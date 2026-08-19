/* ─── HOME — CARROSSEL E FILTROS DE JOGOS ──────────────────────────────────── */

// ── Dados dos jogos (unificados) ──────────────────────────
let listaDeJogos = [];

// Função para carregar jogos do backend MySQL
async function carregarJogos() {
    try {
        const response = await fetch('php/games.php');
        listaDeJogos = await response.json();
        aplicarFiltros();
    } catch (error) {
        console.error('Erro ao carregar jogos:', error);
        // Fallback para uma lista vazia se o servidor falhar
        listaDeJogos = [];
        aplicarFiltros();
    }
}

const galeriaCategorias = document.getElementById('galeria-categorias');
const gradeJogos = galeriaCategorias?.querySelector('.grade-jogos') || document.querySelector('.grade-jogos');
const campoBusca = document.querySelector('.campo-busca');
let categoriaAtiva = "todos";
let plataformaAtiva = "todos";
let generoAtivo = "todos";
let etariaAtiva = "todos";
let anoAtivo = "todos";
let precoAtivo = "todos";
let termoPesquisa = "";
let cardAberto = null;
let cliqueTimer = null;

// ── Função para formatar preço ───────────────────────────────────────────────
function formatarPreco(valor) {
    if (typeof valor === 'string') valor = parseFloat(valor);
    return valor.toFixed(2).replace('.', ',');
}

// ── Critérios das galerias baseados nos campos reais do banco ───────────────
const definicoesCategorias = [
    {
        id: 'lancamentos',
        titulo: '🆕 Lançamentos',
        descricao: 'Jogos lançados recentemente.',
        filtrar: jogo => jogoEstaNosUltimosDias(jogo.data_lancamento, 365)
    },
    {
        id: 'premiados',
        titulo: '🏆 Premiados',
        descricao: 'Jogos com premiação registrada no cadastro.',
        filtrar: jogo => jogoPossuiMarcador(jogo, ['premiado', 'recebeu_premio', 'premios'])
    },
    {
        id: 'mais-populares',
        titulo: '🔥 Mais populares',
        descricao: 'Jogos com métricas de acesso ou popularidade disponíveis.',
        filtrar: jogo => jogoPossuiMarcador(jogo, ['popular', 'popularidade', 'acessos', 'visualizacoes', 'jogadas'])
    },
    {
        id: 'em-desconto',
        titulo: '💰 Em desconto',
        descricao: 'Jogos com desconto promocional registrado.',
        filtrar: jogo => obterNumero(jogo.desconto) > 0
    },
    {
        id: 'gratis',
        titulo: '🎁 Grátis',
        descricao: 'Jogos com preço igual a zero.',
        filtrar: jogo => obterNumero(jogo.preco) === 0
    },
    {
        id: 'mais-bem-avaliados',
        titulo: '⭐ Mais bem avaliados',
        descricao: 'Jogos com média de avaliação igual ou superior a 8.',
        filtrar: jogo => obterMediaAvaliacoes(jogo) >= 8
    },
    {
        id: 'em-alta',
        titulo: '📈 Em alta',
        descricao: 'Jogos com indicador de tendência registrado.',
        filtrar: jogo => jogoPossuiMarcador(jogo, ['em_alta', 'tendencia', 'crescimento_popularidade'])
    },
    {
        id: 'classicos',
        titulo: '👑 Clássicos',
        descricao: 'Jogos antigos com avaliação elevada.',
        filtrar: jogo => obterAno(jogo) > 0 && obterAno(jogo) <= 2010 && obterMediaAvaliacoes(jogo) >= 8
    },
    {
        id: 'destaques',
        titulo: '💎 Destaques',
        descricao: 'Jogos marcados para destaque no catálogo.',
        filtrar: jogo => jogoPossuiMarcador(jogo, ['destaque', 'em_destaque'])
    },
    {
        id: 'exclusivos',
        titulo: '🎮 Exclusivos',
        descricao: 'Jogos com exclusividade registrada no cadastro.',
        filtrar: jogo => jogoPossuiMarcador(jogo, ['exclusivo', 'exclusividade'])
    },
    {
        id: 'indies',
        titulo: '🕹️ Indies',
        descricao: 'Jogos identificados como independentes.',
        filtrar: jogo => jogoPossuiTermo(jogo, ['categoria', 'genero'], ['indie', 'indies'])
    },
    {
        id: 'ultima-chance',
        titulo: '⏳ Última chance',
        descricao: 'Ofertas com encerramento próximo.',
        filtrar: jogo => jogoTemOfertaTerminando(jogo)
    },
    {
        id: 'atualizados-recentemente',
        titulo: '🔄 Atualizados recentemente',
        descricao: 'Jogos atualizados nos últimos 90 dias.',
        filtrar: jogo => jogoEstaNosUltimosDias(jogo.data_atualizacao, 90)
    },
    {
        id: 'multijogador',
        titulo: '👥 Multijogador',
        descricao: 'Jogos identificados como multiplayer ou multijogador.',
        filtrar: jogo => jogoPossuiTermo(jogo, ['categoria', 'genero'], ['multiplayer', 'multijogador'])
    },
    {
        id: 'recomendados',
        titulo: '🎯 Recomendados',
        descricao: 'Sugestões marcadas pelo sistema de catálogo.',
        filtrar: jogo => jogoPossuiMarcador(jogo, ['recomendado', 'recomendacao'])
    },
    {
        id: 'favoritos',
        titulo: '❤️ Favoritos',
        descricao: 'Jogos salvos pelo usuário conectado.',
        filtrar: jogo => jogoEhFavorito(jogo)
    },
    {
        id: 'em-breve',
        titulo: '🆕 Em breve',
        descricao: 'Jogos ainda não lançados.',
        filtrar: jogo => jogoEstaEmBreve(jogo)
    },
    {
        id: 'ofertas-imperdiveis',
        titulo: '💥 Ofertas imperdíveis',
        descricao: 'Jogos com desconto de 30% ou mais.',
        filtrar: jogo => obterNumero(jogo.desconto) >= 30
    },
    {
        id: 'indicacoes-premios',
        titulo: '🏅 Indicações a prêmios',
        descricao: 'Jogos com indicação a premiação registrada.',
        filtrar: jogo => jogoPossuiMarcador(jogo, ['indicado', 'indicacao', 'indicacoes'])
    }
];

function normalizarTexto(valor) {
    return String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

// Converte diferentes formatos cadastrados no banco para os códigos oficiais.
function normalizarEtaria(valor) {
    const texto = normalizarTexto(valor).replace(/\s+/g, ' ');

    if (!texto) {
        return { codigo: 'nao-informada', rotulo: 'N/I', classe: 'etaria-nao-informada' };
    }

    if (texto === 'l' || texto === '0' || texto.includes('livre')) {
        return { codigo: 'L', rotulo: 'L', classe: 'etaria-L' };
    }

    const correspondencia = texto.match(/(?:^|[^0-9])(10|12|14|16|18)(?:[^0-9]|$)/);
    if (correspondencia) {
        return {
            codigo: correspondencia[1],
            rotulo: correspondencia[1],
            classe: `etaria-${correspondencia[1]}`
        };
    }

    return { codigo: 'nao-informada', rotulo: 'N/I', classe: 'etaria-nao-informada' };
}

function escaparHtml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function obterNumero(valor) {
    const numero = typeof valor === 'string' ? parseFloat(valor.replace(',', '.')) : Number(valor);
    return Number.isFinite(numero) ? numero : 0;
}

function obterAno(jogo) {
    return parseInt(jogo.ano, 10) || 0;
}

function obterMediaAvaliacoes(jogo) {
    const avaliacoes = ['avaliacao_gameplay', 'avaliacao_graficos', 'avaliacao_historia']
        .map(campo => obterNumero(jogo[campo]))
        .filter(valor => valor > 0);
    return avaliacoes.length ? avaliacoes.reduce((total, valor) => total + valor, 0) / avaliacoes.length : 0;
}

function jogoPossuiTermo(jogo, campos, termos) {
    return campos.some(campo => {
        const valor = normalizarTexto(jogo[campo]);
        return termos.some(termo => valor.includes(normalizarTexto(termo)));
    });
}

function jogoPossuiMarcador(jogo, campos) {
    return campos.some(campo => {
        const valor = jogo[campo];
        if (valor === true || valor === 1) return true;
        const texto = normalizarTexto(valor);
        return texto !== '' && !['0', 'nao', 'false', 'nenhum', 'null'].includes(texto);
    });
}

function converterData(data) {
    if (!data) return null;
    const texto = String(data).trim();
    const dataIso = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const dataBrasileira = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    let dataConvertida;

    if (dataIso) {
        dataConvertida = new Date(Number(dataIso[1]), Number(dataIso[2]) - 1, Number(dataIso[3]));
    } else if (dataBrasileira) {
        dataConvertida = new Date(Number(dataBrasileira[3]), Number(dataBrasileira[2]) - 1, Number(dataBrasileira[1]));
    } else {
        dataConvertida = new Date(texto);
    }

    return Number.isNaN(dataConvertida.getTime()) ? null : dataConvertida;
}

function jogoEstaNosUltimosDias(data, quantidadeDias) {
    const dataJogo = converterData(data);
    if (!dataJogo) return false;
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() - quantidadeDias);
    return dataJogo >= limite && dataJogo <= hoje;
}

function jogoTemOfertaTerminando(jogo) {
    const campoData = ['data_fim_promocao', 'data_fim_oferta', 'oferta_expira', 'promocao_fim']
        .find(campo => jogo[campo]);
    if (!campoData) return false;
    const fimOferta = converterData(jogo[campoData]);
    if (!fimOferta) return false;
    const hoje = new Date();
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + 7);
    return fimOferta >= hoje && fimOferta <= limite && obterNumero(jogo.desconto) > 0;
}

function jogoEstaEmBreve(jogo) {
    const status = normalizarTexto(jogo.status);
    const dataLancamento = converterData(jogo.data_lancamento);
    return status.includes('breve') || status.includes('pre lancamento') || (dataLancamento && dataLancamento > new Date());
}

function obterFavoritosUsuario() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
        return Array.isArray(usuario?.jogos_favoritos) ? usuario.jogos_favoritos : [];
    } catch (erro) {
        return [];
    }
}

function jogoEhFavorito(jogo) {
    return obterFavoritosUsuario().some(favorito => {
        if (typeof favorito === 'object' && favorito !== null) {
            return String(favorito.id) === String(jogo.id) || normalizarTexto(favorito.nome) === normalizarTexto(jogo.nome);
        }
        return normalizarTexto(favorito) === normalizarTexto(jogo.nome);
    });
}

function criarMarkupCard(jogo, indice) {
    const precoNum = obterNumero(jogo.preco);
    let precoClasse = '';
    let precoTexto = '';

    if (precoNum === 0) {
        precoClasse = 'gratis';
        precoTexto = 'Grátis';
    } else if (precoNum <= 50) {
        precoClasse = 'baixo';
        precoTexto = `R$ ${formatarPreco(precoNum)}`;
    } else if (precoNum <= 150) {
        precoClasse = 'medio';
        precoTexto = `R$ ${formatarPreco(precoNum)}`;
    } else {
        precoClasse = 'alto';
        precoTexto = `R$ ${formatarPreco(precoNum)}`;
    }

    const nome = escaparHtml(jogo.nome || 'Jogo sem nome');
    const descricao = escaparHtml(jogo.descricao || 'Descrição não informada.');
    const categoria = escaparHtml(jogo.categoria || 'Sem categoria');
    const genero = escaparHtml(jogo.genero || 'Não informado');
    const plataforma = escaparHtml(jogo.plataforma || 'Não informada');
    const informacaoEtaria = normalizarEtaria(jogo.etaria);
    const etaria = escaparHtml(informacaoEtaria.rotulo);
    const classeEtaria = informacaoEtaria.classe;
    const ano = escaparHtml(jogo.ano || '—');
    const status = escaparHtml(jogo.status || 'Não informado');
    const imagem = escaparHtml(jogo.img || 'assets/img/naoencontrada.png');
    const classeStatus = normalizarTexto(jogo.status) === 'disponivel' ? 'status-disponivel' : 'status-em-breve';
    const atributosInteracao = galeriaCategorias
        ? `role="button" tabindex="0" aria-expanded="false" aria-controls="painel-contextual-jogo" aria-label="Abrir informações de ${nome}"`
        : '';

    const urlDetalhes = `pages/pagina.html?id=${encodeURIComponent(jogo.id)}`;
    const urlCategoria = `pages/biblioteca.html?categoria=${encodeURIComponent(jogo.categoria || '')}`;
    const urlGenero = `pages/biblioteca.html?genero=${encodeURIComponent(jogo.genero || '')}`;
    const urlPlataforma = `pages/biblioteca.html?plataforma=${encodeURIComponent(jogo.plataforma || '')}`;

    return `
        <article class="card-jogo animar-entrada${galeriaCategorias ? ' card-jogo--contextual' : ''}" data-id="${escaparHtml(jogo.id)}" style="animation-delay:${indice * 0.08}s" ${atributosInteracao}>
            <div class="card-jogo-sidebar">
                <img src="${imagem}" alt="Capa de ${nome}" loading="lazy" onerror="this.src='assets/img/naoencontrada.png'">
                <span class="badge-etaria ${classeEtaria}">${etaria}</span>
                <button class="menu-trigger" type="button" aria-label="Abrir menu" aria-expanded="false">⋮</button>
            </div>
            <div class="card-jogo-content">
                <h2 class="card-jogo-titulo"><a href="${urlDetalhes}" title="Ver detalhes de ${nome}">${nome}</a></h2>
                <p class="card-jogo-descricao">${descricao}</p>
                <div class="card-jogo-info">
                    <a href="${urlCategoria}" class="info-tag link-tag" title="Filtrar por categoria ${categoria}"><i class="fas fa-tag"></i> ${categoria}</a>
                    <a href="${urlGenero}" class="info-tag link-tag" title="Filtrar por gênero ${genero}"><i class="fas fa-gamepad"></i> ${genero}</a>
                    <a href="${urlPlataforma}" class="info-tag link-tag" title="Filtrar por plataforma ${plataforma}"><i class="fas fa-desktop"></i> ${plataforma}</a>
                    <span class="info-tag"><i class="fas fa-shield-alt"></i> ${etaria}</span>
                    <span class="info-tag"><i class="fas fa-calendar"></i> ${ano}</span>
                    <span class="info-tag info-preco ${precoClasse}"><i class="fas fa-dollar-sign"></i> ${precoTexto}</span>
                    <span class="info-tag info-status ${classeStatus}"><i class="fas fa-circle"></i> ${status}</span>
                </div>
                <button class="botao-detalhes" data-id="${escaparHtml(jogo.id)}" type="button"><i class="fas fa-chevron-right"></i> Ver detalhes</button>
            </div>
        </article>
    `;
}

// ── Renderização das galerias e dos cards ───────────────────────────────────
function renderizarJogos(lista) {
    const containerJogos = galeriaCategorias || gradeJogos;
    if (!containerJogos) return;

    fecharPainelContextual();

    if (lista.length === 0) {
        containerJogos.innerHTML = `
            <div class="estado-galeria-vazia">
                <i class="fas fa-search"></i>
                <p>Nenhum jogo encontrado.</p>
            </div>`;
        return;
    }

    if (!galeriaCategorias) {
        containerJogos.innerHTML = lista.map(criarMarkupCard).join('');
        adicionarEventosCards();
        return;
    }

    const secoes = definicoesCategorias.map(definicao => {
        const jogosDaCategoria = lista
            .filter(definicao.filtrar)
            .slice(0, 10);
        if (jogosDaCategoria.length === 0) return '';

        return `
            <section class="galeria-categoria" id="categoria-${definicao.id}" aria-labelledby="titulo-${definicao.id}">
                <div class="galeria-categoria__cabecalho">
                    <div>
                        <h2 class="galeria-categoria__titulo" id="titulo-${definicao.id}">${definicao.titulo}</h2>
                        <p class="galeria-categoria__descricao">${definicao.descricao}</p>
                    </div>
                    <a href="pages/biblioteca.html?categoria=${encodeURIComponent(definicao.titulo)}" class="galeria-categoria__ver-todos">Ver todos →</a>
                </div>
                <div class="galeria-categoria__container">
                    <button class="galeria-botao-navegacao galeria-botao-navegacao--esquerda" type="button" aria-label="Rolar para esquerda" onclick="document.getElementById('grade-${definicao.id}').scrollBy({left: -600, behavior: 'smooth'})">
                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    <div class="grade-jogos galeria-categoria__grade" id="grade-${definicao.id}" aria-label="${definicao.titulo}">
                        ${jogosDaCategoria.map(criarMarkupCard).join('')}
                    </div>
                    <button class="galeria-botao-navegacao galeria-botao-navegacao--direita" type="button" aria-label="Rolar para direita" onclick="document.getElementById('grade-${definicao.id}').scrollBy({left: 600, behavior: 'smooth'})">
                        <i class="fas fa-chevron-right" aria-hidden="true"></i>
                    </button>
                </div>
            </section>`;
    }).join('');

    containerJogos.innerHTML = secoes || `
        <div class="estado-galeria-vazia">
            <i class="fas fa-filter"></i>
            <p>Nenhuma categoria possui jogos com os filtros atuais.</p>
        </div>`;
    adicionarEventosCards();
}

function adicionarEventosCards() {
    document.querySelectorAll('.card-jogo').forEach(card => {
        const id = parseInt(card.dataset.id, 10);
        const jogo = listaDeJogos.find(item => Number(item.id) === id);
        if (!jogo) return;

        const menuTrigger = card.querySelector('.menu-trigger');
        if (menuTrigger) {
            menuTrigger.addEventListener('click', evento => {
                evento.stopPropagation();
                toggleCard(card);
            });
        }

        // Clique no card redireciona diretamente para a página do jogo (pagina.html)
        card.addEventListener('click', evento => {
            // Ignora se o clique for em botões de ação específicos (como o menu trigger)
            if (evento.target.closest('.botao-detalhes') || evento.target.closest('.menu-trigger')) return;
            
            const prefixo = galeriaCategorias ? 'pages/' : '';
            window.location.href = `${prefixo}pagina.html?id=${id}`;
        });

        // Suporte a teclado (Enter ou Espaço) direciona para pagina.html
        card.addEventListener('keydown', evento => {
            if (evento.key === 'Enter' || evento.key === ' ') {
                if (evento.target.closest('.botao-detalhes') || evento.target.closest('.menu-trigger')) return;
                evento.preventDefault();
                const prefixo = galeriaCategorias ? 'pages/' : '';
                window.location.href = `${prefixo}pagina.html?id=${id}`;
            }
        });

        const botaoDetalhes = card.querySelector('.botao-detalhes');
        if (botaoDetalhes) {
            botaoDetalhes.addEventListener('click', evento => {
                evento.stopPropagation();
                window.location.href = `pages/pagina.html?id=${id}`;
            });
        }
    });
}

// ── Painel contextual do jogo selecionado ───────────────────────────────────
function obterTextoPreco(jogo) {
    const preco = obterNumero(jogo.preco);
    const desconto = obterNumero(jogo.desconto);
    if (preco === 0) return '<strong>Grátis</strong>';
    if (desconto > 0) {
        const precoPromocional = preco * (1 - desconto / 100);
        return `<s>R$ ${formatarPreco(preco)}</s> <strong>R$ ${formatarPreco(precoPromocional)}</strong>`;
    }
    return `<strong>R$ ${formatarPreco(preco)}</strong>`;
}

function formatarDataBrasileira(data) {
    const dataConvertida = converterData(data);
    return dataConvertida ? dataConvertida.toLocaleDateString('pt-BR') : 'Não informada';
}

function criarPainelContextual(jogo) {
    const nome = escaparHtml(jogo.nome || 'Jogo');
    const descricao = escaparHtml(jogo.descricao || 'Descrição não informada.');
    const categoria = escaparHtml(jogo.categoria || 'Sem categoria');
    const plataforma = escaparHtml(jogo.plataforma || 'Não informada');
    const status = escaparHtml(jogo.status || 'Não informado');
    const media = obterMediaAvaliacoes(jogo);
    const avaliacao = media ? media.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : 'Não informada';

    const painel = document.createElement('aside');
    painel.className = 'painel-contextual';
    painel.id = 'painel-contextual-jogo';
    painel.setAttribute('role', 'dialog');
    painel.setAttribute('aria-modal', 'false');
    painel.setAttribute('aria-labelledby', 'titulo-painel-contextual');
    painel.setAttribute('tabindex', '-1');
    painel.innerHTML = `
        <button class="painel-contextual__fechar" type="button" aria-label="Fechar informações de ${nome}" data-acao="fechar">
            <i class="fas fa-times" aria-hidden="true"></i>
        </button>
        <p class="painel-contextual__categoria">${categoria}</p>
        <h2 class="painel-contextual__titulo" id="titulo-painel-contextual">${nome}</h2>
        <p class="painel-contextual__descricao">${descricao}</p>
        <dl class="painel-contextual__informacoes">
            <div><dt>Plataforma</dt><dd>${plataforma}</dd></div>
            <div><dt>Status</dt><dd>${status}</dd></div>
            <div><dt>Avaliação</dt><dd>${avaliacao}</dd></div>
            <div><dt>Preço</dt><dd>${obterTextoPreco(jogo)}</dd></div>
            <div><dt>Lançamento</dt><dd>${formatarDataBrasileira(jogo.data_lancamento)}</dd></div>
        </dl>
        <a class="botao-detalhes painel-contextual__acao" href="pages/pagina.html?id=${encodeURIComponent(jogo.id)}">
            Ver detalhes <i class="fas fa-arrow-right" aria-hidden="true"></i>
        </a>
    `;
    return painel;
}

function posicionarPainelContextual() {
    if (!painelContextual || !cardSelecionado) return;
    const margem = 12;
    const distancia = 14;
    const cartao = cardSelecionado.getBoundingClientRect();
    const largura = painelContextual.offsetWidth;
    const altura = painelContextual.offsetHeight;
    const cabeDireita = cartao.right + distancia + largura <= window.innerWidth - margem;
    const esquerda = cabeDireita ? cartao.right + distancia : cartao.left - largura - distancia;
    const limiteEsquerdo = Math.max(margem, window.innerWidth - largura - margem);
    const topo = Math.min(Math.max(margem, cartao.top), Math.max(margem, window.innerHeight - altura - margem));

    painelContextual.style.left = `${Math.min(Math.max(margem, esquerda), limiteEsquerdo)}px`;
    painelContextual.style.top = `${topo}px`;
}

function alternarPainelContextual(card) {
    if (cardSelecionado === card) {
        fecharPainelContextual();
        return;
    }

    fecharPainelContextual(false);
    const jogo = listaDeJogos.find(item => Number(item.id) === Number(card.dataset.id));
    if (!jogo) return;

    painelContextual = criarPainelContextual(jogo);
    cardSelecionado = card;
    document.body.appendChild(painelContextual);
    card.classList.add('selecionado');
    card.setAttribute('aria-expanded', 'true');
    painelContextual.querySelector('[data-acao="fechar"]').addEventListener('click', fecharPainelContextual);
    painelContextual.querySelector('.painel-contextual__acao').addEventListener('click', fecharPainelContextual);
    posicionarPainelContextual();
    requestAnimationFrame(() => {
        painelContextual.classList.add('visivel');
        painelContextual.querySelector('[data-acao="fechar"]')?.focus();
    });
}

function fecharPainelContextual(restaurarFoco = true) {
    if (!painelContextual) return;
    const painelAtual = painelContextual;
    const cardAtual = cardSelecionado;
    painelContextual = null;
    cardSelecionado = null;
    cardAtual?.classList.remove('selecionado');
    cardAtual?.setAttribute('aria-expanded', 'false');
    painelAtual.classList.remove('visivel');
    setTimeout(() => painelAtual.remove(), 180);
    if (restaurarFoco && cardAtual) cardAtual.focus({ preventScroll: true });
}

function toggleCard(card) {
    if (cardAberto === card) {
        fecharCard(card);
    } else {
        if (cardAberto) fecharCard(cardAberto);
        abrirCard(card);
    }
}

function abrirCard(card) {
    const rect = card.getBoundingClientRect();
    const larguraMenu = 220; // Mesma largura definida no CSS
    const espacoDireita = window.innerWidth - rect.right;
    
    if (espacoDireita < larguraMenu) {
        card.classList.add('open-left');
    } else {
        card.classList.remove('open-left');
    }
    
    card.classList.add('open');
    cardAberto = card;
}

function fecharCard(card) {
    card.classList.remove('open');
    card.classList.remove('open-left');
    if (cardAberto === card) cardAberto = null;
}

let painelContextual = null;
let cardSelecionado = null;

document.addEventListener('click', evento => {
    if (!galeriaCategorias || !painelContextual || !cardSelecionado) return;
    if (!painelContextual.contains(evento.target) && !cardSelecionado.contains(evento.target)) fecharPainelContextual(false);
});

document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && painelContextual) fecharPainelContextual();
});

window.addEventListener('resize', posicionarPainelContextual);
window.addEventListener('scroll', posicionarPainelContextual, true);

// ── Função para resetar um filtro específico ────────────────────────────────
function resetarFiltro(menuId) {
    const menu = document.getElementById(menuId);
    if (!menu) return;

    const opcaoTodos = menu.querySelector('.opcao-filtro[data-filtro="todos"]');
    if (opcaoTodos) {
        menu.querySelectorAll('.opcao-filtro').forEach(o => o.classList.remove('selecionada'));
        opcaoTodos.classList.add('selecionada');

        const valor = opcaoTodos.dataset.filtro;
        if (menuId === 'menu-categorias') categoriaAtiva = valor;
        if (menuId === 'menu-plataforma') plataformaAtiva = valor;
        if (menuId === 'menu-genero') generoAtivo = valor;
        if (menuId === 'menu-etaria') etariaAtiva = valor;
        if (menuId === 'menu-ano') anoAtivo = valor;
        if (menuId === 'menu-preco') precoAtivo = valor;

        aplicarFiltros();

        const botaoPrincipal = document.querySelector(`.botao-filtro-principal[data-menu="${menuId}"]`);
        if (botaoPrincipal) {
            botaoPrincipal.classList.remove('ativo');
        }
    }
    menu.classList.remove('show');
}

function aplicarFiltros() {
    const jogosFiltrados = listaDeJogos.filter(jogo => {
        const cat = categoriaAtiva === "todos" || jogo.categoria === categoriaAtiva;
        const plat = plataformaAtiva === "todos" || jogo.plataforma === plataformaAtiva;
        const gen = generoAtivo === "todos" || jogo.genero === generoAtivo;
        const eta = etariaAtiva === "todos" || normalizarEtaria(jogo.etaria).codigo === etariaAtiva;
        const ano = anoAtivo === "todos" || jogo.ano === anoAtivo;

        let precoMatch = true;
        const precoNum = typeof jogo.preco === 'string' ? parseFloat(jogo.preco) : jogo.preco;
        if (precoAtivo !== "todos") {
            switch (precoAtivo) {
                case "gratis":
                    precoMatch = precoNum === 0;
                    break;
                case "baixo":
                    precoMatch = precoNum > 0 && precoNum <= 50;
                    break;
                case "medio":
                    precoMatch = precoNum > 50 && precoNum <= 150;
                    break;
                case "alto":
                    precoMatch = precoNum > 150;
                    break;
                default:
                    precoMatch = true;
            }
        }

        const bus = jogo.nome.toLowerCase().includes(termoPesquisa.toLowerCase());
        return cat && plat && gen && eta && ano && precoMatch && bus;
    });
    renderizarJogos(jogosFiltrados);
    atualizarBotoesFiltro();
}

function atualizarBotoesFiltro() {
    const filtros = {
        'menu-categorias': categoriaAtiva,
        'menu-plataforma': plataformaAtiva,
        'menu-genero': generoAtivo,
        'menu-etaria': etariaAtiva,
        'menu-ano': anoAtivo,
        'menu-preco': precoAtivo
    };

    Object.keys(filtros).forEach(menuId => {
        const botao = document.querySelector(`.botao-filtro-principal[data-menu="${menuId}"]`);
        if (botao) {
            if (filtros[menuId] !== 'todos') {
                botao.classList.add('ativo');
            } else {
                botao.classList.remove('ativo');
            }
        }
    });
}

// ── Busca ────────────────────────────────────────────────────────────────────
if (campoBusca) {
    campoBusca.addEventListener('input', () => {
        termoPesquisa = campoBusca.value;
        aplicarFiltros();
    });
}

// ── Eventos de Filtro ────────────────────────────────────────────────────────
document.querySelectorAll('.botao-filtro-principal').forEach(botao => {
    botao.addEventListener('click', e => {
        e.stopPropagation();
        const menuId = botao.dataset.menu;
        const menu = document.getElementById(menuId);

        document.querySelectorAll('.menu-flutuante.show').forEach(m => {
            if (m !== menu) m.classList.remove('show');
        });

        if (menu) menu.classList.toggle('show');
    });
});

document.querySelectorAll('.btn-reset-filtro').forEach(btn => {
    btn.addEventListener('click', e => {
        e.stopPropagation();
        const menuId = btn.dataset.menu;
        resetarFiltro(menuId);
    });
});

document.querySelectorAll('.opcao-filtro[data-filtro]').forEach(opcao => {
    opcao.addEventListener('click', e => {
        e.stopPropagation();
        const grupo = opcao.closest('.menu-flutuante').id;
        const valor = opcao.dataset.filtro;

        document.querySelectorAll(`#${grupo} .opcao-filtro`).forEach(o => o.classList.remove('selecionada'));
        opcao.classList.add('selecionada');

        if (grupo === 'menu-categorias') categoriaAtiva = valor;
        if (grupo === 'menu-plataforma') plataformaAtiva = valor;
        if (grupo === 'menu-genero') generoAtivo = valor;
        if (grupo === 'menu-etaria') etariaAtiva = valor;
        if (grupo === 'menu-ano') anoAtivo = valor;
        if (grupo === 'menu-preco') precoAtivo = valor;

        aplicarFiltros();
        opcao.closest('.menu-flutuante').classList.remove('show');
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.menu-flutuante.show').forEach(m => m.classList.remove('show'));
});

// ── Carrossel ────────────────────────────────────────────────────────────────
(function iniciarCarrossel() {
    const track = document.getElementById('carouselTrack');
    const indicadores = document.getElementById('carouselIndicators');
    if (!track || !indicadores) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const total = slides.length;
    const DURACAO = 5000;
    let atual = 0;
    let intervalo = null;

    slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'carousel-indicator' + (i === 0 ? ' ativo' : '');
        btn.addEventListener('click', () => irPara(i));
        indicadores.appendChild(btn);
    });

    function irPara(idx) {
        atual = (idx + total) % total;
        track.style.transform = `translateX(-${atual * 100}%)`;
        document.querySelectorAll('.carousel-indicator').forEach((b, i) => {
            b.classList.toggle('ativo', i === atual);
        });
        reiniciarIntervalo();
    }

    function avancar() { irPara(atual + 1); }

    function reiniciarIntervalo() {
        clearInterval(intervalo);
        intervalo = setInterval(avancar, DURACAO);
    }

    reiniciarIntervalo();
})();

// ── Renderização inicial ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    carregarJogos();
});
