# Luso Continental

Site institucional da Luso Continental, com apresentação dos serviços de transporte, pronto socorro automóvel e plataforma elevatória, galerias e pedidos de orçamento.

Construído com [Astro](https://astro.build), gerado como site estático. As páginas não dependem de servidor nem de base de dados.

## Estrutura

- `src/pages/`: uma página por ficheiro (`index`, `transportes`, `plataforma-elevatoria`, `mensagem-enviada`). Os textos, serviços, galerias e perguntas frequentes estão aqui.
- `src/components/`: blocos reutilizados (assistente, galeria, cabeçalho, rodapé, FAQ, etc.).
- `src/layouts/BaseLayout.astro`: `<head>` comum, incluindo título e descrição de cada página.
- `src/data/site.ts`: telefone, e-mail, WhatsApp e endereços das páginas. **Para mudar um contacto, altere só este ficheiro.**
- `src/styles/` e `src/scripts/`: estilos e comportamento de cada página.
- `src/assets/`: fotografias originais. O build gera versões WebP em vários tamanhos.
- `public/assets/`: ficheiros servidos sem alteração (vídeo do hero e fundo animado).
- `vercel.json`: configuração de publicação e de cache.

## Desenvolver

Requisito: Node.js 24.x com npm.

```sh
npm ci
npm run dev       # servidor local com recarregamento automático
npm run build     # gera o site em dist/
npm run preview   # mostra o resultado do build
```

Não edite `dist/`: é gerada pelo build.

## Adicionar ou trocar uma fotografia

1. Coloque o ficheiro em `src/assets/` com um nome descritivo.
2. Importe-o na página (`import foto from '../assets/...'`) e use o componente `<Image>` ou adicione-o à lista da galeria.

O tamanho e o formato são tratados no build; não é preciso reduzir a imagem à mão.

## Vídeo do hero

A página inicial usa `hero-desktop.mp4` (720p) e `hero-mobile.mp4` (960 px, abaixo de 780 px de largura), ambos sem áudio e com um keyframe a cada 12 fotogramas, para a rolagem responder bem. Ao substituir o vídeo, mantenha esse intervalo e mude o nome do ficheiro: `/assets/` fica em cache até 7 dias.

```sh
ffmpeg -i original.mp4 -an -c:v libx264 -preset veryslow -crf 24 -g 12 -keyint_min 12 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart hero-desktop.mp4
ffmpeg -i original.mp4 -an -vf scale=960:-2 -c:v libx264 -preset veryslow -crf 27 -g 12 -keyint_min 12 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart hero-mobile.mp4
```

## Publicar na Vercel

O projeto está ligado ao repositório `WelbennysKennedy/Lusocontinental`. A branch `main` publica em produção; as outras branches geram um endereço de pré-visualização. O `vercel.json` define o comando `npm run build` e a pasta de saída `dist`. O projeto não requer variáveis de ambiente.

Os endereços `.html` são mantidos de propósito (`build.format: 'file'` em `astro.config.mjs`), porque já estão públicos e o formulário redireciona para `mensagem-enviada.html`.

## Formulários e serviços externos

- **E-mail:** os formulários enviam por POST para o FormSubmit, com destino a `lusocontinental@hotmail.com`. O responsável deve confirmar a ativação na caixa de correio quando solicitada pelo serviço.
- **WhatsApp:** os botões preparam uma mensagem para `+351 933 359 605`; o visitante confirma o envio no WhatsApp.
- **Confirmação:** o JavaScript calcula o endereço de `mensagem-enviada.html` a partir do domínio em utilização.
- **Fontes:** a Plus Jakarta Sans é descarregada durante o build e servida pelo próprio site.

O build não envia mensagens. A entrega real de e-mails deve ser verificada após cada publicação.

## Manutenção

O GitHub Actions executa o build a cada push em `main` e em pull requests.

ZIPs, cópias antigas da HostGator, capturas de teste, configurações locais e ficheiros de credenciais ficam excluídos pelo `.gitignore`. O ficheiro `ALTERACOES-FORMULARIOS.txt` contém notas históricas da versão HostGator; para a publicação atual, siga este README.
