/* v16 page script: fills the pages from window.BIZ (../business.js + biz-local.js).
   All user-visible text is set with textContent or built with createElement: no innerHTML anywhere. */
(function () {
  var B = window.BIZ; if (!B) return;
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function list(key, items, make) {
    if (!items || !items.length) return;
    $$('[data-each="' + key + '"]').forEach(function (box) { clear(box); items.forEach(function (v, i) { box.appendChild(make(v, i)); }); });
  }

  /* single values */
  $$("[data-biz]").forEach(function (n) {
    var k = n.getAttribute("data-biz"); if (!B[k]) return;
    n.textContent = B[k];
    if (k === "phone" && n.tagName === "A") n.href = "tel:+1" + B.phoneRaw;
    if (k === "email" && n.tagName === "A") n.href = "mailto:" + B[k];
  });
  $$("[data-tel]").forEach(function (n) { if (B.phoneRaw) n.href = "tel:+1" + B.phoneRaw; });
  /* real photos for the service cards (replace the drawings) */
  var photos = { contract: ["commercial-glass-cleaning", "Crew cleaning commercial glass"], highdust: ["high-dusting-warehouse", "High dusting of warehouse overhead structures"], pressure: ["pressure-washing-exterior", "Pressure washing an exterior surface"], warehouse: ["industrial-facility-clean", "Clean industrial facility after service"], floors: ["floor-scrubbing-warehouse", "Floor scrubbing machine in a warehouse"], special: ["exterior-window-cleaning", "Exterior window cleaning on a building"] };
  $$("[data-svc]").forEach(function (c) {
    var p = photos[c.getAttribute("data-svc")], fig = c.querySelector(".pic"); if (!p || !fig) return;
    var im = document.createElement("img"); im.src = "images/" + p[0] + ".jpg"; im.alt = p[1]; im.width = 1200; im.height = 800; im.loading = "lazy";
    clear(fig); fig.appendChild(im);
  });
  /* LocalBusiness structured data, built from the shared business data */
  try {
    var ld = { "@context": "https://schema.org", "@type": "LocalBusiness", name: B.name, telephone: B.phone, email: B.email, areaServed: B.area, description: B.short, logo: "images/maple-axis-official.png", image: "images/maple-axis-official.png", makesOffer: (B.services || []).map(function (s) { return { "@type": "Offer", itemOffered: { "@type": "Service", name: s.name } }; }) };
    var sc = document.createElement("script"); sc.type = "application/ld+json"; sc.textContent = JSON.stringify(ld); document.head.appendChild(sc);
  } catch (e) {}
  var rv = document.getElementById("reviews"); if (rv && (B.sampleQuotes || []).length) rv.hidden = false;
  $$("[data-motto]").forEach(function (n) { n.textContent = String(B.name).toUpperCase() + ": " + B.tagline; });

  /* lists */
  list("about", B.about, function (t) { return el("p", null, t); });
  list("commitment", B.commitment, function (t) { return el("p", null, t); });
  list("process", B.process, function (v) { var li = el("li"); li.appendChild(el("b", null, v.step)); li.appendChild(el("span", null, v.desc)); return li; });
  function faq(v) { var d = el("details"); d.appendChild(el("summary", null, v.q)); d.appendChild(el("p", null, v.a)); return d; }
  list("faq", B.faq, faq);
  list("residentialFaq", B.residentialFaq, faq);
  list("cities", B.cities, function (t) { return el("li", null, t); });
  if (B.forContractors) {
    var cp = document.getElementById("pitch"); if (cp && B.forContractors.pitch) cp.textContent = B.forContractors.pitch;
    list("perks", B.forContractors.perks, function (t) { return el("li", null, t); });
  }

  /* cards that mirror a business service */
  function svc(id) { return (B.services || []).filter(function (x) { return x.id === id; })[0]; }
  $$("[data-svc]").forEach(function (c) {
    var v = svc(c.getAttribute("data-svc")); if (!v) return;
    var t = c.querySelector(".t"), d = c.querySelector(".d"), g = c.querySelector(".tag");
    if (t) t.textContent = v.name; if (d) d.textContent = v.desc;
    if (g) g.textContent = v.from == null ? "Custom quote" : B.formatPrice(v.from);
  });
  /* residential cards (sample content from biz-local.js) */
  $$("[data-res]").forEach(function (c) {
    var id = c.getAttribute("data-res"), v = (B.residential || []).filter(function (x) { return x.id === id; })[0]; if (!v) return;
    var t = c.querySelector(".t"), d = c.querySelector(".d"), p = c.querySelector(".price");
    if (t) t.textContent = v.name; if (d) d.textContent = v.desc; if (p) p.textContent = v.from;
  });
  $$("[data-val]").forEach(function (c) {
    var v = (B.values || [])[+c.getAttribute("data-val")]; if (!v) return;
    var t = c.querySelector(".t"), d = c.querySelector(".d"); if (t) t.textContent = v.title; if (d) d.textContent = v.text;
  });

  /* sample testimonials: optional data-filter="Residential" keeps one kind first */
  $$("[data-quotes]").forEach(function (box) {
    var q = (B.sampleQuotes || []).slice(), f = box.getAttribute("data-filter");
    if (f) q.sort(function (a, b) { return (b.kind === f) - (a.kind === f); });
    if (!q.length) { box.hidden = true; return; }
    clear(box);
    q.forEach(function (v) {
      var fig = el("figure", "quote");
      fig.appendChild(el("span", "sample", "Sample content"));
      var bq = el("blockquote"); bq.appendChild(el("p", null, "“" + v.text + "”")); fig.appendChild(bq);
      var cap = el("figcaption"); cap.appendChild(el("b", null, v.who)); cap.appendChild(el("span", null, v.kind)); fig.appendChild(cap);
      box.appendChild(fig);
    });
  });

  /* quote form: property type swaps the service list and the address label */
  var fm = document.getElementById("quote-form");
  if (fm) {
    var sel = fm.querySelector('select[name="jobtype"]'), addr = document.getElementById("addr-label");
    var biz = (B.services || []).map(function (s) { return s.name; }), home = (B.residential || []).map(function (s) { return s.name; });
    function fill(type) {
      if (!sel) return;
      var keep = sel.value, names = type === "Residential" ? home : biz;
      clear(sel);
      names.concat(["Not sure yet"]).forEach(function (n) { var o = el("option", null, n); o.value = n; sel.appendChild(o); });
      if (names.indexOf(keep) >= 0) sel.value = keep;
      if (addr) addr.textContent = type === "Residential" ? "Home address" : type === "Industrial" ? "Facility address" : "Property address";
    }
    var radios = $$('input[name="ptype"]', fm);
    var want = (location.search.match(/[?&]type=(\w+)/) || [])[1];
    radios.forEach(function (r) {
      if (want && r.value.toLowerCase() === want.toLowerCase()) r.checked = true;
      r.addEventListener("change", function () { if (r.checked) fill(r.value); });
    });
    var on = radios.filter(function (r) { return r.checked; })[0];
    fill(on ? on.value : "Commercial");
    /* v23: inline, specific errors next to each required field */
    var rules = { name: "Enter your name so we know who to call.", phone: "Enter a phone number we can reach you on.", email: "Enter an email address like name@example.com." };
    function check(inp) {
      var k = inp.name, msg = "", v = inp.value.trim();
      if (rules[k]) {
        if (!v) msg = rules[k];
        else if (k === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "That email is missing an @ or a domain. Try name@example.com.";
        else if (k === "phone" && v.replace(/\D/g, "").length < 10) msg = "Phone numbers need at least 10 digits, including the area code.";
      }
      var lab = inp.parentNode, e = lab.querySelector(".err");
      if (msg) {
        if (!e) { e = el("span", "err"); e.id = "err-" + k; lab.appendChild(e); }
        e.textContent = msg; inp.setAttribute("aria-invalid", "true"); inp.setAttribute("aria-describedby", e.id);
      } else {
        if (e) lab.removeChild(e);
        inp.removeAttribute("aria-invalid"); inp.removeAttribute("aria-describedby");
      }
      return !msg;
    }
    $$("input[name=name],input[name=phone],input[name=email]", fm).forEach(function (i) {
      i.addEventListener("blur", function () { check(i); });
      i.addEventListener("input", function () { if (i.getAttribute("aria-invalid")) check(i); });
    });
    fm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var bad = $$("input[name=name],input[name=phone],input[name=email]", fm).filter(function (i) { return !check(i); });
      if (bad.length) { bad[0].focus(); return; }
      var m = document.getElementById("formmsg"); m.hidden = false;
      m.textContent = "Form not connected yet; please use the email address on this page: " + B.email;
      if (m.focus) m.focus();
    });
  }
})();
