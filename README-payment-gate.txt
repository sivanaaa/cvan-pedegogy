How the payment gate actually works, in plain terms
=====================================================

This site has no server — it's just files. That means the payment gate
works like this:

1. Visitor clicks "בואי נתחיל" → sent to your payment link (Grow/Stripe).
2. She pays there.
3. Your payment provider redirects her BACK to your site with ?paid=1
   in the address (you set this redirect URL when creating the payment
   link — see config.js for exact steps).
4. The site sees ?paid=1, remembers it in her browser (localStorage),
   and opens the questionnaire automatically.

What this protects against:
- Someone casually clicking the button and expecting to skip payment.
  They can't — the button sends them to pay, full stop.

What this does NOT protect against:
- Someone who knows how URLs work could type "?paid=1" onto your site's
  address by hand and open the questionnaire without paying. There's no
  server checking whether a real payment actually happened — the site
  just trusts that URL parameter.
- If she pays on her phone and opens the questionnaire on her laptop,
  the "paid" flag won't carry over (it's stored per-browser).

Is this a real problem in practice? For most solo educators selling to
individual teachers, no — the people filling this out aren't trying to
defraud you, and this is the same trust level as e.g. a Google Form
locked behind "email me for the link." If you start seeing people
skip payment, or the amounts involved get large enough that it matters,
that's the point to add a real backend: a small server function that
listens for your payment provider's webhook (a message it sends when a
payment truly succeeds), and only THEN lets the questionnaire open —
that's the version with no way to fake it. Ask for this when you're
ready; it's a separate, bigger piece of work than what's here today.
