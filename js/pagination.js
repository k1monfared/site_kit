/* site_kit/js/pagination.js
   Infinite scroll pagination with configurable data attributes.
   Configure via data attributes on the script tag:
     data-page-size     (default: 10)
     data-list-selector (default: ".post-list")
     data-item-selector (default: "li") */
(function () {
  var script = document.currentScript;
  var PAGE_SIZE = parseInt((script && script.getAttribute('data-page-size')) || '10', 10);
  var listSel = (script && script.getAttribute('data-list-selector')) || '.post-list';
  var itemSel = (script && script.getAttribute('data-item-selector')) || 'li';

  document.addEventListener('DOMContentLoaded', function () {
    var list = document.querySelector(listSel);
    if (!list) return;
    var items = list.querySelectorAll(itemSel);
    var shown = PAGE_SIZE;
    if (items.length <= PAGE_SIZE) return;

    function showMore() {
      var end = Math.min(shown + PAGE_SIZE, items.length);
      for (var i = shown; i < end; i++) {
        items[i].removeAttribute('hidden');
      }
      shown = end;
      if (shown >= items.length && sentinel) {
        sentinel.remove();
        sentinel = null;
      }
    }

    var sentinel = document.createElement('div');
    sentinel.className = 'scroll-sentinel';
    list.after(sentinel);

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) showMore();
      }, { rootMargin: '200px' });
      observer.observe(sentinel);
    } else {
      for (var i = PAGE_SIZE; i < items.length; i++) {
        items[i].removeAttribute('hidden');
      }
    }
  });
})();
