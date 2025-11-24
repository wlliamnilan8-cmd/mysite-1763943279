class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `\
            <style>
                :host {
                    display: block;
                    width: 100%;
                    margin-top: auto;
                }
                
                .footer {
                    background: linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(55, 65, 81, 0.8));
                    border-top: 1px solid rgba(236, 72, 153, 0.3);
                    padding: 2rem 0;
                    margin-top: 4rem;
                }
                
                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                    text-align: center;
                }
                
                .footer-links {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-bottom: 1rem;
                }
                
                .footer-link {
                    color: #9ca3af;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                
                .footer-link:hover {
                    color: #ec4899;
                }
                
                .copyright {
                    color: #6b7280;
                    font-size: 0.875rem;
                }
                
                @media (max-width: 768px) {
                    .footer-links {
                        flex-direction: column;
                        gap: 1rem;
                    }
                }
            </style>
            <footer class="footer">
                <div class="footer-content">
                    <div class="footer-links">
                        <a href="#" class="footer-link">Sobre</a>
                        <a href="#" class="footer-link">Ajuda</a>
                        <a href="#" class="footer-link">Privacidade</a>
                        <a href="#" class="footer-link">Termos</a>
                    </div>
                    <div class="copyright">
                        © 2024 PornDash Pixel Paradise. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);