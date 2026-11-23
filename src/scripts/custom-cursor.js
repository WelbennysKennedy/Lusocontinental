// Cursor do design system (modelo design_system.html), em versão leve e sem bibliotecas.
// - Só em computador (rato); em ecrãs táteis não é criado.
// - A seta normal do sistema continua visível; o ponto e o anel acompanham-na.
// - Some nos campos de texto para não tapar o cursor de escrita.
// - O ciclo de animação só corre enquanto o anel está a alcançar o rato e pára sozinho,
//   por isso não compete com o vídeo da página inicial.
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (finePointer.matches) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;

  const INTERACTIVE = 'a, button, summary, label, select, [role="button"], .ds-flashlight, .gallery-photo';
  const TEXT_FIELD =
    'input:not([type="radio"]):not([type="checkbox"]):not([type="range"]):not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"]';

  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'ds-cursor-dot';
  ring.className = 'ds-cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);

  const mouse = { x: 0, y: 0 };
  const follow = { x: 0, y: 0 };
  let frame = null;
  let active = false;

  const render = () => {
    const ease = reducedMotion.matches ? 1 : 0.15;
    follow.x += (mouse.x - follow.x) * ease;
    follow.y += (mouse.y - follow.y) * ease;

    dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    ring.style.transform = `translate3d(${follow.x}px, ${follow.y}px, 0)`;

    const settled = Math.abs(mouse.x - follow.x) < 0.1 && Math.abs(mouse.y - follow.y) < 0.1;
    frame = settled ? null : requestAnimationFrame(render);
  };

  document.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      if (!active) {
        follow.x = mouse.x;
        follow.y = mouse.y;
        root.classList.add('ds-cursor-on');
        active = true;
      }

      const target = event.target instanceof Element ? event.target : null;
      root.classList.toggle('ds-cursor-hover', Boolean(target?.closest(INTERACTIVE)));
      root.classList.toggle('ds-cursor-text', Boolean(target?.closest(TEXT_FIELD)));

      if (frame === null) frame = requestAnimationFrame(render);
    },
    { passive: true },
  );

  // Esconde quando o rato sai da janela.
  document.addEventListener('mouseout', (event) => {
    if (event.relatedTarget) return;
    root.classList.remove('ds-cursor-on');
    active = false;
  });
}
