/* site_kit/js/icons.js
   Replaces innerHTML of all [data-icon] elements with inline SVG.
   Usage: <span data-icon="tags"></span>
   All icons stroke currentColor, 18x18, line-joined/capped round for
   consistency across the family. */
(function () {
  var icons = {
    tags:         '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1" fill="currentColor"/></svg>',
    timeline:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    rss:          '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/></svg>',
    'lock-closed':'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
    'lock-open':  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>',
    grid:         '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="17" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="17" y="9" width="6" height="6" rx="1"/><rect x="1" y="17" width="6" height="6" rx="1"/><rect x="9" y="17" width="6" height="6" rx="1"/><rect x="17" y="17" width="6" height="6" rx="1"/></svg>',
    feed:         '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="1" y="1" width="22" height="6" rx="1"/><rect x="1" y="9" width="22" height="6" rx="1"/><rect x="1" y="17" width="22" height="6" rx="1"/></svg>',
    'sidebar-open':  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/><polyline points="13 10 16 12 13 14"/></svg>',
    'sidebar-close': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/><polyline points="16 10 13 12 16 14"/></svg>',
    menu:         '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    x:            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  };

  function render(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
      var name = el.getAttribute('data-icon');
      if (icons[name] && !el.dataset.iconRendered) {
        el.innerHTML = icons[name];
        el.dataset.iconRendered = '1';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () { render(); });
  // Expose for apps that mount content after DOMContentLoaded (React, Vue, etc.).
  window.siteKitRenderIcons = render;
})();
