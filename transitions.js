// Page transition — fade out on navigate, fade in on load (CSS handles the in)
(function () {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (
      !href ||
      href.charAt(0) === '#' ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      href.startsWith('http') ||
      href.startsWith('//') ||
      link.target === '_blank'
    ) return;

    e.preventDefault();
    var dest = href;
    document.body.classList.add('page-exit');
    setTimeout(function () {
      window.location.href = dest;
    }, 220);
  });
})();
