// Contactos e endereços usados em todas as páginas e scripts.
export const site = {
  name: 'Luso Continental',
  phone: '+351933359605',
  phoneDisplay: '+351 933 359 605',
  email: 'lusocontinental@hotmail.com',
  whatsapp: '351933359605',
};

export const telHref = `tel:${site.phone}`;
export const mailHref = `mailto:${site.email}`;
export const formAction = `https://formsubmit.co/${site.email}`;

export function whatsappHref(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const routes = {
  home: '/',
  transportes: '/transportes.html',
  plataforma: '/plataforma-elevatoria.html',
};
