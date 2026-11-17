/* Renders the project filter tabs and project cards from data/projects.json.
   Projects with "featured": true get a wide card. */
(function (P) {
  P.initProjects = function () {
    var $ = P.$, esc = P.esc;
    var data = P.data.projects;
    var github = P.data.profile.contact.github;
    var tabs = $('#projTabs'), grid = $('#projGrid');
    var current = 'All';

    function a(url, label, icon, main) {
      return '<a' + (main ? ' class="main"' : '') + ' href="' + esc(url) + '" target="_blank" rel="noopener">' +
        '<span class="ico">' + P.icon(icon) + '</span>' + esc(label) + '</a>';
    }

    function linksFor(p) {
      if (p.demo) return a(p.demo, 'Live demo', 'play', true) + a(p.repo || github, 'Code', 'code');
      if (p.link) return a(p.link.url, p.link.label, 'file', true);
      return a(p.repo || github, p.repo ? 'View on GitHub' : 'GitHub', 'code');
    }

    function card(p) {
      return '<article class="proj glow-card' + (p.featured ? ' feature' : '') + '">' +
        '<div class="proj-art">' + P.projectArt(p) +
          '<div class="badges"><span class="badge">' + esc(p.category) + '</span>' +
          (p.demo ? '<span class="badge live"><i class="dot-live"></i>Live</span>' : '') + '</div>' +
        '</div>' +
        '<div class="proj-body">' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<ul>' + P.list(p.points, function (x) { return '<li><span>' + esc(x) + '</span></li>'; }) + '</ul>' +
          '<div class="chips">' + P.list(p.tags, function (t) { return '<span class="chip">' + esc(t) + '</span>'; }) + '</div>' +
          '<div class="proj-links">' + linksFor(p) + '</div>' +
        '</div>' +
      '</article>';
    }

    function render() {
      P.renderTabs(tabs, data.categories, current, 'c');
      var items = data.items.filter(function (p) { return current === 'All' || p.category === current; });
      grid.innerHTML = P.list(items, card);
    }

    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('.tab');
      if (!b) return;
      current = b.dataset.c;
      render();
    });

    render();
  };
})(window.Portfolio);
