/* Moves the soft highlight on .glow-card elements to follow the mouse (CSS in components.css). */
(function (P) {
  P.initGlowCards = function () {
    if (!window.matchMedia('(hover: hover)').matches) return; // skip on touch screens

    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.glow-card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  };
})(window.Portfolio);
