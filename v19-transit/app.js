/* Fills this design from window.SHOP (../shop.js). No dependencies. Prices: SHOP.formatPrice, else SHOP.currency (default "$"). */
(function () {
  var S = window.SHOP || {};
  function $$(s) { return [].slice.call(document.querySelectorAll(s)); }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function money(n) {
    if (typeof S.formatPrice === "function") return S.formatPrice(n);
    var v = Number(n); return (S.currency || "$") + (v % 1 ? v.toFixed(2) : v);
  }
  var TAGS = { "vegetarian": ["V", "Vegetarian"], "vegan": ["VG", "Vegan"], "gluten-free": ["GF", "Gluten-free"], "spicy": ["Hot", "Spicy"] };
  function tags(i) {
    var t = (i.tags || []).slice();
    if (i.veg === true && t.indexOf("vegetarian") < 0 && t.indexOf("vegan") < 0) t.push("vegetarian");
    return t.map(function (k) {
      var m = TAGS[k] || [k, k];
      return '<span class="tag t-' + slug(k) + '" title="' + esc(m[1]) + '"><b>' + esc(m[0]) + '</b><i>' + esc(m[1]) + "</i></span>";
    }).join("");
  }
  var digits = String(S.phone || "").replace(/\D/g, "");

  $$("[data-shop]").forEach(function (el) { var v = S[el.getAttribute("data-shop")]; if (v) el.textContent = v; });
  if (S.name) document.title = S.name + " | " + (document.body.getAttribute("data-page") || "Pizza");
  $$("[data-call]").forEach(function (el) { if (digits) el.href = "tel:+" + digits; });
  $$("[data-order]").forEach(function (el) { el.href = S.orderUrl || "#"; if (S.orderUrl) { el.target = "_blank"; el.rel = "noopener"; } });
  $$("[data-hours-table]").forEach(function (t) {
    if (!S.hoursList) return;
    t.innerHTML = "<thead><tr><th>Day</th><th>Open</th></tr></thead><tbody>" + S.hoursList.map(function (h) {
      return "<tr><td>" + esc(h.d) + "</td><td>" + esc(h.t) + "</td></tr>";
    }).join("") + "</tbody>";
  });
  $$("[data-hours]").forEach(function (ul) {
    if (!S.hoursList) return;
    ul.innerHTML = S.hoursList.map(function (h) { return "<li><span>" + esc(h.d) + "</span><span>" + esc(h.t) + "</span></li>"; }).join("");
  });
  $$("[data-map]").forEach(function (f) {
    var la = 43.6532, lo = -79.3832, d = 0.008; /* downtown Toronto default */
    if (S.lat && S.lon && /toronto|, ON\b/i.test(S.address || "")) { la = S.lat; lo = S.lon; }
    f.src = "https://www.openstreetmap.org/export/embed.html?bbox=" + [lo - d, la - d, lo + d, la + d].join("%2C") + "&layer=mapnik&marker=" + la + "%2C" + lo;
  });
  $$("#menu,[data-menu]").forEach(function (box) {
    box.innerHTML = (S.menu || []).map(function (c, n) {
      return '<section class="cat line-' + (n % 6) + '" id="cat-' + slug(c.category) + '"><h2 class="cat-title"><span class="cat-no">' + (n + 1) + "</span>" + esc(c.category) + '</h2><ul class="items">' +
        c.items.map(function (i) {
          return '<li class="item"><div class="ihead"><span class="iname">' + esc(i.name) + '</span><span class="iprice">' + money(i.price) + '</span></div><p class="idesc">' + esc(i.desc) + '</p><div class="tags">' + tags(i) + "</div></li>";
        }).join("") + "</ul></section>";
    }).join("");
  });
  $$("[data-catnav]").forEach(function (nav) {
    nav.innerHTML = (S.menu || []).map(function (c, n) { return '<a class="line-' + (n % 6) + '" href="#cat-' + slug(c.category) + '">' + esc(c.category) + "</a>"; }).join("");
  });
  $$("[data-featured]").forEach(function (box) {
    var items = (S.menu && S.menu[0] ? S.menu[0].items : []).slice(0, 3);
    box.innerHTML = items.map(function (i, n) {
      return '<article class="fcard line-' + n + '"><span class="fno">' + (n + 1) + "</span><h3>" + esc(i.name) + "</h3><p>" + esc(i.desc) + '</p><div class="tags">' + tags(i) + "</div><b>" + money(i.price) + "</b></article>";
    }).join("");
  });
  $$("[data-special]").forEach(function (box) {
    var s = S.special; if (!s) return;
    box.innerHTML = '<span class="badge">Today&rsquo;s special</span><h2>' + esc(s.name) + "</h2><p>" + esc(s.desc) + "</p><b>" + money(s.price) + "</b>";
  });
  $$("[data-story]").forEach(function (box) { if (S.story) box.innerHTML = S.story.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""); });
  $$("[data-quotes]").forEach(function (box) {
    if (S.quotes) box.innerHTML = S.quotes.map(function (q) { return '<blockquote class="quote"><p>&ldquo;' + esc(q.q) + "&rdquo;</p><cite>" + esc(q.by) + "</cite></blockquote>"; }).join("");
  });
  $$("[data-faq]").forEach(function (box) {
    var f = (S.faq || []).concat([
      { q: "Do you work with delivery apps?", a: "Yes. We are on the major delivery apps in Toronto, but ordering direct is faster and keeps more of your money with the kitchen." },
      { q: "Is there parking?", a: "There is street parking nearby (check the signs) and a paid lot a short walk away. The streetcar and subway are the easiest way to reach us." },
      { q: "Do you cater?", a: "Yes, for offices, parties and events from 10 guests. Call us at least 48 hours ahead." },
      { q: "Do you change hours in winter?", a: "During heavy snow or extreme cold alerts we may close early. We post changes on the door and answer the phone." }
    ]);
    box.innerHTML = f.map(function (x) { return "<details><summary>" + esc(x.q) + "</summary><p>" + esc(x.a) + "</p></details>"; }).join("");
  });
})();
