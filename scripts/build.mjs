import { cp, mkdir, readdir, rm, lstat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
const pages = ['index.html', 'plataforma-elevatoria.html', 'transportes.html', 'mensagem-enviada.html'];
const mediaDirectories = ['assets', 'img', 'img.plataformaelevatoria', 'img.transportes'];

// Only this project's generated directory may be cleared.
if (dirname(output) !== resolve(root)) throw new Error('Invalid output directory');
const existing = await lstat(output).catch(error => {
  if (error.code !== 'ENOENT') throw error;
});
if (existing?.isSymbolicLink()) throw new Error('dist must not be a symbolic link');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const entries = await readdir(root, { withFileTypes: true });
const stylesAndScripts = entries
  .filter(entry => entry.isFile() && /\.(css|js)$/.test(entry.name))
  .map(entry => entry.name);

for (const file of [...pages, ...stylesAndScripts]) {
  await cp(join(root, file), join(output, file));
}
for (const directory of mediaDirectories) {
  await cp(join(root, directory), join(output, directory), {
    recursive: true,
    filter: source => !['.gitkeep', 'hero novo.mp4'].includes(source.split(/[\\/]/).pop()),
  });
}

console.log(`Build complete: ${pages.length} pages and site assets copied to dist/`);
