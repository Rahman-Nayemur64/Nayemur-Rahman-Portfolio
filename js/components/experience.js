/* Renders the Experience & Achievements timeline from data/experience.json.
   "type" (work, education, research, award) sets the coloured label; "highlight": true makes the entry stand out. */
(function (P) {
  var TYPE_LABELS = { work: 'Work', education: 'Education', research: 'Research', award: 'Award' };

  P.initExperience = function () {
    var esc = P.esc;
    P.$('#xpList').innerHTML = P.list(P.data.experience, function (c) {
      var type = c.type && TYPE_LABELS[c.type] ? '<span class="xp-type ' + esc(c.type) + '">' + TYPE_LABELS[c.type] + '</span>' : '';
      return '<li class="xp-item' + (c.highlight ? ' highlight' : '') + '">' +
        '<div class="xp-logo">' + esc(c.logo) + '</div>' +
        '<div class="xp-body glow-card">' +
          '<div class="xp-mobile-when">' + esc(c.when) + '</div>' +
          '<div class="xp-top"><h3>' + esc(c.name) + '</h3>' + type + '</div>' +
          '<div class="xp-role">' + esc(c.role) + '</div>' +
          '<p>' + esc(c.description) + '</p>' +
        '</div>' +
        '<div class="xp-when">' + esc(c.when) + '</div>' +
      '</li>';
    });
  };
})(window.Portfolio);
