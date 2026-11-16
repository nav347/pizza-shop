/* v11 helpers: design-notes toggle (remembered) and "open now" badge. */
(function () {
  var KEY = "v11-notes", on = true;
  try { if (localStorage.getItem(KEY) === "off") on = false; } catch (e) {}
  function apply() {
    document.body.classList.toggle("notes-on", on);
    var b = document.getElementById("notes-toggle");
    if (b) { b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "Design notes: ON" : "Design notes: OFF"; }
  }
  var D = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  function mins(s) {
    var m = /(\d+):(\d+)\s*(am|pm)/i.exec(s); if (!m) return null;
    var h = +m[1] % 12; if (m[3].toLowerCase() === "pm") h += 12;
    return h * 60 + +m[2];
  }
  function days(label) {
    var p = String(label).toLowerCase().match(/[a-z]{3}/g) || [];
    var a = D.indexOf(p[0]); if (a < 0) return [];
    var z = p.length > 1 ? D.indexOf(p[1]) : a, out = [];
    if (z < 0) return [a];
    for (var i = a; ; i = (i + 1) % 7) { out.push(i); if (i === z) break; }
    return out;
  }
  function openNow() {
    var el = document.getElementById("open-now"), S = window.SHOP;
    if (!el || !S || !S.hoursList) return;
    var now = new Date(), d = now.getDay(), t = now.getHours() * 60 + now.getMinutes(), open = false;
    S.hoursList.forEach(function (h) {
      var r = String(h.t).split("-"), s = mins(r[0]), e = mins(r[1]);
      if (s === null || e === null) return;
      var ds = days(h.d);
      if (e <= s) {
        if (ds.indexOf(d) > -1 && t >= s) open = true;
        if (ds.indexOf((d + 6) % 7) > -1 && t < e) open = true;
      } else if (ds.indexOf(d) > -1 && t >= s && t < e) open = true;
    });
    el.textContent = open ? "Open now" : "Closed now";
    el.className = "open " + (open ? "yes" : "no");
  }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function $$(q) { return [].slice.call(document.querySelectorAll(q)); }
  function money(n) {
    var S = window.SHOP || {};
    if (typeof S.formatPrice === "function") return S.formatPrice(n);
    var c = S.currency || "$";
    return c + (Number(n) % 1 ? Number(n).toFixed(2) : Number(n));
  }
  function fill() {
    var S = window.SHOP; if (!S) return;
    $$("[data-shop]").forEach(function (el) { var v = S[el.getAttribute("data-shop")]; if (v) el.textContent = v; });
    var digits = String(S.phone || "").replace(/\D/g, "");
    if (digits) $$("[data-call]").forEach(function (el) { el.href = "tel:+" + digits; });
    $$("[data-hours]").forEach(function (ul) {
      if (!S.hoursList) return;
      ul.innerHTML = S.hoursList.map(function (h) {
        return '<li><span class="hd">' + esc(h.d) + '</span><span class="ht">' + esc(h.t) + "</span></li>";
      }).join("");
    });
    $$("[data-map]").forEach(function (f) {
      if (typeof S.lat !== "number") return;
      var d = 0.006, lo = S.lon, la = S.lat;
      f.src = "https://www.openstreetmap.org/export/embed.html?bbox=" + [lo - d, la - d, lo + d, la + d].join("%2C") + "&layer=mapnik&marker=" + la + "%2C" + lo;
    });
    var m = document.getElementById("menu");
    if (m && S.menu) {
      m.innerHTML = S.menu.map(function (c) {
        return '<section class="cat"><h2 class="cat-title">' + esc(c.category) + '</h2><ul class="items">' +
          c.items.map(function (i) {
            var tags = (i.tags || []).slice();
            if (i.veg && tags.indexOf("Vegetarian") < 0) tags.unshift("Vegetarian");
            var t = tags.length ? ' <span class="dtag">' + esc(tags.join(", ")) + "</span>" : "";
            return '<li class="item"><div class="ihead"><span class="iname">' + esc(i.name) + t +
              '</span><span class="idots" aria-hidden="true"></span><span class="iprice">' + esc(money(i.price)) +
              '</span></div><p class="idesc">' + esc(i.desc) + "</p></li>";
          }).join("") + "</ul></section>";
      }).join("");
    }
  }
  function init() {
    fill();
    var b = document.getElementById("notes-toggle");
    if (b) b.addEventListener("click", function () {
      on = !on; try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
      apply();
    });
    apply(); openNow();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
