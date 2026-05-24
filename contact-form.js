(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('contact-submit');
  const statusEl = document.getElementById('contact-form-status');
  const cfg = window.MENTROID_CONTACT || window.MENTROID_EMAILJS || {};
  const emailjsCfg = cfg.emailjs || cfg;
  const toEmail = (cfg.toEmail || 'mentroid@mentroid.co.in').toLowerCase();

  function isPlaceholder(value) {
    if (!value || typeof value !== 'string') return true;
    const v = value.trim();
    return !v || v.startsWith('YOUR_');
  }

  function isEmailJsConfigured() {
    return !isPlaceholder(emailjsCfg.publicKey) &&
      !isPlaceholder(emailjsCfg.serviceId) &&
      !isPlaceholder(emailjsCfg.adminTemplateId || emailjsCfg.templateId);
  }

  function hasConfirmationTemplate() {
    return !isPlaceholder(emailjsCfg.confirmationTemplateId);
  }

  function isWeb3FormsConfigured() {
    const key = cfg.web3formsAccessKey;
    return key && !isPlaceholder(key);
  }

  function isDeliveryConfigured() {
    return isEmailJsConfigured() || isWeb3FormsConfigured();
  }

  function setStatus(type, message) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.className = 'form-status form-status--' + type;
  }

  function clearStatus() {
    if (!statusEl) return;
    statusEl.hidden = true;
    statusEl.textContent = '';
    statusEl.className = 'form-status';
  }

  function setLoading(loading) {
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? 'Sending…' : 'Send Message';
    }
    form.querySelectorAll('input:not([type="hidden"]), textarea').forEach(function (el) {
      el.disabled = loading;
    });
  }

  function getValues() {
    return {
      name: form.from_name.value.trim(),
      email: form.from_email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };
  }

  function validate() {
    const { name, email, subject, message } = getValues();

    if (form._honey && form._honey.value) {
      return false;
    }

    if (!name) {
      setStatus('error', 'Please enter your name.');
      form.from_name.focus();
      return false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error', 'Please enter a valid email address.');
      form.from_email.focus();
      return false;
    }
    if (!subject) {
      setStatus('error', 'Please enter a subject.');
      form.subject.focus();
      return false;
    }
    if (!message) {
      setStatus('error', 'Please enter your message.');
      form.message.focus();
      return false;
    }
    return true;
  }

  function sendViaWeb3Forms() {
    const { name, email, subject, message } = getValues();

    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: cfg.web3formsAccessKey,
        name: name,
        email: email,
        subject: 'Mentroid contact: ' + subject,
        message: message,
        from_name: 'Mentroid Website',
        botcheck: form._honey ? form._honey.value : '',
      }),
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Could not send message');
        }
        return data;
      });
    });
  }

  function sendViaEmailJs() {
    if (typeof emailjs === 'undefined') {
      return Promise.reject(new Error('Email service failed to load. Please refresh the page.'));
    }

    const { name, email, subject, message } = getValues();
    const serviceId = emailjsCfg.serviceId;
    const adminTemplateId = emailjsCfg.adminTemplateId || emailjsCfg.templateId;

    emailjs.init({ publicKey: emailjsCfg.publicKey });

    return emailjs.sendForm(serviceId, adminTemplateId, form).then(function () {
      if (!hasConfirmationTemplate()) return;
      return emailjs.send(serviceId, emailjsCfg.confirmationTemplateId, {
        to_email: toEmail,
        user_email: email,
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        reply_to: toEmail,
      });
    });
  }

  function sendMessage() {
    if (isEmailJsConfigured()) {
      return sendViaEmailJs();
    }
    if (isWeb3FormsConfigured()) {
      return sendViaWeb3Forms();
    }
    return Promise.reject(new Error('NOT_CONFIGURED'));
  }

  function setupErrorMessage(err) {
    if (err && err.message === 'NOT_CONFIGURED') {
      return 'Message delivery is not configured yet. Add your Web3Forms or EmailJS keys in emailjs-config.js.';
    }
    if (err && err.text) {
      return 'Could not send your message: ' + err.text;
    }
    if (err && err.message) {
      return 'Could not send your message. ' + err.message;
    }
    return 'Could not send your message. Please try again in a moment.';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearStatus();

    if (!validate()) return;

    if (!isDeliveryConfigured()) {
      setStatus('error', setupErrorMessage(new Error('NOT_CONFIGURED')));
      return;
    }

    setLoading(true);

    sendMessage()
      .then(function () {
        var msg = 'Thank you! Your message was sent to Mentroid.';
        if (isEmailJsConfigured() && hasConfirmationTemplate()) {
          msg += ' A confirmation email has been sent to your inbox.';
        } else if (isWeb3FormsConfigured()) {
          msg += ' A confirmation email has been sent to your inbox.';
        } else {
          msg += ' We will get back to you soon.';
        }
        setStatus('success', msg);
        form.reset();
      })
      .catch(function (err) {
        console.error('Contact form error:', err);
        setStatus('error', setupErrorMessage(err));
      })
      .finally(function () {
        setLoading(false);
      });
  });

  form.addEventListener('input', clearStatus);
})();
