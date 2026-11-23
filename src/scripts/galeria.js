(() => {
  'use strict';

  const gallery = document.querySelector('.gallery-carousel');
  if (!gallery) return;

  const track = document.getElementById('galleryTrack');
  const slides = Array.from(track.querySelectorAll('.gallery-slide'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = !('IntersectionObserver' in window);
  let interaction = null;
  let ignoreClickUntil = 0;
  let timer;

  function schedule() {
    window.clearTimeout(timer);
    if (reducedMotion.matches || !visible || interaction || document.hidden) return;
    timer = window.setTimeout(() => {
      move(1);
      schedule();
    }, 4500);
  }

  function positions() {
    const limit = Math.max(0, track.scrollWidth - track.clientWidth);
    return slides.map((slide) => Math.min(slide.offsetLeft, limit));
  }

  function move(direction) {
    const limit = Math.max(0, track.scrollWidth - track.clientWidth);
    if (!limit) return;
    const stops = positions();
    const current = track.scrollLeft;
    const position = direction > 0
      ? stops.find((left) => left > current + 2)
      : stops.slice().reverse().find((left) => left < current - 2);
    const wrapped = position === undefined;
    track.scrollTo({
      left: wrapped ? (direction > 0 ? 0 : limit) : position,
      behavior: reducedMotion.matches || wrapped ? 'auto' : 'smooth'
    });
  }

  // Touch uses native scrolling; mouse and pen can drag the photos directly.
  track.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || interaction) return;
    ignoreClickUntil = 0;
    track.scrollTo({ left: track.scrollLeft, behavior: 'auto' });
    interaction = {
      id: event.pointerId,
      touch: event.pointerType === 'touch',
      startX: event.clientX,
      startScroll: track.scrollLeft,
      moved: false
    };
    schedule();
  });

  window.addEventListener('pointermove', (event) => {
    if (!interaction || event.pointerId !== interaction.id || interaction.touch) return;
    const distance = event.clientX - interaction.startX;
    if (!interaction.moved && Math.abs(distance) < 6) return;
    if (!interaction.moved) {
      interaction.moved = true;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    track.scrollLeft = interaction.startScroll - distance;
  }, { passive: false });

  function finishInteraction(event) {
    if (!interaction || (event?.pointerId !== undefined && event.pointerId !== interaction.id)) return;
    const finished = interaction;
    interaction = null;
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture(finished.id)) track.releasePointerCapture(finished.id);
    if (finished.moved) {
      ignoreClickUntil = Date.now() + 300;
      const nearest = positions().reduce((best, left) =>
        Math.abs(left - track.scrollLeft) < Math.abs(best - track.scrollLeft) ? left : best, 0);
      track.scrollTo({ left: nearest, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }
    schedule();
  }

  window.addEventListener('pointerup', finishInteraction);
  window.addEventListener('pointercancel', finishInteraction);
  window.addEventListener('blur', finishInteraction);
  track.addEventListener('lostpointercapture', finishInteraction);
  track.addEventListener('dragstart', (event) => event.preventDefault());
  track.addEventListener('click', (event) => {
    if (Date.now() >= ignoreClickUntil) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  track.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
    schedule();
  });
  // Setas de vidro: andam uma fotografia e reiniciam a passagem automática.
  const prevButton = gallery.querySelector('[data-gallery-prev]');
  const nextButton = gallery.querySelector('[data-gallery-next]');
  prevButton?.addEventListener('click', () => { move(-1); schedule(); });
  nextButton?.addEventListener('click', () => { move(1); schedule(); });

  // Contador, barra de progresso e desvanecer das bordas seguem o scroll.
  const current = gallery.querySelector('[data-gallery-current]');
  const thumb = gallery.querySelector('.gallery-progress-thumb');
  let frame = 0;

  function update() {
    frame = 0;
    const width = track.scrollWidth;
    const limit = Math.max(0, width - track.clientWidth);
    const left = track.scrollLeft;
    gallery.toggleAttribute('data-at-start', left <= 2);
    gallery.toggleAttribute('data-at-end', left >= limit - 2);

    if (thumb && width) {
      thumb.style.width = `${(track.clientWidth / width) * 100}%`;
      thumb.style.left = `${(left / width) * 100}%`;
    }

    if (current) {
      const stops = positions();
      let index = stops.reduce((best, stop, i) =>
        Math.abs(stop - left) < Math.abs(stops[best] - left) ? i : best, 0);
      if (limit && left >= limit - 2) index = slides.length - 1;
      current.textContent = String(index + 1).padStart(2, '0');
    }
  }

  function requestUpdate() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  track.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('load', requestUpdate);
  update();

  track.addEventListener('wheel', schedule, { passive: true });
  track.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', schedule);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      schedule();
    }, { threshold: 0.15 });
    observer.observe(track);
  }

  schedule();
})();
