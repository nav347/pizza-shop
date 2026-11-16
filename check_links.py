"""Tiny link check: every href/src in every .html must resolve to a local file.
Usage: python check_links.py [--skip PREFIX ...]   (skip = ignore targets starting with these folder prefixes)"""
import os, re, sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.abspath(__file__))
skip = sys.argv[sys.argv.index("--skip") + 1:] if "--skip" in sys.argv else []
EXPECT = ["index.html"]
for slug in ["v1-trattoria", "v2-neon", "v3-diner", "v4-brutalist", "v5-comic", "v6-luxe",
             "v7-zen", "v8-chalkboard", "v9-vaporwave", "v10-blob", "v11-guide", "v12-pixel",
             "v13-bollywood", "v14-newspaper", "v15-bauhaus", "v16-foodtruck", "v17-cabin",
             "v18-hockey", "v19-transit", "v20-aurora"]:
    pages = ["index.html", "menu.html", "visit.html"] + (["checklist.html"] if slug == "v11-guide" else [])
    EXPECT += [slug + "/" + p for p in pages]   # style.css is checked as a link when a page references it

# second site: cleanup/ (index gallery + 10 versions x index/services/quote); only enforced for folders that exist or are in the contract
EXPECT += ["megabar.js", "cleanup/index.html", "cleanup/business.js", "cleanup/switcher.js"]
for slug in ["v1-clean", "v2-pro", "v3-blueprint", "v4-bold", "v5-friendly", "v6-luxury",
             "v7-industrial", "v8-eco", "v9-before-after", "v10-dark"]:
    EXPECT += ["cleanup/" + slug + "/" + p for p in ["index.html", "services.html", "quote.html", "style.css"]]


class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs = []

    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if k in ("href", "src") and v:
                self.refs.append(v)


bad, checked, pages = [], 0, 0
missing = [e for e in EXPECT if not any(e.startswith(s) for s in skip) and not os.path.exists(os.path.join(ROOT, e))]
for dp, dn, fn in os.walk(ROOT):
    dn[:] = [d for d in dn if d != ".git"]
    for f in fn:
        if not f.endswith(".html"):
            continue
        path = os.path.join(dp, f); pages += 1
        p = P(); p.feed(open(path, encoding="utf-8").read())
        for r in p.refs:
            if re.match(r"^(https?:|mailto:|tel:|#|data:|javascript:)", r) or r == "":
                continue
            if r.startswith("/"):
                bad.append((path, r, "absolute path breaks GitHub Pages subpath")); continue
            t = os.path.normpath(os.path.join(dp, r.split("#")[0].split("?")[0]))
            rel = os.path.relpath(t, ROOT).replace("\\", "/")
            if any(rel.startswith(s) for s in skip):
                continue
            checked += 1
            if not os.path.exists(t):
                bad.append((os.path.relpath(path, ROOT), r, "missing"))
for b in bad:
    print("BAD", *b)
for m in missing:
    print("MISSING FILE", m)
print("LINKCHECK %s: %d html pages, %d links checked, %d bad, %d expected files missing"
      % ("OK" if not bad and not missing else "FAIL", pages, checked, len(bad), len(missing)))
sys.exit(1 if bad or missing else 0)
