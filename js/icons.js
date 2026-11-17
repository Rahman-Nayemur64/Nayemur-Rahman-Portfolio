/* Small line icons (24×24, drawn with the current text colour).
   Use P.icon('name') in JS, or <span class="ico" data-icon="name"></span> in HTML. */
(function (P) {
  var PATHS = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    external: '<path d="M7 17 17 7M8 7h9v9"/>',
    download: '<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18h2"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.2a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.6"/>',
    chat: '<path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.1A8.5 8.5 0 1 1 20.5 11.5z"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5z"/>',
    code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>'
  };

  P.icon = function (name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (PATHS[name] || '') + '</svg>';
  };

  /** Fill every empty <span class="ico" data-icon="..."> inside `root` with its SVG. */
  P.hydrateIcons = function (root) {
    [].forEach.call((root || document).querySelectorAll('.ico[data-icon]'), function (el) {
      if (!el.firstChild) el.innerHTML = P.icon(el.getAttribute('data-icon'));
    });
  };

  /** Brand logos for social links, from the Devicon font. */
  P.brand = {
    github: '<i class="devicon-github-original" aria-hidden="true"></i>',
    linkedin: '<i class="devicon-linkedin-plain" aria-hidden="true"></i>'
  };
})(window.Portfolio);
