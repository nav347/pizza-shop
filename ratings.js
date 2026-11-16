/* Ratings + favourites for the pizza site. Loaded automatically by switcher.js (and by the gallery).
   Set API_BASE to the server URL later; empty = only this browser's ratings (localStorage).
   Contract: GET {API_BASE}/ratings -> {"v1-trattoria":{"avg":4.2,"count":12,"favs":3},...}
             POST {API_BASE}/rate {version, stars(1-5), voter}   POST {API_BASE}/fav {version, on:true|false, voter}
   A voter re-rating replaces their old rating (server side). */
const API_BASE = "https://oracle-arm.tail0eeaa5.ts.net/pizza";

(function (root) {
  var KEY = "pizza.ratings.v1", VKEY = "pizza.voter.v1", TIMEOUT = 4000;

  /* ---- core logic (no DOM; testable in Node with injected storage/fetch) ---- */
  function createStore(o) {
    o = o || {};
    var api = o.apiBase || "", st = o.storage, fx = o.fetch, mode = api ? "server" : "local";
    var mine = { stars: {}, favs: {} }, shared = {}, subs = [], voter = "";
    try { var raw = st && st.getItem(KEY); if (raw) { var p = JSON.parse(raw); mine.stars = p.stars || {}; mine.favs = p.favs || {}; } } catch (e) {}
    try { voter = (st && st.getItem(VKEY)) || ""; } catch (e) {}
    if (!voter) {
      voter = "v" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
      try { if (st) st.setItem(VKEY, voter); } catch (e) {}
    }
    function save() { try { if (st) st.setItem(KEY, JSON.stringify(mine)); } catch (e) {} }
    function emit() { subs.forEach(function (f) { try { f(); } catch (e) {} }); }
    function localStats(v) {
      var s = mine.stars[v];
      return { avg: s || 0, count: s ? 1 : 0, favs: mine.favs[v] ? 1 : 0 };
    }
    function stats(v) {
      if (mode === "server") {
        var d = shared[v];
        return d ? { avg: +d.avg || 0, count: +d.count || 0, favs: +d.favs || 0 } : { avg: 0, count: 0, favs: 0 };
      }
      return localStats(v);
    }
    function withTimeout(promise) {
      return Promise.race([promise, new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, TIMEOUT); })]);
    }
    function post(path, body) {
      if (mode !== "server" || !fx) return Promise.resolve(false);
      return withTimeout(fx(api + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }))
        .then(function (r) { return !!r.ok; }, function () { return false; });
    }
    function load() {
      if (!api || !fx) { mode = "local"; emit(); return Promise.resolve(mode); }
      return withTimeout(fx(api + "/ratings").then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); }))
        .then(function (d) { shared = d || {}; mode = "server"; emit(); return mode; },
          function () { mode = "local"; emit(); return mode; });
    }
    function rate(v, n) {
      n = Math.round(+n); if (!(n >= 1 && n <= 5)) return Promise.resolve(false);
      mine.stars[v] = n; save(); emit();
      return post("/rate", { version: v, stars: n, voter: voter }).then(function (ok) { return mode === "server" ? load() : ok; });
    }
    function fav(v, on) {
      if (on === undefined) on = !mine.favs[v];
      if (on) mine.favs[v] = true; else delete mine.favs[v];
      save(); emit();
      return post("/fav", { version: v, on: !!on, voter: voter }).then(function (ok) { return mode === "server" ? load() : ok; });
    }
    return {
      load: load, rate: rate, fav: fav, stats: stats,
      myStars: function (v) { return mine.stars[v] || 0; },
      isFav: function (v) { return !!mine.favs[v]; },
      mode: function () { return mode; },
      voter: function () { return voter; },
      subscribe: function (f) { subs.push(f); }
    };
  }
  function r1(x) { return (Math.round(x * 10) / 10).toFixed(1); }
  function fmt(s) { return s.count ? "★" + r1(s.avg) + " (" + s.count + ")" : "no ratings"; }

  if (typeof module !== "undefined" && module.exports) { module.exports = { createStore: createStore, fmt: fmt }; }
  if (typeof window === "undefined" || typeof document === "undefined") return;

  /* ---- browser part ---- */
  var ls = null; try { ls = window.localStorage; } catch (e) {}
  var store = createStore({ apiBase: API_BASE, storage: ls, fetch: window.fetch ? window.fetch.bind(window) : null });
  var NOTE = "only your ratings shown (shared ratings not connected yet)";
  window.PizzaRatings = { store: store, fmt: fmt, makeWidget: makeWidget, note: NOTE };

  var path = location.pathname.split("/"); path.pop();
  var cur = path.pop() || "";
  var inV = /^v\d+-/.test(cur);

  var css = document.createElement("style");
  css.textContent =
    ".pr-w{display:inline-flex;align-items:center;gap:2px;font:600 13px/1 system-ui,sans-serif;color:#fff;flex-wrap:wrap}" +
    ".pr-w button{background:none;border:0;color:#bbb;font-size:22px;line-height:1;min-width:32px;min-height:32px;padding:0;cursor:pointer;border-radius:6px}" +
    ".pr-w button.on{color:#ffd23f}.pr-w button.hf.on{color:#ff5a7a}" +
    ".pr-w button:focus-visible,.pr-pill:focus-visible{outline:3px solid #7ad7f0;outline-offset:1px}" +
    ".pr-w .pr-t{margin-left:6px;font-size:12px;color:#ddd}" +
    ".pr-row{flex-basis:100%;display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap;border-top:1px solid #444;padding-top:4px;font:600 12px/1.2 system-ui,sans-serif;color:#ddd}" +
    ".pr-pill{position:fixed;right:10px;z-index:2147482000;background:#111;color:#fff;border:2px solid #fff;border-radius:999px;padding:8px 14px;font:600 14px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.5);max-width:calc(100vw - 20px)}" +
    ".pr-panel{position:fixed;right:10px;z-index:2147482001;background:#111;color:#fff;border:2px solid #fff;border-radius:14px;padding:10px 12px;max-width:calc(100vw - 20px);box-shadow:0 4px 16px rgba(0,0,0,.6);font:600 13px/1.4 system-ui,sans-serif}" +
    ".pr-panel[hidden]{display:none}.pr-note{display:block;margin-top:6px;font-weight:400;font-size:11px;color:#ccc;max-width:260px}";
  document.head.appendChild(css);

  /* A widget: 5 stars + heart + text for version v. Updates on store changes. */
  function makeWidget(v, withText) {
    var w = document.createElement("span"); w.className = "pr-w"; w.setAttribute("role", "group"); w.setAttribute("aria-label", "Rate this design");
    var btns = [];
    for (var i = 1; i <= 5; i++) (function (n) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = "★";
      b.setAttribute("aria-label", "Rate " + n + (n === 1 ? " star" : " stars"));
      b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); store.rate(v, n); };
      w.appendChild(b); btns.push(b);
    })(i);
    var h = document.createElement("button"); h.type = "button"; h.textContent = "❤";
    h.onclick = function (e) { e.preventDefault(); e.stopPropagation(); store.fav(v); };
    w.appendChild(h);
    var t = null;
    if (withText !== false) { t = document.createElement("span"); t.className = "pr-t"; t.setAttribute("aria-live", "polite"); w.appendChild(t); }
    function refresh() {
      var m = store.myStars(v), s = store.stats(v), f = store.isFav(v);
      btns.forEach(function (b, k) { b.className = k < m ? "on" : ""; b.setAttribute("aria-pressed", k + 1 === m ? "true" : "false"); });
      h.className = "hf" + (f ? " on" : "");
      h.setAttribute("aria-pressed", f ? "true" : "false");
      h.setAttribute("aria-label", f ? "Remove from favourites" : "Add to favourites");
      if (t) t.textContent = fmt(s) + " · ❤ " + s.favs;
    }
    store.subscribe(refresh); refresh();
    return w;
  }

  function noteText() { return store.mode() === "local" ? NOTE : ""; }

  function attachBar(bar) {
    var sel = bar.querySelector("#sw-sel");
    function refreshOpts() {
      if (!sel) return;
      [].forEach.call(sel.options, function (o) {
        var slug = o.getAttribute("data-slug"); if (!slug) return;
        var s = store.stats(slug), extra = "";
        if (s.count) extra += "  ★" + r1(s.avg) + " (" + s.count + ")";
        if (s.favs) extra += (extra ? " " : "  ") + "❤" + s.favs;
        o.textContent = o.getAttribute("data-label") + extra;
      });
    }
    store.subscribe(refreshOpts); refreshOpts();
    if (!inV) return;
    var row = document.createElement("div"); row.className = "pr-row";
    var lab = document.createElement("span"); lab.textContent = "Rate this:";
    var note = document.createElement("span"); note.style.cssText = "font-weight:400;font-size:11px;color:#bbb";
    row.appendChild(lab); row.appendChild(makeWidget(cur)); row.appendChild(note);
    bar.appendChild(row);
    function n() { note.textContent = noteText(); fit(); }
    store.subscribe(n); n();
  }

  function fit() {
    var bar = document.getElementById("sw-bar"); if (!bar) return;
    var hgt = bar.offsetHeight;
    document.body.style.paddingBottom = (hgt + (inV ? 56 : 8)) + "px";
    var pill = document.getElementById("pr-pill"), panel = document.getElementById("pr-panel");
    if (pill) pill.style.bottom = (hgt + 8) + "px";
    if (panel && pill) panel.style.bottom = (hgt + 8 + pill.offsetHeight + 8) + "px";
  }

  function addPill() {
    var pill = document.createElement("button"); pill.type = "button"; pill.id = "pr-pill"; pill.className = "pr-pill";
    pill.setAttribute("aria-expanded", "false"); pill.setAttribute("aria-controls", "pr-panel");
    pill.setAttribute("aria-label", "Rate this design");
    var panel = document.createElement("div"); panel.id = "pr-panel"; panel.className = "pr-panel"; panel.hidden = true;
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Rate this design");
    var title = document.createElement("div"); title.textContent = "Rate this design";
    var note = document.createElement("span"); note.className = "pr-note";
    panel.appendChild(title); panel.appendChild(makeWidget(cur)); panel.appendChild(note);
    function lbl() {
      var s = store.stats(cur);
      pill.textContent = "★ " + (s.count ? r1(s.avg) : "Rate this design");
      note.textContent = noteText();
    }
    store.subscribe(lbl); lbl();
    function toggle(open) {
      panel.hidden = !open; pill.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) { fit(); var b = panel.querySelector("button"); if (b) b.focus(); } else pill.focus();
    }
    pill.onclick = function () { toggle(panel.hidden); };
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
    document.body.appendChild(panel); document.body.appendChild(pill);
    fit();
  }

  function init(tries) {
    var bar = document.getElementById("sw-bar");
    if (!bar && tries < 60) { setTimeout(function () { init(tries + 1); }, 50); return; }
    if (bar) attachBar(bar);
    if (inV) addPill();
    fit();
    window.addEventListener("resize", fit);
    store.load();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { init(0); }); else init(0);
})(typeof window !== "undefined" ? window : this);
