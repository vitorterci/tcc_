/**
 * Lógica de Integração e Carregamento Dinâmico de Detalhes do Jogo
 * Projeto: TCC (Game Search)
 * Linguagem: Português do Brasil (PT-BR)
 */

document.addEventListener('DOMContentLoaded', () => {
    carregarDetalhesJogo();
});

/**
 * Função principal que captura os parâmetros da URL e busca os dados do jogo na API
 */
async function carregarDetalhesJogo() {
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idJogo = parametrosUrl.get('id');
    const slugJogo = parametrosUrl.get('slug');

    if (!idJogo && !slugJogo) {
        exibirEstadoErro('Nenhum identificador de jogo (ID ou Slug) foi fornecido na URL.');
        return;
    }

    exibirEstadoCarregando(true);

    try {
        let urlApi = '../php/api/jogo.php?acao=buscar';
        if (idJogo) {
            urlApi += `&id=${encodeURIComponent(idJogo)}`;
        } else {
            urlApi += `&slug=${encodeURIComponent(slugJogo)}`;
        }

        const resposta = await fetch(urlApi);
        const resultado = await resposta.json();

        if (!resultado.success || !resultado.jogo) {
            throw new Error(resultado.message || 'Jogo não encontrado na base de dados.');
        }

        renderizarDetalhesJogo(resultado.jogo);
    } catch (erro) {
        console.error('Erro ao buscar detalhes do jogo:', erro);
        exibirEstadoErro(erro.message || 'Ocorreu um erro ao carregar as informações do jogo.');
    } finally {
        exibirEstadoCarregando(false);
    }
}

/**
 * Renderiza os dados do jogo obtidos da API no DOM da página
 * @param {Object} jogo Objeto contendo os dados do jogo
 */
function renderizarDetalhesJogo(jogo) {
    // Breadcrumb e Títulos
    const elementoBreadcrumbNome = document.getElementById('breadcrumb-nome');
    const elementoTitulo = document.getElementById('jogo-titulo');
    if (elementoBreadcrumbNome) elementoBreadcrumbNome.textContent = jogo.nome;
    if (elementoTitulo) elementoTitulo.textContent = jogo.nome;
    document.title = `${jogo.nome} — Detalhes | Game Search`;

    // Imagem da Capa
    const elementoCapa = document.getElementById('jogo-capa');
    if (elementoCapa) {
        let caminhoImagem = jogo.img && jogo.img.trim() !== '' ? jogo.img : '../assets/img/naoencontrada.png';
        
        // Se o caminho começar com 'assets/' e estivermos na pasta 'pages/', precisamos subir um nível
        if (caminhoImagem.startsWith('assets/')) {
            caminhoImagem = '../' + caminhoImagem;
        }
        
        elementoCapa.src = caminhoImagem;
        elementoCapa.alt = `Capa do jogo ${jogo.nome}`;
    }

    // Classificação Etária
    const elementoEtaria = document.getElementById('jogo-etaria');
    if (elementoEtaria) {
        const etariaValor = jogo.etaria || 'L';
        elementoEtaria.textContent = etariaValor;
        elementoEtaria.className = `badge-etaria etaria-${etariaValor}`;
    }

    // Metadados (Plataforma, Gênero, Ano)
    const elementoPlataforma = document.getElementById('jogo-plataforma');
    const elementoGenero = document.getElementById('jogo-genero');
    const elementoAno = document.getElementById('jogo-ano');

    if (elementoPlataforma) elementoPlataforma.textContent = jogo.plataforma || 'Multiplataforma';
    if (elementoGenero) elementoGenero.textContent = jogo.genero || 'Geral';
    if (elementoAno) elementoAno.textContent = jogo.ano || new Date().getFullYear();

    // Descrição
    const elementoDescricao = document.getElementById('jogo-descricao');
    if (elementoDescricao) {
        elementoDescricao.textContent = jogo.descricao || 'Nenhuma descrição detalhada informada para este título.';
    }

    // Avaliações e Barras de Progresso Dinâmicas
    atualizarBarraAvaliacao('gameplay', jogo.avaliacao_gameplay);
    atualizarBarraAvaliacao('graficos', jogo.avaliacao_graficos);
    atualizarBarraAvaliacao('historia', jogo.avaliacao_historia);
}

/**
 * Atualiza o valor numérico e a largura da barra de progresso dinamicamente
 * @param {string} tipo Tipo de avaliação (gameplay, graficos, historia)
 * @param {number} nota Nota numérica de 0 a 10
 */
function atualizarBarraAvaliacao(tipo, nota) {
    const notaNormalizada = Math.min(Math.max(parseFloat(nota) || 0, 0), 10);
    const percentual = notaNormalizada * 10; // 0 a 10 vira 0% a 100%

    // Seleciona a barra correspondente baseada na ordem ou estrutura
    const secoesAvaliacao = document.querySelectorAll('.avaliacao-barra');
    let indice = 0;
    if (tipo === 'graficos') indice = 1;
    if (tipo === 'historia') indice = 2;

    if (secoesAvaliacao[indice]) {
        const barraFill = secoesAvaliacao[indice].querySelector('.avaliacao-fill');
        const valorSpan = secoesAvaliacao[indice].querySelector('.avaliacao-valor');

        if (barraFill) {
            barraFill.style.width = `${percentual}%`;
        }
        if (valorSpan) {
            valorSpan.textContent = notaNormalizada.toFixed(1);
        }
    }
}

/**
 * Exibe indicador visual de carregamento na tela
 * @param {boolean} carregando Status de carregamento
 */
function exibirEstadoCarregando(carregando) {
    const elementoTitulo = document.getElementById('jogo-titulo');
    const elementoDescricao = document.getElementById('jogo-descricao');

    if (carregando) {
        if (elementoTitulo) elementoTitulo.textContent = 'Carregando informações...';
        if (elementoDescricao) elementoDescricao.textContent = 'Buscando dados atualizados do jogo no servidor...';
    }
}

/**
 * Exibe mensagem de erro amigável caso o jogo não seja encontrado ou ocorra falha de rede
 * @param {string} mensagemMensagemErro Mensagem descritiva do erro
 */
function exibirEstadoErro(mensagemMensagemErro) {
    const secaoDetalhes = document.querySelector('.detalhes-jogo');
    if (secaoDetalhes) {
        secaoDetalhes.innerHTML = `
            <div class="estado-erro" style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--cor-texto-destaque); margin-bottom: 20px;"></i>
                <h2 style="font-family: var(--font-titulo); font-size: var(--fs-xl); margin-bottom: 15px; color: var(--cor-texto);">Ops! Jogo não encontrado</h2>
                <p style="font-family: var(--font-corpo); color: var(--cor-texto-muted); font-size: var(--fs-base); margin-bottom: 25px;">${mensagemMensagemErro}</p>
                <a href="biblioteca.html" class="btn-primario" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 12px 24px;">
                    <i class="fas fa-arrow-left"></i> Voltar para a Biblioteca
                </a>
            </div>
        `;
    }
}
