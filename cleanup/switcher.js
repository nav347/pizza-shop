/* Cleanup-site version bar: jump between all versions listed in versions.json, keeping the same page (index / services / quote).
   Also fills elements with data-biz="name|tagline|phone|email|area|hours" from window.BIZ
   (links with data-biz=phone/email and no href get tel:/mailto:), and loads the root megabar.js and ratings.js.
   Versions come from versions.json (one entry per cleanup/vNN-slug folder); notes from notes.json. See NEW-VERSION.md. */
(function () {
  /* FALLBACK is a copy of versions.json used when the fetch fails (file://, offline). New versions do not need to be added here. */
  var FALLBACK = [{"id":"v1-clean","title":"Clean Trust","vibe":"Crisp white and blue minimal: calm, clear and trustworthy.","swatch":["#fff","#1167c9"],"added":"2026-11-05"},{"id":"v2-pro","title":"Pro Contractor","vibe":"Corporate B2B look aimed at drywall companies who need a crew after theirs.","swatch":["#14202e","#f5a300"],"added":"2026-11-05"},{"id":"v3-blueprint","title":"Blueprint","vibe":"Technical drawing grid, white linework and dimensioned rooms.","swatch":["#0a3d8f","#7fb2ff"],"added":"2026-11-05"},{"id":"v4-bold","title":"Bold","vibe":"Huge type, hard contrast and loud yellow: impossible to miss.","swatch":["#111","#ffd400"],"added":"2026-11-05"},{"id":"v5-friendly","title":"Friendly","vibe":"Rounded shapes, warm colours and a neighbourly voice for homeowners.","swatch":["#ffb86b","#7ad7c0"],"added":"2026-11-05"},{"id":"v6-luxury","title":"Luxury","vibe":"White-glove service for high-end renovations, in black and gold.","swatch":["#1b1b1b","#c9a24b"],"added":"2026-11-05"},{"id":"v7-industrial","title":"Industrial","vibe":"Steel, safety orange and site-sign stencils.","swatch":["#444","#ff6a00"],"added":"2026-11-05"},{"id":"v8-eco","title":"Eco","vibe":"Greens and natural tones: HEPA, low-waste and healthier air.","swatch":["#2f7d4f","#cfe8c8"],"added":"2026-11-05"},{"id":"v9-before-after","title":"Before & After","vibe":"Dusty on the left, spotless on the right: the result tells the story.","swatch":["#b9a99a","#fff"],"added":"2026-11-05"},{"id":"v10-dark","title":"Dark","vibe":"Dark mode with a cool teal glow, modern and sleek.","swatch":["#0d0f14","#4de0c4"],"added":"2026-11-05"},{"id":"v11-axis","title":"Maple Axis","vibe":"Near-black and gold corporate look with a glass-lobby Toronto skyline hero.","swatch":["#0e0f12","#f2b233"],"tag":"New: Maple Axis style","added":"2026-11-16"},{"id":"v12-adarsh","title":"Adarsh's version","vibe":"Your own copy of the Maple Axis look. Changes you ask for go here only.","swatch":["#0e0f12","#f2b233"],"tag":"Your editable version","added":"2026-11-18","short":"Adarsh (editable)"}];
  var L = FALLBACK, V = [], readyCbs = [], loaded = false, N = {};
  function mk() { V = L.map(function (e, i) { return [e.id, e.short || ((i + 1) + " " + e.title)]; }); }
  mk();
  var me = document.currentScript;
  var here = me && me.src ? me.src : "";
  function fill() {
    var B = window.BIZ; if (!B) return;
    [].forEach.call(document.querySelectorAll("[data-biz]"), function (el) {
      var k = el.getAttribute("data-biz"), v = B[k];
      if (v === undefined) return;
      if (!el.textContent.trim()) el.textContent = v;
      if (el.tagName === "A" && !el.getAttribute("href")) {
        if (k === "phone") el.setAttribute("href", "tel:" + String(v).replace(/[^\d+]/g, ""));
        if (k === "email") el.setAttribute("href", "mailto:" + v);
      }
    });
  }
  var p = location.pathname.split("/");
  var file = p.pop() || "index.html";
  var dir = p.pop() || "";
  var idx = -1, inV = false, root = "";
  function locate() { idx = -1; V.forEach(function (v, i) { if (v[0] === dir) idx = i; }); inV = idx >= 0; root = inV ? "../" : ""; }
  locate();
  if (!/^(index|services|quote)\.html$/.test(file)) file = "index.html";
  function go(i) { location.href = root + V[(i + V.length) % V.length][0] + "/" + (inV ? file : "index.html"); }
  function byId(id) { for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
  /* Notes of a version, newest first. Missing or invalid data means no notes. */
  function notesFor(id) {
    var a = N && Array.isArray(N[id]) ? N[id].filter(function (n) { return n && typeof n.text === "string"; }) : [];
    return a.map(function (n, i) { return { n: n, i: i }; })
      .sort(function (x, y) { return String(y.n.date || "").localeCompare(String(x.n.date || "")) || y.i - x.i; })
      .map(function (x) { return x.n; });
  }
  /* Fills el with the notes of version id. textContent only: note text may come from a guest. */
  function renderNotes(el, id) {
    el.textContent = "";
    var a = notesFor(id);
    if (!a.length) { var e = document.createElement("p"); e.textContent = "No notes yet"; el.appendChild(e); return; }
    a.forEach(function (n) {
      var q = document.createElement("p"), t = String(n.text);
      if (t.length > 500) t = t.slice(0, 500) + "...";
      q.textContent = t + " (" + [n.author, n.date].filter(Boolean).join(", ") + ")";
      q.style.margin = "4px 0"; el.appendChild(q);
    });
  }
  /* Maple Axis logo on a white rounded chip, put in front of each page's own brand link (so the dark AXIS letters show) */
  function chip() {
    if (document.querySelector("img.ma-chip") || document.querySelector("[data-no-chip]")) return;
    var a = document.querySelector("a.brand, a.logo"); if (!a) return;
    [].forEach.call(a.children, function (c) { if (/^(svg|b|i)$/i.test(c.tagName) || /(^|\s)mark(\s|$)/.test(c.className)) c.style.display = "none"; });
    var im = document.createElement("img");
    im.className = "ma-chip"; im.alt = ""; im.setAttribute("aria-hidden", "true");
    im.src = here ? new URL("assets/maple-axis-logo.png", here).href : (inV ? "../" : "") + "assets/maple-axis-logo.png";
    im.setAttribute("style", "height:30px;width:auto;vertical-align:middle;background:#fff;border-radius:8px;padding:3px 8px;margin-right:8px;box-sizing:content-box");
    a.insertBefore(im, a.firstChild);
  }
  var fillSel = null, afterLoad = null;
  function build() {
    fill(); chip();
    if (document.getElementById("sw-bar")) return;
    var bar = document.createElement("div"); bar.id = "sw-bar";
    bar.setAttribute("style", "position:fixed;left:0;right:0;bottom:0;z-index:2147483000;display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;padding:6px 8px;background:#111;color:#fff;font:600 13px/1 system-ui,sans-serif;box-shadow:0 -2px 10px rgba(0,0,0,.4)");
    var bs = "background:#333;color:#fff;border:1px solid #888;border-radius:6px;padding:7px 10px;font:inherit;cursor:pointer;text-decoration:none;min-height:32px";
    bar.innerHTML = '<a href="' + root + 'index.html" style="' + bs + '">All</a>' +
      '<button type="button" id="sw-prev" style="' + bs + '" aria-label="Previous design">&larr;</button>' +
      '<select id="sw-sel" style="' + bs + ';max-width:55vw" aria-label="Choose design"></select>' +
      '<button type="button" id="sw-next" style="' + bs + '" aria-label="Next design">&rarr;</button>';
    document.body.appendChild(bar);
    var sel = bar.querySelector("#sw-sel");
    fillSel = function () {
      sel.innerHTML = inV ? "" : '<option value="-1">Pick a design...</option>';
      V.forEach(function (v, i) {
        var o = document.createElement("option");
        o.value = i; o.textContent = v[1]; o.setAttribute("data-slug", v[0]); o.setAttribute("data-label", v[1]); if (i === idx) o.selected = true; sel.appendChild(o);
      });
    };
    fillSel();
    sel.onchange = function () { if (+sel.value >= 0) go(+sel.value); };
    bar.querySelector("#sw-prev").onclick = function () { go((inV ? idx : 0) - 1); };
    bar.querySelector("#sw-next").onclick = function () { go((inV ? idx : -1) + 1); };
    /* parent note + notes toggle for the current version */
    var extra = document.createElement("span"); extra.id = "sw-extra"; bar.appendChild(extra);
    var panel = document.createElement("div"); panel.id = "sw-notes"; panel.hidden = true;
    panel.setAttribute("style", "position:fixed;left:8px;right:8px;bottom:56px;max-height:40vh;overflow:auto;z-index:2147483000;background:#111;color:#fff;border:1px solid #888;border-radius:8px;padding:8px 12px;font:500 13px/1.4 system-ui,sans-serif");
    document.body.appendChild(panel);
    afterLoad = function () {
      extra.textContent = ""; panel.hidden = true;
      var v = inV ? L[idx] : null; if (!v) return;
      if (v.parent) {
        var pr = byId(v.parent), s = document.createElement("span");
        s.id = "sw-parent"; s.textContent = "Branched from " + (pr ? pr.title : v.parent); s.style.opacity = ".8"; extra.appendChild(s);
      }
      var nb = document.createElement("button"); nb.type = "button"; nb.id = "sw-notebtn"; nb.setAttribute("style", bs + ";margin-left:6px");
      nb.textContent = "📝 " + notesFor(v.id).length; nb.setAttribute("aria-label", "Notes for this version");
      nb.onclick = function () { panel.hidden = !panel.hidden; if (!panel.hidden) renderNotes(panel, v.id); };
      extra.appendChild(nb);
    };
    afterLoad();
    document.body.style.paddingBottom = "52px";
    var st = document.createElement("style");
    st.textContent = "#sw-bar a:focus-visible,#sw-bar button:focus-visible,#sw-bar select:focus-visible{outline:3px solid #7ad7f0;outline-offset:2px}";
    document.head.appendChild(st);
  }
  /* ratings.js (stars + favourites, shared with the pizza site) lives in the site root */
  if (!window.PizzaRatings && !document.querySelector('script[src$="ratings.js"]')) {
    var rs = document.createElement("script");
    rs.src = here ? new URL("../ratings.js", here).href : "../../ratings.js";
    document.head.appendChild(rs);
  }
  if (!window.__megabar && !document.querySelector('script[src$="megabar.js"]')) {
    var ms = document.createElement("script");
    ms.src = here ? new URL("../megabar.js", here).href : "../../megabar.js";
    document.head.appendChild(ms);
  }
  /* load versions.json + notes.json; on success swap the lists in and refresh the bar; run ready callbacks either way */
  function done() { loaded = true; readyCbs.splice(0).forEach(function (f) { f(L); }); }
  window.CleanupVersions = { list: function () { return L; }, ready: function (f) { if (loaded) f(L); else readyCbs.push(f); },
    notes: notesFor, renderNotes: renderNotes, byId: byId };
  var base = here ? new URL("./", here).href : (inV ? "../" : "");
  function getJson(name) { return fetch(base + name, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw 0; return r.json(); }); }
  try {
    if (typeof fetch !== "function") throw 0;
    var pv = getJson("versions.json").then(function (j) {
      if (Array.isArray(j) && j.length) { L = j; mk(); locate(); }
    }).catch(function () {});
    var pn = getJson("notes.json").then(function (j) { if (j && typeof j === "object" && !Array.isArray(j)) N = j; }).catch(function () {});
    Promise.all([pv, pn]).then(function () { if (fillSel) fillSel(); if (afterLoad) afterLoad(); done(); });
  } catch (e) { done(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
