/* site_kit/js/theme.js
   Unified theme toggle. Dark mode is the default.
   Runs IIFE immediately at parse time to prevent flash. */
(function () {
  var saved = localStorage.getItem('theme');
  var theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);

  function updateIcon(btn, current) {
    var icon = btn.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = current === 'dark' ? '\u263c' : '\u263e';
    } else {
      btn.textContent = current === 'dark' ? '\u263c' : '\u263e';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    updateIcon(btn, theme);
    btn.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateIcon(btn, theme);
    });
  });

})();
