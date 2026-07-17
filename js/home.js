(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll('.home-hero, .home-section'));
  var isScrolling = false;

  if (!sections.length || !window.matchMedia('(min-width: 481px)').matches) return;

  function currentSectionIndex() {
    var viewportCenter = window.scrollY + window.innerHeight / 2;
    var nearestIndex = 0;
    var nearestDistance = Infinity;

    sections.forEach(function (section, index) {
      var sectionCenter = section.offsetTop + section.offsetHeight / 2;
      var distance = Math.abs(viewportCenter - sectionCenter);

      if (distance < nearestDistance) {
        nearestIndex = index;
        nearestDistance = distance;
      }
    });

    return nearestIndex;
  }

  window.addEventListener('wheel', function (event) {
    if (isScrolling || !event.deltaY) return;

    var direction = event.deltaY > 0 ? 1 : -1;
    var targetIndex = Math.max(0, Math.min(sections.length - 1, currentSectionIndex() + direction));

    if (targetIndex === currentSectionIndex()) return;

    event.preventDefault();
    isScrolling = true;
    sections[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(function () {
      isScrolling = false;
    }, 750);
  }, { passive: false });
}());
