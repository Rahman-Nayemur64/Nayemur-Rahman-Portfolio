/* Renders the contact detail rows and footer links from the "contact" block of data/profile.json. */
(function (P) {
  function row(iconHtml, label, valueHtml, copyValue) {
    return '<div class="crow"><span class="ic">' + iconHtml + '</span>' +
      '<div><small>' + P.esc(label) + '</small>' + valueHtml + '</div>' +
      (copyValue ? '<button class="copy" type="button" data-copy="' + P.esc(copyValue) + '"><span class="ico">' + P.icon('copy') + '</span><span class="copy-label">Copy</span></button>' : '') +
    '</div>';
  }

  function linkVal(url, label, external) {
    return '<a class="val" href="' + P.esc(url) + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' + P.esc(label) + '</a>';
  }

  function textVal(text) {
    return '<span class="val">' + P.esc(text) + '</span>';
  }

  var ico = function (name) { return '<span class="ico">' + P.icon(name) + '</span>'; };

  P.initContactInfo = function () {
    var c = P.data.profile.contact, esc = P.esc;

    P.$('#contactInfo').innerHTML =
      (c.email ? row(ico('mail'), 'Email', linkVal('mailto:' + c.email, c.email), c.email) : '') +
      (c.phone ? row(ico('phone'), 'Phone', textVal(c.phone), c.phone) : '') +
      (c.location ? row(ico('pin'), 'Location', textVal(c.location)) : '') +
      (c.github ? row(P.brand.github, 'GitHub', linkVal(c.github, c.githubLabel || c.github, true)) : '') +
      (c.linkedin ? row(P.brand.linkedin, 'LinkedIn', linkVal(c.linkedin, c.linkedinLabel || c.linkedin, true)) : '');

    P.$('#footerText').textContent = P.data.profile.footer;
    P.$('#footerLinks').innerHTML =
      (c.github ? '<a href="' + esc(c.github) + '" target="_blank" rel="noopener">' + P.brand.github + 'GitHub</a>' : '') +
      (c.linkedin ? '<a href="' + esc(c.linkedin) + '" target="_blank" rel="noopener">' + P.brand.linkedin + 'LinkedIn</a>' : '') +
      '<a href="#top">Back to top ↑</a>';
  };
})(window.Portfolio);
