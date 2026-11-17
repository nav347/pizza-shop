/* Maple Axis page renderer (this version). Builds every page from window.BIZ; the HTML files contain the same output as a fallback. */
(function (root) {
  var T = {"k":"kicker","pal":{"bg":"#cdeee3","wall":"#fff9f3","paper":"#ffffff","floor":"#e4dcf5","steel":"#d9cfe8","main":"#f08aa6","acc":"#9ed8c6","acc2":"#f7d774","water":"#8fd0f5","dust":"#a595c0","ink":"#6b5a86","glass":"#d8f0fb","skin":"#f6c9a8","sw":3,"rx":1.8},"heroKick":"North York, Toronto and the GTA","heroLead":"We help keep your facility clean, safe and running smoothly.","quoteBtn":"Get a friendly quote","aboutKick":"Hello from Maple Axis","aboutH":"Who we are","svcKick":"What we do","svcH":"How we help your facility","allSvc":"See all services","comKick":"Our promise","comH":"How we work with you","procKick":"How it works","procH":"Easy as 1, 2, 3, 4","conKick":"Contractors and property managers","conH":"When your trade finishes, we clean up","ctKick":"Say hello","ctH":"Contact us","faqKick":"Questions","faqH":"Good questions","svcPageH":"How we can help","quoteKick":"Get a quote","quotePageH":"Tell us about your facility","sendBtn":"Send my request"};
  function e(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function price(B, n) { return typeof B.formatPrice === "function" ? B.formatPrice(n) : (n == null ? "Custom quote" : "$" + n); }
  var P = T.pal;

  /* ---------- illustrations (inline SVG, no external images) ---------- */
  var A = 'stroke="' + P.ink + '" stroke-width="' + P.sw + '" stroke-linejoin="round" stroke-linecap="round"';
  function R(x, y, w, h, f, r) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + ((r || 0) * P.rx) + '" fill="' + f + '" ' + A + '/>'; }
  function C(x, y, r, f) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '" ' + A + '/>'; }
  function Pa(d, f) { return '<path d="' + d + '" fill="' + (f || "none") + '" ' + A + '/>'; }
  function F(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o ? ' opacity="' + o + '"' : "") + '/>'; }
  function FC(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o ? ' opacity="' + o + '"' : "") + '/>'; }
  function S(d, col, w) { return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
  function worker(x, y, vest, s) { /* simple figure, feet at (x,y), height ~ 70*s */
    s = s || 1;
    return R(x - 9 * s, y - 38 * s, 7 * s, 38 * s, P.ink, 2) + R(x + 2 * s, y - 38 * s, 7 * s, 38 * s, P.ink, 2) +
      R(x - 13 * s, y - 72 * s, 26 * s, 38 * s, vest, 6) + C(x, y - 82 * s, 9 * s, P.skin) +
      Pa("M" + (x - 10 * s) + " " + (y - 84 * s) + "a" + (10 * s) + " " + (9 * s) + " 0 0 1 " + (20 * s) + " 0z", P.acc2);
  }
  function maple(cx, cy, s, f) {
    var pts = [[0, -10], [2.5, -5], [7, -7], [6, -1], [11, 0], [6, 4], [8, 9], [2, 7], [1, 12], [-1, 12], [-2, 7], [-8, 9], [-6, 4], [-11, 0], [-6, -1], [-7, -7], [-2.5, -5]];
    return Pa("M" + pts.map(function (p) { return (cx + p[0] * s) + " " + (cy + p[1] * s); }).join("L") + "z", f);
  }
  var SC = {};
  SC.hero = function () {
    var o = R(0, 0, 400, 260, P.wall) + R(0, 196, 400, 64, P.floor) + R(-4, 0, 408, 22, P.steel) +
      Pa("M0 22L50 64L100 22L150 64L200 22L250 64L300 22L350 64L400 22") + Pa("M0 64H400") +
      R(24, 80, 352, 24, P.steel, 12) + Pa("M100 80V104M180 80V104M260 80V104M340 80V104") +
      R(16, 112, 6, 84, P.acc) + R(116, 112, 6, 84, P.acc) + R(16, 142, 106, 6, P.main) + R(16, 172, 106, 6, P.main) +
      R(28, 118, 28, 24, P.acc2) + R(62, 124, 24, 18, P.paper) + R(92, 120, 20, 22, P.steel) + R(28, 150, 34, 22, P.paper) + R(70, 154, 30, 18, P.acc2) +
      F("M176 206H346L372 238H150Z", P.paper, 0.5) +
      R(204, 160, 104, 34, P.main, 8) + R(250, 128, 42, 32, P.acc, 6) + Pa("M262 128L256 108M248 108H266") +
      C(224, 198, 11, P.ink) + C(290, 198, 11, P.ink) + R(196, 192, 120, 6, P.ink, 2) +
      C(280, 118, 8, P.skin) + Pa("M271 115a9 8 0 0 1 18 0z", P.acc2) + R(316, 176, 18, 10, P.water, 3) +
      FC(150, 70, 2, P.dust, .8) + FC(210, 66, 2, P.dust, .8) + FC(330, 70, 2, P.dust, .8);
    return o;
  };
  SC.building = function () {
    return R(0, 0, 400, 260, P.bg) + FC(340, 46, 20, P.acc2, 1) + R(0, 222, 400, 38, P.floor) +
      R(30, 92, 340, 130, P.paper) + R(22, 76, 356, 18, P.steel) + R(126, 104, 148, 30, P.main, 4) + maple(200, 119, 1.25, P.acc2) +
      R(54, 146, 64, 76, P.steel) + Pa("M54 164H118M54 182H118M54 200H118") + R(168, 146, 64, 76, P.steel) + Pa("M168 164H232M168 182H232M168 200H232") +
      R(282, 146, 64, 76, P.steel) + Pa("M282 164H346M282 182H346M282 200H346") +
      R(46, 214, 8, 14, P.acc) + R(120, 214, 8, 14, P.acc) + R(340, 214, 8, 14, P.acc) +
      R(70, 58, 26, 18, P.steel, 2) + R(300, 58, 26, 18, P.steel, 2);
  };
  SC.dust = function () {
    var o = R(0, 0, 400, 260, P.wall) + R(0, 232, 400, 28, P.floor) + R(0, 0, 400, 22, P.steel) + R(0, 52, 400, 12, P.steel) +
      Pa("M0 64H400") + R(24, 82, 352, 34, P.steel, 17) + Pa("M90 82V116M170 82V116M250 82V116M330 82V116") +
      R(150, 160, 100, 8, P.acc) + Pa("M150 160V130H250V160") + Pa("M166 168L234 214M234 168L166 214") + R(150, 214, 100, 14, P.main, 3) + C(166, 232, 6, P.ink) + C(234, 232, 6, P.ink) +
      worker(200, 160, P.main, .8) + Pa("M212 120L262 90", "none") + F("M255 84L275 94L269 106L249 96Z", P.acc2) + Pa("M255 84L275 94L269 106L249 96Z");
    [[60, 40], [110, 30], [150, 70], [200, 44], [300, 36], [330, 72], [354, 40], [250, 72], [90, 128], [320, 130], [290, 140], [50, 150], [350, 170]].forEach(function (d) { o += FC(d[0], d[1], 2.6, P.dust, .75); });
    return o;
  };
  SC.pressure = function () {
    var o = R(0, 0, 400, 260, P.bg) + R(0, 40, 270, 196, P.paper) + R(0, 236, 400, 24, P.floor) + R(0, 206, 270, 30, P.steel) +
      R(40, 76, 112, 130, P.steel) + Pa("M40 96H152M40 116H152M40 136H152M40 156H152M40 176H152") + R(36, 66, 120, 10, P.ink) +
      F("M0 40H270V70H0Z", P.dust, .25) + R(10, 206, 8, 28, P.acc) + R(178, 206, 8, 28, P.acc) +
      R(302, 160, 26, 50, P.main, 6) + R(304, 208, 8, 28, P.ink, 2) + R(318, 208, 8, 28, P.ink, 2) + C(315, 148, 10, P.skin) + Pa("M305 145a10 9 0 0 1 20 0z", P.acc2) +
      Pa("M302 178L262 196") + R(246, 192, 18, 8, P.acc, 2) +
      S("M246 196L196 176M246 196L192 196M246 196L198 216", P.water, 5) + S("M246 196L204 186M246 196L204 206", P.paper, 3);
    [[190, 160], [180, 190], [188, 222], [168, 176], [172, 208], [200, 232]].forEach(function (d) { o += FC(d[0], d[1], 3.5, P.water); });
    return o;
  };
  SC.racking = function () {
    var o = R(0, 0, 400, 260, P.wall) + R(0, 218, 400, 42, P.floor) + S("M0 244H400", P.acc2, 4);
    [30, 150, 270, 390].forEach(function (x) { o += R(x - 4, 30, 8, 188, P.acc); });
    [76, 136, 196].forEach(function (L) { o += R(30, L, 364, 8, P.main); });
    var fills = [P.acc2, P.paper, P.steel];
    [34, 154, 274].forEach(function (x0, bi) {
      [76, 136, 196].forEach(function (L, li) {
        if ((bi + li) % 4 === 3) return;
        o += R(x0 + 6, L - 34, 40, 34, fills[(bi + li) % 3]) + R(x0 + 52, L - 26, 54, 26, fills[(bi + li + 1) % 3]) + Pa("M" + (x0 + 6) + " " + (L - 20) + "H" + (x0 + 46));
      });
    });
    return o + R(30, 28, 364, 4, P.ink);
  };
  SC.scrubber = function () {
    return R(0, 0, 400, 260, P.wall) + R(0, 168, 400, 92, P.floor) +
      F("M0 168H400L400 176L0 176Z", P.steel, .6) + F("M60 200L130 200L100 240L20 240Z", P.paper, .35) + F("M300 200H380L400 236H320Z", P.paper, .35) +
      FC(44, 208, 3, P.dust, .6) + FC(70, 222, 3, P.dust, .6) + FC(30, 186, 2.5, P.dust, .6) + FC(96, 192, 2.5, P.dust, .6) +
      F("M286 176H400V198H286Z", P.water, .75) + S("M300 186H392", P.paper, 3) +
      R(188, 84, 60, 12, P.acc, 5) + R(188, 52, 10, 40, P.acc, 4) + R(202, 56, 26, 30, P.acc2, 6) + C(215, 44, 10, P.skin) + Pa("M205 42a10 9 0 0 1 20 0z", P.acc2) +
      Pa("M232 80L252 60") + Pa("M244 56L262 70") + R(226, 36, 12, 10, P.acc, 3) +
      R(108, 98, 176, 74, P.main, 16) + R(120, 110, 44, 22, P.paper, 4) +
      R(64, 154, 56, 18, P.acc, 5) + C(150, 176, 24, P.ink) + C(150, 176, 9, P.steel) + C(258, 176, 24, P.ink) + C(258, 176, 9, P.steel) + R(280, 170, 44, 7, P.ink, 2);
  };
  SC.clip = function () {
    var o = R(0, 0, 400, 260, P.bg) + R(18, 56, 90, 90, P.paper, 8) + R(18, 56, 90, 22, P.main, 8) + R(34, 46, 8, 20, P.ink) + R(84, 46, 8, 20, P.ink);
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) o += R(30 + j * 26, 88 + i * 18, 16, 10, (i === 1 && j === 1) ? P.acc : P.steel, 2);
    o += R(128, 24, 150, 208, P.paper, 10) + R(172, 12, 62, 24, P.steel, 6);
    for (var k = 0; k < 4; k++) {
      var y = 62 + k * 40;
      o += R(144, y, 20, 20, P.paper, 3) + (k < 3 ? Pa("M148 " + (y + 10) + "l5 6l10-13", "none").replace(A, 'stroke="' + P.acc + '" stroke-width="' + (P.sw + 2) + '" stroke-linecap="round" stroke-linejoin="round"') : "") + Pa("M176 " + (y + 6) + "H256M176 " + (y + 16) + "H228");
    }
    o += R(300, 176, 94, 14, P.acc2, 6) + Pa("M308 176a39 36 0 0 1 78 0z", P.acc2) + R(338, 138, 10, 38, P.acc, 3);
    return o;
  };
  SC.drywall = function () {
    return R(0, 0, 400, 260, P.paper) + R(230, 0, 170, 186, P.steel) + R(0, 0, 230, 186, P.acc2) + Pa("M290 0V186M350 0V186") +
      FC(290, 60, 2, P.ink) + FC(290, 110, 2, P.ink) + FC(350, 80, 2, P.ink) + FC(350, 140, 2, P.ink) +
      R(0, 186, 400, 74, P.floor) + R(0, 180, 400, 8, P.steel) +
      R(36, 36, 100, 96, P.glass) + Pa("M86 36V132M36 84H136") +
      F("M300 190L338 50L392 64L356 190Z", P.paper) + Pa("M300 190L338 50L392 64L356 190Z") + Pa("M312 150L348 160") +
      R(168, 150, 38, 40, P.main, 5) + Pa("M172 150a15 18 0 0 1 30 0") + Pa("M60 74L120 196M104 190L132 160", "none") +
      Pa("M236 66L206 176") + Pa("M188 186L236 170L248 188L200 204Z", P.acc) +
      F("M20 214Q60 200 100 214T180 214L180 228Q120 238 20 228Z", P.dust, .35) +
      Pa("M60 150v18M51 159h18", "none").replace(A, 'stroke="' + P.acc + '" stroke-width="' + (P.sw + 1) + '" stroke-linecap="round"') +
      Pa("M100 120v12M94 126h12", "none").replace(A, 'stroke="' + P.main + '" stroke-width="' + (P.sw + 1) + '" stroke-linecap="round"');
  };
  SC.plan = function () {
    return R(0, 0, 400, 260, P.bg) + R(40, 28, 250, 190, P.paper, 4) + Pa("M60 50H270V200H60Z") + Pa("M60 120H160M160 50V120M160 150V200M160 150H270M215 50V90") +
      Pa("M60 90H88", "none") + C(110, 160, 12, P.acc2) + C(215, 120, 10, P.acc2) + Pa("M215 90V105") +
      S("M70 62H92M70 70H84", P.acc, 3) + R(300, 40, 72, 14, P.acc, 4) + Pa("M300 70H372") +
      Pa("M326 118L350 104L374 118V150C374 172 350 186 350 186C350 186 326 172 326 150Z", P.acc2) + Pa("M338 146l9 9l16-20", "none") +
      R(250, 206, 130, 12, P.steel, 3) + Pa("M270 206v8M290 206v8M310 206v8M330 206v8M350 206v8");
  };
  SC.skyline = function () {
    var o = R(0, 0, 400, 260, P.bg) + FC(60, 56, 16, P.acc2) + R(0, 226, 400, 34, P.floor);
    var b = [[20, 150, 44], [70, 120, 36], [110, 168, 50], [166, 104, 40], [210, 140, 46], [262, 160, 40], [306, 128, 38], [348, 150, 44]];
    b.forEach(function (d, i) {
      o += R(d[0], d[1], d[2], 226 - d[1], i % 2 ? P.paper : P.steel);
      for (var y = d[1] + 12; y < 214; y += 20) o += Pa("M" + (d[0] + 8) + " " + y + "h" + (d[2] - 16));
    });
    o += R(224, 58, 8, 168, P.steel) + '<ellipse cx="228" cy="86" rx="20" ry="9" fill="' + P.steel + '" ' + A + '/>' + Pa("M228 58V30");
    o += Pa("M96 40a22 22 0 1 1 44 0c0 18-22 44-22 44s-22-26-22-44z", P.main) + C(118, 40, 8, P.paper);
    return o;
  };
  var ALT = {
    hero: "Illustration: an industrial floor scrubber working in a warehouse with racking and overhead ductwork",
    dust: "Illustration: a worker on a lift cleaning dust from overhead ductwork and beams",
    pressure: "Illustration: a worker pressure washing a loading dock",
    racking: "Illustration: warehouse pallet racking with stacked boxes",
    scrubber: "Illustration: a ride-on industrial floor scrubber leaving a clean wet track",
    clip: "Illustration: a service checklist on a clipboard, a calendar and a hard hat",
    drywall: "Illustration: a room after drywall work with a broom, bucket and leaning drywall sheet"
  };
  function pic(id, cls, informative) {
    var svg = '<svg viewBox="0 0 400 260" ' + (informative && ALT[id] ? 'role="img" aria-label="' + e(ALT[id]) + '"' : 'aria-hidden="true"') + ' focusable="false">' + SC[id]() + (T.frame ? '<rect x="8" y="8" width="384" height="244" fill="none" stroke="' + P.acc + '" stroke-width="1"/>' : "") + "</svg>";
    return '<figure class="pic ' + (cls || "") + '">' + svg + "</figure>";
  }
  var SVCPIC = { contract: "clip", highdust: "dust", pressure: "pressure", warehouse: "racking", floors: "scrubber", special: "drywall" };

  /* ---------- sections ---------- */
  function sec(cls, inner, id) { return '<section class="sec' + (cls ? " " + cls : "") + '"' + (id ? ' id="' + id + '"' : "") + '><div class="wrap">' + inner + "</div></section>"; }
  function kick(t) { return '<p class="' + T.k + '">' + e(t) + "</p>"; }
  function tel(B) { return "tel:+1" + B.phoneRaw; }
  function hero(B) {
    return '<section class="hero"><div class="wrap hero-in"><div class="hero-t reveal">' + kick(T.heroKick) + "<h1>" + e(B.tagline) + '</h1><p class="lead">' + e(B.short) + ". " + e(T.heroLead) + '</p><p class="cta-row"><a class="btn" href="quote.html">' + e(T.quoteBtn) + '</a><a class="btn ghost" href="' + tel(B) + '">Call ' + e(B.phone) + "</a></p></div>" + pic("hero", "hero-pic reveal", true) + (T.badge ? T.badge : "") + "</div></section>";
  }
  function pagehead(kk, title, lead) {
    return '<section class="page-head"><div class="wrap narrow reveal">' + kick(kk) + "<h1>" + e(title) + '</h1><p class="lead">' + e(lead) + "</p></div></section>";
  }
  function values(B) {
    if (!B.values || !B.values.length) return "";
    return '<section class="sec vals"><div class="wrap"><ul class="vals-l">' + B.values.map(function (v) {
      return '<li><span class="vi" aria-hidden="true">' + e(v.icon) + "</span><b>" + e(v.title) + "</b><span>" + e(v.text) + "</span></li>";
    }).join("") + "</ul></div></section>";
  }
  function about(B) {
    return sec("tint", '<div class="split"><div class="split-t">' + kick(T.aboutKick) + "<h2>" + e(T.aboutH) + "</h2>" + B.about.map(function (p, i) { return "<p" + (i === 0 ? ' class="big-p"' : "") + ">" + e(p) + "</p>"; }).join("") + "</div>" + pic("building", "", false) + "</div>", "about");
  }
  function services(B, layout) {
    var list = B.services || [];
    var head = '<div class="sec-h">' + kick(T.svcKick) + "<h2>" + e(T.svcH) + "</h2></div>";
    if (layout === "rows") {
      return sec("", head + '<div class="svc-rows">' + list.map(function (s, i) {
        return '<article class="svc-row' + (i % 2 ? " flip" : "") + '" id="' + e(s.id) + '">' + pic(SVCPIC[s.id] || "hero", "", true) +
          '<div class="svc-t"><span class="ic" aria-hidden="true">' + e(s.icon || "") + "</span><h3>" + e(s.name) + "</h3><p>" + e(s.desc || "") + '</p><p class="tag">' + e(price(B, s.from)) + '</p><p><a class="btn ghost" href="quote.html">' + e(T.quoteBtn) + "</a></p></div></article>";
      }).join("") + "</div>", "services");
    }
    return sec("", head + '<ul class="svc-grid">' + list.map(function (s) {
      return '<li class="card" id="' + e(s.id) + '">' + pic(SVCPIC[s.id] || "hero", "", true) + '<span class="ic" aria-hidden="true">' + e(s.icon || "") + "</span><h3>" + e(s.name) + "</h3><p>" + e(s.desc || "") + '</p><p class="tag">' + e(price(B, s.from)) + "</p></li>";
    }).join("") + '</ul><p class="center"><a class="btn ghost" href="services.html">' + e(T.allSvc) + "</a></p>", "services");
  }
  function commitment(B) {
    return sec("tint", '<div class="split rev">' + pic("plan", "", false) + '<div class="split-t">' + kick(T.comKick) + "<h2>" + e(T.comH) + "</h2>" + B.commitment.map(function (p, i) { return "<p" + (i === 0 ? ' class="big-p"' : "") + ">" + e(p) + "</p>"; }).join("") + "</div></div>", "commitment");
  }
  function process(B) {
    return sec("", '<div class="sec-h">' + kick(T.procKick) + "<h2>" + e(T.procH) + '</h2></div><ol class="steps">' + (B.process || []).map(function (s, i) {
      return '<li><span class="n">' + (i + 1) + "</span><div><h3>" + e(s.step) + "</h3><p>" + e(s.desc) + "</p></div></li>";
    }).join("") + "</ol>", "process");
  }
  function contractors(B) {
    var c = B.forContractors; if (!c) return "";
    return sec("contr", '<div class="contr-box">' + kick(T.conKick) + "<h2>" + e(T.conH) + "</h2><p>" + e(c.pitch) + '</p><ul class="perks">' + (c.perks || []).map(function (x) { return "<li>" + e(x) + "</li>"; }).join("") + '</ul><p><a class="btn" href="quote.html">' + e(T.quoteBtn) + "</a></p></div>", "contractors");
  }
  function contact(B) {
    return sec("tint", '<div class="split rev">' + pic("skyline", "", false) + '<div class="split-t">' + kick(T.ctKick) + "<h2>" + e(T.ctH) + '</h2><ul class="contact-l"><li><b>Phone</b> <a href="' + tel(B) + '">' + e(B.phone) + '</a></li><li><b>Email</b> <a href="mailto:' + e(B.email) + '">' + e(B.email) + "</a></li><li><b>Address</b> " + (B.addressLines || [B.address]).map(e).join("<br>") + "</li><li><b>Service area</b> " + e(B.area) + "</li><li><b>Availability</b> " + e(B.hours) + '</li></ul><ul class="chips" aria-label="Cities we serve">' + (B.cities || []).map(function (c) { return "<li>" + e(c) + "</li>"; }).join("") + "</ul></div></div>", "contact");
  }
  function faq(B) {
    if (!B.faq || !B.faq.length) return "";
    return sec("", '<div class="sec-h">' + kick(T.faqKick) + "<h2>" + e(T.faqH) + '</h2></div><div class="faq">' + B.faq.map(function (f) { return "<details><summary>" + e(f.q) + "</summary><p>" + e(f.a) + "</p></details>"; }).join("") + "</div>", "faq");
  }
  function quoteForm(B) {
    return sec("", '<div class="narrow-form"><form id="qf" class="qform" action="#" method="post">' +
      '<label>Name<input name="name" autocomplete="name" required></label>' +
      '<label>Company<input name="company" autocomplete="organization"></label>' +
      '<label>Phone<input name="phone" type="tel" autocomplete="tel" required></label>' +
      '<label>Email<input name="email" type="email" autocomplete="email" required></label>' +
      '<label>City<input name="city" autocomplete="address-level2" placeholder="North York, Mississauga, Markham..." required></label>' +
      '<label>Service<select name="service">' + (B.services || []).map(function (s) { return "<option>" + e(s.name) + "</option>"; }).join("") + "<option>Not sure yet</option></select></label>" +
      '<label>Facility size<input name="size" placeholder="e.g. 40,000 sq ft warehouse"></label>' +
      '<label>Preferred date<input name="date" type="date"></label>' +
      '<label class="full">About the work<textarea name="notes" rows="4" placeholder="Location, type of work and your timing"></textarea></label>' +
      '<button class="btn" type="submit">' + e(T.sendBtn) + '</button><p id="form-msg" class="form-msg" role="status" tabindex="-1" hidden>Form not connected yet; call or email us.</p></form></div>', "quote-form");
  }
  function main(B, page) {
    if (page === "services") {
      return pagehead(T.svcKick, T.svcPageH, B.short + ". Every job is quoted to its scope.") + services(B, "rows") + values(B) + about(B) + commitment(B) + process(B) + contractors(B) + contact(B) + faq(B);
    }
    if (page === "quote") {
      return pagehead(T.quoteKick, T.quotePageH, "Tell us about the facility, the work and your timing. Pricing depends on the scope, so we respond with a quote.") + quoteForm(B) + faq(B) + services(B, "cards") + values(B) + about(B) + commitment(B) + process(B) + contractors(B) + contact(B);
    }
    return hero(B) + values(B) + about(B) + services(B, "cards") + commitment(B) + process(B) + contractors(B) + contact(B) + faq(B);
  }
  function foot(B) {
    return '<div class="wrap fcols"><div><p class="foot-brand">' + e(B.name) + "</p><p>" + e(B.legalLine) + '</p><p class="motto">' + e(B.name.toUpperCase()) + ": " + e(B.tagline) + '</p></div><div><p><a href="' + tel(B) + '">' + e(B.phone) + '</a></p><p><a href="mailto:' + e(B.email) + '">' + e(B.email) + "</a></p></div><div><p>" + (B.addressLines || [B.address]).map(e).join("<br>") + "</p><p>" + e(B.area) + "</p></div></div>";
  }
  var api = { main: main, foot: foot };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined" && window.document) {
    var B = window.BIZ, d = window.document;
    if (B) {
      var m = d.getElementById("main"), f = d.getElementById("foot"), pg = d.body.getAttribute("data-page") || "index";
      if (m && B.services) { m.innerHTML = main(B, pg); }
      if (f) { f.innerHTML = foot(B); }
    }
    d.addEventListener("submit", function (ev) {
      if (!ev.target || ev.target.id !== "qf") return;
      ev.preventDefault(); var g = d.getElementById("form-msg"); g.hidden = false; g.focus();
    });
  }
})(this);
