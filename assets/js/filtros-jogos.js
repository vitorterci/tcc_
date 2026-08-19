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
    const termoNormalizado = termoPesquisa.trim().toLocaleLowerCase('pt-BR');
    const filtros = obterFiltrosAtivos();

    jogosFiltradosAtuais = listaDeJogos.filter(jogo => {
        const categoriaCorrespondente = filtros.categoria === 'todos' || jogo.categoria === filtros.categoria;
        const plataformaCorrespondente = filtros.plataforma === 'todos' || jogo.plataforma === filtros.plataforma;
        const generoCorrespondente = filtros.genero === 'todos' || jogo.genero === filtros.genero;
        const etariaCorrespondente = filtros.etaria === 'todos' || obterCodigoEtariaFiltro(jogo.etaria) === filtros.etaria;
        const anoCorrespondente = filtros.ano === 'todos' || String(jogo.ano) === String(filtros.ano);

        let precoCorrespondente = true;
        const precoNumerico = typeof jogo.preco === 'string' ? parseFloat(jogo.preco) : Number(jogo.preco);
        if (filtros.preco !== 'todos') {
            switch (filtros.preco) {
                case 'gratis':
                    precoCorrespondente = precoNumerico === 0;
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

        const nomeJogo = String(jogo.nome || '').toLocaleLowerCase('pt-BR');
        const buscaCorrespondente = !termoNormalizado || nomeJogo.includes(termoNormalizado);

        return categoriaCorrespondente && plataformaCorrespondente && generoCorrespondente
            && etariaCorrespondente && anoCorrespondente && precoCorrespondente
            && buscaCorrespondente;
    });

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
