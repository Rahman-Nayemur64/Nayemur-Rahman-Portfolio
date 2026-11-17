/* Profile card in the About section and every "Download CV" link (elements with class .js-cv).
   Paths come from "photo" and "cv" in data/profile.json. */
(function (P) {
  P.initProfile = function () {
    var $ = P.$, profile = P.data.profile;

    // CV links: hide them all if no CV file is set
    [].forEach.call(document.querySelectorAll('.js-cv'), function (a) {
      if (profile.cv) {
        a.href = profile.cv;
        a.setAttribute('download', profile.cv.split('/').pop());
      } else {
        (a.closest('li') || a).hidden = true;
      }
    });

    // Profile card
    var photo = $('#profilePhoto');
    if (profile.photo) {
      photo.src = profile.photo;
      photo.alt = 'Photo of ' + profile.name;
    } else {
      photo.closest('.avatar-ring').hidden = true;
    }
    $('#aboutName').textContent = profile.name;
    $('#aboutHeadline').textContent = profile.headline || '';
    $('#aboutLocation').textContent = profile.contact.location || '';
    $('#aboutSocial').innerHTML = P.socialButtons();
  };
})(window.Portfolio);
