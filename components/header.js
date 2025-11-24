class CustomHeader extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `\
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .header {
                    background: linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(107, 33, 168, 0.8));
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(236, 72, 153, 0.3);
                    padding: 1rem 0;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                
                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .logo {
                    font-size: 1.5rem;
                    font-weight: bold;
                    background: linear-gradient(45deg, #ec4899, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-decoration: none;
                }
                
                .nav-links {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                }
                
                .nav-link {
                    color: #d1d5db;
                    text-decoration: none;
                    transition: color 0.3s ease;
                    font-weight: 500;
                }
                
                .nav-link:hover {
                    color: #ec4899;
                }
                
                @media (max-width: 768px) {
                    .nav-links {
                        gap: 1rem;
                    }
                    
                    .nav-link span {
                        display: none;
                    }
                }
            </style>
            <header class="header">
                <div class="nav-container">
                    <a href="index.html" class="logo">
                        PornDash Pixel Paradise 🎮
                    </a>
                    <nav class="nav-links">
                        <a href="index.html" class="nav-link">
                            <i data-feather="home"></i>
                            <span>Início</span>
                        </a>
                        <a href="#" class="nav-link">
                            <i data-feather="award"></i>
                            <span>Conquistas</span>
                        </a>
                        <a href="#" class="nav-link">
                            <i data-feather="settings"></i>
                            <span>Configurações</span>
                        </a>
                    </nav>
                </div>
            </header>
        `;
    }
}

customElements.define('custom-header', CustomHeader);