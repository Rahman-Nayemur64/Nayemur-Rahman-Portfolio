/* Renders the About section (bio, education, publications) from data/about.json. */
(function (P) {
  P.initAbout = function () {
    var $ = P.$, esc = P.esc;
    var about = P.data.about;

    $('#aboutText').innerHTML = P.list(about.paragraphs, function (p) {
      return '<p>' + P.richText(p) + '</p>';
    });

    $('#educationList').innerHTML = P.list(about.education, function (e) {
      return '<li><span class="when">' + esc(e.when) + '</span><b>' + esc(e.title) + '</b><span>' + esc(e.detail) + '</span></li>';
    });

    $('#publicationList').innerHTML = P.list(about.publications, function (p) {
      return '<a class="pub" href="' + esc(p.url) + '" target="_blank" rel="noopener">' +
        '<span class="pub-ic"><span class="ico">' + P.icon('file') + '</span></span>' +
        '<span>' + esc(p.title) + '<br><small>' + esc(p.venue) + ' <span class="ico">' + P.icon('external') + '</span></small></span>' +
      '</a>';
    });
  };
})(window.Portfolio);
