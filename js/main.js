/* Entry point. Loaded last, after all other scripts.
   The background and static icons start right away; content sections render once the JSON data has loaded. */
(function (P) {
  P.hydrateIcons();
  P.initStarfield();
  P.initCopyButtons();
  P.initGlowCards();
  P.initCursor();

  P.loadData()
    .then(function () {
      P.initHero();
      P.initProfile();
      P.initProjects();
      P.initSkills();
      P.initExperience();
      P.initAbout();
      P.initContactInfo();
      P.initContactForm();
      P.initNav();    // after rendering, so section positions are correct
      P.initReveal(); // last, so it sees every rendered block
    })
    .catch(function (err) {
      console.error(err);
      P.showLoadError(err);
    });
})(window.Portfolio);
