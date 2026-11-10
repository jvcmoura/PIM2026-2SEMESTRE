const API_URL = "http://localhost:5263/api";

/**
 * Ultra Fit Academia - Sistema de Interatividade
 * Funcionalidades: Scroll suave, animação de cards, redirecionamento de planos, menu mobile
 */

(function() {
    'use strict';
    
    // Aguarda o DOM carregar completamente
    document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initSmoothScroll();
        initCardAnimation();
        initPlanButtons();
        initHeaderScroll();
        initContactForm();
        initActiveNav();
    });
    
    /**
     * 1. MENU MOBILE
     * Abre/fecha o menu em dispositivos móveis
     */
    function initMobileMenu() {
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileBtn && navMenu) {
            mobileBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileBtn.classList.toggle('active');
            });
            
            // Fecha o menu ao clicar em um link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileBtn.classList.remove('active');
                });
            });
        }
    }
    
    /**
     * 2. SCROLL SUAVE
     * Rolagem suave ao clicar nos links de navegação
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Ignora links vazios ou apenas "#"
                if (href === '#' || href === '') return;
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Atualiza URL sem recarregar a página
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    /**
     * 3. ANIMAÇÃO DOS CARDS
     * Cards aparecem com animação fade + subir ao entrar na tela
     */
    function initCardAnimation() {
        const cards = document.querySelectorAll('.card');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        cards.forEach(card => {
            observer.observe(card);
        });
    }
    
    /**
     * 4. REDIRECIONAMENTO DE PLANOS
     * Salva o plano escolhido no localStorage e redireciona para cadastro
     */
    function initPlanButtons() {
        const buttons = document.querySelectorAll('.btn-assinar');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Encontra o card do plano
                const planCard = button.closest('.plano-card');
                
                if (planCard) {
                    // Extrai informações do plano
                    const plano = planCard.getAttribute('data-plano') || 
                                 planCard.querySelector('.plano-nome')?.innerText.toLowerCase().replace('plano ', '') || 
                                 'basico';
                    
                    const nomePlano = planCard.querySelector('.plano-nome')?.innerText || 'Plano';
                    const precoPlano = planCard.querySelector('.preco-valor')?.innerText || 'R$ 0';
                    
                    // Dados do plano para salvar
                    const dadosPlano = {
                        tipo: plano,
                        nome: nomePlano,
                        preco: precoPlano,
                        dataSelecao: new Date().toISOString()
                    };
                    
                    // Salva no localStorage
                    localStorage.setItem('planoEscolhido', JSON.stringify(dadosPlano));
                    
                    // Efeito visual de clique
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 150);
                    
                    // Redireciona para a página de cadastro
                    window.location.href = 'html/cadastro.html';
                }
            });
        });
    }
    
    /**
     * 5. HEADER COM EFEITO AO SCROLL
     * Muda o estilo do header ao rolar a página
     */
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
                header.style.padding = '0';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.padding = '';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    /**
     * 6. FORMULÁRIO DE CONTATO
     * Validação e feedback do formulário
     */
    function initContactForm() {
        const form = document.getElementById('contatoForm');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Validação simples
                const inputs = form.querySelectorAll('input, textarea');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = '#ff4444';
                        input.style.background = 'rgba(255, 68, 68, 0.1)';
                    } else {
                        input.style.borderColor = 'rgba(255, 107, 0, 0.2)';
                        input.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                });
                
                if (isValid) {
                    // Simula envio
                    const submitBtn = form.querySelector('button');
                    const originalText = submitBtn.innerText;
                    
                    submitBtn.innerText = 'Enviando...';
                    submitBtn.disabled = true;
                    
                    setTimeout(() => {
                        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                        form.reset();
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                } else {
                    showNotification('Por favor, preencha todos os campos.', 'error');
                }
            });
        }
    }
    
    /**
     * 7. NOTIFICAÇÃO FLUTUANTE
     * Exibe mensagens temporárias na tela
     */
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${type === 'success' ? '✓' : '⚠️'}</span>
            <span>${message}</span>
        `;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease;
            cursor: pointer;
        `;
        
        document.body.appendChild(notification);
        
        // Remove após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Fecha ao clicar
        notification.addEventListener('click', () => notification.remove());
    }
    
    /**
     * 8. INICIALIZAÇÃO DO VLRBAS
     */
    function initVLibras() {
        setTimeout(function() {
            if (typeof window.VLibras !== 'undefined') {
                new window.VLibras.Widget('https://vlibras.gov.br/app');
            }
        }, 500);
    }
    
    /**
     * 9. NAVEGAÇÃO ATIVA
     * Destaca o link do menu conforme a seção visível
     */
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    /**
     * 10. SCROLL INDICATOR
     * Clica na seta e rola para próxima seção
     */
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const beneficiosSection = document.querySelector('.beneficios');
            if (beneficiosSection) {
                beneficiosSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Adiciona estilos para animações das notificações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
})();