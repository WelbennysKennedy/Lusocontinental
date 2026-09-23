(() => {
  const background = document.getElementById('cardsBackgroundScene');
  const section = background?.closest('.cs-section, .gallery-map-section');
  if (!section || !background) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scene;
  let loading = false;
  let visible = false;

  function syncPlayback() {
    if (scene) scene.paused = !visible || document.hidden || reducedMotion.matches;
  }
  function fail() {
    section.classList.add('cs-background-unavailable');
  }
  function start() {
    if (typeof window.UnicornStudio?.addScene !== 'function') { fail(); return; }
    window.UnicornStudio.addScene({
      elementId: 'cardsBackgroundScene',
      filePath: 'assets/cards-background.json',
      fps: 24,
      dpi: 1,
      scale: window.matchMedia('(max-width: 780px)').matches ? 0.5 : 0.65,
      interactivity: { mouse: { disableMobile: true } }
    }).then(result => {
      scene = result;
      syncPlayback();
    }).catch(fail);
  }
  function initialize() {
    if (loading || reducedMotion.matches) return;
    loading = true;
    if (typeof window.UnicornStudio?.addScene === 'function') { start(); return; }
    const script = document.createElement('script');
    script.src = 'assets/unicornStudio.umd.js';
    script.async = true;
    script.onload = start;
    script.onerror = fail;
    document.head.appendChild(script);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) initialize();
      syncPlayback();
    });
    observer.observe(background);
  } else {
    visible = true;
    initialize();
  }
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', () => {
    if (visible) initialize();
    syncPlayback();
  });
})();
