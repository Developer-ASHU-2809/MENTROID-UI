// ═══════════════════════════════════════════
//  Mentroid AI Assistant — Chatbot Engine
// ═══════════════════════════════════════════

(function () {
  const TEAM_MEMBERS = [
    {
      name: "Om Roy",
      aliases: ["om", "roy", "omroy", "ceo", "co-founder"],
      role: "Co-Founder & CEO",
      bio: "Om Roy is the Co-Founder & CEO of Mentroid. He leads the company's strategic vision, client relations, and overall startup operations.",
      linkedin: "https://www.linkedin.com/in/om-roy-3b809628a/",
      portfolio: "https://portfolio-eiv7.vercel.app/"
    },
    {
      name: "Shubhangi Roy",
      aliases: ["shubhangi", "shubhangiroy", "cto", "co-founder"],
      role: "Co-Founder & Head of Technology",
      bio: "Shubhangi Roy is the Co-Founder & Head of Technology of Mentroid. She drives the company's technology roadmap, system engineering, and custom AI architecture.",
      linkedin: "https://www.linkedin.com/in/shubhangi-roy-762a3427a/",
      portfolio: null
    },
    {
      name: "Aditya Gupta",
      aliases: ["aditya", "gupta", "adityagupta", "ml lead"],
      role: "Machine Learning Lead",
      bio: "Aditya Gupta is the Machine Learning Lead at Mentroid. He specializes in designing, training, and optimizing custom neural networks, CNNs, and deep learning architectures.",
      linkedin: "https://www.linkedin.com/in/aditya-gupta-b06418365",
      portfolio: "https://portfolio-rose-ten-26.vercel.app/"
    },
    {
      name: "Anshika Singh",
      aliases: ["anshika", "singh", "anshikasingh", "ai systems lead"],
      role: "AI Systems Lead",
      bio: "Anshika Singh is the AI Systems Lead at Mentroid, developing automated workflows, GenAI implementations, and orchestration pipelines.",
      linkedin: "https://www.linkedin.com/in/anshika-singh093",
      portfolio: null
    },
    {
      name: "Aayush Sinha",
      aliases: ["aayush", "sinha", "aayushsinha", "ai engineer"],
      role: "AI Engineer",
      bio: "Aayush Sinha is an AI Engineer at Mentroid, specializing in LLM integrations, retrieval pipelines (RAG), and interactive generative AI tools.",
      linkedin: "https://www.linkedin.com/in/aayush-sinha-481345230/",
      portfolio: "https://aayush-sinha.vercel.app/"
    },
    {
      name: "Harsh Gupta",
      aliases: ["harsh", "harshgupta", "iot lead", "embedded"],
      role: "IoT & Embedded Lead",
      bio: "Harsh Gupta is the IoT & Embedded Lead at Mentroid, focusing on hardware-software integration, sensors, edge AI, and remote telemetry.",
      linkedin: "https://www.linkedin.com/in/harsh-gupta-b7a282278",
      portfolio: null
    },
    {
      name: "Snehika Acharya",
      aliases: ["snehika", "acharya", "snehikaacharya", "mobile lead"],
      role: "Mobile App Lead",
      bio: "Snehika Acharya is the Mobile App Lead at Mentroid, architecting robust cross-platform mobile apps for Android and iOS using Flutter and React Native.",
      linkedin: "https://www.linkedin.com/in/snehika-acharya",
      portfolio: null
    },
    {
      name: "Sachin Pathak",
      aliases: ["sachin", "pathak", "sachinpathak", "full stack developer"],
      role: "Full Stack Developer",
      bio: "Sachin Pathak is a Full Stack Developer at Mentroid, building clean UI components, secure APIs, and database structures using Flask, React, and Node.",
      linkedin: "https://www.linkedin.com/in/sachin-pathak-b52b20215/",
      portfolio: null
    },
    {
      name: "Sneha Talawar",
      aliases: ["sneha", "talawar", "snehatalawar", "web lead"],
      role: "Web Engineering Lead",
      bio: "Sneha Talawar is the Web Engineering Lead at Mentroid, developing optimized frontend layouts, responsive designs, and SEO structures.",
      linkedin: "https://www.linkedin.com/in/sneha-talawar98",
      portfolio: null
    },
    {
      name: "Ashutosh Yadav",
      aliases: ["ashu", "ashutosh", "yadav", "ashutoshyadav", "web development lead"],
      role: "Web Development Lead",
      bio: "Ashutosh Yadav is the Web Development Lead at Mentroid, designing dynamic websites, managing backend integrations, and optimizing web experiences.",
      linkedin: "https://www.linkedin.com/in/ashutosh-yadav-developer2809",
      portfolio: "https://developerashuportfolio.vercel.app/"
    },
    {
      name: "Harshit Jaiswal",
      aliases: ["harshit", "jaiswal", "harshitjaiswal", "content", "media"],
      role: "Content & Media Specialist",
      bio: "Harshit Jaiswal is the Content & Media specialist at Mentroid, managing digital storytelling, post-production video editing, and creative assets.",
      linkedin: "http://www.linkedin.com/in/harshit-jaiswal-882662215",
      portfolio: null
    },
    {
      name: "Arya Sharma",
      aliases: ["arya", "sharma", "aryasharma", "brand", "visual design"],
      role: "Brand & Visual Designer",
      bio: "Arya Sharma is the Brand & Visual Designer at Mentroid, crafting UI layouts, styling systems, and product brand guidelines.",
      linkedin: null,
      portfolio: null
    }
  ];

  const PACKAGES = [
    {
      name: "AI Starter Pack",
      aliases: ["starter pack", "starter package", "starter plan", "starter cost", "starter price", "starter"],
      priceINR: "₹15,000 – ₹30,000",
      priceUSD: "$180 – $360",
      features: [
        "Basic AI Chatbot (Website or WhatsApp integration)",
        "FAQ Automation (answers common queries)",
        "Lead Capture System",
        "Basic Dashboard",
        "7 Days of Post-Delivery Support"
      ],
      description: "Ideal for small local businesses, creators, freelancers, and coaches looking for a quick and budget-friendly entry into AI.",
      timeline: "7 days",
      link: "services/ai-starter-pack.html"
    },
    {
      name: "Growth Automation Pack",
      aliases: ["growth pack", "growth package", "growth plan", "growth cost", "growth price", "growth", "most popular"],
      priceINR: "₹40,000 – ₹80,000",
      priceUSD: "$480 – $960",
      features: [
        "Advanced AI Chatbot (GPT-powered with business logic)",
        "WhatsApp + CRM Integration (Zoho, Hubspot, etc.)",
        "Lead Qualification Automation",
        "Email & SMS Automation flows",
        "Workflow Automation (Zapier, custom APIs)",
        "Analytics Dashboard",
        "30 Days of Support",
        "Bonus: AI Funnel Setup & Conversion Optimization"
      ],
      description: "Our most popular pack. Best for startups, agencies, and expanding businesses seeking complete customer lifecycle and CRM automation.",
      timeline: "2 to 3 weeks",
      link: "services/growth-automation-pack.html"
    },
    {
      name: "Business Automation Pack",
      aliases: ["business automation pack", "business automation package", "business automation plan", "business automation cost", "business automation price", "business automation", "automation pack"],
      priceINR: "₹80,000 – ₹1,50,000",
      priceUSD: "$960 – $1,800",
      features: [
        "Custom AI Chatbots tailored to your service catalog",
        "WhatsApp Business Automation",
        "Full CRM, database, & ERP Integration",
        "Complete Email / Notification Automation",
        "Advanced Lead Generation & Pipeline Systems",
        "Custom Automated Workflows"
      ],
      description: "End-to-end automation for SMEs wanting to minimize manual operational tasks and integrate multi-channel AI support.",
      timeline: "3 weeks to 1 month",
      link: "services/business-automation-pack.html"
    },
    {
      name: "AI SaaS Development (Premium)",
      aliases: ["saas development", "saas pack", "saas package", "saas plan", "saas cost", "saas price", "saas", "premium pack", "premium plan", "premium"],
      priceINR: "₹2,00,000 – ₹8,00,000+",
      priceUSD: "$2,400 – $9,600+",
      features: [
        "Custom SaaS Web Application Development",
        "Proprietary AI Model Integration (LLM, ML, CV, NLP)",
        "Secure User Authentication & Subscription",
        "Payment Gateway Integration (Razorpay, Stripe)",
        "Scalable Backend (Flask, Node, C++)",
        "Modern Responsive SaaS UI/UX Design",
        "Cloud Deployment (AWS, Vercel)",
        "Bonus: MVP Strategy & Go-To-Market Plan"
      ],
      description: "Our top-tier package designed for AI startups, founders, and enterprises building custom SaaS platforms, proprietary AI models, or production-grade products.",
      timeline: "1 to 2 months",
      link: "services/ai-saas-development.html"
    }
  ];

  const SERVICES_DETAIL = [
    {
      name: "AI Chatbot Development",
      aliases: ["chatbot development", "chat bot development", "chatbot", "chat bot", "whatsapp bot", "bot dev", "conversational ai"],
      description: "We build custom conversational AI chatbots trained on your business data and workflows, rather than relying on generic templates.",
      features: [
        "WhatsApp & Website integration",
        "Retrieval-Augmented Generation (RAG) to query internal documentation",
        "Automated lead capture & CRM syncing",
        "24/7 automated support with live agent fallbacks"
      ],
      link: "services/chatbot-development.html"
    },
    {
      name: "Machine Learning Models",
      aliases: ["machine learning", "machine learning models", "ml model", "ml models", "ml training", "train model", "anomaly detection", "deep learning", "neural network"],
      description: "Custom ML models built from scratch or fine-tuned on your data, taking solutions from simple prototypes to production-grade deployment.",
      features: [
        "Time-series modeling & forecasting (e.g., Demand Forecasting)",
        "Computer Vision & image classification (e.g., ECG signal classification)",
        "Natural Language Processing (NLP)",
        "Model optimization, conversion (ONNX, TF Lite), & edge AI deployment"
      ],
      link: "services/ml-models.html"
    },
    {
      name: "Generative AI Projects",
      aliases: ["generative ai", "genai", "gen ai", "large language model", "llm", "gpt", "rag systems", "neural style transfer"],
      description: "Implementation of Generative AI systems, including LLM agents, image creation, text and code generation, and RAG systems.",
      features: [
        "1-on-1 mentorship & implementation guidance",
        "RAG (Retrieval-Augmented Generation) setups",
        "Custom content creation & generative pipelines",
        "Interactive ML web app integrations"
      ],
      link: "services/genai-projects.html"
    },
    {
      name: "AI Business Transformation",
      aliases: ["ai business transformation", "business transformation", "business integration", "consulting", "crm integration"],
      description: "Strategic consulting to audits workflows, map custom AI agents, and integrate AI capabilities into existing CRM & ERP systems to transform business processes.",
      features: [
        "Operational audits to identify automation opportunities",
        "Custom enterprise AI agents",
        "Deep integration with CRM & database systems",
        "Workflow automations that reduce manual errors"
      ],
      link: "services/ai-business-transformation.html"
    },
    {
      name: "AI Marketing & Sales",
      aliases: ["ai marketing", "marketing & sales", "marketing", "sales", "sales automation", "lead scoring", "social media automation"],
      description: "Applying AI to optimize marketing funnels, automate outreach sequences, implement predictive lead scoring, and manage social media post pipelines.",
      features: [
        "AI copywriting & automated content pipelines",
        "Smart lead scoring & automated qualifications",
        "Email & SMS marketing sequences",
        "Social media analytics & auto-scheduling"
      ],
      link: "services/ai-marketing-sales.html"
    },
    {
      name: "Advanced AI Solutions",
      aliases: ["advanced ai solutions", "advanced ai", "advanced ml", "multi-modal systems", "edge ai", "custom neural networks"],
      description: "Cutting-edge research and deployment for complex AI/ML requirements, including custom neural network design, multi-modal systems, and edge hardware deployment.",
      features: [
        "GenAI pipelines & multi-modal processing",
        "Custom LLM training and fine-tuning",
        "Edge AI compilation (TFLite) for low-power hardware",
        "Anomaly detection systems and AI research"
      ],
      link: "services/advanced-ai-solutions.html"
    },
    {
      name: "AI Startup Builder",
      aliases: ["ai startup builder", "startup builder", "mvp builder", "rapid prototyping", "tech consulting"],
      description: "End-to-end consulting for startup founders, assisting with MVP strategy, technology stacks, rapid prototyping, and scalable infrastructure setup.",
      features: [
        "MVP strategy & functional blueprints",
        "Rapid prototyping and verification",
        "Pitch deck technical reviews",
        "Cloud architecture (AWS, Vercel) strategy"
      ],
      link: "services/ai-startup-builder.html"
    },
    {
      name: "Website Development",
      aliases: ["website development", "web development", "website", "web app", "frontend", "backend", "full stack", "react", "node", "seo"],
      description: "Performant, modern, and SEO-optimized full-stack web applications built with React, Node.js, Python, and SQL/NoSQL databases.",
      features: [
        "Custom front-end UI/UX designs",
        "E-commerce solutions & payments",
        "Responsive grids & speed optimizations",
        "Modern SEO setup for Google search rankings"
      ],
      link: null
    },
    {
      name: "App Development",
      aliases: ["app development", "mobile app", "app", "mobile development", "android", "ios", "flutter", "react native"],
      description: "High-performance native-quality mobile applications for both Android and iOS platforms built from a single codebase.",
      features: [
        "Cross-platform efficiency using Flutter and React Native",
        "Secure local caching & database sync",
        "Push notifications and hardware integrations",
        "Beautiful transition animations"
      ],
      link: null
    },
    {
      name: "IoT + ML Solutions",
      aliases: ["iot", "internet of things", "embedded", "edge ai", "hardware", "sensor", "smart device", "remote monitoring"],
      description: "Integrating embedded devices with machine learning models. We build firmware, process sensor data, and run edge inference on smart hardware.",
      features: [
        "Microcontroller development (ESP32, Raspberry Pi, Arduino)",
        "Telemetry data pipeline ingestion",
        "Edge ML models for local inference",
        "Remote dashboard controls & triggers"
      ],
      link: null
    },
    {
      name: "Photo / Video Editing",
      aliases: ["photo / video editing", "photo editing", "video editing", "media editing", "media", "editing", "color grading", "retouching"],
      description: "Professional creative post-production utilizing AI enhancement tools for fast, clean, and high-fidelity video cuts, color grading, and photo assets.",
      features: [
        "AI photo enhancement and background work",
        "Video editing, transitions, and audio sync",
        "Cinematic color grading & LUT profiles",
        "Automated batch processing pipelines"
      ],
      link: null
    }
  ];

  const KB = {
    about: {
      keywords: ['about', 'mentroid', 'company', 'who are you', 'what is mentroid', 'tell me about', 'mission', 'vision'],
      answer: `🚀 <b>About Mentroid</b><br><br>
Mentroid is a next-generation AI solutions company focused on building intelligent systems that solve real-world problems.<br><br>
🎯 <b>Mission:</b> Make AI accessible, practical, and impactful for businesses and individuals.<br>
🚀 <b>Vision:</b> Become a leading AI innovation hub powering startups and enterprises.<br>
💡 <b>What we do:</b> Design AI systems, build ML models, and deliver real-world automation solutions.<br><br>
📍 Based in Sehore, Madhya Pradesh, India — serving businesses across the country.`
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
    testimonials: {
      keywords: ['review', 'testimonial', 'feedback', 'client', 'rating', 'experience', 'what do clients say', 'reviews'],
      answer: `⭐ <b>Client Testimonials</b><br><br>
<b>"Amazing people and amazing services."</b><br>
— Priyaranjan Jha, Chatbot Development<br><br>
<b>"Excellent experience! The video was professional, and their service was top-notch."</b><br>
— Shivam Jha, Photo/Video Editing<br><br>
<b>"Awesome experience."</b><br>
— Aditi, AI/ML & GenAI Projects<br><br>
All clients rated us ⭐⭐⭐⭐⭐`
    },
    tech: {
      keywords: ['technology', 'tech stack', 'tools', 'tensorflow', 'pytorch', 'flask', 'mongodb', 'aws', 'docker', 'figma', 'what tech', 'technologies'],
      answer: `⚙️ <b>Technologies We Use</b><br><br>
<b>🤖 AI / ML:</b> TensorFlow, PyTorch, OpenAI, Scikit-learn<br>
<b>🎨 Frontend:</b> React.js, HTML, CSS, Tailwind<br>
<b>🔧 Backend:</b> Flask, Node.js, Express<br>
<b>🗄️ Database:</b> MongoDB, Firebase, MySQL<br>
<b>☁️ Cloud:</b> AWS, Vercel, Netlify<br>
<b>🛠️ Tools:</b> Git, Docker, Postman, Figma`
    }
  };

  const QUICK_REPLIES = [
    'What services do you offer?',
    'How much does it cost?',
    'Tell me about the team',
    'How do I get started?',
    'Show me your projects'
  ];

  // ── Conversation Memory ──────────────────────────────────────────
  let lastDiscussedPackage = null;
  let lastDiscussedService = null;

  // ── Normalization Helper ─────────────────────────────────────────
  function normalizeText(text) {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ── Levenshtein Distance for Typo Tolerance ──────────────────────
  function getLevenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function checkTypoMatch(word, targetList, threshold = 2) {
    const wNorm = normalizeText(word);
    if (wNorm.length < 3) return false;
    return targetList.some(item => {
      const itemNorm = normalizeText(item);
      if (itemNorm.includes(wNorm) || wNorm.includes(itemNorm)) return true;
      const dist = getLevenshteinDistance(wNorm, itemNorm);
      return dist <= threshold;
    });
  }

  // ── Active DOM Content Scraper Fallback ──────────────────────────
  function searchActiveDOM(query) {
    const qNormalized = normalizeText(query);
    if (!qNormalized) return null;

    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
    let bestBlock = null;
    let maxScore = 0;

    const queryWords = qNormalized.split(' ').filter(w => w.length > 2);
    if (queryWords.length === 0) return null;

    for (const h of headings) {
      const hText = normalizeText(h.textContent);
      let score = 0;
      
      for (const word of queryWords) {
        if (hText.includes(word)) {
          score += 3;
        }
      }

      if (score > 0 && score > maxScore) {
        let content = '';
        let sibling = h.nextElementSibling;
        let count = 0;

        while (sibling && !['H1', 'H2', 'H3', 'H4', 'SECTION', 'NAV', 'FOOTER'].includes(sibling.tagName) && count < 5) {
          const sText = sibling.textContent.trim();
          if (sText && sibling.tagName !== 'SCRIPT' && sibling.tagName !== 'STYLE') {
            content += sibling.innerHTML + '<br><br>';
            count++;
          }
          sibling = sibling.nextElementSibling;
        }

        if (content.trim()) {
          maxScore = score;
          bestBlock = {
            title: h.textContent.trim(),
            content: content.trim()
          };
        }
      }
    }

    if (bestBlock) {
      return `🔍 <b>From the page: ${bestBlock.title}</b><br><br>${bestBlock.content}`;
    }
    return null;
  }

  // ── Match User Input to KB & Routers ──────────────────────────────
  function getResponse(input) {
    const rawInput = input;
    const text = normalizeText(input);
    if (!text) return null;

    // 1. Greetings
    if (/^(hi|hello|hey|hii|helo|howdy|sup|yo|greetings)\b/.test(text)) {
      return `👋 Hey there! I'm <b>Mentroid Assistant</b>.<br><br>
I can help you with info about our custom AI packages, team, services, pricing, and project portfolio.<br><br>
What would you like to know? 😊`;
    }

    // 2. Thanks
    if (/thank|thanks|thx|ty|awesome|great|cool|perfect\b/.test(text)) {
      return `😊 You're welcome! Let me know if you have any other questions. We're here to help!`;
    }

    // 3. Bye
    if (/bye|goodbye|see you|cya|later/.test(text)) {
      return `👋 Goodbye! Feel free to open the chat anytime. Have an amazing day! 🚀`;
    }

    // 4. Team Member Router
    for (const member of TEAM_MEMBERS) {
      const matchFound = member.aliases.some(alias => {
        const regex = new RegExp("\\b" + alias + "\\b");
        if (regex.test(text)) return true;
        const tokens = text.split(' ');
        return tokens.some(t => checkTypoMatch(t, [alias], 1));
      });

      if (matchFound) {
        let ans = `👥 <b>${member.name}</b> — <i>${member.role}</i><br><br>${member.bio}`;
        const links = [];
        if (member.linkedin) {
          links.push(`<a href="${member.linkedin}" target="_blank">🔗 LinkedIn</a>`);
        }
        if (member.portfolio) {
          links.push(`<a href="${member.portfolio}" target="_blank">🌐 Portfolio</a>`);
        }
        if (links.length > 0) {
          ans += `<br><br>${links.join(' · ')}`;
        }
        return ans;
      }
    }

    // 5. Package / Pricing Details Router
    for (const pkg of PACKAGES) {
      const matchFound = pkg.aliases.some(alias => {
        if (text.includes(alias)) return true;
        const tokens = text.split(' ');
        return tokens.some(t => checkTypoMatch(t, [alias], 1));
      });

      if (matchFound) {
        lastDiscussedPackage = pkg;
        lastDiscussedService = null;
        let ans = `📦 <b>${pkg.name}</b><br><br>${pkg.description}<br><br>`;
        ans += `💰 <b>Price:</b> <span class="grad-text" style="font-weight:700;">${pkg.priceINR}</span> / <span>${pkg.priceUSD}</span><br>`;
        ans += `⏳ <b>Timeline:</b> ${pkg.timeline}<br><br>`;
        ans += `🎯 <b>What's Included:</b><br>`;
        pkg.features.forEach(f => {
          ans += `• ${f}<br>`;
        });
        ans += `<br><a href="#contact" onclick="closeChatbot()">👉 Get started with this package</a>`;
        return ans;
      }
    }

    // 6. Service Details Router
    for (const svc of SERVICES_DETAIL) {
      const matchFound = svc.aliases.some(alias => {
        if (text.includes(alias)) return true;
        const tokens = text.split(' ');
        return tokens.some(t => checkTypoMatch(t, [alias], 1));
      });

      if (matchFound) {
        lastDiscussedService = svc;
        lastDiscussedPackage = null;
        let ans = `🛠️ <b>${svc.name}</b><br><br>${svc.description}<br><br>`;
        ans += `🎯 <b>Key Features:</b><br>`;
        svc.features.forEach(f => {
          ans += `• ${f}<br>`;
        });
        if (svc.link) {
          ans += `<br><a href="${svc.link}" onclick="closeChatbot()">👉 Read more on our service page</a>`;
        } else {
          ans += `<br><a href="#contact" onclick="closeChatbot()">👉 Get a quote for this service</a>`;
        }
        return ans;
      }
    }

    // 7. Contextual Pricing Follow-up
    if (/(price|cost|how much|fee|charge)/.test(text) && lastDiscussedPackage) {
      return `💰 The price for <b>${lastDiscussedPackage.name}</b> is <span class="grad-text" style="font-weight:700;">${lastDiscussedPackage.priceINR}</span> / <span>${lastDiscussedPackage.priceUSD}</span>.<br><br>
              <a href="#contact" onclick="closeChatbot()">👉 Get started now</a>`;
    }

    // 8. General Pricing Inquiry
    if (/(price|cost|how much|package|plan|fee|charge|rupee|₹|dollar|usd|packages|pricing)/.test(text)) {
      let ans = `💰 <b>Our Service Packages & Pricing</b><br><br>`;
      PACKAGES.forEach(pkg => {
        ans += `<b>• ${pkg.name}:</b> ${pkg.priceINR} / ${pkg.priceUSD}<br>`;
      });
      ans += `<br>Which package are you interested in? Tell me its name (e.g. <i>"Growth"</i> or <i>"Starter"</i>) for full details, or click below to check them on the page:<br><br>
              <a href="#services" onclick="closeChatbot()">👉 View Packages Section</a>`;
      return ans;
    }

    // 9. Contact / Address / Email
    if (/(contact|reach|email|address|location|where|phone|call|map|sehore|india|hire)/.test(text)) {
      return `📬 <b>Contact Mentroid</b><br><br>
📍 <b>Location:</b> Sehore, Madhya Pradesh, India (serving clients nationwide)<br>
📧 <b>Email:</b> <a href="mailto:mentroid@mentroid.co.in">mentroid@mentroid.co.in</a><br><br>
We are active from Monday to Saturday, but our AI agents run 24/7! 🚀<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Send a message via Contact Form</a>`;
    }

    // 10. Process & Workflow
    if (/(process|work|step|flow|procedure|workflow|timeline|how do you)/.test(text)) {
      return `📋 <b>How We Work</b><br><br>
<b>1️⃣ Discovery Call:</b> We analyze your business goals and current pain points.<br>
<b>2️⃣ Tailored Proposal:</b> We structure a solution with a timeline and transparent pricing.<br>
<b>3️⃣ Development & Training:</b> We build custom models/chatbots/products in close collaboration.<br>
<b>4️⃣ Delivery & Support:</b> We deploy the solution and provide post-launch maintenance.<br><br>
<a href="#contact" onclick="closeChatbot()">👉 Request a Discovery Call</a>`;
    }

    // 11. Projects & Work Showcase
    if (/(project|work|portfolio|built|show me|ecg|stock|saas|case study|example|projects|learnsphere|agritech|ecgenius|visionstra)/.test(text)) {
      return `🗂️ <b>Our Featured Projects</b><br><br>
🎓 <b>LearnSphere:</b> Static educational web platform with physics/chemistry simulations, quizzes, and Gemini AI Tutor.<br>
🌱 <b>AgriTech:</b> Smart agriculture platform for crop recommendation, yield forecasting, and disease detection.<br>
❤️ <b>ECGenius:</b> Deep learning app built with PyTorch & Flask for ECG signal classification and cardiac arrhythmia detection.<br>
👓 <b>VisionSTRA:</b> Privacy-first, local browser-based road safety AI assistant for visually impaired users.<br><br>
<a href="#projects" onclick="closeChatbot()">👉 Scroll to Projects Showcase</a>`;
    }

    // 12. General KB Lookup
    let bestKey = null;
    let highestScore = 0;
    const queryTokens = text.split(' ').filter(t => t.length > 2);

    for (const key in KB) {
      const entry = KB[key];
      let score = 0;
      
      entry.keywords.forEach(kw => {
        if (text.includes(kw)) {
          score += 5;
        }
      });

      queryTokens.forEach(t => {
        if (entry.keywords.some(kw => kw.includes(t))) {
          score += 1;
        }
      });

      if (score > highestScore) {
        highestScore = score;
        bestKey = key;
      }
    }

    if (highestScore >= 3 && bestKey) {
      return KB[bestKey].answer;
    }

    // 13. Active Page DOM Scraper Fallback
    const domResult = searchActiveDOM(rawInput);
    if (domResult) {
      return domResult;
    }

    // 14. Fallback default reply
    return `🤔 I'm not sure about that, but I'd love to help! You can ask me about:<br>
• 💻 <b>Our Services</b> (e.g., <i>"SaaS"</i>, <i>"Chatbots"</i>, <i>"ML models"</i>)<br>
• 💰 <b>Packages & Pricing</b> (e.g., <i>"Growth pack"</i>, <i>"Starter price"</i>)<br>
• 👥 <b>Our Team</b> (e.g., <i>"Who is Om Roy?"</i>, <i>"Who is Shubhangi?"</i>)<br>
• 📋 <b>How we work</b> & 📬 <b>How to reach us</b><br><br>
Or <a href="#contact" onclick="closeChatbot()">send us a direct message</a> and our team will get back to you!`;
  }

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
