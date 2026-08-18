// C.van Pedagogy — submission configuration
// ===========================================
// This is the ONE place you need to edit to make the questionnaire send you email.
//
// STEP 1 — Create a Formspree form:
//   1. Go to https://formspree.io and sign up / log in.
//   2. Create a new form (any name, e.g. "C.van Pedagogy Questionnaire").
//   3. Formspree will give you a Form ID that looks like: mzzeqjkd
//      (it appears in an endpoint URL like https://formspree.io/f/mzzeqjkd)
//   4. Copy just that ID and paste it below, replacing YOUR_FORMSPREE_ID.
//
// STEP 2 — Save this file. No other file needs to change.
//
// Until you paste a real ID, the site will detect the placeholder and fall
// back to opening the visitor's email client (mailto) instead — so nothing
// breaks, but you should switch to Formspree before real launch since mailto
// depends on the visitor having a configured email app, and long answers can
// get cut off in some email clients.

const CVAN_CONFIG = {
  // Paste your real Formspree ID between the quotes below (keep the /f/ prefix).
  formspreeEndpoint: "https://formspree.io/f/maewpyjo",

  // Where questionnaire answers should land if Formspree isn't configured
  // yet (see above) — the mailto fallback addresses itself to this so it
  // never sends to a blank "To:" field again.
  contactEmail: "sivandavid250@gmail.com",

  // Your WhatsApp number, so a "לשלוח גם בוואטסאפ" button can appear —
  // always, on both the thank-you screen and if the email send fails.
  // Format: country code + number, digits only, no +, no spaces or dashes.
  // Example: an Israeli 050-1234567 becomes "972501234567".
  // Leave the placeholder below to keep the WhatsApp button hidden.
  whatsappNumber: "972544454473",

  // Payment gate: until this is configured, the "בואי נתחיל" buttons open the
  // questionnaire directly (so the site stays fully testable). Once you paste
  // a real link below, those buttons say "מעבר לביט" and send visitors there
  // FIRST — the questionnaire only opens after a successful payment.
  //
  // CURRENT PLAN — personal Bit, no business registration needed:
  //   Open Bit → request/share a payment link (Bit supports generating a
  //   shareable payment-request link, not just QR-in-person) → paste that
  //   link below.
  //   ⚠️ Test it yourself from a browser where you are NOT already logged
  //   into Bit with your own number, to confirm a stranger can actually pay
  //   through it — personal Bit is built for people who already know each
  //   other, and this use (a public link on a website, for anyone) is not
  //   its typical case. If it doesn't work smoothly for a stranger, this
  //   isn't the right link to use here.
  //
  //   Also set the redirect-after-payment address to your site + ?paid=1
  //   (e.g. https://your-site.example/?paid=1) wherever Bit lets you set
  //   that — this is what tells the site the payment went through. If Bit
  //   has no such setting, this gate can't auto-continue and you're better
  //   off with the option below for now.
  //
  // LATER, once you register as עוסק פטור — Grow (grow.link) replaces this
  // cleanly: same paymentLink field, but you also get a real tax invoice
  // issued automatically, and Grow's checkout still includes Bit as one of
  // the options inside it. Just swap the URL below when you're ready.
  //
  // Read the honest limitation of this whole approach in
  // README-payment-gate.txt next to this file before relying on it.
  paymentLink: "https://YOUR-PAYMENT-LINK-HERE",
};
