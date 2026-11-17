/* "Copy" buttons next to email/phone. Any button with class .copy and a data-copy value works. */
(function (P) {
  function copyText(text, done) {
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      done(ok);
    };
    try {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } catch (e) {
      fallback();
    }
  }

  P.initCopyButtons = function () {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('.copy');
      if (!b) return;
      copyText(b.dataset.copy, function (ok) {
        var label = b.querySelector('.copy-label') || b;
        var icon = b.querySelector('.ico');
        label.textContent = ok ? 'Copied' : 'Select text';
        if (icon && ok) icon.innerHTML = P.icon('check');
        setTimeout(function () {
          label.textContent = 'Copy';
          if (icon) icon.innerHTML = P.icon('copy');
        }, 1500);
      });
    });
  };
})(window.Portfolio);
