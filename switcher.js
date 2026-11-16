/* Version switcher bar: jump between the designs, keeping the same page (home/menu/visit).
   checklist.html exists only in v11-guide; from there other versions open their home page.
   Also a safety net: fills empty data-shop="name|tagline|address|phone|hours" elements and an empty #menu
   from window.SHOP, so a page that forgot to do it still shows real text. */
(function () {
  var V = [
    ["v1-trattoria", "1 Naples Trattoria"], ["v2-neon", "2 Neon Night"],
    ["v3-diner", "3 Retro Diner"], ["v4-brutalist", "4 Brutalist"],
    ["v5-comic", "5 Pop Comic"], ["v6-luxe", "6 Luxe Black & Gold"],
    ["v7-zen", "7 Zen Minimal"], ["v8-chalkboard", "8 Chalkboard"],
    ["v9-vaporwave", "9 Vaporwave Y2K"], ["v10-blob", "10 Kinetic Blob"],
    ["v11-guide", "11 UX Guide (learn why)"], ["v12-pixel", "12 8-bit Pixel Arcade"],
    ["v13-bollywood", "13 Bollywood Poster"], ["v14-newspaper", "14 The Daily Slice"],
    ["v15-bauhaus", "15 Bauhaus"], ["v16-foodtruck", "16 Street Food Truck"],
    ["v17-cabin", "17 Northern Cabin"], ["v18-hockey", "18 Hockey Night"],
    ["v19-transit", "19 Transit Map"], ["v20-aurora", "20 Aurora"]
  ];
  function fallbackFill() {
    var S = window.SHOP; if (!S) return;
    [].forEach.call(document.querySelectorAll("[data-shop]"), function (el) {
      if (!el.textContent.trim()) el.textContent = S[el.getAttribute("data-shop")] || "";
    });
    var m = document.getElementById("menu");
    if (m && !m.children.length && S.menu) {
      S.menu.forEach(function (c) {
        var h = document.createElement("h2"); h.textContent = c.category; m.appendChild(h);
        var ul = document.createElement("ul");
        c.items.forEach(function (i) {
          var li = document.createElement("li");
          var pr = S.formatPrice ? S.formatPrice(i.price) : (S.currency || "$") + Number(i.price).toFixed(2);
          li.textContent = i.name + " — " + pr + " — " + i.desc +
            ((i.tags && i.tags.length) ? " (" + i.tags.join(", ") + ")" : ""); ul.appendChild(li);
        });
        m.appendChild(ul);
      });
    }
  }
  var p = location.pathname.split("/");
  var file = p.pop() || "index.html";
  var dir = p.pop() || "";
  var idx = -1;
  V.forEach(function (v, i) { if (v[0] === dir) idx = i; });
  var inV = idx >= 0;
  var root = inV ? "../" : "";
  if (!/^(index|menu|visit|checklist)\.html$/.test(file)) file = "index.html";
  function go(i) {
    var t = V[(i + V.length) % V.length][0];
    var f = inV ? file : "index.html";
    if (f === "checklist.html" && t !== "v11-guide") f = "index.html";
    location.href = root + t + "/" + f;
  }

  function build() {
    fallbackFill();
    var bar = document.createElement("div");
    bar.setAttribute("style", "position:fixed;left:0;right:0;bottom:0;z-index:2147483000;display:flex;gap:6px;align-items:center;justify-content:center;padding:6px 8px;background:#111;color:#fff;font:600 13px/1 system-ui,sans-serif;box-shadow:0 -2px 10px rgba(0,0,0,.4)");
    var bs = "background:#333;color:#fff;border:1px solid #666;border-radius:6px;padding:6px 10px;font:inherit;cursor:pointer;text-decoration:none";
    bar.innerHTML = '<a href="' + root + 'index.html" style="' + bs + '">All</a>' +
      '<button type="button" id="sw-prev" style="' + bs + '" aria-label="Previous design">&larr;</button>' +
      '<select id="sw-sel" style="' + bs + ';max-width:55vw" aria-label="Choose design"></select>' +
      '<button type="button" id="sw-next" style="' + bs + '" aria-label="Next design">&rarr;</button>';
    document.body.appendChild(bar);
    var sel = bar.querySelector("#sw-sel");
    if (!inV) sel.innerHTML = '<option value="-1">Pick a design...</option>';
    V.forEach(function (v, i) {
      var o = document.createElement("option");
      o.value = i; o.textContent = v[1]; if (i === idx) o.selected = true; sel.appendChild(o);
    });
    sel.onchange = function () { if (+sel.value >= 0) go(+sel.value); };
    bar.querySelector("#sw-prev").onclick = function () { go((inV ? idx : 0) - 1); };
    bar.querySelector("#sw-next").onclick = function () { go((inV ? idx : -1) + 1); };
    document.body.style.paddingBottom = "52px";
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
