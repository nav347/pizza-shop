/* v16 extras: order links, CAD price format, dietary tags, menu anchors. Runs after shop-fill.js. */
(function () {
  var S = window.SHOP || {};
  var cur = S.currency || "$";
  function money(n) { return typeof S.formatPrice === "function" ? S.formatPrice(n) : cur + n; }
  [].forEach.call(document.querySelectorAll("[data-order]"), function (a) {
    a.href = S.orderUrl || "#";
    if (S.orderUrl) { a.target = "_blank"; a.rel = "noopener"; }
  });
  var NV = /pepperoni|bacon|chicken|ham|sausage|prosciutto|meat|fish|prawn/i;
  var anchors = document.getElementById("anchors");
  var menu = document.getElementById("menu");
  if (!menu) return;
  function tagHtml(it, flat) {
    var t = (it.tags || []).map(function (x) { return String(x).toLowerCase(); });
    if (!t.length) {
      if (it.veg === true || !NV.test(it.name + " " + (it.desc || ""))) t.push("vegetarian");
      if (/chilli|chili|spicy|hot honey|blaze|arrabbiata/i.test(it.name + " " + (it.desc || ""))) t.push("spicy");
    }
    var out = "";
    if (t.indexOf("vegan") > -1) out += '<span class="tg t-vg" title="Vegan">VG</span>';
    else if (t.indexOf("vegetarian") > -1) out += '<span class="tg t-v" title="Vegetarian">V</span>';
    if (t.indexOf("gluten-free") > -1) out += '<span class="tg t-gf" title="Gluten-free">GF</span>';
    if (t.indexOf("spicy") > -1) out += '<span class="tg t-sp" title="Spicy">&#127798;</span>';
    return out;
  }
  var all = [];
  (S.menu || []).forEach(function (c) { c.items.forEach(function (i) { all.push(i); }); });
  [].forEach.call(menu.querySelectorAll(".cat"), function (c, ci) {
    c.id = "c" + ci;
    if (anchors) {
      var l = document.createElement("a");
      l.href = "#c" + ci; l.textContent = c.querySelector(".cat-title").textContent;
      anchors.appendChild(l);
    }
    var src = (S.menu || [])[ci];
    [].forEach.call(c.querySelectorAll(".item"), function (li, ii) {
      var it = src && src.items[ii]; if (!it) return;
      var h = li.querySelector(".ihead");
      var n = li.querySelector(".iname");
      var tags = document.createElement("span"); tags.className = "tags"; tags.innerHTML = tagHtml(it);
      h.insertBefore(tags, li.querySelector(".idots"));
      var p = li.querySelector(".iprice"); if (p) p.textContent = money(it.price);
    });
  });
})();
/* shop-fill.js hard-codes the rupee sign in featured/special; rewrite it to the shop currency. */
(function () {
  var S = window.SHOP || {}, cur = S.currency || "$";
  [].forEach.call(document.querySelectorAll("[data-featured] b,[data-special] *"), function (e) {
    if (e.children.length === 0 && /₹/.test(e.textContent)) {
      e.textContent = e.textContent.replace(/₹(\d+)/g, function (m, n) {
        return typeof S.formatPrice === "function" ? S.formatPrice(+n) : cur + n;
      });
    }
  });
})();
