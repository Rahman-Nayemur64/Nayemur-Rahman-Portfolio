/* Navigation: mobile menu, active-link highlighting, nav background on scroll, and the scroll progress bar. */
(function (P) {
  P.initNav = function () {
    var $ = P.$;
    var header = $('header.nav'), list = $('#navList'), menuBtn = $('#menuBtn'), progress = $('#scrollProgress');

    function setMenu(open) {
      list.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    menuBtn.addEventListener('click', function () { setMenu(!list.classList.contains('open')); });
    list.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

    // Only in-page section links (href="#something") take part in highlighting
    var links = [].slice.call(list.querySelectorAll('a[href^="#"]')).filter(function (a) {
      return a.getAttribute('href').length > 1;
    });
    var sections = links.map(function (a) { return $(a.getAttribute('href')); });

    function onScroll() {
      var y = window.scrollY, active = -1;
      sections.forEach(function (s, i) { if (s && s.offsetTop <= y + 140) active = i; });
      links.forEach(function (a, i) { a.classList.toggle('on', i === active); });

      header.classList.toggle('scrolled', y > 20);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  };
})(window.Portfolio);
