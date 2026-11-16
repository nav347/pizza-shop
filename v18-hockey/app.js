/* Fills the page from window.SHOP when it is a Canadian shop (SHOP.currency set); otherwise uses the Toronto placeholder below. */
(function () {
  var CA = {
    name: "Dough Re Mi", tagline: "Wood-fired. Hand-stretched. Slightly dramatic.",
    address: "42 Queen Street West, Toronto, ON M5H 2M9", phone: "+1 416 555 0142",
    lat: 43.6529, lon: -79.3849, currency: "$",
    hours: "Mon-Thu 11:30 am - 10 pm | Fri-Sat 11:30 am - 12 am | Sun 12 pm - 9 pm",
    hoursList: [{ d: "Mon - Thu", t: "11:30 am - 10:00 pm" }, { d: "Fri - Sat", t: "11:30 am - 12:00 am" }, { d: "Sunday", t: "12:00 pm - 9:00 pm" }],
    special: { name: "Maple Bacon Smoke", desc: "Today only: maple-glazed bacon, smoked cheddar, caramelised onion, a drizzle of Ontario maple.", price: 24.5 },
    story: ["Dough Re Mi started with one stubborn idea: pizza dough deserves 48 hours of patience. We ferment it slowly, stretch it by hand and bake it in a wood-fired oven that hits 450 degrees.", "Every sauce is made in-house each morning. Every pizza leaves the oven a little charred, a little dramatic, and completely worth the wait, even in February."],
    quotes: [{ q: "The crust alone is worth the trip. Crisp outside, soft inside.", by: "Priya N." }, { q: "Best pie downtown, no argument allowed.", by: "Mike D." }, { q: "We ordered once and now it is our Friday tradition.", by: "The Tremblay family" }],
    faq: [{ q: "Do you deliver, and through which apps?", a: "Yes. Order direct for the best price, or find us on the major delivery apps. Direct orders ship within 5 km." }, { q: "Is there parking?", a: "Street parking and a nearby Green P lot on Albert Street. The TTC streetcar stops nearby." }, { q: "Do you cater?", a: "Yes, from office lunches to weddings. Call us at least 48 hours ahead." }, { q: "What are your winter hours?", a: "Same as above, though we may close early in a proper blizzard. We post it on the door and answer the phone." }],
    menu: [
      { category: "Pizzas", items: [
        { name: "Margherita", desc: "Tomato, fresh mozzarella, basil, olive oil", price: 18, tags: ["vegetarian"] },
        { name: "Maple Bacon Smoke", desc: "Maple bacon, smoked cheddar, onion", price: 24.5, tags: [] },
        { name: "Garden Harvest", desc: "Mushroom, olives, peppers, red onion, no cheese", price: 21, tags: ["vegan"] },
        { name: "Pepperoni Blaze", desc: "Spicy pepperoni, chilli oil, extra cheese", price: 23, tags: ["spicy"] },
        { name: "Four Cheese", desc: "Mozzarella, cheddar, parmesan, blue cheese", price: 22, tags: ["vegetarian"] },
        { name: "Gluten-Free Margherita", desc: "Our classic on a rice-flour base", price: 21, tags: ["vegetarian", "gluten-free"] }
      ] },
      { category: "Sides", items: [
        { name: "Garlic Bread", desc: "Toasted, buttery, a little too much garlic", price: 8, tags: ["vegetarian"] },
        { name: "Poutine Fries", desc: "Crisp fries, cheese curds, gravy", price: 11, tags: [] },
        { name: "Stuffed Calzone", desc: "Folded pizza, ricotta and spinach inside", price: 15, tags: ["vegetarian"] }
      ] },
      { category: "Pasta", items: [
        { name: "Arrabbiata", desc: "Penne in fiery tomato and garlic sauce", price: 16, tags: ["vegan", "spicy"] },
        { name: "Alfredo", desc: "Creamy parmesan, herbs, black pepper", price: 17, tags: ["vegetarian"] }
      ] },
      { category: "Drinks & Sweets", items: [
        { name: "Maple Lemonade", desc: "Fizzy, tangy, Ontario maple", price: 5, tags: ["vegan", "gluten-free"] },
        { name: "Cold Brew", desc: "Thick, chilled, not shy", price: 5.5, tags: ["vegan", "gluten-free"] },
        { name: "Tiramisu Cup", desc: "Espresso-soaked sponge, mascarpone", price: 9, tags: ["vegetarian"] },
        { name: "Butter Tart Pizza Slice", desc: "Warm dessert pizza, butter tart filling, sea salt", price: 8, tags: ["vegetarian"] }
      ] }
    ]
  };
  var S = (window.SHOP && window.SHOP.currency) ? window.SHOP : CA;
  var TAGL = { vegetarian: "V", vegan: "VG", "gluten-free": "GF", spicy: "Spicy" };
  var TAGT = { vegetarian: "Vegetarian", vegan: "Vegan", "gluten-free": "Gluten-free", spicy: "Spicy" };
  function $$(s) { return [].slice.call(document.querySelectorAll(s)); }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
  function price(n) { return S.formatPrice ? S.formatPrice(n) : (S.currency || "$") + Number(n).toFixed(2); }
  function tags(i) {
    var t = i.tags || (i.veg ? ["vegetarian"] : []);
    return t.map(function (x) { return '<span class="tag t-' + x.replace(/[^a-z]/g, "") + '" title="' + (TAGT[x] || x) + '">' + (TAGL[x] || x) + "</span>"; }).join("");
  }
  function slug(s) { return s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, ""); }
  var digits = String(S.phone || "").replace(/\D/g, "");
  $$("[data-shop]").forEach(function (el) { el.textContent = S[el.getAttribute("data-shop")] || el.textContent; });
  document.title = S.name + (document.body.getAttribute("data-page") ? " | " + document.body.getAttribute("data-page") : "");
  $$("[data-call]").forEach(function (el) { el.href = "tel:+" + digits; });
  $$("[data-order]").forEach(function (el) { el.href = (window.SHOP && window.SHOP.orderUrl) || "#"; });
  $$("[data-hours-table]").forEach(function (t) {
    t.innerHTML = "<thead><tr><th>Day</th><th>Open</th></tr></thead><tbody>" + S.hoursList.map(function (h) { return "<tr><td>" + esc(h.d) + "</td><td>" + esc(h.t) + "</td></tr>"; }).join("") + "</tbody>";
  });
  $$("[data-hours]").forEach(function (ul) {
    ul.innerHTML = S.hoursList.map(function (h) { return "<li><span>" + esc(h.d) + "</span> <b>" + esc(h.t) + "</b></li>"; }).join("");
  });
  $$("[data-map]").forEach(function (f) {
    var d = 0.006;
    f.src = "https://www.openstreetmap.org/export/embed.html?bbox=" + [S.lon - d, S.lat - d, S.lon + d, S.lat + d].join("%2C") + "&layer=mapnik&marker=" + S.lat + "%2C" + S.lon;
  });
  $$("[data-menu]").forEach(function (box) {
    var n = 0;
    box.innerHTML = S.menu.map(function (c) {
      return '<section class="cat" id="cat-' + slug(c.category) + '"><h2 class="cat-title">' + esc(c.category) + '</h2><ul class="items">' +
        c.items.map(function (i) { n++; return '<li class="item"><span class="num">' + n + '</span><div class="ihead"><span class="iname">' + esc(i.name) + '</span><span class="iprice">' + price(i.price) + '</span></div><p class="idesc">' + esc(i.desc) + '</p><div class="tags">' + tags(i) + "</div></li>"; }).join("") + "</ul></section>";
    }).join("");
  });
  $$("[data-catnav]").forEach(function (nav) {
    nav.innerHTML = S.menu.map(function (c) { return '<a href="#cat-' + slug(c.category) + '">' + esc(c.category) + "</a>"; }).join("");
  });
  $$("[data-featured]").forEach(function (box) {
    var nums = [9, 19, 99];
    box.innerHTML = S.menu[0].items.filter(function (i, k) { return [0, 1, 3].indexOf(k) > -1; }).map(function (i, k) {
      return '<article class="fcard"><span class="num">' + nums[k] + "</span><h3>" + esc(i.name) + "</h3><p>" + esc(i.desc) + '</p><div class="tags">' + tags(i) + '</div><b class="price">' + price(i.price) + "</b></article>";
    }).join("");
  });
  $$("[data-special]").forEach(function (box) {
    var s = S.special; if (!s) return;
    box.innerHTML = '<span class="badge">Today&rsquo;s special</span><h2>' + esc(s.name) + "</h2><p>" + esc(s.desc) + '</p><b class="price">' + price(s.price) + "</b>";
  });
  $$("[data-story]").forEach(function (b) { b.innerHTML = S.story.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""); });
  $$("[data-quotes]").forEach(function (b) { b.innerHTML = S.quotes.map(function (q) { return '<blockquote class="quote"><p>&ldquo;' + esc(q.q) + "&rdquo;</p><cite>" + esc(q.by) + "</cite></blockquote>"; }).join(""); });
  $$("[data-faq]").forEach(function (b) { b.innerHTML = S.faq.map(function (f) { return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>"; }).join(""); });
  /* hockey scoreboard clock + goal horn */
  $$("[data-clock]").forEach(function (el) {
    var t = 20 * 60;
    function r() { var m = Math.floor(t / 60), s = t % 60; el.textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s; }
    r();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(function () { t = t > 0 ? t - 1 : 20 * 60; r(); }, 1000);
  });
  $$("[data-goal]").forEach(function (b) {
    b.addEventListener("click", function () { document.body.classList.remove("goal"); void document.body.offsetWidth; document.body.classList.add("goal"); setTimeout(function () { document.body.classList.remove("goal"); }, 1600); });
  });
})();
