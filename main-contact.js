(() => {
  const form = document.getElementById('operationForm');
  if (!form) return;
  const field = name => form.elements.namedItem(name);
  const whatsapp = form.querySelector('button[value="whatsapp"]');
  const email = form.querySelector('button[value="email"]');
  const status = document.getElementById('operationStatus');
  const fallback = document.getElementById('operationFallback');
  let sending = false;
  let lastClick = -Infinity;
  const date = new Date();
  field('date').min = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  if (/^https?:$/.test(location.protocol)) {
    field('_next').value = new URL('mensagem-enviada.html', location.href).href;
    field('_next').disabled = false;
  }
  function clear() { status.hidden = true; fallback.hidden = true; fallback.removeAttribute('href'); }
  function selectService() {
    const platform = field('service').value === 'Plataforma elevatória';
    for (const [id, enabled] of [['operationDestination', !platform], ['operationHeight', platform], ['operationVehicleBrand', !platform], ['operationVehicleType', !platform]]) {
      const group = document.getElementById(id);
      group.hidden = !enabled;
      group.querySelector('input, select').disabled = !enabled;
    }
    document.getElementById('operationLocationLabel').textContent = platform ? 'Localidade da operação *' : 'Origem / recolha *';
    clear();
  }
  form.addEventListener('change', event => { if (event.target.name === 'service') selectService(); });
  form.addEventListener('input', event => { event.target.setCustomValidity?.(''); clear(); });
  function valid() {
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(control => {
      if (!control.disabled) control.setCustomValidity(control.value.trim() ? '' : 'Preencha este campo.');
    });
    if (field('phone').value.replace(/\D/g, '').length < 7) field('phone').setCustomValidity('Introduza um telefone com pelo menos 7 algarismos.');
    return form.reportValidity();
  }
  form.addEventListener('submit', event => {
    if (sending || !valid()) { event.preventDefault(); return; }
    sending = true;
    clear();
    form.setAttribute('aria-busy', 'true');
    email.disabled = whatsapp.disabled = true;
  });
  whatsapp.addEventListener('click', () => {
    if (sending || !valid() || Date.now() - lastClick < 1000) return;
    lastClick = Date.now();
    const data = new FormData(form);
    const read = name => String(data.get(name) || '').trim();
    const message = [
      'Olá! Gostaria de pedir um orçamento à Luso Continental.', '',
      `Assunto: ${read('service')}`, `Nome: ${read('name')}`, `Telefone: ${read('phone')}`,
      `E-mail: ${read('email') || 'Não informado'}`,
      ...(read('company') ? [`Empresa: ${read('company')}`] : []),
      ...(read('marca_veiculo') ? [`Marca do veículo: ${read('marca_veiculo')}`] : []),
      ...(read('tipo_veiculo') ? [`Tipo de veículo: ${read('tipo_veiculo')}`] : []),
      `Localidade / origem: ${read('location')}`,
      ...(read('destination') ? [`Destino: ${read('destination')}`] : []),
      ...(read('height') ? [`Piso / altura: ${read('height')}`] : []),
      `Data pretendida: ${read('date') ? read('date').split('-').reverse().join('/') : 'A combinar'}`,
      '', 'Mensagem:', read('details')
    ].join('\n');
    const url = 'https://wa.me/351933359605?text=' + encodeURIComponent(message);
    fallback.href = url; fallback.hidden = false;
    status.textContent = 'Pedido preparado. Reveja a mensagem e toque em Enviar no WhatsApp. Se não abriu, use o link abaixo.';
    status.hidden = false;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  window.addEventListener('pageshow', () => {
    sending = false; lastClick = -Infinity;
    form.removeAttribute('aria-busy');
    email.disabled = whatsapp.disabled = false;
    selectService();
  });
  selectService();
  whatsapp.disabled = false;
})();
