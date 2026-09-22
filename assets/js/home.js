/* ─── HOME — CARROSSEL E FILTROS DE JOGOS ──────────────────────────────────── */

// ── Dados dos jogos (unificados) ──────────────────────────
let listaDeJogos = [];
let idsMinhaLista = new Set();
let idsRecomendacoes = new Set();

// Função para carregar jogos do backend MySQL
async function carregarJogos() {
    try {
        const response = await fetch('php/games.php');
        listaDeJogos = await response.json();
        try {
            const respostaLista = await fetch('php/api/user.php?acao=minha_lista', { credentials: 'include', cache: 'no-store' });
            const dadosLista = await respostaLista.json();
            idsMinhaLista = new Set((dadosLista.lista || []).map(jogo => Number(jogo.jogo_id)));
            const respostaRecomendacoes = await fetch('php/api/user.php?acao=recomendacoes', { credentials: 'include', cache: 'no-store' });
            const dadosRecomendacoes = await respostaRecomendacoes.json();
            idsRecomendacoes = new Set((dadosRecomendacoes.recomendacoes || []).map(jogo => Number(jogo.id)));
	        } catch (erroLista) {
	            idsMinhaLista = new Set();
	            idsRecomendacoes = new Set();
	        }
	        if (typeof window.carregarPrecosDosJogos === 'function') {
	            await window.carregarPrecosDosJogos(listaDeJogos, 'php/api/precos.php');
	        }
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
let jogosFiltradosAtuais = [];
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
        titulo: '🎯 Recomendados para você',
        descricao: 'Ofertas personalizadas conforme suas preferências.',
        filtrar: jogo => idsRecomendacoes.has(Number(jogo.id))
    },
    {
        id: 'minha-lista',
        titulo: '♡ Minha Lista',
        descricao: 'Jogos acompanhados pelo usuário conectado.',
        filtrar: jogo => idsMinhaLista.has(Number(jogo.id))
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
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}

const sinonimosBusca = {
    witcher: ['the witcher'],
    'cavaleiro oco': ['hollow knight'],
    'cavaleiros ocos': ['hollow knight'],
    zelda: ['the legend of zelda'],
    'zelda tears': ['the legend of zelda tears'],
    ragnarok: ['god of war ragnarok'],
    'deus da guerra': ['god of war'],
    'deuses da guerra': ['god of war'],
    'anel antigo': ['elden ring']
};

function distanciaLevenshtein(primeiro, segundo) {
    const linha = Array.from({ length: segundo.length + 1 }, (_, indice) => indice);
    for (let indice = 1; indice <= primeiro.length; indice += 1) {
        let diagonal = linha[0];
        linha[0] = indice;
        for (let coluna = 1; coluna <= segundo.length; coluna += 1) {
            const acima = linha[coluna];
            linha[coluna] = primeiro[indice - 1] === segundo[coluna - 1]
                ? diagonal
                : Math.min(diagonal + 1, acima + 1, linha[coluna - 1] + 1);
            diagonal = acima;
        }
    }
    return linha[segundo.length];
}

function pontuarBusca(jogo, termo) {
    if (!termo) return 0;
    const nome = normalizarTexto(jogo.nome);
    const consultas = [termo, ...(sinonimosBusca[termo] || [])];
    let melhorPontuacao = 0;

    consultas.forEach(consulta => {
        if (nome === consulta) melhorPontuacao = Math.max(melhorPontuacao, 1000);
        else if (nome.startsWith(consulta)) melhorPontuacao = Math.max(melhorPontuacao, 800);
        else if (nome.includes(consulta)) melhorPontuacao = Math.max(melhorPontuacao, 650);

        const palavrasBusca = consulta.split(' ').filter(Boolean);
        const palavrasNome = nome.split(' ').filter(Boolean);
        const palavrasEncontradas = palavrasBusca.filter(palavraBusca => palavrasNome.some(palavraNome => {
            if (palavraNome.startsWith(palavraBusca) || palavraBusca.startsWith(palavraNome)) return true;
            const limite = palavraBusca.length >= 5 ? 2 : palavraBusca.length > 3 ? 1 : 0;
            return palavraBusca.length >= 4 && distanciaLevenshtein(palavraBusca, palavraNome) <= limite;
        }));
        if (palavrasEncontradas.length === palavrasBusca.length) {
            melhorPontuacao = Math.max(melhorPontuacao, 400 + palavrasEncontradas.length * 20);
        }
    });
    return melhorPontuacao;
}

function obterRelevanciaBusca(jogo, termo) {
    const pontuacao = pontuarBusca(jogo, termo);
    return pontuacao || (termo ? -1 : 0);
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

function criarMarkupCard(jogo, indice) {
	    const precoComparado = typeof window.obterPrecoComparado === 'function'
	        ? window.obterPrecoComparado(jogo)
	        : { valor: null, texto: 'Preço indisponível' };
	    const precoNum = precoComparado.valor;
	    let precoClasse = '';
	    let precoTexto = precoComparado.texto;

	    if (precoNum === null || precoNum === undefined) {
	        precoClasse = 'indisponivel';
	    } else if (precoNum === 0) {
	        precoClasse = 'gratis';
	        precoTexto = 'Grátis';
	    } else if (precoNum <= 50) {
	        precoClasse = 'baixo';
	    } else if (precoNum <= 150) {
	        precoClasse = 'medio';
	    } else {
	        precoClasse = 'alto';
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
    const imagem = escaparHtml(window.obterCaminhoImagem(jogo.img, jogo.slug));
    const classeStatus = normalizarTexto(jogo.status) === 'disponivel' ? 'status-disponivel' : 'status-em-breve';
    const atributosInteracao = galeriaCategorias
        ? `role="button" tabindex="0" aria-expanded="false" aria-controls="painel-contextual-jogo" aria-label="Abrir informações de ${nome}"`
        : '';

    const urlDetalhes = `pages/pagina.html?id=${encodeURIComponent(jogo.id)}`;
    const urlCategoria = `pages/biblioteca.html?categoria=${encodeURIComponent(jogo.categoria || '')}`;
    const urlGenero = `pages/biblioteca.html?genero=${encodeURIComponent(jogo.genero || '')}`;
    const urlPlataforma = `pages/biblioteca.html?plataforma=${encodeURIComponent(jogo.plataforma || '')}`;

    const censurado = typeof jogoDeveSerCensurado === 'function' && jogoDeveSerCensurado(jogo);
    const overlayCensura = censurado ? `
        <div class="card-censura-overlay">
            <i class="fas fa-lock"></i>
            <h3 class="card-censura-titulo">🔒 Conteúdo restrito</h3>
            <p class="card-censura-sub">Classificação: ${etaria} anos</p>
        </div>
    ` : '';

    return `
        <article class="card-jogo animar-entrada${galeriaCategorias ? ' card-jogo--contextual' : ''}" data-id="${escaparHtml(jogo.id)}" style="animation-delay:${indice * 0.08}s" ${atributosInteracao}>
            ${overlayCensura}
            <div class="card-jogo-sidebar">
                <img src="${imagem}" alt="Capa de ${nome}" loading="lazy" onerror="this.onerror=null; this.src='assets/img/naoencontrada.png'">
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
                    <button class="galeria-botao-navegacao galeria-botao-navegacao--esquerda" type="button" aria-label="Rolar para esquerda" data-grade="grade-${definicao.id}" data-direcao="-1">
                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    <div class="grade-jogos galeria-categoria__grade" id="grade-${definicao.id}" aria-label="${definicao.titulo}">
                        ${jogosDaCategoria.map(criarMarkupCard).join('')}
                    </div>
                    <button class="galeria-botao-navegacao galeria-botao-navegacao--direita" type="button" aria-label="Rolar para direita" data-grade="grade-${definicao.id}" data-direcao="1">
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
    inicializarCarrosseisCards();
}

function inicializarCarrosseisCards() {
    document.querySelectorAll('.galeria-categoria__grade').forEach(grade => {
        if (grade.dataset.loopInicializado === 'true') return;

        const cards = Array.from(grade.querySelectorAll('.card-jogo'));
        if (cards.length < 2) return;

        const estilos = getComputedStyle(grade);
        const gap = parseFloat(estilos.columnGap || estilos.gap) || 0;
        const larguraOriginal = cards.reduce((total, card) => total + card.offsetWidth, 0) + gap * cards.length;
        const criarCopias = () => cards.map(card => {
            const copia = card.cloneNode(true);
            copia.setAttribute('aria-hidden', 'true');
            copia.setAttribute('tabindex', '-1');
            return copia;
        });

        const copiasAntes = criarCopias();
        const copiasDepois = criarCopias();
        grade.prepend(...copiasAntes);
        grade.append(...copiasDepois);
        adicionarEventosCards([...copiasAntes, ...copiasDepois]);
        grade.dataset.loopInicializado = 'true';
        grade.scrollLeft = larguraOriginal;

        let ajusteAgendado = null;
        let ajustando = false;
        const reposicionarSemMovimento = deslocamento => {
            const comportamentoAnterior = grade.style.scrollBehavior;
            grade.style.scrollBehavior = 'auto';
            grade.scrollLeft += deslocamento;
            requestAnimationFrame(() => {
                grade.style.scrollBehavior = comportamentoAnterior;
            });
        };
        const normalizarLoop = () => {
            if (ajustando) return;
            if (grade.scrollLeft <= 1) {
                ajustando = true;
                reposicionarSemMovimento(larguraOriginal);
            } else if (grade.scrollLeft >= (larguraOriginal * 2) - 1) {
                ajustando = true;
                reposicionarSemMovimento(-larguraOriginal);
            }
            if (ajustando) requestAnimationFrame(() => { ajustando = false; });
        };
        if ('onscrollend' in grade) {
            grade.addEventListener('scrollend', normalizarLoop);
        } else {
            grade.addEventListener('scroll', () => {
                clearTimeout(ajusteAgendado);
                ajusteAgendado = setTimeout(normalizarLoop, 220);
            }, { passive: true });
        }

        const container = grade.closest('.galeria-categoria__container');
        container?.querySelectorAll('.galeria-botao-navegacao').forEach(botao => {
            botao.addEventListener('click', () => {
                const direcao = Number(botao.dataset.direcao) || 1;
                grade.scrollBy({ left: direcao * 600, behavior: 'smooth' });
            });
        });
    });
}

function adicionarEventosCards(cards = document.querySelectorAll('.card-jogo')) {
    Array.from(cards).forEach(card => {
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
	    const comparacao = typeof window.obterPrecoComparado === 'function'
	        ? window.obterPrecoComparado(jogo)
	        : { valor: null, texto: 'Preço indisponível' };
	    if (comparacao.valor === null || comparacao.valor === undefined) return 'Preço indisponível';
	    if (comparacao.valor === 0) return '<strong>Grátis</strong>';
	    return `<strong>${escaparHtml(comparacao.texto)}</strong>`;
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

// ── Fonte única de verdade dos filtros do catálogo ──────────────────────────
const mapaFiltros = {
    'menu-categorias': 'categoria',
    'menu-plataforma': 'plataforma',
    'menu-genero': 'genero',
    'menu-etaria': 'etaria',
    'menu-ano': 'ano',
    'menu-preco': 'preco'
};

function obterFiltrosAtivos() {
    return {
        categoria: categoriaAtiva,
        plataforma: plataformaAtiva,
        genero: generoAtivo,
        etaria: etariaAtiva,
        ano: anoAtivo,
        preco: precoAtivo
    };
}

function definirFiltroAtivo(menuId, valor) {
    const propriedade = mapaFiltros[menuId];
    if (!propriedade) return;
    const valorNormalizado = normalizarTexto(valor) || 'todos';
    if (propriedade === 'categoria') categoriaAtiva = valorNormalizado;
    if (propriedade === 'plataforma') plataformaAtiva = valorNormalizado;
    if (propriedade === 'genero') generoAtivo = valorNormalizado;
    if (propriedade === 'etaria') etariaAtiva = valor === 'L' ? 'L' : valorNormalizado;
    if (propriedade === 'ano') anoAtivo = valorNormalizado;
    if (propriedade === 'preco') precoAtivo = valorNormalizado;
}

function plataformaCorresponde(valor, filtro) {
    const plataforma = normalizarTexto(valor);
    if (!plataforma || filtro === 'todos') return true;
    const partes = plataforma.split(/[,/|+]+/).map(parte => parte.trim()).filter(Boolean);
    return partes.some(parte => parte === filtro || parte.startsWith(`${filtro} `));
}

	function aplicarFiltros() {
	    const termo = normalizarTexto(termoPesquisa);
	    const filtros = obterFiltrosAtivos();
	    jogosFiltradosAtuais = listaDeJogos.map((jogo, indice) => ({ jogo, indice, relevancia: obterRelevanciaBusca(jogo, termo) }))
	        .filter(({ relevancia }) => !termo || relevancia >= 0)
	        .filter(({ jogo }) => {
	        const precoComparado = typeof window.obterPrecoComparado === 'function'
	            ? window.obterPrecoComparado(jogo)
	            : { valor: null };
	        const preco = precoComparado.valor;
	        const precoCorrespondente = filtros.preco === 'todos'
	            || (filtros.preco === 'gratis' && false)
	            || (filtros.preco === 'baixo' && preco > 0 && preco <= 50)
	            || (filtros.preco === 'medio' && preco > 50 && preco <= 150)
            || (filtros.preco === 'alto' && preco > 150);
	        return (filtros.categoria === 'todos' || normalizarTexto(jogo.categoria) === filtros.categoria)
            && plataformaCorresponde(jogo.plataforma, filtros.plataforma)
            && (filtros.genero === 'todos' || normalizarTexto(jogo.genero) === filtros.genero)
            && (filtros.etaria === 'todos' || normalizarEtaria(jogo.etaria).codigo === filtros.etaria)
            && (filtros.ano === 'todos' || String(jogo.ano ?? '') === filtros.ano)
	            && precoCorrespondente;
	    })
	        .sort((primeiro, segundo) => segundo.relevancia - primeiro.relevancia || primeiro.indice - segundo.indice)
	        .map(({ jogo }) => jogo);

    if (typeof reiniciarPaginacao === 'function') reiniciarPaginacao();
    if (typeof renderizarJogos === 'function') renderizarJogos(jogosFiltradosAtuais);
    atualizarBotoesFiltro();
}

function atualizarBotoesFiltro() {
    const filtros = obterFiltrosAtivos();
    Object.entries(mapaFiltros).forEach(([menuId, propriedade]) => {
        const botao = document.querySelector(`.botao-filtro-principal[data-menu="${menuId}"]`);
        if (!botao) return;
        botao.classList.toggle('ativo', filtros[propriedade] !== 'todos');
        botao.setAttribute('aria-expanded', document.getElementById(menuId)?.classList.contains('show') ? 'true' : 'false');
    });
}

function resetarFiltro(menuId) {
    const menu = document.getElementById(menuId);
    const opcaoTodos = menu?.querySelector('.opcao-filtro[data-filtro="todos"]');
    if (!menu || !opcaoTodos) return;
    menu.querySelectorAll('.opcao-filtro').forEach(opcao => opcao.classList.remove('selecionada'));
    opcaoTodos.classList.add('selecionada');
    definirFiltroAtivo(menuId, 'todos');
    menu.classList.remove('show');
    aplicarFiltros();
}

function inicializarFiltros() {
    document.querySelectorAll('.botao-filtro-principal').forEach(botao => {
        if (botao.dataset.filtroInicializado) return;
        botao.dataset.filtroInicializado = 'true';
        botao.addEventListener('click', evento => {
            evento.stopPropagation();
            const menu = document.getElementById(botao.dataset.menu);
            document.querySelectorAll('.menu-flutuante.show').forEach(aberto => {
                if (aberto !== menu) aberto.classList.remove('show');
            });
            menu?.classList.toggle('show');
            atualizarBotoesFiltro();
        });
    });

    document.querySelectorAll('.btn-reset-filtro').forEach(botao => {
        if (botao.dataset.filtroInicializado) return;
        botao.dataset.filtroInicializado = 'true';
        botao.addEventListener('click', evento => {
            evento.stopPropagation();
            resetarFiltro(botao.dataset.menu);
        });
    });

    document.querySelectorAll('.opcao-filtro[data-filtro]').forEach(opcao => {
        if (opcao.dataset.filtroInicializado) return;
        opcao.dataset.filtroInicializado = 'true';
        opcao.addEventListener('click', evento => {
            evento.stopPropagation();
            const menu = opcao.closest('.menu-flutuante');
            if (!menu) return;
            menu.querySelectorAll('.opcao-filtro').forEach(item => item.classList.remove('selecionada'));
            opcao.classList.add('selecionada');
            definirFiltroAtivo(menu.id, opcao.dataset.filtro);
            menu.classList.remove('show');
            aplicarFiltros();
        });
    });

    if (campoBusca && !campoBusca.dataset.filtroInicializado) {
        campoBusca.dataset.filtroInicializado = 'true';
        campoBusca.addEventListener('input', () => {
            termoPesquisa = campoBusca.value;
            aplicarFiltros();
        });
    }
    atualizarBotoesFiltro();
}

document.addEventListener('click', () => {
    document.querySelectorAll('.menu-flutuante.show').forEach(menu => menu.classList.remove('show'));
    atualizarBotoesFiltro();
});
document.addEventListener('keydown', evento => {
    if (evento.key !== 'Escape') return;
    document.querySelectorAll('.menu-flutuante.show').forEach(menu => menu.classList.remove('show'));
    atualizarBotoesFiltro();
});
document.addEventListener('DOMContentLoaded', inicializarFiltros);
inicializarFiltros();

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
    if (galeriaCategorias) carregarJogos();
});
