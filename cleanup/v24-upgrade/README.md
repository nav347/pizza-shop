# Version 16 (v16-homes-business), Maple Axis site

Branched from v15-residential. A light, logo-first redesign: the new vector logo (../assets/maple-axis-logo.svg) sits straight on the
white header with no chip, and the colours come from the logo itself (maple orange-red and near-black on warm paper).
Why this direction and the other options looked at: PLAN.md.

Pages:
- index.html: hero, "For businesses" / "For homeowners" split, services, about, how it works, sample reviews, contractors, contact.
- residential.html: home services with sample prices, why homeowners call, sample reviews, homeowner FAQ.
- services.html: the six business services, a "Need this at home?" band, how it works, contractors, contact.
- quote.html: property type (Residential / Commercial / Industrial) changes the service list and the address label. Still not
  connected: pressing the button only shows a message with the phone and email.

Files:
- style.css: the whole look. Colours are at the top (--or = logo orange for big shapes, --or-d = darker orange for text and buttons).
- biz-local.js: v16 wording (Industrial, Commercial & Residential), the residential service list, sample reviews and homeowner FAQ.
  It loads right after ../business.js, so change wording here, not in the pages.
- site.js: fills the pages from the data (text only, no HTML injection) and runs the quote form.
- Phone, email, address and area come from ../business.js (shared by all versions). Do not type them into the pages.

Sample content: everything marked PLACEHOLDER (in biz-local.js and as HTML comments) is demo content. Sample prices and reviews
also show a yellow "Sample price" / "Sample content" tag on the page. The full list for Adarsh to confirm: WORDING-TO-CONFIRM.md.
