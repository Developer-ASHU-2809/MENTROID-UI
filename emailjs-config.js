/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           MENTROID — Email Delivery Configuration           ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  Fill in ONE of the two options below.                      ║
 * ║  EmailJS is recommended — it works for BOTH forms.         ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ── OPTION A: EmailJS (Recommended) ─────────────────────────────
 *  1. Go to https://www.emailjs.com and sign up (free tier = 200 emails/month)
 *  2. Add Email Service → connect Gmail / Outlook for mentroid@mentroid.co.in
 *     → copy the Service ID  (looks like: service_xxxxxxx)
 *  3. Create Email Template for ADMIN (what YOU receive):
 *       Subject : {{subject}}
 *       Body    :
 *         From   : {{from_name}} <{{from_email}}>
 *         Mobile : {{mobile}}
 *         Package: {{package_name}}
 *         Location: {{location}}
 *         Designation: {{designation}}
 *         Details: {{general_details}}
 *         Problem: {{problem_statement}}
 *         Solution: {{expected_solution}}
 *         Message: {{message}}
 *       → copy the Template ID  (looks like: template_xxxxxxx)
 *  4. Create Email Template for USER CONFIRMATION (what the sender receives):
 *       To      : {{user_email}}
 *       Subject : We received your message — Mentroid
 *       Body    : Hi {{from_name}}, thanks for reaching out! We'll reply within 24 hours.
 *       → copy the Template ID  (looks like: template_xxxxxxx)
 *  5. Go to Account → Public Key → copy it  (looks like: xxxxxxxxxxxxxxxxxxxxxx)
 *  6. Paste all three values below.
 *
 * ── OPTION B: Web3Forms (Simpler, no account needed) ────────────
 *  1. Go to https://web3forms.com
 *  2. Enter mentroid@mentroid.co.in → click "Create Access Key"
 *  3. Paste the key in web3formsAccessKey below.
 *  NOTE: Web3Forms does NOT support the extra quote fields (mobile, location etc.)
 *        as separate columns — they will be bundled in the message body.
 */

window.MENTROID_CONTACT = {
  toEmail: 'mentroid@mentroid.co.in',

  // ── Option B: Web3Forms ──────────────────────────────────────
  web3formsAccessKey: '',   // e.g. 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

  // ── Option A: EmailJS ────────────────────────────────────────
  emailjs: {
    publicKey:             '',   // Account → Public Key
    serviceId:             '',   // e.g. 'service_xxxxxxx'
    adminTemplateId:       '',   // Template that sends to YOU
    confirmationTemplateId:'',   // Template that sends to the USER (optional)
  },
};

/* ── Internal: keep backward-compat alias ── */
window.MENTROID_EMAILJS = window.MENTROID_CONTACT;
