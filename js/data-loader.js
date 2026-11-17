/* Loads every JSON file in /data and stores it on Portfolio.data.
   Add a new file here if you create another JSON data file. */
(function (P) {
  var FILES = {
    profile: 'data/profile.json',
    projects: 'data/projects.json',
    skills: 'data/skills.json',
    experience: 'data/experience.json',
    about: 'data/about.json'
  };

  function fetchJson(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error(path + ' (HTTP ' + res.status + ')');
      return res.json().catch(function (err) {
        throw new Error(path + ' is not valid JSON: ' + err.message);
      });
    });
  }

  P.loadData = function () {
    var keys = Object.keys(FILES);
    return Promise.all(keys.map(function (k) { return fetchJson(FILES[k]); }))
      .then(function (results) {
        keys.forEach(function (k, i) { P.data[k] = results[i]; });
        return P.data;
      });
  };

  /** Shown at the top of the page if the data can't be loaded. */
  P.showLoadError = function (err) {
    var box = document.createElement('div');
    box.className = 'load-error';
    var fromDisk = location.protocol === 'file:';
    box.innerHTML = '<b>Couldn\'t load the portfolio data.</b> ' + P.esc(err.message) +
      (fromDisk ? '<br>Browsers block JSON files when a page is opened straight from disk. Run it through a local server instead (see README).' : '');
    document.body.prepend(box);
  };
})(window.Portfolio);
