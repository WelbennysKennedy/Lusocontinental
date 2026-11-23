// Superfície "flashlight" do design system: o brilho dos cards segue o cursor.
// Só em aparelhos com rato; em ecrãs táteis o efeito fica desligado.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener(
    'pointermove',
    (event) => {
      const card = event.target instanceof Element ? event.target.closest('.ds-flashlight') : null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    },
    { passive: true },
  );
}
