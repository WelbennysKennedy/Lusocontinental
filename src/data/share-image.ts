import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import fotoPadrao from '../assets/transportes/porta-automoveis-junto-stand.jpeg';

// Imagem mostrada quando um link é partilhado (Open Graph) e nos dados estruturados.
export const shareImageAltPadrao = 'Porta-automóveis azul carregado com carros, junto a um stand';
export const shareImageSize = { width: 1200, height: 630 };

export function getShareImage(src: ImageMetadata = fotoPadrao) {
  return getImage({ src, format: 'jpeg', quality: 80, fit: 'cover', ...shareImageSize });
}
