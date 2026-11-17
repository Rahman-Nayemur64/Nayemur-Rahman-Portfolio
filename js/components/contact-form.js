/* Contact form. There is no backend: on "Send" it shows Gmail / WhatsApp / mail-app links
   pre-filled with the visitor's message. Email and WhatsApp number come from data/profile.json. */
(function (P) {
  P.initContactForm = function () {
    var $ = P.$;
    var contact = P.data.profile.contact;
    var form = $('#contactForm'), status = $('#status'), opts = $('#sendOpts');
    var gmailLink = $('#mailLink'), mailtoLink = $('#mailtoLink'), waLink = $('#waLink');

    waLink.hidden = !contact.whatsapp;

    function compose() {
      var name = $('#cName').value.trim();
      var email = $('#cEmail').value.trim();
      var msg = $('#cMsg').value.trim();
      var body = msg + '\n\n' + (name || '') + (email ? ' (' + email + ')' : '');
      return { subject: 'Portfolio inquiry' + (name ? ' from ' + name : ''), body: body.trim() };
    }

    function updateLinks() {
      var c = compose();
      var subject = encodeURIComponent(c.subject), body = encodeURIComponent(c.body);
      waLink.href = 'https://wa.me/' + contact.whatsapp + '?text=' + encodeURIComponent(c.subject + '\n\n' + c.body);
      gmailLink.href = 'https://mail.google.com/mail/?view=cm&to=' + contact.email + '&su=' + subject + '&body=' + body;
      mailtoLink.href = 'mailto:' + contact.email + '?subject=' + subject + '&body=' + body;
    }

    updateLinks();
    form.addEventListener('input', updateLinks);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!$('#cMsg').value.trim()) {
        opts.hidden = true;
        status.style.color = 'var(--warn)';
        status.textContent = 'Write a message first.';
        return;
      }
      updateLinks();
      status.textContent = '';
      opts.hidden = false;
    });
  };
})(window.Portfolio);
