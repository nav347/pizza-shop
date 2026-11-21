# v16 plan: design directions (written before building, 2026-11-18)

Starting point: v15-residential (dark near-black + gold, new SVG logo on a white chip, residential words only in the taglines).
What v16 must fix: the logo sits in a chip; the gold accent does not match the logo (orange-red #E63A00 + near-black);
homeowners have no page of their own; the quote form cannot tell a home from a plant.

| # | Direction | Pros | Cons |
|---|-----------|------|------|
| 1 | Keep v15 dark, only add a residential section | Least work, continuity | Logo still in a chip; gold still clashes with the logo; looks like v15 |
| 2 | Dark site with a white header band only | Logo on white; keeps the v11 mood | Gold vs orange clash stays; homeowners still see a "warehouse" site |
| 3 | Light, logo-first, colours taken FROM the logo (white + warm paper, near-black ink, maple orange-red), audience split on home | Logo sits on white with no chip; brand looks deliberate; reads friendly for homes and serious for business | All illustrations need re-colouring (done in CSS, the art uses shared classes) |
| 4 | Split-screen hero: dark "business" half, light "homes" half | Very clear audience split | Gimmicky at 375 px (stacks into two heroes); the logo still lands on dark on one half |
| 5 | Editorial/magazine layout, big serif type | Distinctive, premium | Weak for calls and quotes; serif fights the logo's own type |
| 6 | Blueprint/technical light theme | On-brand for industrial | Already done in v3; cold for homeowners |
| 7 | Two separate mini-sites (business / homes) behind a chooser page | Each audience gets a tailored site | Double the pages to maintain; an extra click before any content |

## Pick: direction 3 (the boss's recommendation, improved)

Why: it is the only option that fixes all three problems at once. The logo sits directly on white (no chip, no squashing,
explicit width/height so no layout shift). Improvement on the brief: instead of keeping v15's gold, the whole palette is lifted
from the logo itself (maple orange-red and near-black), so the site and the logo look designed together. A darker orange
(#C23200) is used for small text and buttons so contrast passes WCAG AA; the pure logo orange is kept for large shapes.

What gets built:
- Light, sticky logo-first header; nav Home / Services / Residential / Get a quote on every page; phone + quote button.
- Home: new hero art (one horizon with a plant, an office tower and a house under the logo's swoosh), an audience split
  ("For businesses" / "For homeowners") reusing the BIZ.services descriptions, services grid, how it works, sample
  testimonials (tagged), contractors band, contact.
- residential.html: home services adapted from the real service lines, sample "from" prices (tagged), sample reviews,
  residential FAQ, quote button that pre-selects Residential.
- services.html: the six business services, plus a band pointing homeowners to the residential page.
- quote.html: property-type choice (Residential / Commercial / Industrial) that swaps the service list and the address label;
  same not-connected submit message as before.
- All text set with textContent (one shared site.js, no innerHTML); reduced motion respected; 375 px first.

Simpler/cheaper route not taken: direction 2 (white header band on the dark v15). Half a day less work, but the colour clash and
the "warehouse only" feel for homeowners would stay.
