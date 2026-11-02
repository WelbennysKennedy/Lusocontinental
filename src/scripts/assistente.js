import { site, telHref, whatsappHref } from '../data/site.ts';

(() => {
  'use strict';

  function initAssistant() {
    const toggle = document.getElementById('assistantToggle');
    const close = document.getElementById('assistantClose');
    const panel = document.getElementById('assistantPanel');
    const form = document.getElementById('assistantForm');
    const input = document.getElementById('assistantInput');
    const messages = document.getElementById('assistantMessages');
    if (!toggle || !close || !panel || !form || !input || !messages || panel.dataset.ready) return;
    panel.dataset.ready = 'true';

    const platformPage = panel.dataset.assistantTopic === 'platform';
    const transportPage = panel.dataset.assistantTopic === 'transport';
    let platformTopic = platformPage;
    let transportTopic = transportPage;
    const platformUrl = platformPage ? '' : 'plataforma-elevatoria.html';
    const transportUrl = transportPage ? '' : 'transportes.html';
    const whatsappUrl = whatsappHref();

    function setOpen(open, restoreFocus = true) {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) input.focus({ preventScroll: true });
      else if (restoreFocus) toggle.focus({ preventScroll: true });
    }

    function quoteLink() {
      return {
        label: 'Pedir orçamento',
        href: platformTopic ? platformUrl + '#orcamento' : transportTopic ? transportUrl + '#orcamento' : '#planeie-sua-operacao'
      };
    }

    function transportAnswer(q) {
      const quote = quoteLink();
      if (/whats|contacto|contato|telefone|telemovel|e-?mail|humano|atendente|falar com|conversar com/.test(q)) {
        return { text: 'Fale com a equipa pelo WhatsApp ou telefone ' + site.phoneDisplay + ', ou pelo e-mail ' + site.email + '. Para pedidos de reboque urgentes, ligue para confirmar a disponibilidade.', link: { label: 'Conversar com a equipa', href: whatsappUrl } };
      }
      if (/orcamento|cotacao|preco|custo|valor|quanto (custa|fica)/.test(q)) {
        return { text: 'O orçamento depende do serviço, origem, destino, características da carga e prazo. Preencha o formulário de transportes com o seu nome, telefone e detalhes da operação. Pode rever e enviar o pedido pelo WhatsApp ou e-mail; a equipa confirma o preço e a disponibilidade.', link: quote };
      }
      if (/reboque|socorro|avaria|sinistr|urgente/.test(q)) {
        return { text: 'O pronto socorro automóvel inclui assistência e reboque de veículos avariados, sinistrados ou sem condições de circulação. Indique a localização, o tipo e estado do veículo e o destino, se conhecido. Para uma urgência, ligue para ' + site.phoneDisplay + ' e confirme a disponibilidade.', link: { label: 'Ligar para pedir assistência', href: telHref } };
      }
      if (/foto|imagem|imagens|galeria/.test(q)) {
        return { text: 'A galeria mostra os porta-automóveis, reboques e meios de transporte de máquinas e apoio a obras. Pode arrastar as fotos para os lados. Fotografias da sua carga e dos acessos podem ser enviadas à equipa pelo WhatsApp.', link: { label: 'Ver a galeria de transportes', href: transportUrl + '#galeria' } };
      }
      if (/peso|capacidade|quilos|\bkg\b|tonelad|suporta|aguenta|dimens|altura|comprimento|largura/.test(q)) {
        return { text: 'Indique o peso e as dimensões aproximadas da carga, bem como os acessos de recolha e entrega. Os meios e a capacidade adequados ao transporte são confirmados pela equipa após avaliação.', link: quote };
      }
      if (/cargas? especia|volumoso|sensivel|amarracao/.test(q)) {
        return { text: 'As cargas especiais exigem planeamento conforme o volume, peso, sensibilidade, percurso e necessidades de amarração. Envie a descrição, medidas e fotografias para a equipa avaliar a viabilidade e os meios necessários.', link: { label: 'Conhecer o serviço de cargas especiais', href: transportUrl + '#cargas-especiais' } };
      }
      if (/maquina|empilhador|empilhadora|industrial/.test(q)) {
        return { text: 'Transportamos máquinas, empilhadores e equipamentos industriais. Para preparar o pedido, indique o equipamento, peso, dimensões, origem e destino, e as condições de carga e descarga.', link: { label: 'Ver transporte de máquinas e empilhadores', href: transportUrl + '#maquinas-empilhadores' } };
      }
      if (/obra|materia[il]|construcao|remodelacao/.test(q)) {
        return { text: 'O apoio a obras inclui transporte de equipamentos e materiais, com recolha e entrega planeadas conforme a carga, os acessos e a sequência dos trabalhos. Indique o local da obra e o que precisa de transportar.', link: { label: 'Conhecer o apoio a obras', href: transportUrl + '#apoio-obras' } };
      }
      if (/veiculo|carro|automovel|automoveis|stand|frota|oficina|retoma/.test(q)) {
        return { text: 'O transporte em porta-automóveis destina-se a particulares, stands, oficinas e frotas, incluindo retomas e entregas programadas. Indique os veículos, quantidade, origem, destino e prazo pretendido.', link: { label: 'Ver transporte de veículos', href: transportUrl + '#transporte-veiculos' } };
      }
      if (/rota|portugal|lisboa|porto|paredes|regiao|zona/.test(q)) {
        return { text: 'Realizamos operações em Portugal continental e temos rotas fixas semanais entre a zona de Paredes e Lisboa. Envie a origem, o destino e o prazo para confirmar o transporte pretendido.', link: quote };
      }
      if (/agend|marcacao|marcar|reserva|disponib|horario|amanha|hoje/.test(q) && !/servicos.*disponiveis/.test(q)) {
        return { text: 'Indique o serviço, origem, destino e data pretendida. O formulário prepara o pedido; a marcação só é confirmada após a avaliação da equipa, disponibilidade e aceitação da proposta.', link: quote };
      }
      if (/acesso|funciona|preparar|preparacao|recolha|entrega|destino|origem/.test(q)) {
        return { text: 'Comece por indicar o serviço, o que precisa de transportar, origem, destino e prazo. A equipa analisa a carga, o percurso e os acessos, prepara o orçamento e combina a recolha e a entrega após confirmação.', link: quote };
      }
      if (/servico|transport|^(ola|oi|bom dia|boa tarde|boa noite)/.test(q)) {
        return { text: 'Os serviços de transporte incluem transporte de veículos, pronto socorro automóvel, máquinas e empilhadores, apoio a obras e cargas especiais. Qual deles precisa?', link: { label: 'Conhecer os serviços de transporte', href: transportUrl + '#servicos' } };
      }
      return { text: 'Posso ajudar com os cinco serviços de transporte, rotas e pedidos de orçamento. Para uma avaliação específica da sua carga, fale com a equipa pelo WhatsApp.', link: { label: 'Falar com a equipa', href: whatsappUrl } };
    }

    function answer(question) {
      const q = question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      if (/plataforma|elevatori|elevacao|moveis|mudanca|sofa|paineis|solar|sandwich|ar condicionado/.test(q)) platformTopic = true;
      if (!/plataforma|elevatori|elevacao/.test(q) && /transport|reboque|socorro|porta.automoveis|maquina|empilhador|cargas? especia|apoio a obras/.test(q)) {
        platformTopic = false;
        transportTopic = true;
      }
      if (platformTopic) transportTopic = false;
      if (transportTopic) return transportAnswer(q);

      if (/whats|contacto|contato|telefone|telemovel|e-?mail|humano|atendente|falar com|conversar com/.test(q)) {
        return { text: 'Pode falar com a equipa pelo WhatsApp ou telefone ' + site.phoneDisplay + ', ou pelo e-mail ' + site.email + '. Use o botão abaixo para abrir a conversa no WhatsApp.', link: { label: 'Conversar com a equipa', href: whatsappUrl } };
      }
      if (/orcamento|cotacao|preco|custo|valor|quanto (custa|fica)|aluguer|alugar/.test(q)) {
        return { text: platformTopic
          ? 'O orçamento da plataforma depende da localização, altura ou piso, carga, acessos e data pretendida. No formulário de orçamento da plataforma, indique esses detalhes, o seu nome e telefone. Pode preparar o pedido para enviar pelo WhatsApp ou e-mail; a equipa confirma o preço e a disponibilidade.'
          : 'Para pedir uma cotação, indique o serviço, origem, destino, carga e prazo. Pode usar o formulário de contacto ou falar com a equipa pelo WhatsApp ' + site.phoneDisplay + '.', link: quoteLink() };
      }
      if (/agendar|agenda|marcacao|marcar|reserva|disponibilidade|\bdisponivel\b|horario|amanha|hoje|urgente/.test(q)) {
        return { text: 'Indique a localidade, o serviço e a data pretendida. A equipa confirma a disponibilidade e os detalhes da operação. O pedido de orçamento não confirma automaticamente a marcação.', link: quoteLink() };
      }
      if (/peso|capacidade|quilos|\bkg\b|tonelad|suporta|aguenta/.test(q)) {
        platformTopic = true;
        return { text: 'Para confirmar a capacidade adequada, a equipa precisa de avaliar o peso, as dimensões, a altura e o acesso ao local. Envie esses dados e, se possível, fotografias da carga. A capacidade para a sua operação será confirmada pela equipa.', link: quoteLink() };
      }
      if (/altura|metros|metragem|alcance|andar|piso/.test(q)) {
        platformTopic = true;
        return { text: 'A plataforma elevatória permite elevação até 42 metros. A altura possível no seu local depende dos acessos, do posicionamento do equipamento e da carga. Indique o piso ou a altura aproximada para a equipa avaliar.', link: quoteLink() };
      }
      if (/foto|imagem|imagens|galeria/.test(q)) {
        platformTopic = true;
        return { text: 'A galeria mostra a plataforma em diferentes operações. Pode arrastar as fotografias para os lados e clicar para ampliar. Fotografias do seu local ou da carga podem ser enviadas à equipa pelo WhatsApp.', link: { label: 'Ver fotografias da plataforma', href: platformUrl + '#galeria' } };
      }
      if (/moveis|mudanca|sofa|mobiliario/.test(q)) {
        return { text: 'Pode pedir elevação de móveis, sofás e outros volumes para mudanças particulares. A movimentação é planeada pelo exterior, através de janelas ou varandas, após avaliar a carga, o piso e os acessos.', link: quoteLink() };
      }
      if (/painel|paineis|solar|sandwich|cobertura/.test(q)) {
        platformTopic = true;
        return { text: 'A plataforma pode apoiar a elevação de painéis sandwich e painéis solares para obras e coberturas. Indique as dimensões, o peso, a altura e o ponto de receção para preparar a avaliação.', link: quoteLink() };
      }
      if (/ar condicionado|equipamento/.test(q) && platformTopic) {
        return { text: 'A plataforma pode elevar equipamentos, incluindo ar condicionado. A equipa avalia as dimensões, o peso, a altura necessária e o acesso antes de confirmar a operação.', link: quoteLink() };
      }
      if (/obra|materia[il]|construcao|remodelacao/.test(q)) {
        platformTopic = true;
        return { text: 'A plataforma apoia a movimentação de materiais para obras, remodelações, fachadas e coberturas. O planeamento considera os acessos, o espaço disponível, a carga e o ponto de descarga.', link: quoteLink() };
      }
      if (/acesso|espaco|funciona|operador|equipa|preparar|preparacao/.test(q)) {
        return { text: 'Comece por indicar a localização, o tipo de carga, o piso ou altura e a data. A equipa avalia os acessos e o espaço disponível, prepara a proposta e combina os detalhes do serviço após a confirmação.', link: quoteLink() };
      }
      if (/rota|portugal|lisboa|porto|paredes|localidade|zona|regiao|entrega/.test(q)) {
        return { text: platformTopic
          ? 'Indique a localidade onde precisa da plataforma e a data pretendida. A equipa confirma a disponibilidade e as condições para realizar a operação nesse local.'
          : 'Atendemos rotas em Portugal continental e temos rotas fixas semanais entre a zona de Paredes e Lisboa. Envie origem, destino e prazo para a equipa confirmar a operação.', link: quoteLink() };
      }
      if (/servico|plataforma|elevatori|elevacao|reboque|socorro|carro|veiculo|maquina|empilhador/.test(q)) {
        return platformTopic
          ? { text: 'A plataforma elevatória serve para móveis e mudanças, materiais para obras, painéis e coberturas, e equipamentos como ar condicionado. A elevação pode chegar aos 42 metros, após avaliação das condições do local.', link: { label: 'Conhecer os serviços da plataforma', href: platformUrl + '#servicos' } }
          : { text: 'Fazemos pronto socorro e reboque, transporte de veículos, máquinas e empilhadores, plataforma elevatória, apoio a obras e cargas especiais.', link: { label: 'Conhecer a plataforma elevatória', href: 'plataforma-elevatoria.html' } };
      }
      if (/^(ola|oi|bom dia|boa tarde|boa noite|obrigad[oa])[!?.\s]*$/.test(q)) {
        return { text: platformTopic ? 'Olá! Posso ajudar com os serviços da plataforma elevatória, a altura até 42 metros, a preparação da operação e o pedido de orçamento. Qual é a sua dúvida?' : 'Olá! Posso ajudar com serviços, rotas, plataforma elevatória e pedidos de orçamento. Qual é a sua dúvida?' };
      }
      return { text: 'Não tenho uma resposta específica para essa pergunta. Posso esclarecer os serviços, a altura da plataforma e como pedir orçamento. Para avaliar o seu caso, fale com a equipa pelo WhatsApp.', link: { label: 'Falar com a equipa no WhatsApp', href: whatsappUrl } };
    }

    function addMessage(text, user, link) {
      const message = document.createElement('p');
      message.className = 'assistant-message ' + (user ? 'assistant-message--user' : 'assistant-message--bot');
      message.textContent = text;
      if (link) {
        const action = document.createElement('a');
        action.className = 'assistant-message-link';
        action.textContent = link.label + ' ↗';
        action.href = link.href;
        if (link.href.startsWith('https://')) {
          action.target = '_blank';
          action.rel = 'noopener';
        } else if (link.href.startsWith('#')) {
          action.addEventListener('click', () => setOpen(false, false));
        }
        message.appendChild(action);
      }
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    }

    function ask(question) {
      const clean = question.trim().slice(0, 600);
      if (!clean) return;
      addMessage(clean, true);
      const response = answer(clean);
      addMessage(response.text, false, response.link);
    }

    toggle.addEventListener('click', () => setOpen(panel.hidden));
    close.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) {
        event.preventDefault();
        setOpen(false);
      }
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      ask(input.value);
      input.value = '';
      input.focus({ preventScroll: true });
    });
    panel.querySelectorAll('.assistant-quick-actions button').forEach((button) => {
      button.addEventListener('click', () => ask(button.dataset.question || ''));
    });
    panel.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => setOpen(false, false));
    });
    toggle.hidden = false;

    const homeForm = document.getElementById('planeie-sua-operacao');
    if (homeForm && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        document.body.classList.toggle('is-form-active', entries[0].isIntersecting);
      }, { threshold: 0.15 });
      observer.observe(homeForm);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAssistant, { once: true });
  else initAssistant();
})();
