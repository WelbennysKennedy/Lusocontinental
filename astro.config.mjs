// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://lusocontinental.com',
  // Mantém os endereços públicos atuais (/transportes.html, ...).
  build: { format: 'file' },
  // A compressão retira os espaços entre elementos e cola o texto dos títulos ("veículos.Plataforma").
  compressHTML: false,
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-jakarta',
      weights: ['200 800'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
  ],
});
