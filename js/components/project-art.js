/* Decorative artwork for project cards (there are no screenshots).
   Each category gets its own motif, drawn as SVG in the accent colour, and the project name
   seeds the random numbers so every card looks different but never changes between visits. */
(function (P) {
  /** Small deterministic random generator seeded from a string. */
  function rng(seedText) {
    var h = 2166136261;
    for (var i = 0; i < seedText.length; i++) { h ^= seedText.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6D2B79F5;
      var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var W = 600, H = 200;
  var svg = function (body) {
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + body + '</svg>';
  };

  /* Machine learning: scatter plot with a fitted curve */
  function scatter(r) {
    var dots = '', path = 'M', a = .3 + r() * .4;
    for (var i = 0; i < 46; i++) {
      var x = 40 + r() * 520, base = H - 30 - (x / W) * 120 * a - Math.sin(x / 90) * 18;
      var y = base + (r() - .5) * 46;
      dots += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (2 + r() * 2.5).toFixed(1) + '" fill="currentColor" opacity="' + (.25 + r() * .5).toFixed(2) + '"/>';
    }
    for (var x2 = 20; x2 <= 580; x2 += 20) {
      path += x2 + ' ' + (H - 30 - (x2 / W) * 120 * a - Math.sin(x2 / 90) * 18).toFixed(1) + ' L';
    }
    return svg(dots + '<path d="' + path.slice(0, -2) + '" fill="none" stroke="#67e8f9" stroke-width="2.5" stroke-linecap="round" opacity=".85"/>');
  }

  /* Analytics / dashboards: bar chart with a trend line */
  function bars(r) {
    var out = '', n = 14, w = 26, gap = (520 - n * w) / (n - 1), pts = [];
    for (var i = 0; i < n; i++) {
      var h = 30 + r() * 70 + i * 4, x = 40 + i * (w + gap), y = H - 24 - h;
      out += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w + '" height="' + h.toFixed(1) + '" rx="5" fill="currentColor" opacity="' + (.18 + i / n * .45).toFixed(2) + '"/>';
      pts.push((x + w / 2).toFixed(1) + ',' + (y - 12).toFixed(1));
    }
    return svg(out + '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#67e8f9" stroke-width="2.5" stroke-linejoin="round" opacity=".85"/>');
  }

  /* Research: network graph */
  function network(r) {
    var nodes = [], out = '';
    for (var i = 0; i < 18; i++) nodes.push([50 + r() * 500, 50 + r() * 130]);
    nodes.forEach(function (a, i) {
      nodes.forEach(function (b, j) {
        if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 150) {
          out += '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="currentColor" stroke-width="1" opacity=".3"/>';
        }
      });
    });
    nodes.forEach(function (n, i) {
      out += '<circle cx="' + n[0].toFixed(1) + '" cy="' + n[1].toFixed(1) + '" r="' + (i % 5 === 0 ? 6 : 3.5) + '" fill="' + (i % 5 === 0 ? '#67e8f9' : 'currentColor') + '" opacity=".8"/>';
    });
    return svg(out);
  }

  /* Robotics & IoT: circuit traces */
  function circuit(r) {
    var out = '';
    for (var i = 0; i < 11; i++) {
      var y = 50 + i * 13 + r() * 6, x = 30 + r() * 80, d = 'M' + x.toFixed(0) + ' ' + y.toFixed(0);
      for (var s = 0; s < 4; s++) {
        x += 60 + r() * 90;
        d += ' H' + x.toFixed(0);
        y += (r() - .5) * 50;
        y = Math.max(40, Math.min(185, y));
        d += ' L' + (x + 20).toFixed(0) + ' ' + y.toFixed(0);
        x += 20;
      }
      out += '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.4" opacity="' + (.2 + r() * .35).toFixed(2) + '"/>' +
        '<circle cx="' + Math.min(x, 580).toFixed(0) + '" cy="' + y.toFixed(0) + '" r="3.5" fill="' + (i % 3 ? 'currentColor' : '#67e8f9') + '" opacity=".8"/>';
    }
    return svg(out);
  }

  /* Python apps: abstract code lines */
  function code(r) {
    var out = '';
    for (var i = 0; i < 9; i++) {
      var y = 52 + i * 17, x = 40 + (r() < .4 ? 28 : 0) + (r() < .2 ? 28 : 0);
      var parts = 1 + Math.floor(r() * 3);
      for (var p = 0; p < parts; p++) {
        var w = 30 + r() * 110;
        out += '<rect x="' + x.toFixed(0) + '" y="' + y + '" width="' + w.toFixed(0) + '" height="7" rx="3.5" fill="' + (r() < .25 ? '#67e8f9' : 'currentColor') + '" opacity="' + (.2 + r() * .45).toFixed(2) + '"/>';
        x += w + 10;
      }
    }
    return svg(out);
  }

  var BY_CATEGORY = {
    'Machine Learning': scatter,
    'Data Analytics': bars,
    'Power BI': bars,
    'Research': network,
    'Robotics & IoT': circuit,
    'Python Apps': code
  };

  P.projectArt = function (project) {
    var draw = BY_CATEGORY[project.category] || scatter;
    return draw(rng(project.name));
  };
})(window.Portfolio);
