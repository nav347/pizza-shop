# How to add a new version to the cleanup site

Every change Adarsh asks for becomes a NEW version. Never edit an old version folder.

1. Copy the newest version folder, for example `v12-adarsh`, to a new name `vNN-slug` (next number, short word), for example `v13-bigger-phone`.
2. Edit only the new folder (index.html, services.html, quote.html, style.css).
3. Add ONE entry at the end of `versions.json`:

        { "id": "v13-bigger-phone", "title": "Bigger Phone", "vibe": "One line describing it.",
          "swatch": ["#0e0f12", "#f2b233"], "tag": "optional badge text", "added": "2026-11-20" }

   `tag` is optional. If a version has other pages than index/services/quote plus style.css, add `"pages": ["index.html", "..."]`.
4. Run `python check_links.py`. Commit. That is all: the gallery card, the version bar and the ratings pick it up by themselves.

## Branching off any version

Copy ANY version's folder (not only the newest) to the new `vNN-slug`, and add `"parent": "v12-adarsh"` (the id you copied) to its entry in `versions.json`. The gallery card then shows "branched from ..." (a link to the parent card) and the version bar shows "Branched from ...".

## Notes per version

`notes.json` holds notes, kept apart so `versions.json` only ever grows:

        { "v13-bigger-phone": [ { "text": "Adarsh wants the phone bigger", "author": "Naveen", "date": "2026-11-20" } ] }

Add notes to the list of that version id (the id must exist). The gallery card shows "N notes" that opens the list, newest first, and the version bar has a notes button. Notes are shown as plain text, cut at 500 characters. A missing or broken notes.json just means no notes. `check_links.py` fails if a notes key or a parent is not a real version id.

The list in `switcher.js` (FALLBACK) is only a backup for opening files straight from disk; it does not need editing for new versions.
