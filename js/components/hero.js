/* Fills the nav logo, hero intro, social buttons, terminal card, stats strip and tools marquee
   from data/profile.json (and logos from data/skills.json). */
(function (P) {
  function terminalText(t) {
    var esc = P.esc;
    var prompt = function (cmd) { return '<span class="p">$</span> ' + cmd + '\n'; };
    var keys = Object.keys(t.profile || {});
    var width = Math.max.apply(null, keys.map(function (k) { return k.length; }).concat([0])) + 2;
    var pad = function (s, n) { return s + new Array(Math.max(n - s.length, 1) + 1).join(' '); };
    var folderWidth = Math.max.apply(null, (t.projects || []).map(function (p) { return p.folder.length; }).concat([0])) + 3;

    return prompt('whoami') +
      '<span class="v">' + esc(t.whoami) + '</span>\n' +
      prompt('cat profile.yml') +
      P.list(keys, function (k) {
        return '<span class="k">' + esc(pad(k + ':', width)) + '</span>' + esc(t.profile[k]) + '\n';
      }) +
      prompt('ls -la skills/') +
      P.list(t.skillRows, function (row) { return 'drwxr-xr-x  ' + esc(row) + '\n'; }) +
      prompt('ls projects/') +
      P.list(t.projects, function (p) {
        return p.note
          ? '<span class="v">' + esc(pad(p.folder, folderWidth)) + '</span><span class="k"># ' + esc(p.note) + '</span>\n'
          : esc(p.folder) + '\n';
      }) +
      '<span class="p">$</span> <span class="cursor"></span>';
  }

  /** Reveal the terminal one line at a time, pausing a little longer after each "$ command". */
  function typeTerminal(pre, html) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pre.innerHTML = html;
    if (reduce) return;

    pre.style.minHeight = pre.offsetHeight + 'px'; // keep the card from growing while typing
    var lines = html.split('\n'), shown = 0;

    (function step() {
      shown++;
      if (shown >= lines.length) { pre.innerHTML = html; return; }
      pre.innerHTML = lines.slice(0, shown).join('\n') + '\n<span class="cursor"></span>';
      var isCommand = lines[shown].indexOf('<span class="p">$') === 0;
      setTimeout(step, isCommand ? 450 : 90);
    })();
  }

  /** Social icon buttons (GitHub, LinkedIn, email) used in the hero and the About profile card. */
  P.socialButtons = function () {
    var c = P.data.profile.contact, esc = P.esc;
    var btn = function (href, label, inner, external) {
      return '<a class="social" href="' + esc(href) + '" aria-label="' + esc(label) + '" title="' + esc(label) + '"' +
        (external ? ' target="_blank" rel="noopener"' : '') + '>' + inner + '</a>';
    };
    return (c.github ? btn(c.github, 'GitHub', P.brand.github, true) : '') +
      (c.linkedin ? btn(c.linkedin, 'LinkedIn', P.brand.linkedin, true) : '') +
      (c.email ? btn('mailto:' + c.email, 'Email', '<span class="ico">' + P.icon('mail') + '</span>') : '') +
      (c.whatsapp ? btn('https://wa.me/' + c.whatsapp, 'WhatsApp', '<span class="ico">' + P.icon('chat') + '</span>', true) : '');
  };

  P.initHero = function () {
    var $ = P.$, esc = P.esc;
    var profile = P.data.profile, hero = profile.hero;
    var icons = (P.data.skills && P.data.skills.icons) || {};

    document.title = profile.pageTitle || profile.name;
    $('#logoName').textContent = profile.logo;
    $('#footerLogo').textContent = profile.logo;
    $('#heroStatus').textContent = hero.status;
    $('#heroName').textContent = profile.name;
    $('#heroTitle').innerHTML = esc(hero.titleLine1) + '<span>' + esc(hero.titleLine2) + '</span>';
    $('#heroIntro').textContent = hero.intro;
    $('#heroSocial').innerHTML = P.socialButtons();
    $('#termPrompt').textContent = profile.terminal.prompt;
    typeTerminal($('#termBody'), terminalText(profile.terminal));

    // Stats strip
    $('#heroStats').innerHTML = P.list(profile.stats, function (s) {
      return '<div class="stat"><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></div>';
    });

    buildMarquee($('#heroTools'), hero.coreTools, icons);
  };

  /* Tools marquee. One "group" holds the tool list, repeated until it is wider than the screen;
     the track holds two copies of that group and the CSS animation slides it left by exactly one group,
     so when it restarts the picture is identical and the loop looks endless. */
  function buildMarquee(track, tools, icons) {
    var esc = P.esc;
    var items = P.list(tools, function (t) {
      var logo = icons[t] ? '<i class="' + esc(icons[t]) + '" aria-hidden="true"></i>' : '<span class="mi">' + esc(t.slice(0, 2).toUpperCase()) + '</span>';
      return '<span class="marquee-item">' + logo + esc(t) + '</span>';
    });

    function render() {
      track.innerHTML = '<div class="marquee-group">' + items + '</div>';
      var group = track.firstChild;
      var oneSet = group.scrollWidth || 1;
      var copies = Math.max(1, Math.ceil(window.innerWidth / oneSet));
      group.innerHTML = new Array(copies + 1).join(items);
      // Keep the speed the same however long the group is (about 40px per second)
      track.style.setProperty('--marquee-duration', Math.max(group.scrollWidth / 40, 10).toFixed(1) + 's');
      track.insertAdjacentHTML('beforeend', group.outerHTML.replace('class="marquee-group"', 'class="marquee-group" aria-hidden="true"'));
    }

    render();
    var lastWidth = window.innerWidth, timer;
    window.addEventListener('resize', function () {
      if (window.innerWidth <= lastWidth) return; // only needs more copies when the screen gets wider
      lastWidth = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(render, 200);
    });
  }
})(window.Portfolio);
