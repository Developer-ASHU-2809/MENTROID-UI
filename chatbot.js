// ═══════════════════════════════════════════
//  Mentroid AI Assistant — Chatbot Engine
// ═══════════════════════════════════════════

(function () {

  // ── Knowledge Base ──────────────────────────────────────────────
  const KB = {
    about: {
      keywords: ['about', 'mentroid', 'company', 'who are you', 'what is mentroid', 'tell me about'],
      answer: `🚀 <b>About Mentroid</b><br><br>
Mentroid is a next-generation AI solutions company focused on building intelligent systems that solve real-world problems.<br><br>
🎯 <b>Mission:</b> Make AI accessible, practical, and impactful for businesses and individuals.<br>
🚀 <b>Vision:</b> Become a leading AI innovation hub powering startups and enterprises.<br>
💡 <b>What we do:</b> Design AI systems, build ML models, and deliver real-world automation solutions.<br><br>
📍 Based in Sehore, India — serving businesses across the country.`
    },

    services: {
      keywords: ['services', 'what do you offer', 'what do you build', 'offerings', 'provide', 'help with'],
      answer: `🛠️ <b>Mentroid Services</b><br><br>
<b>🤖 AI & Machine Learning</b><br>
• Custom Chatbot Development<br>
• Machine Learning Models<br>
• AI/ML & GenAI Projects<br>
• AI Career & Tech Consulting<br><br>
<b>💻 Product Development</b><br>
• Website Development<br>
• App Development (Android/iOS)<br>
• IoT + ML Solutions<br>
• Photo / Video Editing<br><br>
Ask me about any specific service for more details!`
    },

    chatbot: {
      keywords: ['chatbot', 'chat bot', 'conversational ai', 'whatsapp bot', 'automated replies', 'bot development'],
      answer: `🧠 <b>Custom Chatbot Development</b><br><br>
We build conversational AI tailored to your business logic — not generic templates.<br><br>
✅ Designed for your store, company & industry<br>
✅ Personalized conversation flows<br>
✅ Seamless system integration<br>
✅ Automated smart replies + analytics<br>
✅ WhatsApp + Website integration<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Get a Quote</a>`
    },

    ml: {
      keywords: ['machine learning', 'ml model', 'ml training', 'train model', 'dataset', 'algorithm', 'deep learning', 'neural network'],
      answer: `📊 <b>Machine Learning Models</b><br><br>
Custom models trained on your data — from prototype to production-ready.<br><br>
✅ Custom training on your datasets<br>
✅ Algorithm selection based on project goals<br>
✅ Model evaluation & optimization<br>
✅ Portfolio-ready project output<br><br>
We work with TensorFlow, PyTorch, Scikit-learn and more.<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Get a Quote</a>`
    },

    genai: {
      keywords: ['genai', 'generative ai', 'llm', 'gpt', 'large language model', 'generative', 'ai project'],
      answer: `✨ <b>AI/ML & GenAI Projects</b><br><br>
From LLM-powered tools to generative pipelines — we ship innovative AI products.<br><br>
✅ Innovative project ideas & guidance<br>
✅ Web integration with interactive ML models<br>
✅ Generative AI project assistance<br>
✅ 1-on-1 mentorship & implementation<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Start a Project</a>`
    },

    consulting: {
      keywords: ['consulting', 'mentoring', 'career', 'roadmap', 'resume', 'portfolio review', 'guidance', 'mentor'],
      answer: `🎯 <b>AI Career & Tech Consulting</b><br><br>
Strategic mentorship to get you from where you are to where AI is going.<br><br>
✅ 1-on-1 personalized mentoring sessions<br>
✅ Career roadmap & market insights<br>
✅ Resume, portfolio & code reviews<br>
✅ Networking & industry connections<br><br>
<a href="#pricing" onclick="closeChatbot()">👉 Book a Session</a>`
    },

    website: {
      keywords: ['website', 'web development', 'web app', 'frontend', 'backend', 'full stack', 'react', 'node', 'seo'],
      answer: `🌐 <b>Website Development</b><br><br>
Performant, SEO-optimised websites built with modern full-stack technologies.<br><br>
✅ Custom front-end (UI/UX) & back-end<br>
✅ React, Node.js, Python & more<br>
✅ E-commerce solutions<br>
✅ Responsive design & SEO optimisation<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Get a Quote</a>`
    },

    app: {
      keywords: ['app', 'mobile app', 'android', 'ios', 'flutter', 'react native', 'cross platform', 'mobile development'],
      answer: `📱 <b>App Development</b><br><br>
Native-quality apps across Android and iOS from a single codebase.<br><br>
✅ Custom Android & iOS development<br>
✅ Flutter & React Native cross-platform<br>
✅ Secure APIs & database integration<br>
✅ High-performance UI/UX architecture<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Get a Quote</a>`
    },

    iot: {
      keywords: ['iot', 'internet of things', 'embedded', 'edge ai', 'hardware', 'sensor', 'smart device', 'remote monitoring'],
      answer: `🔌 <b>IoT + ML Solutions</b><br><br>
Smart hardware meets intelligent software — edge AI for the real world.<br><br>
✅ IoT device integration & control<br>
✅ Edge & cloud ML deployment<br>
✅ Automated insights & predictions<br>
✅ Remote monitoring & alerts<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Explore</a>`
    },

    media: {
      keywords: ['photo', 'video', 'editing', 'media', 'color grading', 'retouching', 'post production', 'batch processing'],
      answer: `🎬 <b>Photo / Video Editing</b><br><br>
Professional creative post-production powered by AI tools.<br><br>
✅ Professional photo retouching & enhancement<br>
✅ Video cutting, effects & color grading<br>
✅ Automated batch processing & AI tools<br>
✅ High-res export & format optimisation<br><br>
<a href="#contact" onclick="closeChatbot()">👉 View Work</a>`
    },

    pricing: {
      keywords: ['price', 'pricing', 'cost', 'how much', 'fee', 'charge', 'rate', 'package', 'plan', '₹', 'rupee'],
      answer: `💰 <b>Service Packages</b><br><br>
<b>🔹 Consultation — ₹299</b><br>
Personalized AI/ML strategy session to help your business innovate.<br><br>
<b>🔸 Training Program — ₹999/month</b> ⭐ Popular<br>
Comprehensive ML & AI training with hands-on projects, mentorship & career guidance.<br><br>
<b>🔹 Custom Development — ₹299 – ₹25,000*</b><br>
Tailor-made chatbots, ML models, or AI solutions for your business.<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Contact us for a custom quote</a>`
    },

    projects: {
      keywords: ['project', 'portfolio', 'work', 'built', 'example', 'case study', 'previous work', 'ecg', 'stock', 'saas', 'dashboard'],
      answer: `🗂️ <b>Our Projects</b><br><br>
<b>🤖 AI Chatbot for Business</b><br>
WhatsApp + Website integration, 24/7 automated responses, lead generation.<br><br>
<b>📊 Stock Market Predictor</b><br>
Time-series ML models, data visualization dashboard, real-time predictions.<br><br>
<b>🧠 ECG Signal Classifier</b><br>
CNN-based deep learning model to detect ECG components (P, Q, R, S).<br><br>
<b>🌐 AI SaaS Dashboard</b><br>
Flask + React architecture, user authentication, live data insights.<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Discuss your project</a>`
    },

    tech: {
      keywords: ['technology', 'tech stack', 'tools', 'tensorflow', 'pytorch', 'flask', 'mongodb', 'aws', 'docker', 'figma', 'what tech'],
      answer: `⚙️ <b>Technologies We Use</b><br><br>
<b>🤖 AI / ML:</b> TensorFlow, PyTorch, OpenAI, Scikit-learn<br>
<b>🎨 Frontend:</b> React.js, HTML, CSS, Tailwind<br>
<b>🔧 Backend:</b> Flask, Node.js, Express<br>
<b>🗄️ Database:</b> MongoDB, Firebase, MySQL<br>
<b>☁️ Cloud:</b> AWS, Vercel, Netlify<br>
<b>🛠️ Tools:</b> Git, Docker, Postman, Figma`
    },

    process: {
      keywords: ['process', 'how it works', 'how do you work', 'steps', 'workflow', 'procedure', 'start', 'begin', 'get started'],
      answer: `📋 <b>How We Work</b><br><br>
<b>1️⃣ Discovery Call</b><br>
We discuss your needs, goals, and requirements in detail.<br><br>
<b>2️⃣ Custom Proposal</b><br>
We create a tailored solution plan with timeline and pricing.<br><br>
<b>3️⃣ Development / Training</b><br>
We work together to build your solution or achieve your learning goals.<br><br>
<b>4️⃣ Delivery & Support</b><br>
You get your final deliverables plus ongoing support.<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Start with a Discovery Call</a>`
    },

    team: {
      keywords: ['team', 'founder', 'ceo', 'who made', 'om roy', 'shubhangi', 'members', 'staff', 'people', 'employees'],
      answer: `👥 <b>Meet the Team</b><br><br>
<b>👑 Leadership</b><br>
• Om Roy — Co-Founder & CEO<br>
• Shubhangi Roy — Co-Founder & Head of Technology<br><br>
<b>🤖 AI & ML</b><br>
• Aditya Gupta — Machine Learning Lead<br>
• Anshika Singh — AI Systems Lead<br>
• Aayush Sinha — AI Engineer<br><br>
<b>💻 Engineering</b><br>
• Harsh Gupta — IoT & Embedded Lead<br>
• Snehika Acharya — Mobile App Lead<br>
• Sachin Pathak — Full Stack Developer<br>
• Sneha Talawar — Web Engineering Lead<br><br>
<b>🎨 Design & Ops</b><br>
• Arya Sharma — Brand & Visual Design<br>
• Harshit Jaiswal — Content & Media<br><br>
12+ members · 4 departments · 100% passion-driven`
    },

    testimonials: {
      keywords: ['review', 'testimonial', 'feedback', 'client', 'rating', 'experience', 'what do clients say'],
      answer: `⭐ <b>Client Testimonials</b><br><br>
<b>"Amazing people and amazing services."</b><br>
— Priyaranjan Jha, Chatbot Development<br><br>
<b>"Excellent experience! The video was professional, and their service was top-notch."</b><br>
— Shivam Jha, Photo/Video Editing<br><br>
<b>"Awesome experience."</b><br>
— Aditi, AI/ML & GenAI Projects<br><br>
All clients rated us ⭐⭐⭐⭐⭐`
    },

    why: {
      keywords: ['why choose', 'why mentroid', 'advantage', 'benefit', 'different', 'unique', 'better', 'reason'],
      answer: `💡 <b>Why Choose Mentroid?</b><br><br>
🚀 <b>Startup Speed</b> — Fast execution without compromising quality.<br>
🧠 <b>AI Expertise</b> — Strong foundation in ML, Deep Learning & GenAI.<br>
🎯 <b>Custom Solutions</b> — No templates, everything tailored to you.<br>
🤝 <b>Client Focused</b> — We work closely to ensure your success.<br>
📈 <b>Scalable Systems</b> — Built to grow with your business.<br>
💡 <b>Innovation Driven</b> — Cutting-edge ideas in every project.`
    },

    faq: {
      keywords: ['faq', 'question', 'startup', 'support', 'maintenance', 'how long', 'duration', 'timeline'],
      answer: `❓ <b>Frequently Asked Questions</b><br><br>
<b>What services do you provide?</b><br>
AI chatbot development, ML models, web/app development, and consulting.<br><br>
<b>Do you work with startups?</b><br>
Yes! We specialize in helping startups build scalable AI solutions.<br><br>
<b>How long does a project take?</b><br>
Typically 1 week to 1 month depending on complexity.<br><br>
<b>Do you provide support?</b><br>
Yes, we offer post-delivery support and maintenance.`
    },

    contact: {
      keywords: ['contact', 'reach', 'email', 'location', 'address', 'get in touch', 'talk to', 'connect', 'hire'],
      answer: `📬 <b>Contact Mentroid</b><br><br>
📍 <b>Location:</b> Sehore, India<br>
📧 <b>Email:</b> mentroid@mentroid.co.in<br><br>
We'd love to hear about your project or answer any questions!<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Send us a message</a>`
    }
  };

  // ── Suggested quick replies ──────────────────────────────────────
  const QUICK_REPLIES = [
    'What services do you offer?',
    'How much does it cost?',
    'Tell me about the team',
    'How do I get started?',
    'Show me your projects'
  ];

  // ── Match user input to KB ───────────────────────────────────────
  function getResponse(input) {
    const text = input.toLowerCase().trim();
    if (!text) return null;

    // Greetings
    if (/^(hi|hello|hey|hii|helo|howdy|sup|yo)\b/.test(text)) {
      return `👋 Hey there! I'm <b>Mentroid Assistant</b>.<br><br>
I can help you with info about our services, pricing, team, projects, and more.<br><br>
What would you like to know? 😊`;
    }

    // Thanks
    if (/thank|thanks|thx|ty\b/.test(text)) {
      return `😊 You're welcome! Feel free to ask anything else about Mentroid. We're here to help!`;
    }

    // Bye
    if (/bye|goodbye|see you|cya|later/.test(text)) {
      return `👋 Goodbye! Feel free to come back anytime. Have a great day! 🚀`;
    }

    // Scan KB
    for (const key in KB) {
      const entry = KB[key];
      if (entry.keywords.some(kw => text.includes(kw))) {
        return entry.answer;
      }
    }

    // Fallback
    return `🤔 I'm not sure about that, but I'd love to help!<br><br>
You can ask me about:<br>
• Services & pricing<br>
• Our team & projects<br>
• Technologies we use<br>
• How to get started<br><br>
Or <a href="#contact" onclick="closeChatbot()">contact us directly</a> — we respond fast! 📧`;
  }

  // ── Build Chat UI ────────────────────────────────────────────────
  // Expose getResponse globally so Voice AI can query the chatbot KB
  window.mentroidChatAnswer = function(input) {
    const raw = getResponse(input) || '';
    // Strip HTML tags for speech
    return raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  };
  window.mentroidChatAnswerHTML = function(input) {
    return getResponse(input) || '';
  };
  const chatHTML = `
    <div class="cb-window" id="cbWindow" role="dialog" aria-label="Mentroid Assistant">
      <div class="cb-header">
        <div class="cb-header-info">
          <div class="cb-avatar">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36" aria-hidden="true">
              <rect x="6" y="6" width="36" height="36" rx="11" fill="rgba(124,58,237,0.3)" stroke="rgba(167,139,250,0.6)" stroke-width="1.5"/>
              <circle cx="18" cy="20" r="3.5" fill="#a78bfa"/>
              <circle cx="30" cy="20" r="3.5" fill="#60a5fa"/>
              <circle cx="19.4" cy="18.6" r="1.2" fill="rgba(255,255,255,0.85)"/>
              <circle cx="31.4" cy="18.6" r="1.2" fill="rgba(255,255,255,0.85)"/>
              <path d="M16 28.5 Q24 35 32 28.5" stroke="rgba(167,139,250,0.9)" stroke-width="2.2" stroke-linecap="round" fill="none"/>
              <line x1="24" y1="6" x2="24" y2="1" stroke="rgba(167,139,250,0.7)" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="24" cy="0" r="2.2" fill="#a78bfa"/>
            </svg>
          </div>
          <div>
            <div class="cb-name">Mentroid Assistant</div>
            <div class="cb-status"><span class="cb-dot"></span> Online</div>
          </div>
        </div>
        <button class="cb-close" id="cbClose" aria-label="Close chat">✕</button>
      </div>
      <div class="cb-messages" id="cbMessages"></div>
      <div class="cb-quick" id="cbQuick"></div>
      <div class="cb-input-row">
        <input type="text" id="cbInput" placeholder="Ask me anything..." autocomplete="off" maxlength="200" />
        <button id="cbSend" aria-label="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>`;

  // Inject HTML
  document.body.insertAdjacentHTML('beforeend', chatHTML);

  const fab      = document.querySelector('.chat-fab');
  const win      = document.getElementById('cbWindow');
  const messages = document.getElementById('cbMessages');
  const input    = document.getElementById('cbInput');
  const sendBtn  = document.getElementById('cbSend');
  const closeBtn = document.getElementById('cbClose');
  const quickDiv = document.getElementById('cbQuick');

  // ── Helpers ──────────────────────────────────────────────────────
  function addMessage(text, from) {
    const div = document.createElement('div');
    div.className = `cb-msg cb-${from}`;
    div.innerHTML = `<div class="cb-bubble">${text}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'cb-msg cb-bot cb-typing-wrap';
    div.id = 'cbTyping';
    div.innerHTML = `<div class="cb-bubble cb-typing"><span></span><span></span><span></span></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('cbTyping');
    if (t) t.remove();
  }

  function buildQuickReplies(replies) {
    quickDiv.innerHTML = '';
    replies.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'cb-qr';
      btn.textContent = r;
      btn.addEventListener('click', () => {
        quickDiv.innerHTML = '';
        handleSend(r);
      });
      quickDiv.appendChild(btn);
    });
  }

  function handleSend(text) {
    const msg = (text || input.value).trim();
    if (!msg) return;
    input.value = '';
    quickDiv.innerHTML = '';
    addMessage(msg, 'user');
    showTyping();
    setTimeout(() => {
      removeTyping();
      const reply = getResponse(msg);
      addMessage(reply, 'bot');
    }, 600 + Math.random() * 400);
  }

  // ── Open / Close ─────────────────────────────────────────────────
  function openChatbot() {
    win.classList.add('cb-open');
    fab.style.display = 'none';
    if (messages.children.length === 0) {
      setTimeout(() => {
        addMessage(`👋 Hi! I'm <b>Mentroid Assistant</b>.<br>Ask me anything about our services, pricing, team, or projects!`, 'bot');
        setTimeout(() => buildQuickReplies(QUICK_REPLIES), 400);
      }, 200);
    }
    input.focus();
  }

  window.closeChatbot = function () {
    win.classList.remove('cb-open');
    fab.style.display = 'flex';
  };

  fab.addEventListener('click', openChatbot);
  closeBtn.addEventListener('click', closeChatbot);
  sendBtn.addEventListener('click', () => handleSend());
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

})();
