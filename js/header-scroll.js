/* -----------------------------------------------------------------------
 * En-tête qui s'intègre à l'image de fond au repos, puis devient un bandeau
 * plat (fond uni + ombre) au défilement, avec une transition fluide gérée
 * en CSS (.app-header.is-scrolled). Script autonome : n'interagit avec
 * aucune autre fonction de l'application.
 * -------------------------------------------------------------------- */
(function () {
  var header = document.querySelector(".app-header");
  if (!header) return;

  var THRESHOLD = 12;
  var ticking = false;

  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
