# Mentroid AI Solutions Showcase Website

Mentroid is a premium, next-generation AI and Machine Learning solutions agency landing page built with a high-fidelity **Liquid Glass** aesthetic. It showcases services, pricing structures, and features interactive tools like an **AI Chatbot** and a hands-free **Voice AI Assistant** to deliver an immersive web experience.

---

## 🌟 Core Features

### 1. Hands-Free Voice AI Assistant (`voice-assistant.js`)
An advanced voice assistant enabling hands-free navigation, information retrieval, and action execution:
*   **Speech Interruption Prevention**: Pauses SpeechRecognition while Text-to-Speech (TTS) is active, preventing the AI from transcribing its own synthesized voice.
*   **Dynamic Sound Feedback**: Plays dynamic, browser-generated sci-fi chimes via the **Web Audio API** when starting (`start`), stopping (`stop`), or completing actions (`success`).
*   **Alt + V Keyboard Shortcut**: Toggle listening instantly using the shortcut keys.
*   **Real-Time Speech Bubble**: A glassmorphic overlay displaying user transcripts and assistant replies, fading out automatically after 4.5 seconds.
*   **Automated Form Filling**: Guide the user step-by-step to fill the contact form. Focuses and scrolls to the active field in real-time, highlighting it with a glow, and populates inputs dynamically as spoken.

### 2. Smart AI Chatbot (`chatbot.js`)
An interactive support widget featuring:
*   **NLP Keyword Matching**: Tokenizes and scores query keywords to route users to the correct response from a local Knowledge Base.
*   **Active DOM Scraper Fallback**: If a question isn't in the knowledge base, it dynamically scrapes the page's visible text to find relevant information before falling back.
*   **Quick Reply Chips**: Interactive buttons to suggest common user inquiries.

### 3. High-Performance Projects Slider (`projects-slider.js`)
A continuous infinite slider showing featured projects:
*   **LearnSphere**: Static educational web platform with science/maths simulations, quizzes, and Gemini AI.
*   **AgriTech**: AI-driven smart agriculture platform for crop recommendations and disease detection.
*   **ECGenius**: Deep learning application built with PyTorch and Flask to analyze ECG data.
*   **VisionSTRA**: Privacy-first, local browser-based safety assistant for visually impaired users.
*   **GPU Parallax Acceleration**: Utilizes subpixel 3D transitions (`translate3d`, `translateZ`) and promotes elements to compositor layers (`backface-visibility`) for stutter-free rendering.
*   **Scroll transition bypass**: Dynamically attaches an `.is-scrolling` class to the page to disable heavy CSS transitions during active scroll, maintaining a smooth 60fps/120fps frame rate.

### 4. Interactive Theme System
*   **Liquid Glass Aesthetics**: Deep dark-mode gradients, satin-blur filters, and neon glass borders.
*   **Light Theme Support**: A bright, clean teal-cyan glass scheme that auto-detects system preferences and toggles instantly.

---

## 📂 Project Structure

```
MENTROID-UI/
├── index.html            # Main markup (Structure, Meta SEO, Modals, Forms)
├── style.css             # Unified CSS file containing tokens, glass effects, and layout overrides
├── script.js             # General page animations, 3D Canvas rendering, and modal visibility
├── chatbot.js            # Chatbot knowledge base and message loop logic
├── voice-assistant.js    # Speech synthesis/recognition, form highlighting, and audio context
├── projects-slider.js    # Parallax cards offset computations and scroll triggers
├── contact-form.js       # Unified contact form submission handler
├── emailjs-config.js     # EmailJS configuration keys
└── README.md             # Project documentation (this file)
```

---

## 🚀 Quick Start & Local Setup

The website is designed as a standalone static web application (HTML/CSS/JS) with zero build dependencies.

### Method 1: Direct File Launch
Simply double-click the `index.html` file to open it in any modern browser.

### Method 2: Local HTTP Server (Recommended)
To prevent CORS blockages during local script imports or asset loading, serve the project folders through a local web server:

**Using Python:**
```bash
python3 -m http.server 8000
```
Navigate to `http://localhost:8000` in your web browser.

**Using Node.js:**
```bash
# Install static server globally or run directly via npx
npx http-server -p 8000
```

---

## 🛠️ Technology Stack
*   **Core**: HTML5, Vanilla JavaScript (ES6)
*   **Styling**: Vanilla CSS3 (Custom Variables, Glassmorphism, CSS Transitions, Flexbox/Grid)
*   **API Integrations**: EmailJS SDK (Unified contact form delivery)
*   **Browser APIs**: Web Speech API (`SpeechRecognition`, `speechSynthesis`), Web Audio API (`AudioContext`, `OscillatorNode`)
