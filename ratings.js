/* Ratings + favourites for the pizza site AND the cleanup site (cleanup/). Cleanup keys sent to the server are "c-"+folder (c-v1-clean); pizza keys are the plain folder name. Loaded automatically by switcher.js (and by the gallery).
   Set API_BASE to the server URL later; empty = only this browser's ratings (localStorage).
   Contract: GET {API_BASE}/ratings -> {"v1-trattoria":{"avg":4.2,"count":12,"favs":3,"nopes":1},...}   ("nopes" optional)
             POST {API_BASE}/rate {version, stars(1-5), voter}   POST {API_BASE}/fav {version, on:true|false, voter}
             POST {API_BASE}/nope {version, on:true|false, voter}   ("Don't show"; failures are ignored silently)
             POST {API_BASE}/note {version, text(max 300), voter, name?(max 40)} -> {ok:true, notes:N} | 400/429 {error}
             GET  {API_BASE}/notes?version=<key> -> [{ts, text, name}] newest first (max 50); /ratings entries also carry "notes":N
   A voter re-rating replaces their old rating (server side). */
const API_BASE = "https://oracle-arm.tail0eeaa5.ts.net/pizza";

(function (root) {
  var KEY = "pizza.ratings.v1", VKEY = "pizza.voter.v1", TIMEOUT = 4000;
  var THUMB = "👎"; /* thumbs-down */

  /* site key mapping: pizza keeps plain folder names (old votes stay valid); cleanup gets the "c-" prefix */
  function keyFor(site, folder) { return site === "cleanup" ? "c-" + folder : folder; }
  function siteFromPath(pathname) { return /(^|\/)cleanup(\/|$)/.test(pathname || "") ? "cleanup" : "pizza"; }

  /* ---- core logic (no DOM; testable in Node with injected storage/fetch) ---- */
  function createStore(o) {
    o = o || {};
    var pre = o.prefix || "", api = o.apiBase || "", st = o.storage, fx = o.fetch, mode = api ? "server" : "local";
    var mine = { stars: {}, favs: {}, nopes: {} }, shared = {}, subs = [], voter = "";
    try { var raw = st && st.getItem(KEY); if (raw) { var p = JSON.parse(raw); mine.stars = p.stars || {}; mine.favs = p.favs || {}; mine.nopes = p.nopes || {}; } } catch (e) {}
    try { voter = (st && st.getItem(VKEY)) || ""; } catch (e) {}
    if (!voter) {
      voter = "v" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
      try { if (st) st.setItem(VKEY, voter); } catch (e) {}
    }
    function K(v) { return pre && String(v).indexOf(pre) !== 0 ? pre + v : v; }
    function save() { try { if (st) st.setItem(KEY, JSON.stringify(mine)); } catch (e) {} }
    function emit() { subs.forEach(function (f) { try { f(); } catch (e) {} }); }
    function localStats(v) {
      v = K(v); var s = mine.stars[v];
      return { avg: s || 0, count: s ? 1 : 0, favs: mine.favs[v] ? 1 : 0, nopes: mine.nopes[v] ? 1 : 0 };
    }
    function stats(v) {
      v = K(v);
      if (mode === "server") {
        var d = shared[v];
        return d ? { avg: +d.avg || 0, count: +d.count || 0, favs: +d.favs || 0, nopes: +d.nopes || 0, notes: +d.notes || 0 } : { avg: 0, count: 0, favs: 0, nopes: 0, notes: 0 };
      }
      var l = localStats(v); l.notes = 0; return l;
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
      v = K(v);
      n = Math.round(+n); if (!(n >= 1 && n <= 5)) return Promise.resolve(false);
      mine.stars[v] = n; save(); emit();
      return post("/rate", { version: v, stars: n, voter: voter }).then(function (ok) { return mode === "server" ? load() : ok; });
    }
    function fav(v, on) {
      v = K(v);
      if (on === undefined) on = !mine.favs[v];
      if (on) mine.favs[v] = true; else delete mine.favs[v];
      save(); emit();
      return post("/fav", { version: v, on: !!on, voter: voter }).then(function (ok) { return mode === "server" ? load() : ok; });
    }
    function nope(v, on) {
      v = K(v);
      if (on === undefined) on = !mine.nopes[v];
      if (on) mine.nopes[v] = true; else delete mine.nopes[v];
      save(); emit();
      /* the server may not have /nope yet: failures are ignored silently */
      return post("/nope", { version: v, on: !!on, voter: voter }).then(function (ok) { return mode === "server" ? load() : ok; }, function () { return false; });
    }
    /* ---- visitor notes (server only; one short note per call, listed newest first) ---- */
    var ncache = {}, NOTE_TTL = 30000, MSG_FAIL = "Could not save the note, try again later", MSG_MANY = "Too many notes, try again later";
    function notes(v) {
      v = K(v);
      if (mode !== "server" || !fx) return Promise.resolve([]);
      var c = ncache[v]; if (c && Date.now() - c.t < NOTE_TTL) return Promise.resolve(c.list.slice());
      return withTimeout(fx(api + "/notes?version=" + encodeURIComponent(v)).then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); }))
        .then(function (d) {
          var list = (Array.isArray(d) ? d : []).filter(function (n) { return n && typeof n.text === "string"; }).slice(0, 50);
          ncache[v] = { t: Date.now(), list: list }; return list.slice();
        }, function () { return []; });
    }
    function addNote(v, text, name) {
      v = K(v); text = String(text == null ? "" : text).trim().slice(0, 300); name = String(name == null ? "" : name).trim().slice(0, 40);
      if (!text) return Promise.resolve({ ok: false, message: "Write a note first" });
      if (mode !== "server" || !fx) return Promise.resolve({ ok: false, message: MSG_FAIL });
      var body = { version: v, text: text, voter: voter }; if (name) body.name = name;
      return withTimeout(fx(api + "/note", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().then(function (j) { return j || {}; }, function () { return {}; }).then(function (j) { return { status: r.status, ok: !!r.ok, j: j }; }); }))
        .then(function (x) {
          if (x.ok && x.j.ok !== false) {
            var n = +x.j.notes; if (!(n >= 0)) n = ((shared[v] && +shared[v].notes) || 0) + 1;
            shared[v] = shared[v] || {}; shared[v].notes = n;
            var item = { ts: Math.floor(Date.now() / 1000), text: text }; if (name) item.name = name;
            if (ncache[v]) { ncache[v].list.unshift(item); ncache[v].list = ncache[v].list.slice(0, 50); ncache[v].t = Date.now(); }
            emit(); return { ok: true, notes: n, note: item };
          }
          if (x.status === 429) return { ok: false, message: MSG_MANY };
          if (x.status === 400 && typeof x.j.error === "string" && x.j.error) return { ok: false, message: x.j.error.slice(0, 120) };
          return { ok: false, message: MSG_FAIL };
        }, function () { return { ok: false, message: MSG_FAIL }; });
    }
    return {
      load: load, rate: rate, fav: fav, nope: nope, stats: stats, notes: notes, addNote: addNote,
      myStars: function (v) { return mine.stars[K(v)] || 0; },
      isFav: function (v) { return !!mine.favs[K(v)]; },
      isNope: function (v) { return !!mine.nopes[K(v)]; },
      mode: function () { return mode; },
      voter: function () { return voter; },
      subscribe: function (f) { subs.push(f); }
    };
  }
  function r1(x) { return (Math.round(x * 10) / 10).toFixed(1); }
  function fmt(s) { return s.count ? "★" + r1(s.avg) + " (" + s.count + ")" : "no ratings"; }

  /* relative date: ts = unix seconds, unix ms, ISO string or YYYY-MM-DD; unknown input gives "" */
  function ago(ts, now) {
    var t = typeof ts === "number" ? (ts < 1e12 ? ts * 1000 : ts) : Date.parse(ts);
    if (!(t > 0)) return "";
    var d = Math.max(0, ((now == null ? Date.now() : now) - t) / 1000);
    function u(n, w) { n = Math.floor(n); return n + " " + w + (n === 1 ? "" : "s") + " ago"; }
    if (d < 60) return "just now"; if (d < 3600) return u(d / 60, "minute"); if (d < 86400) return u(d / 3600, "hour");
    if (d < 86400 * 30) return u(d / 86400, "day"); if (d < 86400 * 365) return u(d / (86400 * 30), "month"); return u(d / (86400 * 365), "year");
  }
  /* merge of the two note sources for one panel: visitors (server, newest first) and the editor (repo notes.json, newest first) */
  function mergeNotes(visitors, editor) {
    var v = (visitors || []).map(function (n) { return { text: String(n.text), who: n.name ? String(n.name) : "", when: ago(n.ts), src: "visitor" }; });
    var e = (editor || []).map(function (n) { return { text: String(n.text), who: n.author ? String(n.author) : "", when: n.date ? ago(n.date) || String(n.date) : "", src: "editor" }; });
    return { visitors: v, editor: e, total: v.length + e.length };
  }

  if (typeof module !== "undefined" && module.exports) { module.exports = { createStore: createStore, fmt: fmt, keyFor: keyFor, siteFromPath: siteFromPath, ago: ago, mergeNotes: mergeNotes }; }
  if (typeof window === "undefined" || typeof document === "undefined") return;

  /* ---- browser part ---- */
  var ls = null; try { ls = window.localStorage; } catch (e) {}
  var SITE = siteFromPath(location.pathname);
  var store = createStore({ prefix: SITE === "cleanup" ? "c-" : "", apiBase: API_BASE, storage: ls, fetch: window.fetch ? window.fetch.bind(window) : null });
  var NOTE = "only your ratings shown (shared ratings not connected yet)";
  window.PizzaRatings = { site: SITE, store: store, fmt: fmt, makeWidget: makeWidget, attachFold: attachFold, makeNotes: makeNotes, ago: ago, mergeNotes: mergeNotes, note: NOTE };

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
    ".pr-nopebtn{background:none;border:1px solid #888;color:inherit;border-radius:8px;min-height:32px;padding:4px 10px;font:600 12px/1 system-ui,sans-serif;cursor:pointer;margin:4px 0 0 4px}.pr-nopebtn[aria-pressed=true]{background:#555;color:#fff;border-color:#555}" +
    ".pr-fold{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;background:#e6e6e6;color:#555;border:1px dashed #999;border-radius:10px;padding:6px 10px;font:600 13px/1.3 system-ui,sans-serif;opacity:.85}.pr-fold[hidden]{display:none}.pr-fold button{background:#fff;color:#222;border:1px solid #888;border-radius:8px;min-height:32px;padding:4px 10px;font:600 12px/1 system-ui,sans-serif;cursor:pointer}" +
    ".pr-nopebtn:focus-visible,.pr-fold button:focus-visible{outline:3px solid #7ad7f0;outline-offset:2px}" +
    ".pr-np,.pr-np-p{--np-bg:#111;--np-fg:#fff;--np-mut:#bbb;--np-line:#555;--np-acc:#7ad7f0;display:block;flex-basis:100%;min-width:0;font:500 13px/1.4 system-ui,sans-serif}" +
    ".pr-np-btn{background:none;border:1px solid #888;color:inherit;border-radius:8px;min-height:32px;padding:4px 10px;font:600 12px/1 system-ui,sans-serif;cursor:pointer;margin:4px 0 0 4px}.pr-np-btn[aria-expanded=true]{background:#555;color:#fff;border-color:#555}" +
    ".pr-np-p{margin-top:6px;background:var(--np-bg);color:var(--np-fg);border:1px solid var(--np-line);border-radius:10px;padding:8px 10px;max-height:min(55vh,420px);overflow:auto;text-align:left}.pr-np-p[hidden]{display:none}" +
    ".pr-np-p.pr-np-fix{position:fixed;left:8px;right:8px;max-width:440px;margin:0 auto;z-index:2147482500;box-shadow:0 4px 16px rgba(0,0,0,.6);border:2px solid #fff}" +
    ".pr-np-p h3{font:700 12px/1.2 system-ui,sans-serif;margin:8px 0 4px;color:var(--np-mut);text-transform:uppercase;letter-spacing:.04em}.pr-np-p h3:first-child{margin-top:0}" +
    ".pr-np-p p{margin:4px 0;overflow-wrap:anywhere;white-space:pre-wrap}.pr-np-p p small{display:block;color:var(--np-mut);font-size:11px}" +
    ".pr-np-p textarea,.pr-np-p input{width:100%;font:inherit;font-size:16px;color:#111;background:#fff;border:1px solid #888;border-radius:6px;padding:6px;margin:4px 0}.pr-np-p textarea{min-height:56px;resize:vertical}" +
    ".pr-np-p .pr-np-ct{font-size:11px;color:var(--np-mut)}.pr-np-p .pr-np-go{background:var(--np-acc);color:#111;border:0;border-radius:8px;min-height:36px;padding:6px 14px;font:700 13px/1 system-ui,sans-serif;cursor:pointer}.pr-np-p .pr-np-go:disabled{opacity:.6;cursor:default}" +
    ".pr-np-p .pr-np-msg{display:block;margin-top:4px;font-size:12px;color:var(--np-mut)}.pr-np-p button:focus-visible,.pr-np-p textarea:focus-visible,.pr-np-p input:focus-visible,.pr-np-btn:focus-visible{outline:3px solid var(--np-acc);outline-offset:2px}" +
    "@media(prefers-reduced-motion:reduce){.pr-np-p,.pr-np-btn{transition:none!important;animation:none!important}}" +
    ".pr-panel[hidden]{display:none}.pr-note{display:block;margin-top:6px;font-weight:400;font-size:11px;color:#ccc;max-width:260px}";
  if (SITE === "cleanup") css.textContent += ".pr-pill,.pr-panel,.pr-np-fix{border-color:#1167c9;font-family:Inter,system-ui,sans-serif}.pr-w button.on{color:#f5a300}";
  document.head.appendChild(css);

  /* Gallery fold. x = {slug, el (wrapper holding the card a.card), box (rating box)}. Adds a "Don't show" button and a slim
     greyed row ("v4 Brutalist - hidden, you didn't like it" + "Show again"). x.apply(showAll) re-applies state; the gallery calls it from render(). */
  function attachFold(x) {
    var card = x.el.querySelector("a.card"), nEl = x.el.querySelector(".n"), hEl = x.el.querySelector("h2");
    var num = nEl ? parseInt(nEl.textContent, 10) : NaN;
    x.label = (isNaN(num) ? "" : "v" + num + " ") + (hEl ? hEl.textContent : x.slug);
    var b = document.createElement("button"); b.type = "button"; b.className = "pr-nopebtn";
    x.box.appendChild(b);
    var row = document.createElement("div"); row.className = "pr-fold"; row.hidden = true;
    var tx = document.createElement("span"), sb = document.createElement("button"); sb.type = "button"; sb.textContent = "Show again";
    row.appendChild(tx); row.appendChild(sb); x.el.appendChild(row);
    b.onclick = function () { store.nope(x.slug); if (x.folded) sb.focus(); };
    sb.onclick = function () { store.nope(x.slug, false); b.focus(); };
    x.apply = function (showAll) {
      var no = store.isNope(x.slug), fold = no && !showAll;
      if (card) card.style.display = fold ? "none" : "";
      x.box.style.display = fold ? "none" : "";
      row.hidden = !fold; tx.textContent = x.label + " · hidden, you didn't like it";
      b.setAttribute("aria-expanded", fold ? "false" : "true"); b.setAttribute("aria-pressed", no ? "true" : "false");
      b.textContent = THUMB + (no ? " Hidden (undo)" : " Don't show");
      sb.setAttribute("aria-expanded", fold ? "false" : "true");
      x.folded = fold;
    };
    x.apply(false);
  }

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
      if (t) t.textContent = fmt(s) + " · ❤ " + s.favs + (s.nopes ? " · " + THUMB + " " + s.nopes : "");
    }
    store.subscribe(refresh); refresh();
    return w;
  }

  /* Notes control for version slug (plain folder name): returns {wrap, btn, panel, refresh}. All text goes in with textContent only.
     o.fixed = panel floats above the version bar (id pr-np-bar); o.editor = function(slug) -> repo notes (default: CleanupVersions.notes). */
  var npSeq = 0;
  function makeNotes(slug, o) {
    o = o || {}; var id = "pr-np-" + (++npSeq), open = false;
    function editorNotes() {
      try { var f = o.editor || (window.CleanupVersions && window.CleanupVersions.notes); return f ? (f(slug) || []) : []; } catch (e) { return []; }
    }
    var wrap = document.createElement("span"); wrap.className = "pr-np";
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "pr-np-btn";
    btn.setAttribute("aria-expanded", "false");
    var panel = document.createElement("div"); panel.className = "pr-np-p" + (o.fixed ? " pr-np-fix" : ""); panel.id = o.fixed ? "pr-np-bar" : id; panel.hidden = true;
    panel.setAttribute("role", "group"); panel.setAttribute("aria-label", "Notes for this design");
    btn.setAttribute("aria-controls", panel.id);
    var list = document.createElement("div"); list.setAttribute("aria-live", "polite");
    var form = document.createElement("div");
    var ta = document.createElement("textarea"); ta.maxLength = 300; ta.rows = 2; ta.placeholder = "Leave a short note (max 300 characters)"; ta.setAttribute("aria-label", "Your note");
    var ct = document.createElement("span"); ct.className = "pr-np-ct";
    var nm = document.createElement("input"); nm.type = "text"; nm.maxLength = 40; nm.placeholder = "Your name (optional)"; nm.setAttribute("aria-label", "Your name, optional");
    var go = document.createElement("button"); go.type = "button"; go.className = "pr-np-go"; go.textContent = "Add note";
    var msg = document.createElement("span"); msg.className = "pr-np-msg"; msg.setAttribute("role", "status");
    form.appendChild(ta); form.appendChild(ct); form.appendChild(nm); form.appendChild(go); form.appendChild(msg);
    panel.appendChild(list); panel.appendChild(form);
    wrap.appendChild(btn);
    if (!o.fixed) wrap.appendChild(panel);
    var visitors = [], sending = false;
    function count() { return store.stats(slug).notes + editorNotes().length; }
    function label() { btn.textContent = "📝 Notes (" + count() + ")"; }
    function line(n) {
      var p = document.createElement("p"); p.textContent = n.text;
      var meta = [n.who, n.when].filter(Boolean).join(", ");
      if (meta) { var s = document.createElement("small"); s.textContent = meta; p.appendChild(s); }
      return p;
    }
    function head(t) { var h = document.createElement("h3"); h.textContent = t; return h; }
    function draw() {
      var m = mergeNotes(visitors, editorNotes());
      list.textContent = "";
      if (!m.total) { var e = document.createElement("p"); e.textContent = "No notes yet"; list.appendChild(e); }
      if (m.visitors.length) { if (m.editor.length) list.appendChild(head("From visitors")); m.visitors.forEach(function (n) { list.appendChild(line(n)); }); }
      if (m.editor.length) { list.appendChild(head("From the editor")); m.editor.forEach(function (n) { list.appendChild(line(n)); }); }
      form.hidden = store.mode() !== "server";
      ct.textContent = ta.value.length + "/300";
    }
    function setOpen(v, focusBack) {
      open = v; panel.hidden = !v; btn.setAttribute("aria-expanded", v ? "true" : "false");
      if (o.fixed) fit();
      if (v) {
        draw(); store.notes(slug).then(function (l) { visitors = l; draw(); });
        if (!form.hidden) ta.focus(); else { panel.tabIndex = -1; panel.focus(); }
      } else if (focusBack) btn.focus();
    }
    btn.onclick = function (e) { e.preventDefault(); e.stopPropagation(); setOpen(!open, false); };
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.stopPropagation(); setOpen(false, true); } });
    btn.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) setOpen(false, true); });
    ta.addEventListener("input", function () { ct.textContent = ta.value.length + "/300"; });
    go.onclick = function () {
      if (sending) return; sending = true; go.disabled = true; msg.textContent = "Sending...";
      store.addNote(slug, ta.value, nm.value).then(function (r) {
        sending = false; go.disabled = false;
        if (r.ok) {
          ta.value = ""; msg.textContent = "Thanks, note added";
          visitors = [{ ts: r.note.ts, text: r.note.text, name: r.note.name }].concat(visitors).slice(0, 50); draw();
        } else msg.textContent = r.message;
      });
    };
    store.subscribe(function () { label(); if (open) draw(); });
    if (window.CleanupVersions && window.CleanupVersions.ready) window.CleanupVersions.ready(function () { label(); if (open) draw(); });
    label(); draw();
    return { wrap: wrap, btn: btn, panel: panel, refresh: function () { label(); draw(); }, open: function () { setOpen(true); }, close: function () { setOpen(false, true); } };
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
        if (s.nopes) extra += (extra ? " " : "  ") + THUMB + s.nopes;
        if (store.isNope(slug)) extra += "  (hidden by you)";
        o.textContent = o.getAttribute("data-label") + extra;
      });
    }
    store.subscribe(refreshOpts); refreshOpts();
    if (!inV) return;
    var row = document.createElement("div"); row.className = "pr-row";
    var lab = document.createElement("span"); lab.textContent = "Rate this:";
    var note = document.createElement("span"); note.style.cssText = "font-weight:400;font-size:11px;color:#bbb";
    var nb = document.createElement("button"); nb.type = "button"; nb.className = "pr-nopebtn"; nb.style.color = "#ddd";
    nb.onclick = function () { store.nope(cur); };
    function nbl() {
      var no = store.isNope(cur);
      nb.setAttribute("aria-pressed", no ? "true" : "false");
      nb.textContent = THUMB + (no ? " Marked: don't show (undo)" : " Don't show");
    }
    store.subscribe(nbl); nbl();
    row.appendChild(lab); row.appendChild(makeWidget(cur)); row.appendChild(nb);
    /* the old repo-only notes button of the cleanup bar is replaced by this merged one */
    var oldNb = document.getElementById("sw-notebtn"), oldNp = document.getElementById("sw-notes");
    if (oldNb && oldNb.parentNode) oldNb.parentNode.removeChild(oldNb);
    if (oldNp && oldNp.parentNode) oldNp.parentNode.removeChild(oldNp);
    var nt = makeNotes(cur, { fixed: true }); row.appendChild(nt.btn); row.appendChild(note);
    document.body.appendChild(nt.panel);
    bar.appendChild(row);
    function n() { note.textContent = noteText(); fit(); }
    store.subscribe(n); n();
  }

  function fit() {
    var bar = document.getElementById("sw-bar"); if (!bar) return;
    var hgt = bar.offsetHeight;
    document.body.style.paddingBottom = (hgt + (inV ? 56 : 8)) + "px";
    var pill = document.getElementById("pr-pill"), panel = document.getElementById("pr-panel");
    var np = document.getElementById("pr-np-bar"); if (np) np.style.bottom = (hgt + 8) + "px";
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
