// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://lusocontinental.com',
  // Mantém os endereços públicos atuais (/transportes.html, ...).
  build: { format: 'file' },
  // A compressão retira os espaços entre elementos e cola o texto dos títulos ("veículos.Plataforma").
  compressHTML: false,
  // Tipografia do design system (design_system.html): Inter no lugar da SF Pro Display
  // e JetBrains Mono para etiquetas, números e dados técnicos. Servidas pelo próprio site.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: ['300 800'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
  ],
});
