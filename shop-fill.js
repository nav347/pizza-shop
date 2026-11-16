/* Fills every v1-v4 page from window.SHOP (shop.js). No dependencies. */
(function () {
  var S = window.SHOP || {};
  var EMOJI = ["🍕", "🧀", "🌶️", "🍅", "🌿", "🔥"];
  var TAG = { "vegetarian": "V", "vegan": "VG", "gluten-free": "GF", "spicy": "🌶" };
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
  function price(n) { return S.formatPrice ? S.formatPrice(n) : (S.currency || "$") + Number(n).toFixed(2); }
  var digits = String(S.phone || "").replace(/\D/g, "");
  function tags(i) {
    var t = (i.tags || []).filter(function (k) { return TAG[k]; });
    return t.length ? '<span class="dtags">' + t.map(function (k) {
      return '<span class="dtag t-' + k + '" title="' + k + '">' + TAG[k] + "</span>";
    }).join("") + "</span>" : "";
  }

  $$("[data-shop]").forEach(function (el) { el.textContent = S[el.getAttribute("data-shop")] || ""; });
  document.title = (S.name || "Pizza") + (document.body.getAttribute("data-page") ? " | " + document.body.getAttribute("data-page") : "");
  $$("[data-call]").forEach(function (el) { el.href = "tel:+" + digits; });
  $$("[data-order]").forEach(function (el) { el.href = S.orderUrl || "#"; el.target = "_blank"; el.rel = "noopener"; });
  $$("[data-wa]").forEach(function (el) {
    el.href = "https://wa.me/" + digits + "?text=" + encodeURIComponent("Hi " + S.name + ", I'd like to order a pizza!");
    el.target = "_blank"; el.rel = "noopener";
  });
  $$("[data-hours]").forEach(function (ul) {
    ul.innerHTML = (S.hoursList || []).map(function (h) {
      return '<li><span class="hd">' + esc(h.d) + '</span><span class="ht">' + esc(h.t) + "</span></li>";
    }).join("");
  });
  $$("[data-hours-table]").forEach(function (t) {
    t.innerHTML = "<thead><tr><th>Day</th><th>Open</th></tr></thead><tbody>" + (S.hoursList || []).map(function (h) {
      return "<tr><td>" + esc(h.d) + "</td><td>" + esc(h.t) + "</td></tr>";
    }).join("") + "</tbody>";
  });
  $$("[data-map]").forEach(function (f) {
    var d = 0.006, lo = S.lon, la = S.lat;
    f.src = "https://www.openstreetmap.org/export/embed.html?bbox=" + [lo - d, la - d, lo + d, la + d].join("%2C") +
      "&layer=mapnik&marker=" + la + "%2C" + lo;
  });
  $$("#menu,[data-menu]").forEach(function (box) {
    box.innerHTML = (S.menu || []).map(function (c, n) {
      return '<section class="cat" id="cat-' + n + '"><h2 class="cat-title">' + esc(c.category) + '</h2><ul class="items">' +
        c.items.map(function (i) {
          return '<li class="item"><div class="ihead"><span class="iname">' + esc(i.name) + tags(i) +
            '</span><span class="idots"></span><span class="iprice">' + price(i.price) +
            '</span></div><p class="idesc">' + esc(i.desc) + "</p></li>";
        }).join("") + "</ul></section>";
    }).join("");
  });
  $$("[data-catnav]").forEach(function (nav) {
    nav.innerHTML = (S.menu || []).map(function (c, n) { return '<a href="#cat-' + n + '">' + esc(c.category) + "</a>"; }).join("");
  });
  $$("[data-featured]").forEach(function (box) {
    var items = (S.menu && S.menu[0] ? S.menu[0].items : []).slice(0, 3);
    box.innerHTML = items.map(function (i, n) {
      return '<article class="fcard"><span class="femoji">' + EMOJI[n % EMOJI.length] + "</span><h3>" + esc(i.name) + tags(i) +
        "</h3><p>" + esc(i.desc) + "</p><b>" + price(i.price) + "</b></article>";
    }).join("");
  });
  $$("[data-special]").forEach(function (box) {
    var s = S.special; if (!s) return;
    box.innerHTML = '<span class="badge">This week’s special</span><h2>' + esc(s.name) + "</h2><p>" + esc(s.desc) + "</p><b>" + price(s.price) + "</b>";
  });
  $$("[data-story]").forEach(function (box) {
    box.innerHTML = (S.story || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  });
  $$("[data-quotes]").forEach(function (box) {
    box.innerHTML = (S.quotes || []).map(function (q) {
      return '<blockquote class="quote"><p>“' + esc(q.q) + '”</p><cite>' + esc(q.by) + "</cite></blockquote>";
    }).join("");
  });
  $$("[data-faq]").forEach(function (box) {
    box.innerHTML = (S.faq || []).map(function (f) {
      return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>";
    }).join("");
  });
})();
