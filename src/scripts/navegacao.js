(() => {
  const header = document.querySelector('.home-header');
  if (!header) return;
  const toggle = header.querySelector('.home-menu-toggle');
  const nav = header.querySelector('.home-nav');
  const mobile = window.matchMedia('(max-width: 900px)');

  function setOpen(open, restoreFocus = false) {
    header.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    if (restoreFocus) toggle.focus();
  }

  header.classList.add('is-enhanced');
  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    setOpen(false);
    const target = link.hash && document.querySelector(link.hash);
    if (!target) return;
    // Com o menu já fechado, o link fica oculto: a rolagem é feita aqui para não depender dele.
    event.preventDefault();
    history.pushState(null, '', link.hash);
    target.scrollIntoView();
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });
  // No Safari, tocar num link tira o foco sem o dar a ninguém (relatedTarget nulo). Fechar aí
  // esconderia o link antes do clique. Os toques fora do menu são tratados no listener acima.
  header.addEventListener('focusout', (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    const focusInNav = nav.contains(document.activeElement);
    const focusOnToggle = document.activeElement === toggle;
    setOpen(false, mobile.matches && focusInNav);
    if (!mobile.matches && focusOnToggle) nav.querySelector('a').focus();
  });
})();
