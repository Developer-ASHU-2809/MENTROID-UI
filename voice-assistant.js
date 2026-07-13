// ═══════════════════════════════════════════
//  Mentroid Voice Assistant
//  Full hands-free navigation + contact form
// ═══════════════════════════════════════════
(function () {
  'use strict';

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;
  if (!SpeechRecognition || !synth) {
    console.warn('Voice Assistant: Speech API not supported.');
    return;
  }

  // ── State ────────────────────────────────
  let isListening   = false;
  let isSpeaking    = false;
  let currentLang   = 'en-IN';
  let recognition   = null;
  let restartTimer  = null;

  // Contact form fill state
  let contactMode   = false;
  let contactStep   = null;
  let contactData   = { name: '', email: '', subject: '', message: '' };

  // Chatbot dictation mode
  let chatDictMode  = false;

  // ── Audio Feedback (Synthetic Chimes) ────
  let audioCtx = null;
  function playChime(type) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      if (type === 'start') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.15);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'stop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.10, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  }

  // ── Speech Bubble Output ─────────────────
  function showSpeechBubble(text, isUser = true) {
    const bubble = document.getElementById('vaSpeechBubble');
    if (!bubble) return;
    bubble.textContent = text;
    bubble.className = 'va-speech-bubble va-speech-bubble-show ' + (isUser ? 'va-bubble-user' : 'va-bubble-ai');

    clearTimeout(bubble.hideTimer);
    bubble.hideTimer = setTimeout(() => {
      bubble.classList.remove('va-speech-bubble-show');
    }, 4500);
  }

  // ── Form Field Highlight ─────────────────
  function highlightActiveField(step) {
    const fields = ['contact-name', 'contact-email', 'contact-subject', 'contact-message'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('va-field-highlight');
      }
    });

    const map = {
      name:    'contact-name',
      email:   'contact-email',
      subject: 'contact-subject',
      message: 'contact-message',
    };
    const activeId = map[step];
    if (activeId) {
      const el = document.getElementById(activeId);
      if (el) {
        el.classList.add('va-field-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }
  }

  // ── Responses ────────────────────────────
  const R = {
    greeting:     { en: 'Hello! I am Mentroid Voice Assistant. Say help to hear all commands.', hi: 'नमस्ते! मैं Mentroid वॉयस असिस्टेंट हूँ। सभी कमांड के लिए help कहें।' },
    help:         { en: 'Navigation: go home, go to services, about, contact, team, projects, technology, process, why us, FAQ, testimonials. Actions: scroll down, scroll up, scroll to top, scroll to bottom, zoom in, zoom out, open chat, close chat, read page, dark mode, light mode, send message. Info: what services, what is the price, who is the founder, tell me about Mentroid. Say stop to pause.', hi: 'नेविगेशन: होम जाओ, सर्विसेज, अबाउट, कॉन्टैक्ट, टीम, प्रोजेक्ट, टेक्नोलॉजी, प्रोसेस, FAQ। एक्शन: नीचे जाओ, ऊपर जाओ, सबसे ऊपर, सबसे नीचे, चैट खोलो, चैट बंद करो, पेज पढ़ो, डार्क मोड, लाइट मोड, मैसेज भेजो। बंद करो।' },
    about:        { en: 'Mentroid is a next-generation AI solutions company based in Sehore, India. Our mission is to make AI accessible and impactful for businesses and individuals.', hi: 'Mentroid एक अगली पीढ़ी की AI सॉल्यूशन कंपनी है जो सीहोर, भारत में है।' },
    services:     { en: 'Mentroid offers 4 packages: AI Starter Pack, Growth Automation Pack, Business Automation Pack, and AI SaaS Development (Premium).', hi: 'Mentroid 4 पैकेज देता है: AI स्टार्टर पैक, ग्रोथ ऑटोमेशन पैक, बिज़नेस ऑटोमेशन पैक, और AI SaaS डेवलपमेंट (प्रीमियम)।' },
    pricing:      { en: 'Pricing starts from 15 thousand rupees for the AI Starter Pack, up to 8 lakh rupees or more for custom AI SaaS Development.', hi: 'कीमतें AI स्टार्टर पैक के लिए 15 हजार रुपये से शुरू होकर कस्टम AI SaaS डेवलपमेंट के लिए 8 लाख रुपये या उससे अधिक तक जाती हैं।' },
    team:         { en: 'Mentroid has 12 plus members in 4 departments. Founders: Om Roy as CEO, and Shubhangi Roy as Head of Technology.', hi: 'Mentroid में 4 विभागों में 12 से अधिक सदस्य हैं। संस्थापक: Om Roy CEO, Shubhangi Roy टेक्नोलॉजी प्रमुख।' },
    founder:      { en: 'Mentroid was co-founded by Om Roy, CEO, and Shubhangi Roy, Head of Technology.', hi: 'Mentroid की सह-स्थापना Om Roy और Shubhangi Roy ने की।' },
    contact:      { en: 'Contact Mentroid at mentroid at mentroid dot co dot in. Office in Sehore, India.', hi: 'Mentroid से संपर्क: mentroid at mentroid dot co dot in। सीहोर, भारत।' },
    projects:     { en: 'Four major projects: LearnSphere, AgriTech, ECGenius, and VisionSTRA.', hi: 'चार प्रमुख प्रोजेक्ट: LearnSphere, AgriTech, ECGenius, और VisionSTRA।' },
    tech:         { en: 'Technologies: TensorFlow, PyTorch, OpenAI for AI. React, Tailwind for frontend. Flask, Node.js for backend. MongoDB, Firebase for databases. AWS, Vercel for cloud.', hi: 'टेक्नोलॉजी: TensorFlow, PyTorch, OpenAI। React, Tailwind। Flask, Node.js। MongoDB, Firebase। AWS, Vercel।' },
    process:      { en: 'Four steps: Discovery Call, Custom Proposal, Development or Training, then Delivery and Support.', hi: 'चार चरण: डिस्कवरी कॉल, कस्टम प्रपोजल, डेवलपमेंट, डिलीवरी और सपोर्ट।' },
    why:          { en: 'Choose Mentroid for startup speed, deep AI expertise, fully custom solutions, client-focused approach, and scalable systems.', hi: 'Mentroid चुनें: स्टार्टअप स्पीड, AI विशेषज्ञता, कस्टम सॉल्यूशन।' },
    testimonials: { en: 'Three 5-star reviews. Priyaranjan Jha said: Amazing people and amazing services. Shivam Jha said: Excellent experience, professional service. Aditi said: Awesome experience.', hi: 'तीन 5-स्टार समीक्षाएं। Priyaranjan Jha: अद्भुत लोग और सेवाएं। Shivam Jha: उत्कृष्ट अनुभव। Aditi: शानदार अनुभव।' },
    stopped:      { en: 'Voice assistant stopped. Click the microphone to start again.', hi: 'वॉयस असिस्टेंट बंद हो गया।' },
    unknown:      { en: 'Sorry, I did not understand. Say help to hear all commands.', hi: 'माफ करें, समझ नहीं आया। help कहें।' },
    langEn:       { en: 'Language switched to English.', hi: 'Language switched to English.' },
    langHi:       { en: 'भाषा हिंदी में बदल दी गई।', hi: 'भाषा हिंदी में बदल दी गई।' },
    readPage:     { en: 'Mentroid is a professional AI and ML services company. Sections on this page: About, Services, Projects, Why Us, Technologies, Process, Testimonials, Team, Contact, and FAQ. Say go to any section name to navigate there.', hi: 'Mentroid एक प्रोफेशनल AI और ML सर्विसेज कंपनी है। इस पेज पर: अबाउट, सर्विसेज, प्रोजेक्ट्स, टेक्नोलॉजी, टेस्टिमोनियल्स, टीम, कॉन्टैक्ट, FAQ।' },
    // Contact form
    cf_start:     { en: 'Sure! Let me help you fill the contact form. Please say your full name.', hi: 'ज़रूर! संपर्क फॉर्म भरने में मदद करता हूँ। कृपया अपना पूरा नाम बोलें।' },
    cf_name:      { en: 'Got it. Now please say your email address.', hi: 'ठीक है। अब अपना ईमेल पता बोलें।' },
    cf_email:     { en: 'Perfect. Now say the subject of your message.', hi: 'बढ़िया। अब अपने संदेश का विषय बोलें।' },
    cf_subject:   { en: 'Great. Now say your full message.', hi: 'अच्छा। अब अपना पूरा संदेश बोलें।' },
    cf_confirm:   { en: '', hi: '' }, // built dynamically
    cf_sent:      { en: 'Your message has been filled in the contact form. Please review it and click Send Message to submit.', hi: 'आपका संदेश संपर्क फॉर्म में भर दिया गया है। कृपया देखें और Send Message दबाएं।' },
    cf_cancel:    { en: 'Contact form filling cancelled.', hi: 'संपर्क फॉर्म भरना रद्द किया गया।' },
    cd_start:     { en: 'Sure! Chatbot is open. Go ahead — say your question and I will send it to the chatbot for you.', hi: 'ज़रूर! चैटबॉट खुल गया है। अपना सवाल बोलें, मैं उसे चैटबॉट में भेज दूंगा।' },
    cd_sent:      { en: 'Question sent to chatbot.', hi: 'सवाल चैटबॉट में भेज दिया गया।' },
    cd_cancel:    { en: 'Chatbot question cancelled.', hi: 'चैटबॉट सवाल रद्द किया गया।' },
  };

  // ── Speak ─────────────────────────────────
  function speak(text, forceLang) {
    synth.cancel();

    // Pause recognition when speaking to avoid self-triggering
    if (isListening && recognition) {
      try { recognition.stop(); } catch (_) {}
    }

    // Display TTS text in speech bubble
    showSpeechBubble(text, false);

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = forceLang || currentLang;
    utt.rate  = 0.93;
    utt.pitch = 1.05;
    utt.volume = 1;
    isSpeaking = true;
    setOrbState('speaking');
    utt.onend = utt.onerror = () => {
      isSpeaking = false;
      setOrbState(isListening ? 'listening' : 'idle');
      if (isListening) {
        // Resume listening
        setTimeout(() => {
          if (isListening && !isSpeaking) {
            startListening(false);
          }
        }, 250);
      }
    };
    const keepAlive = setInterval(() => {
      if (!synth.speaking) clearInterval(keepAlive);
      else { synth.pause(); synth.resume(); }
    }, 10000);
    synth.speak(utt);
  }

  function respond(key, extra) {
    const lang = currentLang.startsWith('hi') ? 'hi' : 'en';
    let text = R[key]?.[lang] || R[key]?.en || '';
    if (extra) text = extra;
    addPopupEntry('assistant', text);
    speak(text);
  }

  // ── Member profiles ──────────────────────
  const MEMBERS = [
    { names: ['om roy','om'],             linkedin: 'https://www.linkedin.com/in/om-roy-3b809628a/',        portfolio: 'https://portfolio-eiv7.vercel.app/' },
    { names: ['shubhangi roy','shubhangi'],linkedin: 'https://www.linkedin.com/in/shubhangi-roy-762a3427a/', portfolio: null },
    { names: ['aditya gupta','aditya'],   linkedin: 'https://www.linkedin.com/in/aditya-gupta-b06418365',   portfolio: null },
    { names: ['anshika singh','anshika'], linkedin: 'https://www.linkedin.com/in/anshika-singh093',          portfolio: null },
    { names: ['aayush sinha','aayush'],   linkedin: 'https://www.linkedin.com/in/aayush-sinha-481345230/',   portfolio: null },
    { names: ['harsh gupta','harsh'],     linkedin: 'https://www.linkedin.com/in/harsh-gupta-b7a282278',     portfolio: null },
    { names: ['snehika acharya','snehika'],linkedin: 'https://www.linkedin.com/in/snehika-acharya',          portfolio: null },
    { names: ['sachin pathak','sachin'],  linkedin: 'https://www.linkedin.com/in/sachin-pathak-b52b20215/',  portfolio: null },
    { names: ['sneha talawar','sneha'],   linkedin: 'https://www.linkedin.com/in/sneha-talawar98',            portfolio: null },
    { names: ['arya sharma','arya'],      linkedin: 'https://www.linkedin.com/in/arya-sharma-460715340',      portfolio: null },
    { names: ['harshit jaiswal','harshit'],linkedin: 'http://www.linkedin.com/in/harshit-jaiswal-882662215', portfolio: null },
  ];

  // ── Navigate ──────────────────────────────
  function nav(hash) {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Contact form voice fill ───────────────
  function startContactForm() {
    contactMode = true;
    contactStep = 'name';
    contactData = { name: '', email: '', subject: '', message: '' };
    nav('#contact');
    highlightActiveField('name');
    setTimeout(() => respond('cf_start'), 600);
  }

  function handleContactStep(transcript) {
    const t = transcript.trim();

    // Allow cancel at any step
    if (/cancel|रद्द|stop form|बंद करो|cancel form/.test(t.toLowerCase())) {
      contactMode = false;
      contactStep = null;
      highlightActiveField(null);
      // Clear form values on cancel
      const map = {
        name:    document.getElementById('contact-name'),
        email:   document.getElementById('contact-email'),
        subject: document.getElementById('contact-subject'),
        message: document.getElementById('contact-message'),
      };
      Object.keys(map).forEach((key) => {
        if (map[key]) {
          map[key].value = '';
          map[key].dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      respond('cf_cancel');
      return;
    }

    if (contactStep === 'name') {
      contactData.name = t;
      const el = document.getElementById('contact-name');
      if (el) {
        el.value = t;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
      contactStep = 'email';
      highlightActiveField('email');
      respond('cf_name');

    } else if (contactStep === 'email') {
      // Normalise spoken email: "at" → @, "dot" → .
      let email = t.toLowerCase()
        .replace(/\s+at\s+/g, '@')
        .replace(/\s+dot\s+/g, '.')
        .replace(/\s/g, '');
      contactData.email = email;
      const el = document.getElementById('contact-email');
      if (el) {
        el.value = email;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
      contactStep = 'subject';
      highlightActiveField('subject');
      respond('cf_email');

    } else if (contactStep === 'subject') {
      contactData.subject = t;
      const el = document.getElementById('contact-subject');
      if (el) {
        el.value = t;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
      contactStep = 'message';
      highlightActiveField('message');
      respond('cf_subject');

    } else if (contactStep === 'message') {
      contactData.message = t;
      const el = document.getElementById('contact-message');
      if (el) {
        el.value = t;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
      contactStep = 'confirm';
      highlightActiveField(null);
      const lang = currentLang.startsWith('hi') ? 'hi' : 'en';
      const confirmMsg = lang === 'hi'
        ? `विवरण भर दिए गए हैं। भेजने के लिए "हाँ" कहें, रद्द करने के लिए "नहीं" कहें।`
        : `Form filled. Say yes to submit and send the message, or no to cancel.`;
      addPopupEntry('assistant', confirmMsg);
      speak(confirmMsg);

    } else if (contactStep === 'confirm') {
      if (/yes|हाँ|haan|confirm|ok|okay|submit|send/.test(t.toLowerCase())) {
        contactMode = false;
        contactStep = null;
        playChime('success');
        respond('cf_sent');

        // Click the submit button on the contact form after short delay
        setTimeout(() => {
          const submitBtn = document.getElementById('contact-submit') || document.querySelector('#contact form button[type="submit"]');
          if (submitBtn) {
            submitBtn.click();
          }
        }, 1500);
      } else {
        contactMode = false;
        contactStep = null;
        // Clear form values on cancel
        const map = {
          name:    document.getElementById('contact-name'),
          email:   document.getElementById('contact-email'),
          subject: document.getElementById('contact-subject'),
          message: document.getElementById('contact-message'),
        };
        Object.keys(map).forEach((key) => {
          if (map[key]) {
            map[key].value = '';
            map[key].dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
        respond('cf_cancel');
      }
    }
  }

  // ── Chatbot dictation ─────────────────────
  function startChatDictation() {
    chatDictMode = true;
    // Open chatbot
    const cbWindow = document.getElementById('cbWindow');
    const chatFab  = document.querySelector('.chat-fab');
    if (cbWindow) {
      cbWindow.classList.add('cb-open');
      if (chatFab) chatFab.style.display = 'none';
      // Init chatbot messages if empty
      const cbMessages = document.getElementById('cbMessages');
      if (cbMessages && cbMessages.children.length === 0) {
        const d = document.createElement('div');
        d.className = 'cb-msg cb-bot';
        d.innerHTML = `<div class="cb-bubble">👋 Hi! I'm <b>Mentroid Assistant</b>. Ask me anything!</div>`;
        cbMessages.appendChild(d);
      }
    }
    respond('cd_start');
  }

  function handleChatDictation(transcript) {
    const t = transcript.trim().toLowerCase();

    // Allow cancel
    if (/cancel|रद्द|बंद करो|never mind|stop/.test(t)) {
      chatDictMode = false;
      respond('cd_cancel');
      return;
    }

    // Type the spoken text into chatbot input and send it
    const cbInput = document.getElementById('cbInput');
    if (cbInput) {
      cbInput.value = transcript.trim();
      cbInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Trigger chatbot send
    const cbSend = document.getElementById('cbSend');
    if (cbSend) cbSend.click();

    chatDictMode = false;

    // After chatbot responds, read the answer aloud
    setTimeout(() => {
      const lang = currentLang.startsWith('hi') ? 'hi' : 'en';
      const sentMsg = R.cd_sent[lang];
      addPopupEntry('assistant', sentMsg);

      // Read the latest bot reply aloud
      setTimeout(() => {
        const bubbles = document.querySelectorAll('#cbMessages .cb-bot .cb-bubble');
        if (bubbles.length > 0) {
          const lastReply = bubbles[bubbles.length - 1].innerText || bubbles[bubbles.length - 1].textContent;
          if (lastReply) speak(lastReply.trim());
        }
      }, 1200);
    }, 300);
  }

  // ── Language switch ───────────────────────
  function switchLang(lang) {
    currentLang = lang;
    updateLangUI();
    if (recognition) {
      try { recognition.stop(); } catch (_) {}
      recognition = null;
    }
    if (isListening) {
      setTimeout(() => {
        recognition = buildRecognition();
        try { recognition.start(); } catch (_) {}
      }, 300);
    }
    const key = lang.startsWith('hi') ? 'langHi' : 'langEn';
    const msg = R[key][lang.startsWith('hi') ? 'hi' : 'en'];
    addPopupEntry('assistant', msg);
    speak(msg, lang);
  }

  // ── Main command processor ────────────────
  function processCommand(transcript) {
    const t = transcript.toLowerCase().trim();
    addPopupEntry('user', transcript);
    showSpeechBubble(transcript, true);

    // If filling contact form, route to form handler
    if (contactMode) {
      handleContactStep(transcript);
      return;
    }

    // If in chatbot dictation mode, route question to chatbot
    if (chatDictMode) {
      handleChatDictation(transcript);
      return;
    }

    // Language switch
    if (/hindi|हिंदी|switch to hindi/.test(t)) { switchLang('hi-IN'); return; }
    if (/english|अंग्रेजी|switch to english/.test(t)) { switchLang('en-IN'); return; }

    // ── Member LinkedIn / Portfolio — checked FIRST before any nav ──
    for (const m of MEMBERS) {
      if (m.names.some(n => t.includes(n))) {
        const wantsPortfolio = /portfolio/.test(t);
        if (wantsPortfolio) {
          if (!m.portfolio || m.portfolio === '#') {
            const msg = `${m.names[0]}'s portfolio is not available yet.`;
            addPopupEntry('assistant', msg); speak(msg);
          } else {
            window.open(m.portfolio, '_blank');
            const msg = `Opening ${m.names[0]}'s portfolio.`;
            addPopupEntry('assistant', msg); speak(msg);
          }
        } else {
          window.open(m.linkedin, '_blank');
          nav('#team');
          const hint = m.portfolio && m.portfolio !== '#'
            ? ` Say "${m.names[0]} portfolio" to open their portfolio too.` : '';
          const msg = `Opening ${m.names[0]}'s LinkedIn profile.${hint}`;
          addPopupEntry('assistant', msg); speak(msg);
        }
        return;
      }
    }

    // ── Navigation ──
    if (/\bhome\b|होम|शुरुआत|\btop\b/.test(t))                    { nav('#hero'); return; }
    if (/\babout\b|कंपनी|के बारे/.test(t))                        { nav('#about'); respond('about'); return; }
    if (/service|सर्विस|सेवा/.test(t))                            { nav('#services'); respond('services'); return; }
    if (/price|pricing|cost|कीमत|मूल्य|पैकेज/.test(t))           { nav('#services'); respond('pricing'); return; }
    if (/\bteam\b|टीम|member|सदस्य/.test(t))                      { nav('#team'); respond('team'); return; }
    if (/contact|संपर्क/.test(t) && !/send|fill|form/.test(t))    { nav('#contact'); respond('contact'); return; }
    if (/project|प्रोजेक्ट/.test(t) && !/portfolio/.test(t))      { nav('#projects'); respond('projects'); return; }
    if (/tech|technology|टेक्नोलॉजी|तकनीक/.test(t))              { nav('#tech'); respond('tech'); return; }
    if (/process|how it work|कैसे काम|प्रक्रिया/.test(t))        { nav('#process'); respond('process'); return; }
    if (/why|क्यों|advantage|फायदा/.test(t))                      { nav('#why-us'); respond('why'); return; }
    if (/\bfaq\b|question|सवाल/.test(t))                          { nav('#faq'); return; }
    if (/testimonial|review|client|समीक्षा/.test(t))              { nav('#testimonials'); respond('testimonials'); return; }

    // ── Scroll ──
    if (/scroll down|नीचे जाओ|page down/.test(t))                 { window.scrollBy({ top: 500, behavior: 'smooth' }); return; }
    if (/scroll up|ऊपर जाओ|page up/.test(t))                      { window.scrollBy({ top: -500, behavior: 'smooth' }); return; }
    if (/scroll to top|सबसे ऊपर|go to top/.test(t))               { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (/scroll to bottom|सबसे नीचे|go to bottom/.test(t))        { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); return; }
    if (/scroll (a bit|little) down|थोड़ा नीचे/.test(t))          { window.scrollBy({ top: 200, behavior: 'smooth' }); return; }
    if (/scroll (a bit|little) up|थोड़ा ऊपर/.test(t))             { window.scrollBy({ top: -200, behavior: 'smooth' }); return; }

    // ── Theme ──
    if (/dark mode|dark theme|डार्क मोड/.test(t))                 { if(window.applyTheme) window.applyTheme('dark'); else { document.documentElement.setAttribute('data-theme','dark'); } addPopupEntry('assistant','Dark mode enabled.'); speak('Dark mode enabled.'); return; }
    if (/light mode|light theme|लाइट मोड/.test(t))                { if(window.applyTheme) window.applyTheme('light'); else { document.documentElement.removeAttribute('data-theme'); } addPopupEntry('assistant','Light mode enabled.'); speak('Light mode enabled.'); return; }
    if (/toggle (theme|mode)|थीम बदलो/.test(t))                   { const cur = document.documentElement.getAttribute('data-theme'); if (window.applyTheme) window.applyTheme(cur === 'light' ? 'dark' : 'light'); addPopupEntry('assistant','Theme toggled.'); speak('Theme toggled.'); return; }

    // ── Chat ──
    if (/open chat|chat खोलो|chatbot open/.test(t))               { document.querySelector('.chat-fab')?.click(); addPopupEntry('assistant','Chat opened.'); speak('Chat opened.'); return; }
    if (/close chat|chat बंद|chatbot close/.test(t))               { document.getElementById('cbClose')?.click(); addPopupEntry('assistant','Chat closed.'); speak('Chat closed.'); return; }

    // ── Read page ──
    if (/read page|read website|पेज पढ़ो|वेबसाइट पढ़ो/.test(t))   { respond('readPage'); return; }

    // ── Zoom ──
    if (/zoom in|बड़ा करो/.test(t))                                { document.body.style.zoom = (parseFloat(document.body.style.zoom || 1) + 0.1).toFixed(1); addPopupEntry('assistant','Zoomed in.'); speak('Zoomed in.'); return; }
    if (/zoom out|छोटा करो/.test(t))                               { document.body.style.zoom = Math.max(0.5, parseFloat(document.body.style.zoom || 1) - 0.1).toFixed(1); addPopupEntry('assistant','Zoomed out.'); speak('Zoomed out.'); return; }
    if (/reset zoom|zoom reset/.test(t))                           { document.body.style.zoom = '1'; addPopupEntry('assistant','Zoom reset.'); speak('Zoom reset.'); return; }

    // ── Contact form fill ──
    if (/send message|fill (contact|form)|contact form|message भेजो|फॉर्म भरो|संदेश भेजो/.test(t)) { startContactForm(); return; }

    // ── Chatbot dictation ──
    if (/ask (question|chatbot)|question to (the )?chatbot|chatbot (se|ko)|चैटबॉट से पूछ|chatbot question|i want to ask/.test(t)) { startChatDictation(); return; }

    // ── Info ──
    if (/founder|ceo|om roy|shubhangi|संस्थापक/.test(t))          { respond('founder'); return; }
    if (/\bmentroid\b/.test(t))                                    { respond('about'); return; }
    if (/\bhelp\b|सहायता|मदद|command/.test(t))                    { respond('help'); return; }
    if (/hello|hi\b|hey|नमस्ते|हेलो/.test(t))                     { respond('greeting'); return; }

    // ── Stop ──
    if (/\bstop\b|pause|बंद करो|रुको|quiet/.test(t))              { stopAssistant(); return; }

    // ── Fallback: ask chatbot KB ──
    askChatbot(transcript);
  }

  // ── Ask chatbot KB ────────────────────────
  function askChatbot(question) {
    if (typeof window.mentroidChatAnswer !== 'function') {
      respond('unknown'); return;
    }
    const plainText = window.mentroidChatAnswer(question);
    const htmlText  = window.mentroidChatAnswerHTML ? window.mentroidChatAnswerHTML(question) : plainText;

    if (!plainText || plainText.includes('not sure about that') || plainText.includes('could not find')) {
      const lang = currentLang.startsWith('hi') ? 'hi' : 'en';
      const msg  = lang === 'hi'
        ? 'मुझे इसका जवाब नहीं पता। कृपया हमसे सीधे संपर्क करें।'
        : 'I could not find an answer. Please contact Mentroid directly or try rephrasing.';
      addPopupEntry('assistant', msg);
      speak(msg);
      return;
    }

    // Speak the plain-text answer
    addPopupEntry('assistant', plainText);
    speak(plainText);

    // Also show in chatbot window (open it, add Q+A bubbles)
    const cbMessages = document.getElementById('cbMessages');
    const cbWindow   = document.getElementById('cbWindow');
    const chatFab    = document.querySelector('.chat-fab');
    if (cbMessages && cbWindow) {
      cbWindow.classList.add('cb-open');
      if (chatFab) chatFab.style.display = 'none';

      const uDiv = document.createElement('div');
      uDiv.className = 'cb-msg cb-user';
      uDiv.innerHTML = `<div class="cb-bubble">${question}</div>`;
      cbMessages.appendChild(uDiv);

      const bDiv = document.createElement('div');
      bDiv.className = 'cb-msg cb-bot';
      bDiv.innerHTML = `<div class="cb-bubble">${htmlText}</div>`;
      cbMessages.appendChild(bDiv);
      cbMessages.scrollTop = cbMessages.scrollHeight;
    }
  }

  // ── Stop ──────────────────────────────────
  function stopAssistant() {
    isListening = false;
    contactMode = false;
    contactStep = null;
    chatDictMode = false;
    clearTimeout(restartTimer);
    try { recognition?.stop(); } catch (_) {}
    synth.cancel();
    setOrbState('idle');
    updateBtn();
    const lang = currentLang.startsWith('hi') ? 'hi' : 'en';
    const msg  = R.stopped[lang];
    addPopupEntry('assistant', msg);
    speak(msg);
  }

  // ── Build recognition ─────────────────────
  function buildRecognition() {
    const rec = new SpeechRecognition();
    rec.continuous      = false;
    rec.interimResults  = false;
    rec.lang            = currentLang;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ');
      processCommand(transcript);
    };

    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        addPopupEntry('system', '⚠️ Microphone access denied. Please allow microphone in browser settings.');
        isListening = false;
        setOrbState('idle');
        updateBtn();
      }
    };

    rec.onend = () => {
      if (isListening) {
        clearTimeout(restartTimer);
        restartTimer = setTimeout(() => {
          if (!isListening) return;
          try { recognition = buildRecognition(); recognition.start(); } catch (_) {}
        }, 250);
      }
    };

    return rec;
  }

  // ── Toggle ────────────────────────────────
  function toggleListening() {
    if (isListening) {
      isListening = false;
      clearTimeout(restartTimer);
      try { recognition?.stop(); } catch (_) {}
      synth.cancel();
      setOrbState('idle');
    } else {
      startListening();
    }
    updateBtn();
  }

  function startListening() {
    isListening = true;
    recognition = buildRecognition();
    try { recognition.start(); } catch (_) {}
    setOrbState('listening');
    updateBtn();
  }

  // ── UI helpers ────────────────────────────
  function setOrbState(state) {
    const orb = document.getElementById('vaOrb');
    if (orb) orb.className = 'va-orb va-' + state;
  }

  function updateBtn() {
    const btn = document.getElementById('vaBtn');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(isListening));
    btn.title = isListening ? 'Stop Voice Assistant' : 'Start Voice Assistant';
    const label = btn.querySelector('.va-btn-label');
    if (label) label.textContent = isListening ? 'Listening…' : 'Voice AI';
  }

  function updateLangUI() {
    const sel = document.getElementById('vaLangSelect');
    if (sel) sel.value = currentLang;
  }

  function addPopupEntry(role, text) {
    const log = document.getElementById('vaLog');
    if (!log) return;
    const entry = document.createElement('div');
    entry.className = 'va-entry va-entry-' + role;
    const label = document.createElement('span');
    label.className = 'va-entry-label';
    label.textContent = role === 'user' ? '🎤 You' : role === 'assistant' ? '🤖 Mentroid' : '⚙️ System';
    const msg = document.createElement('p');
    msg.className = 'va-entry-msg';
    msg.textContent = text;
    entry.appendChild(label);
    entry.appendChild(msg);
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  function showPopup() {
    const p = document.getElementById('vaPopup');
    if (p) p.classList.add('va-popup-show');
  }

  function hidePopup() {
    const p = document.getElementById('vaPopup');
    if (p) p.classList.remove('va-popup-show');
  }

  // ── Inject UI ─────────────────────────────
  const html = `
  <div id="vaWrapper" class="va-wrapper">
    <div id="vaPopup" class="va-popup" role="log" aria-label="Voice assistant conversation" aria-live="polite">
      <div class="va-popup-header">
        <span>🤖 Mentroid Voice AI</span>
        <div class="va-popup-actions">
          <button class="va-clear-btn" id="vaClearBtn" aria-label="Clear history" title="Clear history">🗑️</button>
          <button class="va-popup-close" id="vaPopupClose" aria-label="Close">✕</button>
        </div>
      </div>
      <div id="vaLog" class="va-log"></div>
    </div>
    <!-- Real-Time Speech Transcript Bubble -->
    <div id="vaSpeechBubble" class="va-speech-bubble" aria-live="polite"></div>
    <div class="va-bar">
      <div class="va-lang-wrap">
        <label for="vaLangSelect" class="va-lang-label">🌐</label>
        <select id="vaLangSelect" class="va-lang-select" aria-label="Select input language">
          <option value="en-IN">English (IN)</option>
          <option value="hi-IN">हिंदी</option>
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
        </select>
      </div>
      <button id="vaBtn" class="va-btn" aria-label="Voice Assistant" aria-pressed="false" title="Start Voice Assistant (Alt+V)">
        <div id="vaOrb" class="va-orb va-idle">
          <svg class="va-mic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
          <div class="va-rings"><span></span><span></span><span></span></div>
        </div>
        <span class="va-btn-label">Voice AI</span>
      </button>
      <button class="va-history-btn" id="vaHistoryBtn" aria-label="Show conversation history" title="Show history">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);

  document.getElementById('vaBtn').addEventListener('click', toggleListening);
  document.getElementById('vaLangSelect').addEventListener('change', e => switchLang(e.target.value));
  document.getElementById('vaHistoryBtn').addEventListener('click', () => document.getElementById('vaPopup').classList.toggle('va-popup-show'));
  document.getElementById('vaPopupClose').addEventListener('click', hidePopup);
  document.getElementById('vaClearBtn').addEventListener('click', () => {
    const log = document.getElementById('vaLog');
    if (log) log.innerHTML = '';
  });

  // Keyboard shortcut Alt + V
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      toggleListening();
    }
  });

})();
