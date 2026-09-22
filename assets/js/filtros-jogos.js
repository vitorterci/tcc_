/*
 * Filtros compartilhados do catálogo de jogos.
 * Este módulo é utilizado pelo index e pela Biblioteca para manter o mesmo
 * comportamento de busca, seleção e indicação de filtros ativos.
 */

let listaDeJogos = [];
let categoriaAtiva = 'todos';
let plataformaAtiva = 'todos';
let generoAtivo = 'todos';
let etariaAtiva = 'todos';
let anoAtivo = 'todos';
let precoAtivo = 'todos';
let termoPesquisa = '';
let jogosFiltradosAtuais = [];

const gradeJogos = document.querySelector('.grade-jogos');
const campoBusca = document.querySelector('.campo-busca');

// Formata os valores monetários no padrão brasileiro.
function formatarPreco(valor) {
    const numero = typeof valor === 'string' ? parseFloat(valor) : Number(valor);
    return (Number.isFinite(numero) ? numero : 0).toFixed(2).replace('.', ',');
}

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

// Mantém o filtro compatível com os formatos antigos da classificação etária.
function obterCodigoEtariaFiltro(valor) {
    const texto = String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    if (!texto) return 'nao-informada';
    if (texto === 'l' || texto === '0' || texto.includes('livre')) return 'L';

    const correspondencia = texto.match(/(?:^|[^0-9])(10|12|14|16|18)(?:[^0-9]|$)/);
    return correspondencia ? correspondencia[1] : 'nao-informada';
}

// Atualiza o estado de um grupo de filtros sem duplicar regras nas páginas.
function definirFiltroAtivo(menuId, valor) {
    if (menuId === 'menu-categorias') categoriaAtiva = valor;
    if (menuId === 'menu-plataforma') plataformaAtiva = valor;
    if (menuId === 'menu-genero') generoAtivo = valor;
    if (menuId === 'menu-etaria') etariaAtiva = valor;
    if (menuId === 'menu-ano') anoAtivo = valor;
    if (menuId === 'menu-preco') precoAtivo = valor;
}

function plataformaCorresponde(valor, filtro) {
    const plataforma = String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
    if (!plataforma || filtro === 'todos') return true;
    const partes = plataforma.split(/[,/|+]+/).map(parte => parte.trim()).filter(Boolean);
    return partes.some(parte => parte === filtro || parte.startsWith(`${filtro} `));
}

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

// Reseta apenas o menu solicitado e preserva os demais filtros selecionados.
function resetarFiltro(menuId) {
    const menu = document.getElementById(menuId);
    if (!menu) return;

    const opcaoTodos = menu.querySelector('.opcao-filtro[data-filtro="todos"]');
    if (!opcaoTodos) return;

    menu.querySelectorAll('.opcao-filtro').forEach(opcao => opcao.classList.remove('selecionada'));
    opcaoTodos.classList.add('selecionada');
    definirFiltroAtivo(menuId, 'todos');
    aplicarFiltros();
    menu.classList.remove('show');

    const botaoPrincipal = document.querySelector(`.botao-filtro-principal[data-menu="${menuId}"]`);
    botaoPrincipal?.classList.remove('ativo');
    botaoPrincipal?.setAttribute('aria-expanded', 'false');
}

// Filtra a lista inteira e entrega o resultado ao renderizador específico da página.
function aplicarFiltros() {
    const termoNormalizado = normalizarTexto(termoPesquisa);
    const filtros = obterFiltrosAtivos();

	    jogosFiltradosAtuais = listaDeJogos.map((jogo, indice) => ({ jogo, indice, relevancia: obterRelevanciaBusca(jogo, termoNormalizado) }))
	        .filter(({ relevancia }) => !termoNormalizado || relevancia >= 0)
	        .filter(({ jogo }) => {
	        const categoriaCorrespondente = filtros.categoria === 'todos' || jogo.categoria === filtros.categoria;
        const plataformaCorrespondente = plataformaCorresponde(jogo.plataforma, filtros.plataforma);
	        const generoCorrespondente = filtros.genero === 'todos' || jogo.genero === filtros.genero;
	        const etariaCorrespondente = filtros.etaria === 'todos' || obterCodigoEtariaFiltro(jogo.etaria) === filtros.etaria;
	        const anoCorrespondente = filtros.ano === 'todos' || String(jogo.ano) === String(filtros.ano);

	        let precoCorrespondente = true;
	        const precoComparado = typeof window.obterPrecoComparado === 'function'
	            ? window.obterPrecoComparado(jogo)
	            : { valor: null };
	        const precoNumerico = precoComparado.valor;
	        if (filtros.preco !== 'todos') {
	            switch (filtros.preco) {
	                case 'gratis':
	                    precoCorrespondente = false;
	                    break;
	                case 'baixo':
	                    precoCorrespondente = precoNumerico > 0 && precoNumerico <= 50;
                    break;
                case 'medio':
                    precoCorrespondente = precoNumerico > 50 && precoNumerico <= 150;
                    break;
                case 'alto':
                    precoCorrespondente = precoNumerico > 150;
                    break;
                default:
                    precoCorrespondente = true;
            }
        }

	        return categoriaCorrespondente && plataformaCorrespondente && generoCorrespondente
	            && etariaCorrespondente && anoCorrespondente && precoCorrespondente
	    ;
	    })
	        .sort((primeiro, segundo) => segundo.relevancia - primeiro.relevancia || primeiro.indice - segundo.indice)
	        .map(({ jogo }) => jogo);

    // Toda mudança de filtro começa novamente na primeira página da Biblioteca.
    if (typeof reiniciarPaginacao === 'function') reiniciarPaginacao();
    if (typeof renderizarJogos === 'function') renderizarJogos(jogosFiltradosAtuais);
    atualizarBotoesFiltro();
}

// Indica visualmente quais grupos possuem uma seleção diferente de "todos".
function atualizarBotoesFiltro() {
    const filtros = {
        'menu-categorias': categoriaAtiva,
        'menu-plataforma': plataformaAtiva,
        'menu-genero': generoAtivo,
        'menu-etaria': etariaAtiva,
        'menu-ano': anoAtivo,
        'menu-preco': precoAtivo
    };

    Object.entries(filtros).forEach(([menuId, valor]) => {
        const botao = document.querySelector(`.botao-filtro-principal[data-menu="${menuId}"]`);
        if (!botao) return;
        botao.classList.toggle('ativo', valor !== 'todos');
        botao.setAttribute('aria-expanded', document.getElementById(menuId)?.classList.contains('show') ? 'true' : 'false');
    });
}

function inicializarFiltros() {
    document.querySelectorAll('.botao-filtro-principal').forEach(botao => {
        if (botao.dataset.filtroInicializado === 'true') return;
        botao.dataset.filtroInicializado = 'true';

        botao.addEventListener('click', evento => {
            evento.stopPropagation();
            const menuId = botao.dataset.menu;
            const menu = document.getElementById(menuId);
            if (!menu) return;

            document.querySelectorAll('.menu-flutuante.show').forEach(menuAberto => {
                if (menuAberto !== menu) menuAberto.classList.remove('show');
            });
            document.querySelectorAll('.botao-filtro-principal[aria-expanded="true"]').forEach(botaoAberto => {
                if (botaoAberto !== botao) botaoAberto.setAttribute('aria-expanded', 'false');
            });

            const menuAberto = menu.classList.toggle('show');
            botao.setAttribute('aria-expanded', menuAberto ? 'true' : 'false');
        });
    });

    document.querySelectorAll('.btn-reset-filtro').forEach(botao => {
        if (botao.dataset.filtroInicializado === 'true') return;
        botao.dataset.filtroInicializado = 'true';
        botao.addEventListener('click', evento => {
            evento.stopPropagation();
            resetarFiltro(botao.dataset.menu);
        });
    });

    document.querySelectorAll('.opcao-filtro[data-filtro]').forEach(opcao => {
        if (opcao.dataset.filtroInicializado === 'true') return;
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

    if (campoBusca && campoBusca.dataset.filtroInicializado !== 'true') {
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
    document.querySelectorAll('.botao-filtro-principal[aria-expanded="true"]').forEach(botao => botao.setAttribute('aria-expanded', 'false'));
});

document.addEventListener('keydown', evento => {
    if (evento.key !== 'Escape') return;
    document.querySelectorAll('.menu-flutuante.show').forEach(menu => menu.classList.remove('show'));
    document.querySelectorAll('.botao-filtro-principal[aria-expanded="true"]').forEach(botao => botao.setAttribute('aria-expanded', 'false'));
});

document.addEventListener('DOMContentLoaded', inicializarFiltros);
inicializarFiltros();
