/**
 * Mentroid — Contact Form Handler
 * Supports EmailJS (primary) and Web3Forms (fallback).
 * Keys are set in emailjs-config.js.
 */
(function () {
  'use strict';

  const form      = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('contact-submit');
  const statusEl  = document.getElementById('contact-form-status');

  /* ── Shared helpers (also used by quote form via window.MentroidMail) ── */
  function isBlank(val) {
    return !val || typeof val !== 'string' || !val.trim() || val.trim().startsWith('YOUR_');
  }

  function getCfg() {
    return window.MENTROID_CONTACT || window.MENTROID_EMAILJS || {};
  }

  function ejsCfg() {
    const c = getCfg();
    return c.emailjs || c;
  }

  function isEmailJsReady() {
    const e = ejsCfg();
    return !isBlank(e.publicKey) && !isBlank(e.serviceId) &&
           !isBlank(e.adminTemplateId || e.templateId);
  }

  function isWeb3Ready() {
    return !isBlank(getCfg().web3formsAccessKey);
  }

  function isReady() { return isEmailJsReady() || isWeb3Ready(); }

  /* ── Send via EmailJS ── */
  function sendEmailJs(params) {
    if (typeof emailjs === 'undefined') {
      return Promise.reject(new Error('EmailJS SDK not loaded. Please refresh the page.'));
    }
    const e   = ejsCfg();
    const cfg = getCfg();
    emailjs.init({ publicKey: e.publicKey });

    const adminTpl = e.adminTemplateId || e.templateId;
    const svcId    = e.serviceId;

    // Send to admin
    return emailjs.send(svcId, adminTpl, params).then(function () {
      // Send confirmation to user if template is set
      const confTpl = e.confirmationTemplateId;
      if (!isBlank(confTpl)) {
        return emailjs.send(svcId, confTpl, {
          to_email:   params.from_email,
          user_email: params.from_email,
          from_name:  params.from_name,
          subject:    'We received your message — Mentroid',
          message:    'Hi ' + params.from_name + ', thanks for reaching out! We\'ll reply within 24 hours.',
          reply_to:   cfg.toEmail || 'mentroid@mentroid.co.in',
        });
      }
    });
  }

  /* ── Send via Web3Forms ── */
  function sendWeb3(params) {
    return fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.assign({
        access_key: getCfg().web3formsAccessKey,
        from_name:  'Mentroid Website',
      }, params)),
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok || !data.success) throw new Error(data.message || 'Submission failed');
        return data;
      });
    });
  }

  /* ── Unified send ── */
  function send(params) {
    if (isEmailJsReady()) return sendEmailJs(params);
    if (isWeb3Ready())    return sendWeb3(params);
    return Promise.reject(new Error('NOT_CONFIGURED'));
  }

  /* Expose helpers so the quote form can reuse them */
  window.MentroidMail = { send: send, isReady: isReady, isBlank: isBlank };

  /* ── UI helpers ── */
  function setStatus(type, msg) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = msg;
    statusEl.className = 'form-status form-status--' + type;
  }

  function clearStatus() {
    if (!statusEl) return;
    statusEl.hidden = true;
    statusEl.textContent = '';
    statusEl.className = 'form-status';
  }

  function setLoading(on) {
    if (submitBtn) {
      submitBtn.disabled = on;
      submitBtn.textContent = on ? 'Sending…' : 'Send Message';
    }
    form.querySelectorAll('input:not([type="hidden"]), textarea').forEach(function (el) {
      el.disabled = on;
    });
  }

  /* ── Validation ── */
  function validate() {
    if (form._honey && form._honey.value) return false;

    const name    = form.from_name.value.trim();
    const email   = form.from_email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name)    { setStatus('error', 'Please enter your name.');              form.from_name.focus();    return false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    setStatus('error', 'Please enter a valid email address.');  form.from_email.focus();   return false; }
    if (!subject) { setStatus('error', 'Please enter a subject.');              form.subject.focus();      return false; }
    if (!message) { setStatus('error', 'Please enter your message.');           form.message.focus();      return false; }
    return true;
  }

  /* ── Submit ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearStatus();
    if (!validate()) return;

    if (!isReady()) {
      setStatus('error', 'Email delivery is not configured yet. Add your EmailJS or Web3Forms keys in emailjs-config.js.');
      return;
    }

    const params = {
      to_email:    getCfg().toEmail || 'mentroid@mentroid.co.in',
      from_name:   form.from_name.value.trim(),
      from_email:  form.from_email.value.trim(),
      subject:     'Mentroid Contact: ' + form.subject.value.trim(),
      message:     form.message.value.trim(),
      reply_to:    form.from_email.value.trim(),
      // Web3Forms fields
      name:        form.from_name.value.trim(),
      email:       form.from_email.value.trim(),
    };

    setLoading(true);

    send(params)
      .then(function () {
        setStatus('success', '✅ Message sent! We\'ll get back to you soon.');
        form.reset();
      })
      .catch(function (err) {
        console.error('[Contact form]', err);
        if (err && err.message === 'NOT_CONFIGURED') {
          setStatus('error', 'Email delivery is not configured. Please add your keys in emailjs-config.js.');
        } else {
          setStatus('error', 'Could not send your message. Please try again or email mentroid@mentroid.co.in directly.');
        }
      })
      .finally(function () { setLoading(false); });
  });

  form.addEventListener('input', clearStatus);
})();
