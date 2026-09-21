/* ─── FUNCIONALIDADES GLOBAIS ──────────────────────────────────────────────── */

const Preferencias = {
    aplicarTudo() {
        this.aplicarCor();
        this.aplicarAnimacoes();
        this.aplicarTema(localStorage.getItem('pref_tema') || 'sistema');
    },

    aplicarTema(tema) {
        localStorage.setItem('pref_tema', tema);
        const html = document.documentElement;
        html.classList.remove('tema-claro', 'tema-escuro');
        document.body.classList.remove('tema-claro', 'tema-escuro');

        if (tema === 'claro') {
            html.classList.add('tema-claro');
            document.body.classList.add('tema-claro');
        } else if (tema === 'escuro') {
            html.classList.add('tema-escuro');
            document.body.classList.add('tema-escuro');
        } else {
            // Sistema
            const prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefDark) {
                html.classList.add('tema-escuro');
                document.body.classList.add('tema-escuro');
            } else {
                html.classList.add('tema-claro');
                document.body.classList.add('tema-claro');
            }
        }
    },

    aplicarCor() {
        const cor = localStorage.getItem('pref_cor') || '#2e00e6';
        document.documentElement.style.setProperty('--cor-primaria', cor);
        this.aplicarContraste(cor);
    },

    // Mantém os textos independentes da cor escolhida e calcula a melhor cor sobre o destaque.
    aplicarContraste(cor) {
        const rgb = this.hexToRgb(cor);
        if (!rgb) return;

        const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        const luminanciaFundo = this.calcularLuminancia(rgb);
        const contrasteEscuro = this.calcularContrasteRelativo(luminanciaFundo, 0);
        const contrasteClaro = this.calcularContrasteRelativo(luminanciaFundo, 1);
        const textoSobreDestaque = contrasteEscuro >= contrasteClaro ? '#000000' : '#ffffff';
        const textoSobreDestaqueHover = contrasteEscuro >= contrasteClaro ? '#000000' : '#ffffff';

        document.documentElement.style.setProperty('--cor-primaria-rgb', rgbStr);
        document.documentElement.style.setProperty('--cor-texto-sobre-destaque', textoSobreDestaque);
        document.documentElement.style.setProperty('--cor-texto-sobre-destaque-hover', textoSobreDestaqueHover);
        document.documentElement.style.setProperty('--shadow-glow', `0 0 20px rgba(${rgbStr}, 0.25)`);
        document.documentElement.style.setProperty('--shadow-glow-hover', `0 0 35px rgba(${rgbStr}, 0.45)`);
    },

    // Converte RGB em luminância relativa para a comparação de contraste.
    calcularLuminancia({ r, g, b }) {
        const ajustarCanal = canal => {
            const valor = canal / 255;
            return valor <= 0.03928 ? valor / 12.92 : ((valor + 0.055) / 1.055) ** 2.4;
        };

        return (0.2126 * ajustarCanal(r)) + (0.7152 * ajustarCanal(g)) + (0.0722 * ajustarCanal(b));
    },

    calcularContrasteRelativo(luminanciaFundo, luminanciaTexto) {
        const maisClara = Math.max(luminanciaFundo, luminanciaTexto);
        const maisEscura = Math.min(luminanciaFundo, luminanciaTexto);
        return (maisClara + 0.05) / (maisEscura + 0.05);
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
        const result = /^#?([a-f\d]{2})([a-fd\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
};

// Disponibiliza a aplicação de tema para as prévias e demais páginas.
window.Preferencias = Preferencias;

// Resolve as capas de jogos para a raiz correta do projeto.
// A pasta oficial de imagens de jogos é `games/` (na raiz do projeto).
// A mesma função é usada pelo index, /pages/ e /pages/admin/.
window.obterCaminhoImagem = function (imagem, slug) {
    // Detecta o nível de profundidade para o prefixo relativo.
    const caminhoPagina = window.location.pathname;
    let prefixo = '';
    if (caminhoPagina.includes('/pages/admin/')) {
        prefixo = '../../';
    } else if (caminhoPagina.includes('/pages/')) {
        prefixo = '../';
    }

    const fallback = `${prefixo}assets/img/naoencontrada.png`;
    const valor = String(imagem || '').trim();

    // Sem imagem cadastrada: usa fallback.
    if (!valor) return fallback;

    // URLs absolutas (http, https, data) ou caminhos a partir da raiz: preserva.
    if (/^(https?:|data:)/i.test(valor) || valor.startsWith('/')) return valor;

    // Normaliza o caminho recebido:
    // - remove prefixos relativos acidentais (./, ../)
    // - corrige resquícios do padrão legado "assets/img/games/X" → "games/X"
    let caminho = valor
        .replace(/^(?:\.\.\/|\.\/)+/, '')
        .replace(/^assets\/img\/games\//i, 'games/')
        .replace(/^assets\/img\//i, 'assets/img/');

    // Pasta oficial de imagens de jogos: `games/`.
    if (caminho.startsWith('games/')) {
        return `${prefixo}${caminho}`;
    }

    // Se vier apenas o nome do arquivo (ex.: "elden-ring.webp"),
    // normaliza para `games/<arquivo>`.
    if (!caminho.includes('/')) {
        return `${prefixo}games/${caminho}`;
    }

    // Outros caminhos em `assets/` são preservados para compatibilidade.
    if (caminho.startsWith('assets/')) {
        return `${prefixo}${caminho}`;
    }

    // Caminhos desconhecidos: tratados como arquivo dentro de `games/`.
    return `${prefixo}games/${caminho}`;
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
    let itemAdmin = document.getElementById('itemAdmin');
    const menuUsuario = linkConfiguracao?.closest('ul');

    // Todas as páginas devem ter o mesmo item, inicialmente oculto.
    // Em /pages/, o caminho precisa voltar para a raiz antes de entrar em pages/admin.
    if (!itemAdmin && menuUsuario) {
        itemAdmin = document.createElement('li');
        itemAdmin.id = 'itemAdmin';
        itemAdmin.style.display = 'none';
        itemAdmin.innerHTML = `
            <a href="${base}pages/admin/index.php">
                <i class="fas fa-shield-halved"></i>
                <span>Administrador</span>
            </a>`;
        menuUsuario.appendChild(itemAdmin);
    } else if (itemAdmin) {
        itemAdmin.style.display = 'none';
    }
    
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
            const caminhoLogin = 'pages/login.html';
            window.location.replace(`${base}${caminhoLogin}`);
        }
    };

    botoesSair.forEach(botao => botao.addEventListener('click', encerrarSessao));

    try {
        const resposta = await fetch(`${base}php/api/user.php?acao=get`, { credentials: 'include' });
        const dados = await resposta.json();
        const usuarioLogado = Boolean(dados.success && dados.user);
        const usuarioAdmin = usuarioLogado &&
            String(dados.user.role || '').toLowerCase() === 'admin';
        
        exibirEntrar(!usuarioLogado);
        exibirSair(usuarioLogado);
        exibirCabecalho(usuarioLogado);
        
        if (usuarioLogado) {
            window.usuarioLogado = dados.user;
        
            // Salvar sessão local atualizada
            localStorage.setItem('usuarioLogado', JSON.stringify(dados.user));
        
            // Mostrar opção Administrador somente para admin
            const itemAdmin = document.getElementById('itemAdmin');
        
            if (itemAdmin) {
                itemAdmin.style.display = usuarioAdmin ? '' : 'none';
            }
        } else {
            localStorage.removeItem('usuarioLogado');
            window.usuarioLogado = null;
        
            const itemAdmin = document.getElementById('itemAdmin');
        
            if (itemAdmin) {
                itemAdmin.style.display = 'none';
            }
        }
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



/* ── Censura por Faixa Etária ── */
function jogoDeveSerCensurado(jogo) {
    if (!jogo || !jogo.etaria) return false;
    const texto = String(jogo.etaria).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    if (!texto || texto === 'l' || texto === '0' || texto.includes('livre')) {
        return false;
    }
    const match = texto.match(/(?:^|[^0-9])(10|12|14|16|18)(?:[^0-9]|$)/);
    const idadeJogo = match ? parseInt(match[1], 10) : 0;
    if (idadeJogo === 0) return false;

    const censuraAutoAtiva = localStorage.getItem('pref_censura_auto') !== 'false';
    const idadeManual = parseInt(localStorage.getItem('pref_idade_manual') || '18', 10);
    
    let idadePermitida = 18;
    const usuarioLogado = window.usuarioLogado || JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

    if (censuraAutoAtiva && usuarioLogado) {
        // O perfil não possui data de nascimento; usar o limite padrão do filtro.
        idadePermitida = 18;
    } else {
        idadePermitida = idadeManual;
    }

    return idadeJogo > idadePermitida;
}


/* ─── CONTROLE DE ACESSO E SIDEBAR DINÂMICA ──────────────────────────────── */

// Função para verificar se o usuário está logado via localStorage
function isUsuarioLogado() {
    return Boolean(localStorage.getItem('usuarioLogado'));
}

// Função para verificar se o usuário é administrador
function isAdmin() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
        return usuario && (usuario.role === 'admin');
    } catch {
        return false;
    }
}

// Atualizar sidebar e links baseado no estado de autenticação
function atualizarInterfaceUsuario() {
    const logado = isUsuarioLogado();
    const admin = isAdmin();
    
    // Links de navegação
    const linkEntrar = document.querySelector('.barra-lateral .menu-navegacao a[href*="login.html"]');
    const linkPerfil = document.querySelector('.barra-lateral .menu-navegacao a[href*="perfil.html"]');
    const linkConfig = document.querySelector('.barra-lateral .menu-navegacao a[href*="configuracao.html"]');
    const linkBiblioteca = document.querySelector('.barra-lateral .menu-navegacao a[href*="biblioteca.html"]');
    
    // Ocultar/mostrar itens
    if (linkEntrar) linkEntrar.closest('li').style.display = logado ? 'none' : '';
    if (linkPerfil) linkPerfil.closest('li').style.display = logado ? '' : 'none';
    if (linkConfig) linkConfig.closest('li').style.display = logado ? '' : 'none';
    if (linkBiblioteca) linkBiblioteca.closest('li').style.display = logado ? '' : 'none';
    
    // Botão Sair
    let botaoSair = document.getElementById('botaoSair');
    if (!botaoSair) {
        // Criar botão sair se não existir
        const menuUsuario = linkConfig?.closest('ul') || document.querySelector('.barra-lateral .menu-navegacao ul:last-child');
        if (menuUsuario) {
            const itemSair = document.createElement('li');
            itemSair.innerHTML = `
                <button type="button" class="botao-sair" id="botaoSair" aria-label="Sair da conta">
                    <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                    <span>Sair</span>
                </button>
            `;
            menuUsuario.appendChild(itemSair);
            botaoSair = itemSair.querySelector('#botaoSair');
        }
    }
    
    if (botaoSair) {
        botaoSair.closest('li').style.display = logado ? '' : 'none';
    }
    
    // O item é criado/padronizado no bloco principal acima; aqui apenas alternamos sua visibilidade.
    const itemAdmin = document.getElementById('itemAdmin');
    if (itemAdmin) {
        itemAdmin.style.display = admin ? '' : 'none';
    }
    
    // Atualizar breadcrumb se existir link Admin
    const breadcrumbAdmin = document.querySelector('.breadcrumb a[href*="admin"]');
    if (breadcrumbAdmin) {
        breadcrumbAdmin.style.display = admin ? '' : 'none';
    }
}

// Executar ao carregar
document.addEventListener('DOMContentLoaded', () => {
    atualizarInterfaceUsuario();
    
    // Observar mudanças no localStorage
    const observer = new MutationObserver(() => {
        atualizarInterfaceUsuario();
    });
    
    // Atualizar quando o storage mudar em outras abas
    window.addEventListener('storage', () => {
        atualizarInterfaceUsuario();
    });
});

// Sobrescrever a função de logout para limpar localStorage
const logoutOriginal = window.encerrarSessao;
window.encerrarSessao = async function() {
    try {
        await fetch('php/logout.php', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (e) {
        // Ignorar erros de rede
    } finally {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'pages/login.html';
    }
};

// Expor funções globalmente
window.isUsuarioLogado = isUsuarioLogado;
window.isAdmin = isAdmin;
window.atualizarInterfaceUsuario = atualizarInterfaceUsuario;


/* ─── FOOTER GLOBAL ─────────────────────────────────────────────────────── */

function inicializarFooter() {
    if (document.querySelector('.site-footer')) return;

    const caminho = window.location.pathname.replace(/\\/g, '/');
    let prefixo = '';
    if (caminho.includes('/pages/admin/')) {
        prefixo = '../../';
    } else if (caminho.includes('/pages/')) {
        prefixo = '../';
    }

    // Página atual (só o nome do arquivo) para marcar link ativo
    const paginaAtual = decodeURIComponent(
        window.location.pathname.split('/').pop() || 'index.html'
    ).toLowerCase();

    // Helper para marcar o link ativo
    const linkAtivo = (hrefArquivo) =>
        hrefArquivo.toLowerCase() === paginaAtual ? ' class="ativo" aria-current="page"' : '';

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
        <div class="site-footer__inner">
            <div class="site-footer__brand">
                <div class="site-footer__logo">
                    <img src="${prefixo}assets/img/logo.png" alt="Game Search" loading="lazy">
                </div>
                <p>Encontre, compare e descubra os melhores preços dos seus jogos favoritos em um só lugar.</p>
            </div>

            <nav class="site-footer__nav" aria-label="Navegação">
                <h2 class="site-footer__heading">Navegação</h2>
                <div class="site-footer__links">
                    <a href="${prefixo}index.html"${linkAtivo('index.html')}>Início</a>
                    <a href="${prefixo}pages/apresentação.html"${linkAtivo('apresentação.html')}>Apresentação</a>
                    <a href="${prefixo}pages/biblioteca.html"${linkAtivo('biblioteca.html')}>Biblioteca</a>
                    <a href="${prefixo}pages/sobre.html"${linkAtivo('sobre.html')}>Sobre nós</a>
                    <a href="${prefixo}pages/perfil.html"${linkAtivo('perfil.html')}>Perfil</a>
                </div>
            </nav>

            <nav class="site-footer__nav" aria-label="Suporte">
                <h2 class="site-footer__heading">Suporte</h2>
                <div class="site-footer__links">
                    <a href="${prefixo}pages/feedback.html"${linkAtivo('feedback.html')}>Feedback</a>
                    <a href="${prefixo}pages/ajuda.html"${linkAtivo('ajuda.html')}>Ajuda</a>
                    <a href="${prefixo}pages/configuracao.html"${linkAtivo('configuracao.html')}>Configurações</a>
                </div>
            </nav>

            <div class="site-footer__tools">
                <div class="site-footer__actions">
                    <button
                        type="button"
                        class="site-footer__tools-toggle"
                        aria-expanded="false"
                        aria-controls="footer-tools-menu"
                    >
                        <span>Ferramentas</span>
                        <span class="site-footer__tools-arrow" aria-hidden="true"></span>
                    </button>

                    <button
                        type="button"
                        class="site-footer__top"
                        aria-label="Voltar ao topo"
                    >
                         <span>Voltar ao topo</span>
                    </button>
                </div>

                <div class="site-footer__tools-panel" id="footer-tools-menu" hidden>
                    <div class="site-footer__tools-panel-inner">
                        <div class="site-footer__tools-grid">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                            <a href="https://code.visualstudio.com" target="_blank" rel="noopener noreferrer">VS Code</a>
                            <a href="https://www.mysql.com" target="_blank" rel="noopener noreferrer">MySQL</a>

                            <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank" rel="noopener noreferrer">Flexbox</a>
                            <a href="https://www.reactbits.dev" target="_blank" rel="noopener noreferrer">React Bits</a>
                            <a href="https://www.canva.com" target="_blank" rel="noopener noreferrer">Canva</a>

                            <a href="https://developer.mozilla.org/pt-BR/docs/Web/HTML" target="_blank" rel="noopener noreferrer">HTML5</a>
                            <a href="https://developer.mozilla.org/pt-BR/docs/Web/CSS" target="_blank" rel="noopener noreferrer">CSS3</a>
                            <a href="https://developer.mozilla.org/pt-BR/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">JavaScript</a>

                            <a href="https://www.php.net" target="_blank" rel="noopener noreferrer">PHP</a>
                            <a href="https://www.apachefriends.org" target="_blank" rel="noopener noreferrer">XAMPP</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="site-footer__bottom">
            <span>© ${new Date().getFullYear()} Game Search — Todos os direitos reservados.</span>
        </div>
    `;

    const layout = document.querySelector('.layout-principal');
    if (layout && layout.parentNode) {
        layout.parentNode.insertBefore(footer, layout.nextSibling);
    } else {
        document.body.appendChild(footer);
    }

    // ── Voltar ao topo ─────────────────────────────────────────────────
    const btnTopo = footer.querySelector('.site-footer__top');
    btnTopo?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── Menu Ferramentas (abre dentro do footer, abaixo das ações) ─────
    const toolsToggle = footer.querySelector('.site-footer__tools-toggle');
    const toolsPanel = footer.querySelector('#footer-tools-menu');
    const toolsWrapper = footer.querySelector('.site-footer__tools');

    if (toolsToggle && toolsPanel && toolsWrapper) {
        const abrirMenu = () => {
            toolsToggle.setAttribute('aria-expanded', 'true');
            toolsPanel.hidden = false;
            void toolsPanel.offsetHeight;
            toolsPanel.classList.add('aberto');
        };
        const fecharMenu = () => {
            toolsToggle.setAttribute('aria-expanded', 'false');
            toolsPanel.classList.remove('aberto');
            const finalizar = () => {
                if (!toolsPanel.classList.contains('aberto')) toolsPanel.hidden = true;
                toolsPanel.removeEventListener('transitionend', finalizar);
            };
            toolsPanel.addEventListener('transitionend', finalizar);
        };

        toolsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const aberto = toolsToggle.getAttribute('aria-expanded') === 'true';
            aberto ? fecharMenu() : abrirMenu();
        });

        document.addEventListener('click', (e) => {
            if (toolsToggle.getAttribute('aria-expanded') !== 'true') return;
            if (!toolsWrapper.contains(e.target)) fecharMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && toolsToggle.getAttribute('aria-expanded') === 'true') {
                fecharMenu();
                toolsToggle.focus();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', inicializarFooter);