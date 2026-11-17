/* Cleanup-site version bar: jump between v1..v12, keeping the same page (index / services / quote).
   Also fills elements with data-biz="name|tagline|phone|email|area|hours" from window.BIZ
   (links with data-biz=phone/email and no href get tel:/mailto:), and loads the root megabar.js and ratings.js. */
(function () {
  var V = [
    ["v1-clean", "1 Clean Trust"], ["v2-pro", "2 Pro Contractor"],
    ["v3-blueprint", "3 Blueprint"], ["v4-bold", "4 Bold"],
    ["v5-friendly", "5 Friendly"], ["v6-luxury", "6 Luxury"],
    ["v7-industrial", "7 Industrial"], ["v8-eco", "8 Eco"],
    ["v9-before-after", "9 Before & After"], ["v10-dark", "10 Dark"],
    ["v11-axis", "11 Maple Axis"], ["v12-adarsh", "12 Adarsh (editable)"]
  ];
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
  var idx = -1;
  V.forEach(function (v, i) { if (v[0] === dir) idx = i; });
  var inV = idx >= 0;
  var root = inV ? "../" : "";
  if (!/^(index|services|quote)\.html$/.test(file)) file = "index.html";
  function go(i) { location.href = root + V[(i + V.length) % V.length][0] + "/" + (inV ? file : "index.html"); }
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
    if (!inV) sel.innerHTML = '<option value="-1">Pick a design...</option>';
    V.forEach(function (v, i) {
      var o = document.createElement("option");
      o.value = i; o.textContent = v[1]; o.setAttribute("data-slug", v[0]); o.setAttribute("data-label", v[1]); if (i === idx) o.selected = true; sel.appendChild(o);
    });
    sel.onchange = function () { if (+sel.value >= 0) go(+sel.value); };
    bar.querySelector("#sw-prev").onclick = function () { go((inV ? idx : 0) - 1); };
    bar.querySelector("#sw-next").onclick = function () { go((inV ? idx : -1) + 1); };
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
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
