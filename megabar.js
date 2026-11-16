/* Mega switcher: a slim fixed top bar on EVERY page of BOTH sites (Pizza and Drywall Cleanup).
   Paths come from this script's own URL, so it works under /pizza-shop/ on GitHub Pages and locally. */
(function () {
  if (window.__megabar) return; window.__megabar = true;
  var me = document.currentScript;
  var base = me && me.src ? me.src.replace(/megabar\.js(\?.*)?$/, "") : "";
  if (!base) { var s = document.querySelector('script[src$="megabar.js"]'); base = s ? s.src.replace(/megabar\.js(\?.*)?$/, "") : ""; }
  var inCleanup = /\/cleanup(\/|$)/.test(location.pathname);
  var H = 40;
  function build() {
    if (document.getElementById("mega-bar")) return;
    var st = document.createElement("style");
    st.textContent =
      "#mega-bar{position:fixed;top:0;left:0;right:0;height:" + H + "px;z-index:2147483600;display:flex;gap:6px;align-items:center;justify-content:center;padding:4px 6px;background:#0b0b10;border-bottom:2px solid #fff;box-sizing:border-box;font:700 13px/1 system-ui,Segoe UI,Arial,sans-serif}" +
      "#mega-bar a{display:inline-flex;align-items:center;justify-content:center;min-height:30px;padding:0 10px;border-radius:999px;border:2px solid #fff;color:#fff;background:#23232e;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:48vw;box-sizing:border-box}" +
      "#mega-bar a[aria-current=page]{background:#ffe14d;color:#000;border-color:#ffe14d}" +
      "#mega-bar a:hover{background:#3a3a4c}#mega-bar a[aria-current=page]:hover{background:#fff27a}" +
      "#mega-bar a:focus-visible{outline:3px solid #7ad7f0;outline-offset:2px}" +
      "#mega-spacer{height:" + H + "px;display:block}" +
      "@media(max-width:420px){#mega-bar{font-size:12px;gap:4px}#mega-bar a{padding:0 7px}}";
    document.head.appendChild(st);
    var bar = document.createElement("nav"); bar.id = "mega-bar"; bar.setAttribute("aria-label", "Switch between the two sites");
    bar.innerHTML =
      '<a href="' + base + 'index.html"' + (inCleanup ? "" : ' aria-current="page"') + '>&#127829; Pizza <span style="font-weight:400">&nbsp;(Dough Re Mi)</span></a>' +
      '<a href="' + base + 'cleanup/index.html"' + (inCleanup ? ' aria-current="page"' : "") + '>&#129529; Drywall Cleanup <span style="font-weight:400">&nbsp;(Dust Settled)</span></a>';
    [].forEach.call(bar.querySelectorAll("span"), function (s) { s.className = "mb-long"; });
    st.textContent += "@media(max-width:560px){#mega-bar .mb-long{display:none}}";
    document.body.insertBefore(bar, document.body.firstChild);
    var sp = document.createElement("div"); sp.id = "mega-spacer"; sp.setAttribute("aria-hidden", "true");
    document.body.insertBefore(sp, bar.nextSibling);
    /* page's own fixed/sticky top headers would sit under the bar: nudge them down */
    [].forEach.call(document.querySelectorAll("body > *, header, nav"), function (el) {
      if (el === bar || el === sp) return;
      var cs = getComputedStyle(el);
      if ((cs.position === "fixed" || cs.position === "sticky") && cs.top === "0px") el.style.top = H + "px";
    });
  }
  function loadContact() {
    if (window.__contactjs || document.getElementById("cu-loader") || !base) return;
    var c = document.createElement("script"); c.id = "cu-loader"; c.src = base + "contact.js";
    document.body.appendChild(c);
  }
  function go() { build(); loadContact(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
