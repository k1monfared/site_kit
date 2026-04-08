/* site_kit/js/theme.js
   Unified theme toggle. Dark mode is the default.
   Runs IIFE immediately at parse time to prevent flash. */
(function () {
  var saved = localStorage.getItem('theme');
  var theme;
  if (saved) {
    theme = saved;
  } else if (matchMedia('(prefers-color-scheme: light)').matches) {
    theme = 'light';
  } else {
    theme = 'dark';
  }
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

  /* Respond to OS-level preference changes when no saved preference exists */
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
    if (localStorage.getItem('theme')) return;
    theme = e.matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) updateIcon(btn, theme);
  });
})();
