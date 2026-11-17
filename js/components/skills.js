/* Renders the skills bento grid from data/skills.json: one card per group.
   A skill listed in "icons" shows that Devicon logo (https://devicon.dev); others show their initials.
   Groups with 7 or more skills get a wider card. */
(function (P) {
  /** Two-letter icon text: initials for multi-word names ("Power BI" -> "PB"), else first two letters. */
  function abbreviate(name) {
    var words = name.split(/\s+/);
    return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
  }

  P.initSkills = function () {
    var esc = P.esc;
    var groups = P.data.skills.groups;
    var icons = P.data.skills.icons || {};

    function iconFor(name) {
      return icons[name]
        ? '<span class="ic logo"><i class="' + esc(icons[name]) + '" aria-hidden="true"></i></span>'
        : '<span class="ic">' + esc(abbreviate(name)) + '</span>';
    }

    P.$('#skillGrid').innerHTML = P.list(Object.keys(groups), function (g) {
      var list = groups[g];
      return '<div class="card skill-card glow-card' + (list.length >= 7 ? ' wide' : '') + '">' +
        '<div class="skill-card-head"><h3>' + esc(g) + '</h3><span class="count">' + list.length + ' skills</span></div>' +
        '<div class="skill-list">' + P.list(list, function (n) {
          return '<span class="skill">' + iconFor(n) + esc(n) + '</span>';
        }) + '</div>' +
      '</div>';
    });
  };
})(window.Portfolio);
