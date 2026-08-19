/* ─── FUNCIONALIDADES GLOBAIS ──────────────────────────────────────────────── */

const Preferencias = {
    aplicarTudo() {
        this.aplicarCor();
        this.aplicarAnimacoes();
    },

    aplicarCor() {
        const cor = localStorage.getItem('pref_cor') || '#2e00e6';
        document.documentElement.style.setProperty('--cor-primaria', cor);
        const rgb = this.hexToRgb(cor);
        if (rgb) {
            const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
            document.documentElement.style.setProperty('--cor-primaria-rgb', rgbStr);
            document.documentElement.style.setProperty('--shadow-glow', `0 0 20px rgba(${rgbStr}, 0.25)`);
            document.documentElement.style.setProperty('--shadow-glow-hover', `0 0 35px rgba(${rgbStr}, 0.45)`);
        }
    },

    aplicarAnimacoes() {
        const animacoesAtivas = localStorage.getItem('pref_animacoes') !== 'false';
        if (!animacoesAtivas) {
            document.body.classList.add('sem-animacoes');
        } else {
            document.body.classList.remove('sem-animacoes');
        }
    },

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
};

// Executar aplicação de preferências imediatamente para evitar FOUC (Flash of Unstyled Content)
if (document.body) {
    Preferencias.aplicarTudo();
} else {
    document.addEventListener('DOMContentLoaded', () => Preferencias.aplicarTudo());
}

document.addEventListener('DOMContentLoaded', async () => {

    /* ── Busca global ── */
    const campoBusca = document.querySelector('.campo-busca');
    if (campoBusca) {
        campoBusca.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && campoBusca.value.trim()) {
                const termo = encodeURIComponent(campoBusca.value);
                const base = window.location.pathname.includes('/pages/') ? '../' : '';
                window.location.href = `${base}index.html?busca=${termo}`;
            }
        });
    }

    /* ── Atualizar itens da sidebar conforme a sessão ── */
    const base = window.location.pathname.includes('/pages/') ? '../' : '';
    const linksNavegacao = [...document.querySelectorAll('.barra-lateral .menu-navegacao a')];
    const linkEntrar = linksNavegacao
        .find(link => link.getAttribute('href')?.endsWith('login.html') && link.textContent.trim() === 'Entrar');
    const linkConfiguracao = linksNavegacao
        .find(link => link.getAttribute('href')?.endsWith('configuracao.html'));
    let botaoSair = document.getElementById('botaoSair');
    const navLogin = document.querySelector('.nav-login');
    const navPerfil = document.getElementById('navPerfil');
    const navConfiguracao = document.getElementById('navConfiguracao');
    const navSair = document.getElementById('navSair');

    // A seção de usuário é repetida nas páginas estáticas; criar o item aqui
    // mantém o botão disponível em todas elas sem duplicar marcação.
    if (!botaoSair && linkConfiguracao) {
        const menuUsuario = linkConfiguracao.closest('ul');
        if (menuUsuario) {
            const itemSair = document.createElement('li');
            itemSair.innerHTML = `
                <button type="button" class="botao-sair" id="botaoSair" aria-label="Sair da conta">
                    <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                    <span>Sair da conta</span>
                </button>`;
            menuUsuario.appendChild(itemSair);
            botaoSair = itemSair.querySelector('#botaoSair');
        }
    }

    const exibirEntrar = (exibir) => {
        if (linkEntrar) linkEntrar.closest('li').style.display = exibir ? '' : 'none';
    };

    const exibirSair = (exibir) => {
        if (botaoSair) botaoSair.closest('li').style.display = exibir ? '' : 'none';
        if (navSair) navSair.style.display = exibir ? 'inline-flex' : 'none';
    };

    const exibirCabecalho = (usuarioLogado) => {
        if (navLogin) navLogin.style.display = usuarioLogado ? 'none' : 'inline-flex';
        if (navPerfil) navPerfil.style.display = usuarioLogado ? 'inline-flex' : 'none';
        if (navConfiguracao) navConfiguracao.style.display = usuarioLogado ? 'inline-flex' : 'none';
    };

    const usuarioPersistido = Boolean(localStorage.getItem('usuarioLogado'));
    exibirEntrar(!usuarioPersistido);
    exibirSair(usuarioPersistido);
    exibirCabecalho(usuarioPersistido);

    const menus = document.querySelectorAll('.barra-lateral .menu-navegacao');
    const menuPrincipal = menus[0]?.querySelector('ul');
    const bibliotecaExiste = [...document.querySelectorAll('.barra-lateral .menu-navegacao a')]
        .some(link => link.getAttribute('href')?.endsWith('biblioteca.html'));
    if (menuPrincipal && !bibliotecaExiste) {
        const itemBiblioteca = document.createElement('li');
        const caminhoBiblioteca = base ? 'biblioteca.html' : 'pages/biblioteca.html';
        itemBiblioteca.innerHTML = `<a href="${caminhoBiblioteca}"><i class="fas fa-book"></i><span>Biblioteca</span></a>`;
        menuPrincipal.appendChild(itemBiblioteca);
    }

    const botoesSair = [...new Set([
        botaoSair,
        navSair,
        ...document.querySelectorAll('[data-logout]')
    ].filter(Boolean))];
    const encerrarSessao = async () => {
        if (!botoesSair.length) return;

        botoesSair.forEach(botao => {
            botao.disabled = true;
            botao.setAttribute('aria-busy', 'true');
        });

        try {
            await fetch(`${base}php/logout.php`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            });
        } catch (erro) {
            // Mesmo sem resposta do servidor, limpamos o estado local e retornamos ao login.
        } finally {
            localStorage.removeItem('usuarioLogado');
            const caminhoLogin = base ? 'login.html' : 'pages/login.html';
            window.location.replace(`${base}${caminhoLogin}`);
        }
    };

    botoesSair.forEach(botao => botao.addEventListener('click', encerrarSessao));

    try {
        const resposta = await fetch(`${base}php/api/user.php?acao=get`, { credentials: 'include' });
        const dados = await resposta.json();
        const usuarioLogado = Boolean(dados.success && dados.user);
        exibirEntrar(!usuarioLogado);
        exibirSair(usuarioLogado);
        exibirCabecalho(usuarioLogado);
        if (!usuarioLogado) localStorage.removeItem('usuarioLogado');
    } catch (erro) {
        // Mantém o estado persistido quando o backend estiver indisponível.
    }

    /* ── Marcar item ativo na sidebar ── */
    const paginaAtual = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.menu-navegacao li').forEach(li => li.classList.remove('ativo'));
    document.querySelectorAll('.menu-navegacao li a').forEach(link => {
        const href = decodeURIComponent(link.getAttribute('href')?.split('/').pop() || '');
        if (href === paginaAtual) {
            link.closest('li')?.classList.add('ativo');
        }
    });

    /* ── Animar entradas de cards ── */
    const observador = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animar-entrada');
                observador.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card-jogo, .item-jogo-perfil, .card').forEach(el => {
        observador.observe(el);
    });

    /* ── Sidebar retrátil com persistência ── */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const corpo = document.body;

    // Função para aplicar o estado da sidebar
    const aplicarEstadoSidebar = (estaFechada) => {
        const ehMobile = window.innerWidth <= 1024;
        
        if (estaFechada) {
            corpo.classList.add('sidebar-fechada');
            hamburgerBtn?.setAttribute('aria-expanded', 'false');
            
            if (ehMobile) {
                drawerOverlay?.classList.remove('ativo');
                setTimeout(() => {
                    if (drawerOverlay && !drawerOverlay.classList.contains('ativo')) {
                        drawerOverlay.style.display = 'none';
                    }
                }, 300);
            }
        } else {
            corpo.classList.remove('sidebar-fechada');
            hamburgerBtn?.setAttribute('aria-expanded', 'true');
            
            if (ehMobile) {
                if (drawerOverlay) {
                    drawerOverlay.style.display = 'block';
                    // Pequeno delay para a transição de opacidade
                    setTimeout(() => drawerOverlay.classList.add('ativo'), 10);
                }
            }
        }
        localStorage.setItem('sidebar_fechada', estaFechada);
    };

    // Inicializar estado baseado no localStorage
    const estadoSalvo = localStorage.getItem('sidebar_fechada') === 'true';
    
    // No mobile, sempre começar fechada por padrão se não houver estado salvo
    const ehMobile = window.innerWidth <= 1024;
    if (localStorage.getItem('sidebar_fechada') === null && ehMobile) {
        aplicarEstadoSidebar(true);
    } else {
        aplicarEstadoSidebar(estadoSalvo);
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            const estaFechada = corpo.classList.contains('sidebar-fechada');
            aplicarEstadoSidebar(!estaFechada);
        });
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', () => aplicarEstadoSidebar(true));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !corpo.classList.contains('sidebar-fechada') && window.innerWidth <= 1024) {
            aplicarEstadoSidebar(true);
        }
    });

    // Fechar ao clicar em links no mobile
    document.querySelectorAll('.barra-lateral .menu-navegacao a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                aplicarEstadoSidebar(true);
            }
        });
    });
});

/* ── Cards Expansíveis ── */
function inicializarCardsExpansiveis() {
    const cards = document.querySelectorAll('.card-expansivel');
    cards.forEach(card => {
        const cabecalho = card.querySelector('.cabecalho-expansivel') || card;
        cabecalho.addEventListener('click', () => {
            card.classList.toggle('expandido');
            
            // Acessibilidade
            const expandido = card.classList.contains('expandido');
            cabecalho.setAttribute('aria-expanded', expandido);
        });
    });
}

// Inicializar após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    inicializarCardsExpansiveis();
});


