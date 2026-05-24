/**
 * Contact form — choose ONE option below (Web3Forms is fastest to set up).
 *
 * OPTION A — Web3Forms (recommended, ~2 minutes)
 * 1. https://web3forms.com → enter mentroid@mentroid.co.in → Create Access Key
 * 2. In Web3Forms dashboard: enable "Auto Responder" for confirmation emails
 * 3. Paste access key in web3formsAccessKey below
 *
 * OPTION B — EmailJS (https://www.emailjs.com)
 * 1. Connect email service for mentroid@mentroid.co.in
 * 2. Admin template → To: {{to_email}}, Reply-To: {{from_email}}
 *    Variables: {{to_email}} {{from_name}} {{from_email}} {{subject}} {{message}}
 * 3. Confirmation template → To: {{user_email}}
 *    Variables: {{user_email}} {{from_name}} {{from_email}} {{subject}} {{message}}
 * 4. Paste keys below
 */
window.MENTROID_CONTACT = {
  toEmail: 'mentroid@mentroid.co.in',

  web3formsAccessKey: '',

  emailjs: {
    publicKey: '',
    serviceId: '',
    adminTemplateId: '',
    confirmationTemplateId: '',
  },
};

/* Backward compatibility */
window.MENTROID_EMAILJS = {
  toEmail: window.MENTROID_CONTACT.toEmail,
  publicKey: window.MENTROID_CONTACT.emailjs.publicKey,
  serviceId: window.MENTROID_CONTACT.emailjs.serviceId,
  templateId: window.MENTROID_CONTACT.emailjs.adminTemplateId,
  confirmationTemplateId: window.MENTROID_CONTACT.emailjs.confirmationTemplateId,
  web3formsAccessKey: window.MENTROID_CONTACT.web3formsAccessKey,
};
