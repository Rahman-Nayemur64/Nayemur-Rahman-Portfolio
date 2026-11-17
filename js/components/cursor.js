/* Custom mouse cursor (styles in css/cursor.css): the normal arrow with a purple outline,
   which becomes a pointing hand over clickable things. Mouse and pen only;
   touch screens keep the normal cursor. */
(function (P) {
  var INTERACTIVE = 'a, button, .tab, .copy, .social, summary, [role="button"], label, input, select, textarea';
  var SVG_NS = 'http://www.w3.org/2000/svg';

  // Classic arrow outline; the tip is at (3, 2) in a 24x24 box
  var ARROW = 'M3 2 L3 19 L7.4 14.9 L10.5 21.7 L13.5 20.3 L10.4 13.6 L16.6 13.6 Z';

  // Pointing hand; the fingertip is at (10.5, 1) in a 24x24 box
  var HAND = 'M9 2.5 C9 1.7 9.7 1 10.5 1 C11.3 1 12 1.7 12 2.5 L12 9 L12.6 9 C12.8 8.3 13.5 8 14 8 ' +
    'C14.8 8 15.4 8.4 15.6 9 C15.9 8.6 16.4 8.4 17 8.4 C17.9 8.4 18.5 9 18.7 9.8 C19 9.5 19.5 9.4 20 9.4 ' +
    'C20.9 9.4 21.5 10.1 21.5 11 L21.5 15.5 C21.5 19 19 22 15.5 22 L13 22 C11 22 9.7 21.2 8.6 19.8 ' +
    'L3.8 13.6 C3.3 12.9 3.4 12 4.1 11.5 C4.8 11 5.7 11.1 6.3 11.7 L9 14.5 Z';

  function createShape(className, d) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', className);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '28');
    svg.setAttribute('height', '28');
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
    return svg;
  }

  P.initCursor = function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var root = document.documentElement;
    var body = document.createElement('div');
    body.className = 'cursor-body';
    body.setAttribute('aria-hidden', 'true');
    body.appendChild(createShape('cursor-arrow', ARROW));
    body.appendChild(createShape('cursor-hand', HAND));
    document.body.appendChild(body);

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      root.classList.add('has-cursor');
      body.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
      body.classList.remove('is-away');
    }, { passive: true });

    document.addEventListener('pointerover', function (e) {
      body.classList.toggle('is-hover', !!(e.target.closest && e.target.closest(INTERACTIVE)));
    });
    document.addEventListener('pointerdown', function () { body.classList.add('is-down'); });
    document.addEventListener('pointerup', function () { body.classList.remove('is-down'); });
    root.addEventListener('pointerleave', function () { body.classList.add('is-away'); });
  };
})(window.Portfolio);
