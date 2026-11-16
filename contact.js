/* Contact-us form injected on EVERY page of both sites (loaded by megabar.js). No per-page edits.
   POST JSON {site, page, name, contact, message, website} to API_BASE + "/contact". Scoped classes: cu-. */
(function (root) {
  var API_BASE = "https://oracle-arm.tail0eeaa5.ts.net/pizza";
  var LIM = { name: 80, contact: 120, message: 2000 };
  function detectSite(path) { return /\/cleanup(\/|$)/.test(path || "") ? "cleanup" : "pizza"; }
  function buildPayload(path, v) {
    return {
      site: detectSite(path), page: path,
      name: String(v.name || "").trim().slice(0, LIM.name),
      contact: String(v.contact || "").trim().slice(0, LIM.contact),
      message: String(v.message || "").trim().slice(0, LIM.message),
      website: String(v.website || "")
    };
  }
  function validate(p) { return !!(p.name && p.contact && p.message); }
  root.__contactUtils = { API_BASE: API_BASE, LIM: LIM, detectSite: detectSite, buildPayload: buildPayload, validate: validate };
  if (typeof document === "undefined") return;
  if (window.__contactjs) return; window.__contactjs = true;

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in (attrs || {})) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
  }
  function phone() {
    var o = window.SHOP || window.BIZ; return o && o.phone ? String(o.phone) : "";
  }
  function build() {
    if (document.getElementById("contact-us")) return;
    var st = el("style");
    st.textContent =
      "#contact-us{box-sizing:border-box;max-width:640px;margin:32px auto;padding:0 14px;font-family:inherit;font-size:16px;line-height:1.4;color:#111}" +
      "#contact-us *{box-sizing:border-box;font-family:inherit}" +
      ".cu-card{background:#fff;color:#111;border:2px solid #111;border-radius:10px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.25)}" +
      ".cu-card h2{margin:0 0 10px;font-size:22px;color:#111;background:none;text-transform:none;letter-spacing:0}" +
      ".cu-card label{display:block;margin:10px 0 4px;font-weight:700;color:#111}" +
      ".cu-card input[type=text],.cu-card textarea{display:block;width:100%;max-width:100%;padding:9px;font-size:16px;color:#111;background:#fff;border:2px solid #444;border-radius:6px}" +
      ".cu-card textarea{min-height:110px;resize:vertical}" +
      ".cu-card input:focus-visible,.cu-card textarea:focus-visible,.cu-btn:focus-visible,#mega-bar a.cu-link:focus-visible{outline:3px solid #0057d9;outline-offset:2px}" +
      ".cu-count{font-size:13px;color:#333;text-align:right;margin-top:2px}" +
      ".cu-btn{margin-top:12px;min-height:44px;padding:0 20px;font-size:16px;font-weight:700;color:#fff;background:#0b3d91;border:2px solid #0b3d91;border-radius:8px;cursor:pointer}" +
      ".cu-btn:disabled{opacity:.6;cursor:wait}" +
      ".cu-toggle{background:#fff;color:#111;border-color:#111;margin-top:0}" +
      ".cu-status{margin-top:10px;min-height:1.4em;font-weight:700;color:#111}" +
      ".cu-hp{position:absolute!important;left:-10000px;width:1px;height:1px;overflow:hidden}" +
      ".cu-hidden{display:none}" +
      "@media(prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}";
    document.head.appendChild(st);

    var sec = el("section", { id: "contact-us", "aria-labelledby": "cu-h" });
    var card = el("div", { "class": "cu-card", id: "cu-card" });
    card.appendChild(el("h2", { id: "cu-h" }, "Contact us"));
    var form = el("form", { novalidate: "novalidate" });
    function field(id, label, max, area) {
      form.appendChild(el("label", { "for": id }, label));
      var i = area ? el("textarea", { id: id, name: id, maxlength: max, required: "required" })
                   : el("input", { id: id, name: id, type: "text", maxlength: max, required: "required" });
      form.appendChild(i); return i;
    }
    var fn = field("cu-name", "Your name", LIM.name);
    fn.setAttribute("autocomplete", "name");
    var fc = field("cu-contact", "Email or phone", LIM.contact);
    fc.setAttribute("autocomplete", "email");
    var fm = field("cu-message", "Message", LIM.message, true);
    var count = el("div", { "class": "cu-count", "aria-hidden": "true" }, "0 / " + LIM.message);
    form.appendChild(count);
    var hpw = el("div", { "class": "cu-hp", "aria-hidden": "true" });
    var hp = el("input", { type: "text", name: "website", tabindex: "-1", autocomplete: "off" });
    hpw.appendChild(hp); form.appendChild(hpw);
    var btn = el("button", { type: "submit", "class": "cu-btn" }, "Send message");
    form.appendChild(btn);
    var status = el("div", { "class": "cu-status", role: "status", "aria-live": "polite" });
    form.appendChild(status);
    card.appendChild(form);
    sec.appendChild(card);

    fm.addEventListener("input", function () { count.textContent = fm.value.length + " / " + LIM.message; });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var p = buildPayload(location.pathname, { name: fn.value, contact: fc.value, message: fm.value, website: hp.value });
      if (!validate(p)) { status.textContent = "Please fill in your name, email or phone, and a message."; return; }
      btn.disabled = true; status.textContent = "Sending...";
      var ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
      var ph = phone();
      var fail = function () {
        status.textContent = "Could not send. Please call or email us instead." + (ph ? " " + ph : "");
      };
      fetch(API_BASE + "/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p), signal: ctl ? ctl.signal : undefined
      }).then(function (r) {
        if (r.status === 200) { status.textContent = "Thanks, we got your message and will reply soon."; form.reset(); count.textContent = "0 / " + LIM.message; }
        else if (r.status === 429) { status.textContent = "Too many messages, please try again later or call us." + (ph ? " " + ph : ""); }
        else fail();
      }).catch(fail).then(function () { clearTimeout(timer); btn.disabled = false; });
    });

    /* quote pages: collapse behind a button to avoid two big forms */
    var tg = null;
    if (/\/quote\.html$/.test(location.pathname)) {
      card.classList.add("cu-hidden");
      tg = el("button", { type: "button", "class": "cu-btn cu-toggle", "aria-expanded": "false", "aria-controls": "cu-card" }, "Questions? Contact us");
      tg.addEventListener("click", function () {
        var open = card.classList.toggle("cu-hidden") === false;
        tg.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) fn.focus();
      });
      sec.insertBefore(tg, card);
    }

    var main = document.querySelector("main");
    var foot = document.querySelector("footer");
    if (main) main.appendChild(sec);
    else if (foot && foot.parentNode) foot.parentNode.insertBefore(sec, foot);
    else document.body.appendChild(sec);

    var bar = document.getElementById("mega-bar");
    if (bar && !bar.querySelector(".cu-link")) {
      var a = el("a", { href: "#contact-us", "class": "cu-link" }, "Contact us");
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (tg && card.classList.contains("cu-hidden")) tg.click();
        sec.scrollIntoView();
        (tg && card.classList.contains("cu-hidden") ? tg : fn).focus();
      });
      bar.appendChild(a);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})(typeof window !== "undefined" ? window : globalThis);
