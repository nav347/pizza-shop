# Maple Axis site, version 28

What the site has now:
- A red, black and off-white look. All colours are at the top of style.css.
- Four service groups on services.html: Industrial, Commercial, Residential and the rest, in that order.
- Six real photos supplied by the customer, in images/. site.js puts them on the service cards.
- LocalBusiness data (for search engines) built by site.js from the shared business data.
- No street address anywhere.
- The phone number is shown in only two places: the call link in the header, and the contact block on quote.html. Buttons that
  say "Call" carry no digits. Everywhere else the site points people to the quote form or the email address.

- On phones (860px and narrower) the top navigation collapses into a hamburger menu button; site.js runs it and the styles are at the end of style.css.

Pages: index.html, services.html, residential.html, quote.html.

Files:
- style.css: the whole look.
- biz-local.js: wording for this version. It loads right after ../business.js, so change shared wording here, not in the pages.
- site.js: fills the pages from the business data (text only, no HTML injection) and runs the quote form. The quote form is not
  connected yet: pressing the button shows a message pointing to the email address.
- The phone number, email and service area come only from ../business.js. Do not type them into the pages.
