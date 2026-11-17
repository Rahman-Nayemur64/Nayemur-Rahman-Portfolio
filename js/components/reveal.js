/* Fades blocks in as they scroll into view. Skipped for visitors who prefer reduced motion. */
(function (P) {
  var SELECTOR = '.stats-strip, .sec-head, .tabs, .proj, .skill-card, .xp-item, .profile-card, .about .card, .contact-panel';

  P.initReveal = function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('in');
        observer.unobserve(el);
        // Once faded in, hand control back to the element's normal hover transitions
        setTimeout(function () {
          el.classList.remove('reveal', 'in');
          el.style.transitionDelay = '';
        }, 900);
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    [].forEach.call(document.querySelectorAll(SELECTOR), function (el, i) {
      // Things already on screen stay visible; only below-the-fold blocks animate
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 3) * 70 + 'ms'; // small stagger for cards in a row
      observer.observe(el);
    });
  };
})(window.Portfolio);
