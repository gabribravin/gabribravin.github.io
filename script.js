/**
 * Lógica de Interface do Usuário - Programa ARCA
 */
document.addEventListener('DOMContentLoaded', () => {
    const paths = getPaths();
    renderLayout(paths); 
    initGlobalEvents(paths);
    initLoginLogic(paths);
    initNoValidate();
});

function getPaths() {
    const p = window.location.pathname;
    const inPag = p.includes('/paginas/');
    const deep = inPag && p.split('/paginas/')[1].includes('/');
    return {
        root: deep ? '../../' : (inPag ? '../' : './'),
        pag: deep ? '../' : (inPag ? './' : './paginas/')
    };
}

function renderLayout(paths) {
    const nav = document.getElementById('navbar-placeholder');
    const footer = document.getElementById('footer-placeholder');
    
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const logado = sessionStorage.getItem('usuarioLogado') === 'true';

    if (nav) {
        const topoInstitucional = `
            <div class="topo-governo-institucional">
                <div class="logotipo-prefeitura">
                    <img src="${paths.root}imagens/prefeitura-arca-serra.png" alt="Logo Prefeitura da Serra">
                </div>
                <div class="nav-institucional-links">
                    <a href="#"><span>1</span> Conteúdo</a>
                    <a href="#"><span>2</span> Menu</a>
                    <a href="#"><span>3</span> Busca</a>
                    <a href="#"><span>4</span> Contraste</a>
                    <a href="#"><span>5</span> Acessibilidade</a>
                </div>
            </div>`;

        if (isAdmin) {
            nav.innerHTML = topoInstitucional + `
                <nav class="menu-navegacao-principal">
                    <a href="${paths.pag}prefeitura/dashboard.html" class="link-logotipo-projeto">
                        <img src="${paths.root}imagens/logo-arca.png" alt="Logo Programa ARCA">
                        <div class="logo-texto">
                            <span>GESTÃO</span>
                            <strong>ARCA</strong>
                        </div>
                    </a>
                    <button class="menu-hamburger" aria-label="Abrir Menu">
                        <span></span><span></span><span></span>
                    </button>
                    <ul class="lista-links-menu">
                        <li><a href="${paths.pag}prefeitura/dashboard.html">Dashboard</a></li>
                        <li><a href="${paths.pag}prefeitura/adocoes.html">Adoções</a></li>
                        <li><a href="${paths.pag}prefeitura/castracoes.html">Castrações</a></li>
                        <li><a href="${paths.pag}prefeitura/denuncias.html">Denúncias</a></li>
                        <li><a href="${paths.pag}prefeitura/resgates.html">Resgates</a></li>
                        <li><a href="#" id="btn-logout" class="logout-link">Sair</a></li>
                    </ul>
                </nav>
            `;
        } else {
            const perfilPath = `${paths.root}paginas/Perfil/`;
            const perfilLink = logado ? `
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle">Olá, Tutor! 🐾</a>
                    <ul class="sub-menu-suspenso">
                        <li><a href="${perfilPath}perfil.html">Meu Perfil</a></li>
                        <li><a href="${perfilPath}favoritos.html">Meus Favoritos</a></li>
                        <li><a href="${perfilPath}solicitacoes.html">Minhas Solicitações</a></li>
                        <li><a href="#" id="btn-logout" class="logout-link">Sair da Conta</a></li>
                    </ul>
                </li>` : `<li><a href="${perfilPath}login.html">Login / Cadastro</a></li>`;

            nav.innerHTML = topoInstitucional + `
                <nav class="menu-navegacao-principal">
                    <a href="${paths.root}index.html" class="link-logotipo-projeto">
                        <img src="${paths.root}imagens/logo-arca.png" alt="Logo Programa ARCA">
                        <div class="logo-texto"><span>PROJETO</span><strong>ARCA</strong></div>
                    </a>
                    <button class="menu-hamburger" aria-label="Abrir Menu">
                        <span></span><span></span><span></span>
                    </button>
                    <ul class="lista-links-menu">
                        <li><a href="${paths.pag}adotar/adocao.html">Adoção</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle">Castração</a>
                            <ul class="sub-menu-suspenso">
                                <li><a href="${paths.pag}castracao/informacoes.html">Como funciona</a></li>
                                <li><a href="${paths.pag}castracao/selecionar-pet.html">Agendar Castração</a></li>
                                <li><a href="${paths.pag}castracao/clinicas.html">Clínicas credenciadas</a></li>
                            </ul>
                        </li>
                        <li><a href="${paths.pag}Denuncia/escolha-denuncia.html">Denúncia</a></li>
                        <li><a href="${paths.pag}resgate/solicitação-resgate.html">Resgate</a></li>
                        <li><a href="${paths.pag}fale-conosco.html">Fale Conosco</a></li>
                        ${perfilLink}
                    </ul>
                </nav>`;
        }
    }

    if (footer) {
        footer.innerHTML = `
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

function initGlobalEvents(paths) {
    document.addEventListener('click', (e) => {
        const target = e.target;

        // 1. Fechar Modais
        if (target.classList.contains('modal-ficha') || target.classList.contains('btn-fechar-ficha')) {
            const modal = e.target.closest('.modal-ficha') || document.querySelector('.modal-ficha[style*="display: flex"]');
            if (modal) modal.style.display = 'none';
        }

        // 2. Logout
        if (target.closest('#btn-logout')) {
            e.preventDefault();
            sessionStorage.removeItem('usuarioLogado');
            sessionStorage.removeItem('isAdmin');
            window.location.href = `${paths.root}index.html`;
        }

        // 3. Proteção de Rotas e Captura de Redirect
        const linkProtegido = target.closest('a[href*="formulario-adocao.html"], a[href*="solicitacoes.html"], a[href*="agendar-cast.html"], a[href*="selecionar-pet.html"], a[href*="formulario-resgate.html"]');
        if (linkProtegido) {
            if (!checkAccess(e)) return;
        }

        const linkLogin = target.closest('a[href*="login.html"], a[href*="cadastro.html"]');
        if (linkLogin) sessionStorage.setItem('returnUrl', window.location.href);

        // 4. Favoritos
        const btnFav = target.closest('.btn-favorito');
        if (btnFav) {
            if (!checkAccess(e)) return;
            btnFav.classList.toggle('favoritado');
            btnFav.innerText = btnFav.classList.contains('favoritado') ? '❤️' : '🤍';
        }

        // 5. Dropdowns Mobile
        const toggle = target.closest('.dropdown-toggle');
        if (toggle && window.innerWidth <= 768) {
            e.preventDefault();
            toggle.parentElement.classList.toggle('active');
        }

        // 6. Toggle Filtros
        if (target.classList.contains('btn-toggle-filtros')) {
            document.querySelector('.barra-filtros-container')?.classList.toggle('active');
        }

        // 7. Menu Hamburger
        const btnHamburger = target.closest('.menu-hamburger');
        if (btnHamburger) {
            const navPrincipal = btnHamburger.closest('.menu-navegacao-principal');
            navPrincipal?.querySelector('.lista-links-menu')?.classList.toggle('active');
            btnHamburger.classList.toggle('active');
        }
    });
}

function checkAccess(e) {
    if (sessionStorage.getItem('usuarioLogado') !== 'true') {
        sessionStorage.setItem('returnUrl', window.location.href);
        e.preventDefault();
        showModalAcesso();
        return false;
    }
    return true;
}

function showModalAcesso() {
    const paths = getPaths();
    const perfilPath = `${paths.root}paginas/Perfil/`;
    const modalHtml = `
        <div class="camada-fundo-modal" style="display: flex;" onclick="if(event.target===this)this.remove()">
            <div class="caixa-card-modal">
                <span style="font-size: 50px;">🐾</span>
                <h2>Acesso Necessário</h2>
                <p>Para favoritar, adotar ou agendar castrações, você precisa estar conectado à sua conta.</p>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <a href="${perfilPath}login.html" class="botao-acao-principal" style="max-width: 100%;">Já tenho uma conta</a>
                    <a href="${perfilPath}cadastro.html" class="botao-acao-secundaria" style="max-width: 100%;">Criar meu cadastro</a>
                    <button onclick="this.closest('.camada-fundo-modal').remove()" style="background: none; border: none; color: #888; cursor: pointer; margin-top: 10px;">Depois eu faço isso</button>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function initLoginLogic(paths) {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('usuario').value;
        const pass = document.getElementById('senha').value;
        if (user === 'prefeitura' && pass === 'pref@456') {
            sessionStorage.setItem('usuarioLogado', 'true');
            sessionStorage.setItem('isAdmin', 'true');
            window.location.href = `${paths.pag}prefeitura/dashboard.html`;
        } else if (user === 'tutor' && pass === '123456') {
            sessionStorage.setItem('usuarioLogado', 'true');
            const back = sessionStorage.getItem('returnUrl');
            window.location.href = (back && !back.includes('login.html')) ? back : `${paths.pag}Perfil/solicitacoes.html`;
        }
    });
}