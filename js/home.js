(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll('.home-hero, .home-section'));
  var isScrolling = false;

  if (!sections.length || !window.matchMedia('(min-width: 481px)').matches) return;

  var canvas = document.querySelector('.home-services__canvas');

  if (canvas && canvas.getContext) {
    var context = canvas.getContext('2d');
    var particles = [];
    var canvasWidth = 0;
    var canvasHeight = 0;
    var particleCount = 48;

    function createParticle() {
      return {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - .5) * .28,
        vy: (Math.random() - .5) * .28,
        radius: Math.random() * 1.4 + .6
      };
    }

    function resizeCanvas() {
      var rect = canvas.getBoundingClientRect();
      var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      canvas.width = Math.round(canvasWidth * pixelRatio);
      canvas.height = Math.round(canvasHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = Array.from({ length: particleCount }, createParticle);
    }

    function drawCanvas() {
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      particles.forEach(function (particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > canvasWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvasHeight) particle.vy *= -1;
      });

      for (var i = 0; i < particles.length; i += 1) {
        for (var j = i + 1; j < particles.length; j += 1) {
          var xDistance = particles[i].x - particles[j].x;
          var yDistance = particles[i].y - particles[j].y;
          var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

          if (distance < 145) {
            context.beginPath();
            context.strokeStyle = 'rgba(92, 209, 234, ' + ((1 - distance / 145) * .28) + ')';
            context.lineWidth = .7;
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.stroke();
          }
        }

        context.beginPath();
        context.fillStyle = 'rgba(163, 235, 248, .8)';
        context.arc(particles[i].x, particles[i].y, particles[i].radius, 0, Math.PI * 2);
        context.fill();
      }

      window.requestAnimationFrame(drawCanvas);
    }

    resizeCanvas();
    drawCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

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
