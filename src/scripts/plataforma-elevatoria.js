import { whatsappHref } from '../data/site.ts';

(() => {
  'use strict';

  const form = document.getElementById('quoteForm');
  if (!form) return;

  const service = document.getElementById('quoteService');
  const date = document.getElementById('quoteDate');
  const status = document.getElementById('quoteStatus');
  const fallback = document.getElementById('quoteFallback');
  const today = new Date();
  date.min = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');

  function clearPreparedRequest() {
    status.hidden = true;
    fallback.hidden = true;
    fallback.removeAttribute('href');
  }

  document.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      service.value = link.dataset.service;
      clearPreparedRequest();
    });
  });

  form.addEventListener('input', (event) => {
    event.target.setCustomValidity?.('');
    clearPreparedRequest();
  });


  const whatsappButton = form.querySelector('button[value="whatsapp"]');
  const emailButton = form.querySelector('button[value="email"]');
  let emailSending = false;
  let lastWhatsAppClick = -Infinity;

  // FormSubmit requires an absolute return URL; resolve it on the deployed site.
  const next = form.elements.namedItem('_next');
  if (/^https?:$/.test(window.location.protocol)) {
    next.value = new URL('mensagem-enviada.html', window.location.href).href;
    next.disabled = false;
  }

  function validate() {
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach((field) => {
      if (!field.disabled) field.setCustomValidity(field.value.trim() ? '' : 'Preencha este campo.');
    });
    const phone = form.elements.namedItem('phone');
    if (phone.value.replace(/\D/g, '').length < 7) {
      phone.setCustomValidity('Introduza um número de telefone válido, com pelo menos 7 algarismos.');
    }
    return form.reportValidity();
  }

  function whatsappMessage() {
    const data = new FormData(form);
    const read = (name) => String(data.get(name) || '').trim();
    const requestedDate = read('date');
    return [
      'Olá! Gostaria de pedir um orçamento de plataforma elevatória.',
      '',
      `Nome: ${read('name')}`,
      `Telefone: ${read('phone')}`,
      `E-mail: ${read('email') || 'Não informado'}`,
      `Assunto: ${read('service') || 'Pedido de orçamento'}`,
      `Serviço: ${read('service')}`,
      `Localidade: ${read('location')}`,
      `Piso / altura: ${read('height') || 'A confirmar'}`,
      `Data pretendida: ${requestedDate ? requestedDate.split('-').reverse().join('/') : 'A combinar'}`,
      '',
      'Mensagem:',
      read('details')
    ].join('\n');
  }

  form.addEventListener('change', (event) => {
    event.target.setCustomValidity?.('');
    clearPreparedRequest();
  });

  // Only the e-mail button (or Enter) submits this form to FormSubmit.
  form.addEventListener('submit', (event) => {
    if (emailSending || !validate()) {
      event.preventDefault();
      return;
    }
    emailSending = true;
    clearPreparedRequest();
    form.setAttribute('aria-busy', 'true');
    emailButton.disabled = true;
    whatsappButton.disabled = true;
    // Do not show success here: CAPTCHA and delivery are handled by FormSubmit.
    // Native POST includes every named field and all FormSubmit settings.
  });

  // Independent click handler: this button never submits the e-mail form.
  whatsappButton.addEventListener('click', () => {
    if (emailSending || !validate()) return;
    const now = Date.now();
    if (now - lastWhatsAppClick < 1000) return;
    lastWhatsAppClick = now;
    const url = whatsappHref(whatsappMessage());
    fallback.href = url;
    fallback.textContent = 'Abrir o pedido no WhatsApp ↗';
    fallback.hidden = false;
    status.textContent = 'Pedido preparado. Reveja a mensagem e toque em Enviar no WhatsApp. Se não abriu, use o link abaixo.';
    status.hidden = false;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  // Restore controls when returning from CAPTCHA or the confirmation page.
  window.addEventListener('pageshow', () => {
    emailSending = false;
    lastWhatsAppClick = -Infinity;
    form.removeAttribute('aria-busy');
    emailButton.disabled = false;
    whatsappButton.disabled = false;
  });
  whatsappButton.disabled = false;
  emailButton.disabled = false;
})();
