/* Shared helpers. Creates the global `Portfolio` namespace that every other script attaches to. */
window.Portfolio = window.Portfolio || { data: {} };

(function (P) {
  /** Find one element by CSS selector. */
  P.$ = function (selector, root) {
    return (root || document).querySelector(selector);
  };

  /** Escape text before inserting it into HTML (safe for text and attribute values). */
  P.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  /** Escape text, then turn **double asterisks** into <strong> bold text. */
  P.richText = function (s) {
    return P.esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  };

  /** Join an array through a template function. */
  P.list = function (items, fn) {
    return (items || []).map(fn).join('');
  };

  /** Build a row of filter tab buttons. `key` is the data-attribute name used to store each value. */
  P.renderTabs = function (container, values, current, key) {
    container.innerHTML = P.list(values, function (v) {
      return '<button class="tab" role="tab" aria-selected="' + (v === current) + '" data-' + key + '="' + P.esc(v) + '">' + P.esc(v) + '</button>';
    });
  };
})(window.Portfolio);
