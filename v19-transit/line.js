/* Slides the train along the spine as the page scrolls. */
(function () {
  var spine = document.querySelector(".spine"), train = document.querySelector(".train");
  if (!spine || !train) return;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function upd() {
    if (still) { train.style.transform = "translateY(0)"; return; }
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    train.style.transform = "translateY(" + Math.round(p * (spine.offsetHeight - train.offsetHeight)) + "px)";
  }
  addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); addEventListener("load", upd); upd();
})();
