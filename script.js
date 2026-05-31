/**
 * Lógica de Interface do Usuário - Programa ARCA
 * Controla comportamentos dinâmicos globais e estados responsivos.
 */
document.addEventListener('DOMContentLoaded', () => {
    // O "Cérebro" do site: espera o HTML carregar para ativar as funções
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
});

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

    const isSubfolder = window.location.pathname.includes('/paginas/');
    const rootPath = isSubfolder ? '../../' : './';
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
        const isSubfolder = window.location.pathname.includes('/paginas/');
        const rootPath = isSubfolder ? '../../' : './';
        const perfilPath = `${rootPath}paginas/Perfil/`;

        if (logado) {
            li.classList.add('dropdown');
            perfilLink.innerHTML = 'Olá, Tutor! 🐾';
            perfilLink.href = '#';
            perfilLink.classList.remove('active'); // Remove se estiver vindo do login
            perfilLink.classList.add('dropdown-toggle');

            // Cria o submenu se ele ainda não existir
            if (!li.querySelector('.sub-menu-suspenso')) {
                const subMenu = document.createElement('ul');
                subMenu.className = 'sub-menu-suspenso';
                subMenu.innerHTML = `
                    <li><a href="#">Meu Perfil</a></li>
                    <li><a href="#">Meus Favoritos</a></li>
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
            // Volta para a home baseado em onde o usuário está
            const isSubfolder = window.location.pathname.includes('/paginas/');
            window.location.href = isSubfolder ? '../../index.html' : 'index.html';
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
                    window.location.href = 'solicitacoes.html';
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