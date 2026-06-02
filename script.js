/**
 * Lógica de Interface do Usuário - Programa ARCA
 * Controla comportamentos dinâmicos globais e estados responsivos.
 */
document.addEventListener('DOMContentLoaded', () => {
    // O "Cérebro" do site: espera o HTML carregar para ativar as funções
    renderLayout(); // Injeta Navbar e Footer antes de tudo
    initMenuResponsivo();
    initFiltrosMobile();
    initFormularioAdocao();
    initFavoritos();
    initDropdowns();
    initNavbarLogin();
    initProtecaoRotas();
    initCapturaRedirect();
    handleLogout();
    initLoginGlobal();
    initGlobalModals(); // Gerencia o fechamento de qualquer modal/ficha
});

/**
 * Injeta o cabeçalho e rodapé em todas as páginas
 */
function renderLayout() {
    const navPlaceholder = document.getElementById('navbar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // Nova lógica de detecção de profundidade de pastas
    const path = window.location.pathname;
    const inPaginas = path.includes('/paginas/');
    // Verifica se estamos em uma subpasta dentro de paginas (ex: adotar/, castracao/, Perfil/)
    const isDeepSubfolder = inPaginas && path.split('/paginas/')[1].includes('/');

    let rootPath = './';
    let paginasPath = './paginas/';

    if (isDeepSubfolder) {
        rootPath = '../../';
        paginasPath = '../';
    } else if (inPaginas) {
        rootPath = '../';
        paginasPath = './';
    }

    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    if (navPlaceholder) {
        if (isAdmin) {
            // NAVBAR PARA PREFEITURA (ADMIN)
            navPlaceholder.innerHTML = `
                <div class="topo-governo-institucional">
                    <div class="logotipo-prefeitura">
                        <img src="${rootPath}imagens/prefeitura-arca-serra.png" alt="Logo Prefeitura da Serra">
                    </div>
                    <div class="nav-institucional-links">
                        <a href="#"><span>1</span> Conteúdo</a>
                        <a href="#"><span>2</span> Menu</a>
                        <a href="#"><span>3</span> Busca</a>
                        <a href="#"><span>4</span> Contraste</a>
                        <a href="#"><span>5</span> Acessibilidade</a>
                    </div>
                </div>
                <nav class="menu-navegacao-principal">
                    <a href="${paginasPath}prefeitura/dashboard.html" class="link-logotipo-projeto">
                        <img src="${rootPath}imagens/logo-arca.png" alt="Logo Programa ARCA">
                        <div class="logo-texto">
                            <span>GESTÃO</span>
                            <strong>ARCA</strong>
                        </div>
                    </a>
                    <button class="menu-hamburger" aria-label="Abrir Menu">
                        <span></span><span></span><span></span>
                    </button>
                    <ul class="lista-links-menu">
                        <li><a href="${paginasPath}prefeitura/dashboard.html">Dashboard</a></li>
                        <li><a href="${paginasPath}prefeitura/adocoes.html">Adoções</a></li>
                        <li><a href="${paginasPath}prefeitura/castracoes.html">Castrações</a></li>
                        <li><a href="${paginasPath}prefeitura/denuncias.html">Denúncias</a></li>
                        <li><a href="${paginasPath}prefeitura/resgates.html">Resgates</a></li>
                        <li><a href="#" id="btn-logout" class="logout-link">Sair</a></li>
                    </ul>
                </nav>
            `;
        } else {
            // NAVBAR PARA CIDADÃO (PADRÃO)
        navPlaceholder.innerHTML = `
            <div class="topo-governo-institucional">
                <div class="logotipo-prefeitura">
                    <img src="${rootPath}imagens/prefeitura-arca-serra.png" alt="Logo Prefeitura da Serra">
                </div>
                <div class="nav-institucional-links">
                    <a href="#"><span>1</span> Conteúdo</a>
                    <a href="#"><span>2</span> Menu</a>
                    <a href="#"><span>3</span> Busca</a>
                    <a href="#"><span>4</span> Contraste</a>
                    <a href="#"><span>5</span> Acessibilidade</a>
                </div>
            </div>
            <nav class="menu-navegacao-principal">
                <a href="${rootPath}index.html" class="link-logotipo-projeto">
                    <img src="${rootPath}imagens/logo-arca.png" alt="Logo Programa ARCA">
                    <div class="logo-texto">
                        <span>PROJETO</span>
                        <strong>ARCA</strong>
                    </div>
                </a>
                <button class="menu-hamburger" aria-label="Abrir Menu">
                    <span></span><span></span><span></span>
                </button>
                <ul class="lista-links-menu">
                    <li><a href="${paginasPath}adotar/adocao.html">Adoção</a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle">Castração</a>
                        <ul class="sub-menu-suspenso">
                            <li><a href="${paginasPath}castracao/informacoes.html">Como funciona</a></li>
                            <li><a href="${paginasPath}castracao/selecionar-pet.html">Agendar Castração</a></li>
                            <li><a href="${paginasPath}castracao/clinicas.html">Clínicas credenciadas</a></li>
                        </ul>
                    </li>
                    <li><a href="${paginasPath}Denuncia/escolha-denuncia.html">Denúncia</a></li>
                    <li><a href="${paginasPath}resgate/solicitação-resgate.html">Resgate</a></li>
                    <li><a href="${paginasPath}fale-conosco.html">Fale Conosco</a></li>
                    <li><a href="${paginasPath}Perfil/solicitacoes.html">Perfil</a></li>
                </ul>
            </nav>
        `;
        }
    }

    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <footer class="rodape-institucional-site">
                <div class="footer-container">
                    <div class="footer-coluna">
                        <h4>Desenvolvimento</h4>
                        <p>© SEICIT/SUBTI - Subsecretaria de Tecnologia da Informação</p>
                        <p>Rua Maestro Antônio Cícero, 111, Caçaroca, Prefeitura, Serra/ES, CEP 29176-110</p>
                        <p>Abertura de chamados: <a href="#">centraldeajuda.serra.es.gov.br</a></p>
                    </div>
                    <div class="footer-coluna">
                        <h4>Gestão</h4>
                        <p>GBEA - Gerência do Bem-Estar Animal - Secretaria Municipal de Meio Ambiente (SEMMAM)</p>
                        <p>Av. Talma Rodrigues Ribeiro, 5416, Portal de Jacaraípe, Serra/ES</p>
                        <p>Telefones: (27) 3382-6578 / (27) 3382-6540</p>
                    </div>
                    <div class="footer-coluna">
                        <h4>Área administrativa - Clínicas</h4>
                        <p>Se você é uma das clínicas credenciadas, <a href="#">clique aqui</a> para acessar.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

/**
 * Centraliza o fechamento de modais ao clicar no X ou fora da caixa
 */
function initGlobalModals() {
    document.addEventListener('click', (e) => {
        // Fecha se clicar no botão 'X' ou na camada de fundo escura
        if (e.target.classList.contains('modal-ficha') || e.target.classList.contains('btn-fechar-ficha')) {
            const modal = e.target.closest('.modal-ficha') || document.querySelector('.modal-ficha[style*="display: flex"]');
            if (modal) modal.style.display = 'none';
        }
    });
}

/**
 * Verifica se o usuário está logado e impede ações caso negativo
 */
function checkAccess(e) {
    const logado = sessionStorage.getItem('usuarioLogado') === 'true';
    
    if (!logado) {
        sessionStorage.setItem('returnUrl', window.location.href);
        e.preventDefault();
        e.stopPropagation();
        showModalAcesso();
        return false;
    }
    return true;
}

/**
 * Cria e exibe o modal de acesso personalizado
 */
function showModalAcesso() {
    // Remove modal anterior se existir
    const existing = document.querySelector('.camada-fundo-modal');
    if (existing) existing.remove();

    const path = window.location.pathname;
    const inPaginas = path.includes('/paginas/');
    const isDeepSubfolder = inPaginas && path.split('/paginas/')[1].includes('/');

    let rootPath = './';
    if (isDeepSubfolder) rootPath = '../../';
    else if (inPaginas) rootPath = '../';

    const perfilPath = `${rootPath}paginas/Perfil/`;

    const modalHtml = `
        <div class="camada-fundo-modal" style="display: flex;">
            <div class="caixa-card-modal">
                <span style="font-size: 50px;">🐾</span>
                <h2>Acesso Necessário</h2>
                <p>Para favoritar, adotar ou agendar castrações, você precisa estar conectado à sua conta.</p>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <a href="${perfilPath}login.html" class="botao-acao-principal" style="max-width: 100%;">Já tenho uma conta</a>
                    <a href="${perfilPath}cadastro.html" class="botao-acao-secundaria" style="max-width: 100%;">Criar meu cadastro</a>
                    <button onclick="this.closest('.camada-fundo-modal').remove()" style="background: none; border: none; color: #888; cursor: pointer; margin-top: 10px; font-size: 14px;">Depois eu faço isso</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Fecha o modal se clicar fora da caixa branca
    document.querySelector('.camada-fundo-modal').addEventListener('click', function(e) {
        if (e.target === this) this.remove();
    });
}

/**
 * Altera o texto do menu dependendo se o usuário está logado ou não
 */
function initNavbarLogin() {
    // Busca o link de Perfil pelo texto ou por partes do href para ser mais resiliente às pastas
    const links = document.querySelectorAll('.lista-links-menu a');
    let perfilLink = null;
    
    links.forEach(link => {
        if (link.textContent.trim() === 'Perfil' || link.textContent.trim() === 'Login / Cadastro' || link.href.includes('solicitacoes.html')) {
            perfilLink = link;
        }
    });

    const logado = sessionStorage.getItem('usuarioLogado') === 'true';

    if (perfilLink) {
        const li = perfilLink.parentElement;
        
        // Detecta o nível da pasta para ajustar os caminhos (se está em /paginas/xxx/)
        const path = window.location.pathname;
        const inPaginas = path.includes('/paginas/');
        const isDeepSubfolder = inPaginas && path.split('/paginas/')[1].includes('/');

        let rootPath = './';
        if (isDeepSubfolder) rootPath = '../../';
        else if (inPaginas) rootPath = '../';

        const perfilPath = `${rootPath}paginas/Perfil/`;
        const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

        if (logado) {
            li.classList.add('dropdown');
            perfilLink.innerHTML = isAdmin ? 'Painel Gestor ⚙️' : 'Olá, Tutor! 🐾';
            perfilLink.href = '#';
            perfilLink.classList.remove('active'); // Remove se estiver vindo do login
            perfilLink.classList.add('dropdown-toggle');

            // Cria o submenu se ele ainda não existir
            if (!li.querySelector('.sub-menu-suspenso')) {
                const subMenu = document.createElement('ul');
                subMenu.className = 'sub-menu-suspenso';
                subMenu.innerHTML = `
                    <li><a href="${perfilPath}perfil.html">Meu Perfil</a></li>
                    <li><a href="${perfilPath}favoritos.html">Meus Favoritos</a></li>
                    <li><a href="${perfilPath}solicitacoes.html">Minhas Solicitações</a></li>
                    <li><a href="#" id="btn-logout" class="logout-link">Sair da Conta</a></li>
                `;
                li.appendChild(subMenu);
            }
        } else {
            li.classList.remove('dropdown');
            perfilLink.innerHTML = 'Login / Cadastro';
            perfilLink.href = `${perfilPath}login.html`;
            perfilLink.classList.remove('dropdown-toggle');
            const subMenu = li.querySelector('.sub-menu-suspenso');
            if (subMenu) subMenu.remove();
        }
    }
}

/**
 * Gerencia a saída do usuário do sistema
 */
function handleLogout() {
    document.addEventListener('click', (e) => {
        const btnLogout = e.target.closest('#btn-logout');
        if (btnLogout) {
            e.preventDefault();
            sessionStorage.removeItem('usuarioLogado');
            sessionStorage.removeItem('isAdmin');
            
            const path = window.location.pathname;
            const inPaginas = path.includes('/paginas/');
            const isDeepSubfolder = inPaginas && path.split('/paginas/')[1].includes('/');
            let rootPath = isDeepSubfolder ? '../../' : (inPaginas ? '../' : './');

            window.location.href = `${rootPath}index.html`;
        }
    });
}

/**
 * Lógica de login centralizada para evitar repetição nos HTMLs
 */
function initLoginGlobal() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        const btn = loginForm.querySelector('button');

        // Detecta a profundidade da pasta para redirecionamento correto
        const path = window.location.pathname;
        const inPaginas = path.includes('/paginas/');
        const isDeepSubfolder = inPaginas && path.split('/paginas/')[1].includes('/');
        let rootPath = isDeepSubfolder ? '../../' : (inPaginas ? '../' : './');

        // LOGIN DA PREFEITURA
        if (usuario === 'prefeitura' && senha === '123456') {
            sessionStorage.setItem('usuarioLogado', 'true');
            sessionStorage.setItem('isAdmin', 'true');
            btn.innerText = 'Acesso Administrativo...';
            setTimeout(() => {
                window.location.href = `${rootPath}paginas/prefeitura/dashboard.html`;
            }, 800);
            return;
        }

        if (usuario === 'tutor' && senha === '123456') {
            sessionStorage.setItem('usuarioLogado', 'true');
            btn.innerHTML = 'Acesso Permitido! 🐾';
            btn.style.backgroundColor = 'var(--sucesso)';
            btn.style.color = 'white';
            
            setTimeout(() => {
                const returnUrl = sessionStorage.getItem('returnUrl');
                if (returnUrl && !returnUrl.includes('login.html') && !returnUrl.includes('cadastro.html')) {
                    sessionStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                } else {
                    window.location.href = `${rootPath}paginas/Perfil/solicitacoes.html`;
                }
            }, 800);
        } else {
            alert('Usuário ou senha incorretos. Tente "tutor" e "123456".');
        }
    });
}

/**
 * Controla abertura e fechamento do menu em resoluções mobile/tablet
 */
function initMenuResponsivo() {
    const hamburger = document.querySelector('.menu-hamburger');
    const menuLinks = document.querySelector('.lista-links-menu');

    if (hamburger && menuLinks) {
        hamburger.addEventListener('click', () => {
            // Alterna classe de exibição da lista de links
            menuLinks.classList.toggle('active');
            
            // Efeito visual sutil no botão hambúrguer transformando em 'X'
            const spans = hamburger.querySelectorAll('span');
            if(menuLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

/**
 * Simula o envio do formulário de adoção com feedback visual
 */
function initFormularioAdocao() {
    const formAdocao = document.querySelector('form[action="solicitacoes.html"]');
    
    if (formAdocao) {
        formAdocao.addEventListener('submit', (e) => {
            e.preventDefault(); // Interrompe o envio automático para mostrar o aviso primeiro
            
            const btn = formAdocao.querySelector('.btn-enviar-solicitacao');
            
            // Muda o texto do botão para o usuário saber que algo está acontecendo
            btn.innerText = 'Enviando Solicitação...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            // Cria um "atraso artificial" de 1.5s para simular o tempo de resposta da internet
            setTimeout(() => {
                window.location.href = 'sucesso.html';
            }, 1500);
        });
    }
}

/**
 * Captura a URL atual antes de navegar para login/cadastro para permitir redirecionamento posterior
 */
function initCapturaRedirect() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="login.html"], a[href*="cadastro.html"]');
        if (link) {
            sessionStorage.setItem('returnUrl', window.location.href);
        }
    });
}

/**
 * Protege links de adoção, castração e perfil
 */
function initProtecaoRotas() {
    // Protege especificamente o formulário de adoção, agendamento e agora resgate
    const linksProtegidos = document.querySelectorAll('a[href*="formulario-adocao.html"], a[href*="solicitacoes.html"], a[href*="agendar-cast.html"], a[href*="selecionar-pet.html"], a[href*="formulario-resgate.html"]');
    
    linksProtegidos.forEach(link => {
        link.addEventListener('click', (e) => checkAccess(e));
    });
}

/**
 * Controla a expansão dos filtros na página de listagem (mobile)
 */
function initFiltrosMobile() {
    const btnToggle = document.querySelector('.btn-toggle-filtros');
    const container = document.querySelector('.barra-filtros-container');

    if (btnToggle && container) {
        btnToggle.addEventListener('click', () => {
            container.classList.toggle('active');
        });
    }
}

/**
 * Gerencia a funcionalidade de favoritar animais
 */
function initFavoritos() {
    // Usamos delegação de eventos para funcionar também na página de listagem (adocao.html)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-favorito');
        if (btn) {
            if (!checkAccess(e)) return;
            btn.classList.toggle('favoritado');
            
            // Troca o emoji dependendo do estado
            if (btn.classList.contains('favoritado')) {
                btn.innerText = '❤️';
            } else {
                btn.innerText = '🤍';
            }
        }
    });
}

/**
 * Controla o comportamento do menu dropdown no mobile
 */
function initDropdowns() {
    // Usamos delegação de eventos para funcionar com menus criados dinamicamente
    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('.dropdown-toggle');
        
        if (toggle && window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = toggle.parentElement;
            dropdown.classList.toggle('active');
        }
    });
}