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
    if (event.target.closest('a')) setOpen(false, mobile.matches);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });
  header.addEventListener('focusout', (event) => {
    if (!header.contains(event.relatedTarget)) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    const focusInNav = nav.contains(document.activeElement);
    const focusOnToggle = document.activeElement === toggle;
    setOpen(false, mobile.matches && focusInNav);
    if (!mobile.matches && focusOnToggle) nav.querySelector('a').focus();
  });
})();
