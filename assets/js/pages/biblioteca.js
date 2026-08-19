/* ─── BIBLIOTECA — LISTAGEM, CARDS E PAGINAÇÃO ─────────────────────────────── */

const ITENS_POR_PAGINA = 12;
let paginaAtual = 1;
let totalPaginas = 1;
let cliqueTimer = null; // Timer para distinguir clique único de duplo

const gradeJogosBiblioteca = document.getElementById('gradeJogosBiblioteca');
const contadorCatalogo = document.getElementById('catalogoContador');
const paginacaoCatalogo = document.getElementById('catalogoPaginacao');
const botaoPaginaAnterior = document.getElementById('btnPaginaAnterior');
const botaoPaginaProxima = document.getElementById('btnPaginaProxima');
const informacaoPagina = document.getElementById('infoPagina');

function escaparHtml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Converte diferentes formatos cadastrados no banco para os códigos oficiais.
function normalizarEtaria(valor) {
    const texto = String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

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

// Converte caminhos salvos no banco para o contexto da pasta /pages.
function obterCaminhoImagem(caminho) {
    const imagemPadrao = '../assets/img/naoencontrada.png';
    if (!caminho) return imagemPadrao;
    if (/^(https?:)?\/\//.test(caminho) || caminho.startsWith('/')) return caminho;
    if (caminho.startsWith('../')) return caminho;
    return `../${caminho}`;
}

function obterInformacoesPreco(jogo) {
    const precoNumerico = typeof jogo.preco === 'string' ? parseFloat(jogo.preco) : Number(jogo.preco);

    if (precoNumerico === 0) {
        return { classe: 'gratis', texto: 'Grátis' };
    }
    if (precoNumerico <= 50) {
        return { classe: 'baixo', texto: `R$ ${formatarPreco(precoNumerico)}` };
    }
    if (precoNumerico <= 150) {
        return { classe: 'medio', texto: `R$ ${formatarPreco(precoNumerico)}` };
    }
    return { classe: 'alto', texto: `R$ ${formatarPreco(precoNumerico)}` };
}

function criarCardBiblioteca(jogo, indice) {
    const preco = obterInformacoesPreco(jogo);
    const statusDisponivel = jogo.status === 'Disponível';
    const idJogo = Number(jogo.id);
    const nome = escaparHtml(jogo.nome || 'Jogo sem nome');
    const descricao = escaparHtml(jogo.descricao || 'Descrição não disponível.');
    const caminhoImagem = escaparHtml(obterCaminhoImagem(jogo.img));
    const informacaoEtaria = normalizarEtaria(jogo.etaria);
    const etaria = escaparHtml(informacaoEtaria.rotulo);
    const classeEtaria = informacaoEtaria.classe;

    const urlDetalhes = `pagina.html?id=${encodeURIComponent(jogo.id)}`;
    const urlCategoria = `biblioteca.html?categoria=${encodeURIComponent(jogo.categoria || '')}`;
    const urlGenero = `biblioteca.html?genero=${encodeURIComponent(jogo.genero || '')}`;
    const urlPlataforma = `biblioteca.html?plataforma=${encodeURIComponent(jogo.plataforma || '')}`;
    const categoriaTexto = escaparHtml(jogo.categoria || 'Sem categoria');
    const generoTexto = escaparHtml(jogo.genero || 'Não informado');
    const plataformaTexto = escaparHtml(jogo.plataforma || 'Não informada');

    return `
        <article class="card-jogo animar-entrada" data-id="${idJogo}" style="animation-delay:${indice * 0.08}s">
            <div class="card-jogo-sidebar">
                <img src="${caminhoImagem}" alt="Capa de ${nome}" loading="lazy" onerror="this.onerror=null; this.src='../assets/img/naoencontrada.png';">
                <span class="badge-etaria ${classeEtaria}">${etaria}</span>
            </div>
            <div class="card-jogo-content">
                <h2 class="card-jogo-titulo"><a href="${urlDetalhes}" title="Ver detalhes de ${nome}">${nome}</a></h2>
                <p class="card-jogo-descricao">${descricao}</p>
                <div class="card-jogo-info">
                    <a href="${urlCategoria}" class="info-tag link-tag" title="Filtrar por categoria ${categoriaTexto}"><i class="fas fa-tag" aria-hidden="true"></i> ${categoriaTexto}</a>
                    <a href="${urlGenero}" class="info-tag link-tag" title="Filtrar por gênero ${generoTexto}"><i class="fas fa-gamepad" aria-hidden="true"></i> ${generoTexto}</a>
                    <a href="${urlPlataforma}" class="info-tag link-tag" title="Filtrar por plataforma ${plataformaTexto}"><i class="fas fa-desktop" aria-hidden="true"></i> ${plataformaTexto}</a>
                    <span class="info-tag"><i class="fas fa-shield-alt" aria-hidden="true"></i> ${etaria}</span>
                    <span class="info-tag"><i class="fas fa-calendar" aria-hidden="true"></i> ${escaparHtml(jogo.ano)}</span>
                    <span class="info-tag info-preco ${preco.classe}"><i class="fas fa-dollar-sign" aria-hidden="true"></i> ${preco.texto}</span>
                    <span class="info-tag info-status ${statusDisponivel ? 'status-disponivel' : 'status-em-breve'}">
                        <i class="fas fa-circle" aria-hidden="true"></i> ${escaparHtml(jogo.status || 'Indisponível')}
                    </span>
                </div>
                <button class="botao-detalhes" type="button" data-id="${idJogo}">
                    <i class="fas fa-chevron-right" aria-hidden="true"></i> Ver detalhes
                </button>
            </div>
        </article>`;
}

function atualizarContadorCatalogo(totalItens, inicio, fim) {
    if (!contadorCatalogo) return;

    if (totalItens === 0) {
        contadorCatalogo.textContent = '';
        return;
    }

    contadorCatalogo.textContent = `Exibindo ${inicio + 1}–${fim} de ${totalItens} jogos`;
}

function atualizarPaginacao() {
    if (!paginacaoCatalogo || !botaoPaginaAnterior || !botaoPaginaProxima || !informacaoPagina) return;

    const possuiMaisDeUmaPagina = totalPaginas > 1;
    paginacaoCatalogo.hidden = !possuiMaisDeUmaPagina;
    informacaoPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    botaoPaginaAnterior.disabled = paginaAtual <= 1;
    botaoPaginaProxima.disabled = paginaAtual >= totalPaginas;
    botaoPaginaAnterior.setAttribute('aria-label', 'Ir para a página anterior');
    botaoPaginaProxima.setAttribute('aria-label', 'Ir para a próxima página');
}

function renderizarEstadoVazio() {
    if (!gradeJogosBiblioteca) return;

    gradeJogosBiblioteca.innerHTML = `
        <div class="estado-biblioteca" role="status">
            <i class="fas fa-search" aria-hidden="true"></i>
            <p>Nenhum jogo encontrado com os filtros selecionados.</p>
            <small>Tente remover um filtro ou alterar o termo de busca.</small>
        </div>`;
}

function renderizarJogos(lista) {
    if (!gradeJogosBiblioteca) return;

    const totalItens = lista.length;
    totalPaginas = Math.max(1, Math.ceil(totalItens / ITENS_POR_PAGINA));
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const jogosDaPagina = lista.slice(inicio, inicio + ITENS_POR_PAGINA);

    if (jogosDaPagina.length === 0) {
        renderizarEstadoVazio();
        atualizarContadorCatalogo(0, 0, 0);
        atualizarPaginacao();
        return;
    }

    gradeJogosBiblioteca.innerHTML = jogosDaPagina.map(criarCardBiblioteca).join('');
    atualizarContadorCatalogo(totalItens, inicio, inicio + jogosDaPagina.length);
    atualizarPaginacao();
    adicionarEventosCardsBiblioteca();
}

function adicionarEventosCardsBiblioteca() {
    document.querySelectorAll('#gradeJogosBiblioteca .card-jogo').forEach(card => {
        const id = Number(card.dataset.id);
        const abrirDetalhes = () => {
            window.location.href = `pagina.html?id=${encodeURIComponent(id)}`;
        };

        // Lógica unificada para clique único e duplo
        card.addEventListener('click', evento => {
            if (evento.target.closest('.botao-detalhes')) return;

            if (cliqueTimer) {
                // Segundo clique detectado: Navega para detalhes
                clearTimeout(cliqueTimer);
                cliqueTimer = null;
                abrirDetalhes();
            } else {
                // Primeiro clique detectado: Aguarda intervalo
                cliqueTimer = setTimeout(() => {
                    cliqueTimer = null;
                    // Clique único: Abre/Fecha o card (visualização rápida)
                    card.classList.toggle('open');
                }, 250);
            }
        });

        // Clique direto no botão de detalhes
        card.querySelector('.botao-detalhes')?.addEventListener('click', evento => {
            evento.stopPropagation();
            abrirDetalhes();
        });

        // Suporte a teclado
        card.addEventListener('keydown', evento => {
            if (evento.key === 'Enter' || evento.key === ' ') {
                if (evento.target.closest('.botao-detalhes')) return;
                evento.preventDefault();
                card.classList.toggle('open');
            }
        });
    });
}

function reiniciarPaginacao() {
    paginaAtual = 1;
}

function configurarPaginacao() {
    botaoPaginaAnterior?.addEventListener('click', () => {
        if (paginaAtual <= 1) return;
        paginaAtual -= 1;
        renderizarJogos(jogosFiltradosAtuais);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    botaoPaginaProxima?.addEventListener('click', () => {
        if (paginaAtual >= totalPaginas) return;
        paginaAtual += 1;
        renderizarJogos(jogosFiltradosAtuais);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

async function carregarJogosBiblioteca() {
    try {
        const resposta = await fetch('../php/api/jogo.php?acao=listar');
        if (!resposta.ok) throw new Error('Erro na resposta do servidor');

        const dados = await resposta.json();
        if (!dados.success) throw new Error(dados.message || 'Não foi possível carregar os jogos');

        listaDeJogos = Array.isArray(dados.jogos) ? dados.jogos : [];
        aplicarFiltros();
    } catch (erro) {
        console.error('Erro ao carregar jogos da biblioteca:', erro);
        if (!gradeJogosBiblioteca) return;

        gradeJogosBiblioteca.innerHTML = `
            <div class="estado-biblioteca estado-biblioteca--erro" role="alert">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <p>Não foi possível carregar a biblioteca no momento.</p>
                <small>Verifique a conexão com o servidor e tente novamente.</small>
                <button class="botao-detalhes" type="button" id="botaoTentarBiblioteca">Tentar novamente</button>
            </div>`;

        document.getElementById('botaoTentarBiblioteca')?.addEventListener('click', carregarJogosBiblioteca);
        atualizarContadorCatalogo(0, 0, 0);
        if (paginacaoCatalogo) paginacaoCatalogo.hidden = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    configurarPaginacao();
    carregarJogosBiblioteca();
});
