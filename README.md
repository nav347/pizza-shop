# Dough Re Mi: pizza shop site, 10 designs

One placeholder shop, ten radically different static websites. No frameworks, no build step.

- Open `index.html` for the gallery. Each `vN-*/` folder has `index.html`, `menu.html`, `visit.html`, `style.css`.
- **All shop details live in `shop.js`** (name, tagline, address, phone, hours, menu in rupees). Edit that one file.
- `switcher.js` adds the bottom bar to jump between designs while keeping the same page.
- `shop-fill.js` fills text from `shop.js` for v1 to v4; other versions may fill themselves (switcher.js is a fallback).
- Links are relative, so it works on GitHub Pages under a subpath. `.nojekyll` is included.
- Check links: `python check_links.py`
