/* site_kit/js/icons.js
   Replaces innerHTML of all [data-icon] elements with inline SVG.
   Usage: <span data-icon="tags"></span> */
(function () {
  var icons = {
    tags: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1" fill="currentColor"/></svg>',
    timeline: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    rss: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/></svg>',
    'lock-closed': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
    'lock-open': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>',
    grid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="17" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="17" y="9" width="6" height="6" rx="1"/><rect x="1" y="17" width="6" height="6" rx="1"/><rect x="9" y="17" width="6" height="6" rx="1"/><rect x="17" y="17" width="6" height="6" rx="1"/></svg>',
    feed: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="1" y="1" width="22" height="6" rx="1"/><rect x="1" y="9" width="22" height="6" rx="1"/><rect x="1" y="17" width="22" height="6" rx="1"/></svg>'
  };

  document.addEventListener('DOMContentLoaded', function () {
    var els = document.querySelectorAll('[data-icon]');
    els.forEach(function (el) {
      var name = el.getAttribute('data-icon');
      if (icons[name]) {
        el.innerHTML = icons[name];
      }
    });
  });
})();
