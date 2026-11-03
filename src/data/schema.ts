import { site } from './site';
import { municipios } from './zonas';

// Partes comuns dos dados estruturados (JSON-LD) de todas as páginas.
const origin = import.meta.env.SITE;

export const businessUrl = new URL('/', origin).href;
export const businessId = `${businessUrl}#empresa`;
export const businessType = 'AutomotiveBusiness';

export const areaServed = municipios.map((name) => ({ '@type': 'AdministrativeArea', name }));

export const provider = {
  '@type': businessType,
  '@id': businessId,
  name: site.name,
  url: businessUrl,
  telephone: site.phone,
};
