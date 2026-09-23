# Luso Continental

Site institucional da Luso Continental, com apresentação dos serviços de transporte, pronto socorro automóvel e plataforma elevatória, galerias e pedidos de orçamento.

Construído com HTML, CSS e JavaScript, sem framework ou dependências npm. O vídeo e as imagens são servidos pelo próprio site.

## Estrutura

- `index.html`: página inicial e formulário de contacto.
- `transportes.html`: serviços de transporte e galeria.
- `plataforma-elevatoria.html`: serviços de elevação e galeria.
- `mensagem-enviada.html`: confirmação após envio do formulário.
- `assets/`, `img/`, `img.transportes/`, `img.plataformaelevatoria/`: recursos visuais.
- `scripts/build.mjs`: preparação dos ficheiros públicos em `dist/`.
- `vercel.json`: configuração de publicação.

## Preparar e visualizar localmente

Requisito para o build: Node.js 24.x com npm.

```sh
npm ci
npm run build
```

A pasta `dist/` contém apenas as páginas, estilos, scripts e recursos do site. Para visualizar, use um servidor estático apontado para essa pasta. Por exemplo, se tiver Python instalado:

```sh
python -m http.server 3000 --directory dist
```

Abra `http://localhost:3000`. Não edite `dist/` diretamente: altere os ficheiros de origem e execute o build novamente.

## Publicar na Vercel

1. Na Vercel, importe o repositório `WelbennysKennedy/Lusocontinental`.
2. Use a branch `main` e a raiz do repositório como **Root Directory**.
3. Selecione **Other** como framework. O `vercel.json` define o comando `npm run build` e a pasta de saída `dist`.
4. Publique e verifique a página inicial, as duas páginas de serviços, o vídeo, as galerias e os formulários.

O projeto atual não requer variáveis de ambiente. Os caminhos `.html` existentes são preservados para manter a navegação e o redirecionamento dos formulários.

Referência: [configuração de builds da Vercel](https://vercel.com/docs/builds/configure-a-build).

### Domínio próprio

Depois da publicação, adicione o domínio em **Settings → Domains** no projeto da Vercel. No fornecedor do domínio, configure exatamente os registos DNS indicados pela Vercel e aguarde a validação. Preserve os registos de e-mail existentes, como MX e TXT. Escolha também qual endereço será o principal, com ou sem `www`.

O domínio final ainda não foi definido neste repositório. Não existem redirecionamentos para um domínio provisório.

Referência: [adicionar um domínio à Vercel](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

## Formulários e serviços externos

- **E-mail:** os formulários enviam por POST para o FormSubmit, com destino a `lusocontinental@hotmail.com`. O responsável deve confirmar a ativação na caixa de correio quando solicitada pelo serviço.
- **WhatsApp:** os botões preparam uma mensagem para `+351 933 359 605`; o visitante confirma o envio no WhatsApp.
- **Confirmação:** o JavaScript calcula o endereço de `mensagem-enviada.html` a partir do domínio em utilização.
- **Fontes:** carregadas através do Google Fonts.

A entrega real de e-mails deve ser verificada após a publicação e ativação do FormSubmit. O build não envia mensagens.

## Manutenção

O GitHub Actions verifica a sintaxe JavaScript e executa o build a cada push em `main` e em pull requests.

ZIPs, cópias antigas da HostGator, capturas de teste, configurações locais e ficheiros de credenciais ficam excluídos pelo `.gitignore`. O vídeo duplicado `assets/hero novo.mp4` também é excluído; o site usa `assets/hero-novo.mp4`.

O ficheiro `ALTERACOES-FORMULARIOS.txt` contém notas históricas da versão HostGator; para a publicação atual, siga este README.
