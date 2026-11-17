/* Animated background: twinkling star field with a slow-spinning wireframe icosahedron.
   Respects the visitor's "reduce motion" setting (draws one still frame instead). */
(function (P) {
  P.initStarfield = function () {
    var canvas = P.$('#stars'), ctx = canvas.getContext('2d');
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var stars = [];

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(W * H / 9000);
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + .2, a: Math.random() * .7 + .2, p: Math.random() * 6.28 });
      }
    }

    /* Icosahedron: 12 vertices from the golden ratio; edges are vertex pairs at distance 2. */
    var phi = (1 + Math.sqrt(5)) / 2, V = [], E = [];
    [-1, 1].forEach(function (a) { [-phi, phi].forEach(function (b) { V.push([0, a, b], [a, b, 0], [b, 0, a]); }); });
    for (var i = 0; i < V.length; i++) {
      for (var j = i + 1; j < V.length; j++) {
        var d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]);
        if (Math.abs(d - 2) < .01) E.push([i, j]);
      }
    }

    function drawPoly(t) {
      // Shape sits top-right of the hero and drifts up as the page scrolls
      var s = Math.min(W, 900) * .07 + 26, ox = W > 960 ? W * .9 : W * .84, oy = (W > 960 ? 150 : 110) - window.scrollY * .7;
      var ay = t * .00022, ax = t * .00014;
      var cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      var pts = V.map(function (v) {
        var x = v[0] * cy + v[2] * sy, z = -v[0] * sy + v[2] * cy, y = v[1] * cx - z * sx;
        return [ox + x * s, oy + y * s];
      });
      ctx.strokeStyle = 'rgba(184,174,255,.32)'; ctx.lineWidth = 1; ctx.beginPath();
      E.forEach(function (e) { ctx.moveTo(pts[e[0]][0], pts[e[0]][1]); ctx.lineTo(pts[e[1]][0], pts[e[1]][1]); });
      ctx.stroke();
      ctx.fillStyle = 'rgba(236,236,244,.8)';
      pts.forEach(function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], 1.6, 0, 6.28); ctx.fill(); });
    }

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      var scroll = window.scrollY * .15;
      stars.forEach(function (s) {
        var twinkle = reduce ? 1 : .65 + .35 * Math.sin(t * .001 + s.p);
        ctx.globalAlpha = s.a * twinkle;
        ctx.fillStyle = '#fff';
        var y = ((s.y - scroll * s.r) % H + H) % H;
        ctx.beginPath(); ctx.arc(s.x, y, s.r, 0, 6.28); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (window.scrollY < H * 1.2) drawPoly(t);
      if (!reduce) requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', function () { resize(); if (reduce) frame(0); });
    frame(0);
    if (!reduce) requestAnimationFrame(frame);
  };
})(window.Portfolio);
