/* site_kit/js/lightbox.js
   Click any matched image to view it fullscreen.
   Configure via data-lightbox-selector on the script tag.
   Default selector: "article img" */
(function () {
  var script = document.currentScript;
  var selector = (script && script.getAttribute('data-lightbox-selector')) || 'article img';

  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<img class="lightbox-img"><button class="lightbox-close">&times;</button>';
  document.body.appendChild(overlay);

  var img = overlay.querySelector('.lightbox-img');
  var closeBtn = overlay.querySelector('.lightbox-close');

  function open(src) {
    img.src = src;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll(selector).forEach(function (el) {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', function () { open(el.src); });
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target === closeBtn) close();
  });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
