(function () {
  var S = window.SHOP || { menu: [] };
  var cur = S.currency || "$";
  function money(n) { return S.formatPrice ? S.formatPrice(n) : cur + n; }
  function $$(s) { return [].slice.call(document.querySelectorAll(s)); }
  $$("[data-price]").forEach(function (e) { e.textContent = money(e.getAttribute("data-price")); });
  $$("[data-order]").forEach(function (a) { a.href = S.orderUrl || "#"; if (S.orderUrl) { a.target = "_blank"; a.rel = "noopener"; } });
  var cats = document.getElementById("cats");
  var TAGS = { vegetarian: ["V", "Vegetarian"], vegan: ["VG", "Vegan"], "gluten-free": ["GF", "Gluten-free"], spicy: ["&#127798;", "Spicy"] };
  var HEAT = [[/pepperoni|blaze/i, 5], [/arrabbiata/i, 4], [/paneer|tikka/i, 3], [/farmhouse|calzone|masala/i, 2]];
  if (cats && S.menu) S.menu.forEach(function (c, i) {
    var a = document.createElement("a"); a.href = "#c" + i; a.textContent = c.category; cats.appendChild(a);
  });
  $$("#menu .cat").forEach(function (c, i) {
    c.id = "c" + i;
    var t = c.querySelector(".cat-title"); if (t) t.setAttribute("data-n", i + 1);
    var data = (S.menu[i] || {}).items || [];
    [].slice.call(c.querySelectorAll(".item")).forEach(function (li, j) {
      var d = data[j] || {}, p = li.querySelector(".iprice");
      if (p && d.price != null) p.textContent = money(d.price);
      var tags = (d.tags || []).slice();
      if (d.veg && tags.indexOf("vegetarian") < 0) tags.push("vegetarian");
      if (tags.length) {
        var w = document.createElement("span"); w.className = "tags";
        w.innerHTML = tags.map(function (g) { var x = TAGS[g]; return x ? '<span class="tag-' + g + '" title="' + x[1] + '">' + x[0] + '<small> ' + x[1] + "</small></span>" : ""; }).join("");
        li.appendChild(w);
      }
      if (document.body.hasAttribute("data-heat") && (i === 0 || i === 2 || /calzone/i.test(d.name || ""))) {
        var s = 1; HEAT.forEach(function (h) { if (s === 1 && h[0].test(d.name || "")) s = h[1]; });
        if ((d.tags || []).indexOf("spicy") >= 0 && s < 4) s = 4;
        var h = document.createElement("p"); h.className = "hp";
        h.innerHTML = "SPICE HP <span class=\"bar\">" + [1, 2, 3, 4, 5].map(function (k) { return "<i" + (k <= s ? ' class="on"' : "") + "></i>"; }).join("") + "</span>";
        li.appendChild(h);
      }
      if (document.body.hasAttribute("data-tracks")) {
        var k = document.createElement("span"); k.className = "trk"; k.textContent = "Track " + ((j + 1) < 10 ? "0" : "") + (j + 1); li.insertBefore(k, li.firstChild);
      }
    });
  });
  var sp = S.special;
  if (sp && document.getElementById("sp-name")) {
    document.getElementById("sp-name").textContent = sp.name;
    document.getElementById("sp-desc").textContent = sp.desc;
    document.getElementById("sp-price").textContent = money(sp.price);
  }
})();
