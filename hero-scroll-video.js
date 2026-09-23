/* ==========================================================================
   Hero Scroll Video — script
   Cole isto antes do </body> do seu site (ou importe no seu JS principal):
   <script src="hero-scroll-video.js"></script>
   ========================================================================== */
(function () {
  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();

  function init() {
    const video = document.getElementById('hsvVideo');
    const stage = document.getElementById('hsvScrollStage');
    if (!video || !stage) return; // componente não está nesta página

    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const progressBar = document.getElementById('hsvProgressBar');
    const heroContent = document.getElementById('hsvContent');
    const heroDesc = document.getElementById('hsvDesc');
    const scrollHint = document.getElementById('hsvScrollHint');
    const kmGauge = document.getElementById('hsvKmGauge');
    const kmGaugeProgress = document.getElementById('hsvKmGaugeProgress');
    const kmGaugeValue = document.getElementById('hsvKmGaugeValue');

    const KM_GAUGE_MAX = 900;
    const KM_GAUGE_CIRCUMFERENCE = 2 * Math.PI * 90;

    // Janela de visibilidade da descrição: entra (fadeInStart -> fadeInEnd),
    // fica visível até holdEnd e depois some (holdEnd -> fadeOutEnd). Depois
    // disso o vídeo fica "limpo" até o próximo bloco de conteúdo entrar.
    const DESC_FADE_IN_START = 0.15;
    const DESC_FADE_IN_END = 0.40;
    const DESC_HOLD_END = 0.75;
    const DESC_FADE_OUT_END = 0.95;

    function windowOpacity(progress, fadeInStart, fadeInEnd, holdEnd, fadeOutEnd) {
      if (progress < fadeInStart) return 0;
      if (progress < fadeInEnd) return (progress - fadeInStart) / (fadeInEnd - fadeInStart);
      if (progress < holdEnd) return 1;
      if (progress < fadeOutEnd) return 1 - (progress - holdEnd) / (fadeOutEnd - holdEnd);
      return 0;
    }

    let duration = 0;
    let targetTime = 0;
    let currentTime = 0;
    let ticking = false;
    const isMobile = window.matchMedia('(max-width: 780px)').matches;

    function syncVideoDuration() {
      if (!duration && Number.isFinite(video.duration)) duration = video.duration;
      if (!duration) return;

      if (video.currentTime === 0) video.currentTime = 0.001;
      updateScrollTarget();
    }

    video.addEventListener('loadedmetadata', syncVideoDuration);
    video.addEventListener('loadeddata', syncVideoDuration);
    video.addEventListener('canplay', syncVideoDuration);
    video.addEventListener('durationchange', syncVideoDuration);
    syncVideoDuration();

    function updateScrollTarget() {
      if (!duration) return;

      const rect = stage.getBoundingClientRect();
      const scrollable = stage.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      let progress = scrollable > 0 ? scrolled / scrollable : 0;
      progress = Math.min(Math.max(progress, 0), 1);

      targetTime = progress * duration;
      if (progressBar) progressBar.style.width = (progress * 100) + '%';

      // O título some logo nos primeiros 12,5% do scroll...
      const titleOpacity = Math.min(Math.max(1 - progress / 0.125, 0), 1);
      if (heroContent) {
        heroContent.style.opacity = titleOpacity;
        heroContent.style.pointerEvents = titleOpacity > 0.05 ? 'auto' : 'none';
      }
      if (scrollHint) scrollHint.style.opacity = titleOpacity * 0.8;

      // ...a descrição entra em seguida, fica visível por um trecho do
      // scroll e depois some de novo (o vídeo continua sozinho até o
      // próximo bloco de conteúdo entrar).
      if (heroDesc) {
        const descProgress = windowOpacity(progress, DESC_FADE_IN_START, DESC_FADE_IN_END, DESC_HOLD_END, DESC_FADE_OUT_END);
        heroDesc.style.opacity = descProgress;
        heroDesc.style.pointerEvents = descProgress > 0.05 ? 'auto' : 'none';
        heroDesc.style.transform = 'translateY(' + ((1 - descProgress) * 20) + 'px)';
      }

      // Relógio de km: acompanha o progresso do scroll 1:1 (sobe e desce
      // junto, sem suavização) — aparece rápido no início e some perto do
      // fim do scroll-stage, ao entrar na próxima dobra.
      if (kmGauge && kmGaugeProgress && kmGaugeValue) {
        const km = Math.round(progress * KM_GAUGE_MAX);
        kmGaugeValue.textContent = km;
        kmGaugeProgress.style.strokeDashoffset = KM_GAUGE_CIRCUMFERENCE * (1 - progress);

        const gaugeFadeIn = Math.min(progress / 0.03, 1);
        const gaugeFadeOut = Math.min((1 - progress) / 0.06, 1);
        kmGauge.style.opacity = Math.min(gaugeFadeIn, gaugeFadeOut);
      }


    }

    function animate() {
      const diff = targetTime - currentTime;
      if (Math.abs(diff) > 0.0015) {
        currentTime += diff * (isMobile ? 0.22 : 0.4);
        if (!video.seeking) video.currentTime = currentTime;
      } else if (currentTime !== targetTime) {
        currentTime = targetTime;
        if (!video.seeking) video.currentTime = currentTime;
      }
      requestAnimationFrame(animate);
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollTarget();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateScrollTarget);

    requestAnimationFrame(animate);
  }
})();



/* ==========================================================================
   Seção "Cards" — independente do hero. Cada card sobe/aparece (com blur)
   individualmente conforme entra na tela, uma única vez — efeito elegante
   em cascata (sem depender do vídeo/scroll-stage acima).
   ========================================================================== */
(function () {
  document.addEventListener('DOMContentLoaded', initCards);
  if (document.readyState !== 'loading') initCards();

  function initCards() {
    const csCards = Array.from(document.querySelectorAll('.cs-card'));
    if (!csCards.length) return;

    csCards.forEach(function (card, i) {
      card.style.transitionDelay = ((i % 3) * 0.12) + 's';
      // Alterna o lado de entrada (esquerda/direita) a cada card.
      card.style.setProperty('--reveal-x', (i % 2 === 0 ? -1 : 1) * 100 + 'px');
    });

    if ('IntersectionObserver' in window) {
      const csObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            csObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

      csCards.forEach(function (card) { csObserver.observe(card); });
    } else {
      csCards.forEach(function (card) { card.classList.add('is-visible'); });
    }
  }
})();

/* ==========================================================================
   Reveal genérico (.reveal-up) — usado nas seções "Principais diferenciais",
   "Operação por serviço" e "Planeie a sua operação". Sobe + ganha foco
   conforme entra na tela, uma única vez, com atraso em cascata para quem
   está no mesmo grupo (mesmo pai direto).
   ========================================================================== */
(function () {
  document.addEventListener('DOMContentLoaded', initReveal);
  if (document.readyState !== 'loading') initReveal();

  function initReveal() {
    const revealEls = Array.from(document.querySelectorAll('.reveal-up'));
    if (!revealEls.length) return;

    const groupIndex = new Map();
    revealEls.forEach(function (el) {
      const parent = el.parentElement;
      const i = groupIndex.get(parent) || 0;
      el.style.transitionDelay = (i * 0.12) + 's';
      groupIndex.set(parent, i + 1);
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }
})();

/* ==========================================================================
   Seção "Planeie a sua operação" — número de itens ao vivo no slider.
   ========================================================================== */
(function () {
  document.addEventListener('DOMContentLoaded', initFormSlider);
  if (document.readyState !== 'loading') initFormSlider();

  function initFormSlider() {
    const slider = document.getElementById('formItemsSlider');
    const value = document.getElementById('formItemsValue');
    if (!slider || !value) return;

    slider.addEventListener('input', function () {
      value.textContent = slider.value;
    });
  }
})();
