// ========= VERIFICAÇÃO DE SESSÃO ADMIN =========
const _adminSessao = JSON.parse(localStorage.getItem('usuarioLogado')) || null;

if (!_adminSessao || _adminSessao.tipo !== 'admin') {
    window.location.href = '../../html/login.html';
}

// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // ========= NOME DO ADMIN LOGADO =========
    if (_adminSessao) {
        const nomeEl = document.getElementById('adminNome');
        const badgeEl = document.getElementById('adminBadge');
        const primeiroNome = _adminSessao.nome ? _adminSessao.nome.split(' ')[0] : 'Gestor';
        if (nomeEl) nomeEl.textContent = primeiroNome;
        if (badgeEl) badgeEl.textContent = _adminSessao.nome || 'Admin';
    }
    
    // ========= DADOS DO DASHBOARD ==========
    const dados = {
        totalAlunos: 386,
        totalProfessores: 24,
        planosAtivos: 312,
        faturamentoTotal: 94520,
        pagRecebidos: 46280,
        pagPendentes: 11340,
        inadimplentes: 32,
        receitaMensal: 52180
    };
    
    // ========= ATUALIZAR CARDS ==========
    document.getElementById('totalAlunos').innerText = dados.totalAlunos;
    document.getElementById('totalProfessores').innerText = dados.totalProfessores;
    document.getElementById('planosAtivos').innerText = dados.planosAtivos;
    document.getElementById('faturamentoTotal').innerText = `R$ ${dados.faturamentoTotal.toLocaleString('pt-BR')}`;
    document.getElementById('pagRecebidos').innerText = `R$ ${dados.pagRecebidos.toLocaleString('pt-BR')}`;
    document.getElementById('pagPendentes').innerText = `R$ ${dados.pagPendentes.toLocaleString('pt-BR')}`;
    document.getElementById('inadimplentes').innerText = dados.inadimplentes;
    document.getElementById('receitaMensal').innerText = `R$ ${dados.receitaMensal.toLocaleString('pt-BR')}`;
    
    // ========= LISTA DE ATIVIDADES RECENTES ==========
    const atividades = [
        { icone: 'fa-user-plus', texto: 'Novo aluno: Lucas Mendes (Plano Black)', tempo: 'Há 15 minutos' },
        { icone: 'fa-credit-card', texto: 'Pagamento aprovado: Ana Beatriz - R$189,90', tempo: 'Há 1 hora' },
        { icone: 'fa-exclamation-triangle', texto: 'Inadimplência: Carlos Eduardo (Mensalidade atrasada)', tempo: 'Há 3 horas' },
        { icone: 'fa-chalkboard-user', texto: 'Professor Roberto atribuído à turma HIIT', tempo: 'Há 5 horas' },
        { icone: 'fa-dumbbell', texto: 'Plano Trimestral renovado por 12 alunos', tempo: 'Ontem' },
        { icone: 'fa-chart-line', texto: 'Meta de faturamento mensal atingida em 87%', tempo: 'Ontem' }
    ];
    
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    
    atividades.forEach(ativ => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        li.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${ativ.icone}"></i>
            </div>
            <div class="activity-text">
                <strong>${ativ.texto}</strong>
                <span class="activity-time">${ativ.tempo}</span>
            </div>
        `;
        activityList.appendChild(li);
    });
    
    // ========= GRÁFICO DE BARRAS ==========
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Plano Mensal', 'Plano Trimestral', 'Plano Semestral', 'Plano Anual'],
            datasets: [{
                label: 'Faturamento (R$)',
                data: [28500, 16400, 22780, 26840],
                backgroundColor: ['#ff7a2f', '#f39c12', '#3498db', '#2ecc71'],
                borderRadius: 12,
                barPercentage: 0.65
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { font: { family: 'Inter', size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `R$ ${context.raw.toLocaleString('pt-BR')}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(val) {
                            return 'R$ ' + val.toLocaleString('pt-BR');
                        }
                    },
                    grid: { color: '#e9ecef' }
                },
                x: {
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
    
    // ========= GRÁFICO DE LINHA (CRESCIMENTO) ==========
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev'],
            datasets: [{
                label: 'Total de Alunos Ativos',
                data: [312, 328, 347, 359, 372, 386],
                borderColor: '#ff7a2f',
                backgroundColor: 'rgba(255,122,47,0.05)',
                borderWidth: 3,
                pointBackgroundColor: '#ff7a2f',
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw} alunos`;
                        }
                    }
                },
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Quantidade de alunos',
                        font: { weight: '500' }
                    },
                    grid: { color: '#edf2f7' },
                    beginAtZero: false,
                    min: 300
                },
                x: {
                    title: {
                        display: true,
                        text: 'Meses'
                    }
                }
            }
        }
    });
    
    // ========= INTERATIVIDADE DO MENU ==========
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active de todos
            navItems.forEach(nav => nav.classList.remove('active'));
            // Adiciona active no clicado
            this.classList.add('active');
            
            // Efeito visual no título
            const menuText = this.querySelector('span')?.innerText || this.innerText;
            const pageTitle = document.querySelector('.page-title h1');
            const originalTitle = pageTitle.innerHTML;
            
            pageTitle.style.opacity = '0.5';
            setTimeout(() => {
                pageTitle.innerHTML = menuText;
                pageTitle.style.opacity = '1';
            }, 150);
            
            setTimeout(() => {
                pageTitle.innerHTML = originalTitle;
            }, 1500);
        });
    });
    
    // ========= AÇÕES DOS CARDS (BOTÕES) ==========
    const cardLinks = document.querySelectorAll('.card-footer a');
    cardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const action = link.innerText.trim();
            
            // Criar notificação flutuante
            const notificacao = document.createElement('div');
            notificacao.innerHTML = `
                <div style="
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #1e2a36;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 40px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    z-index: 9999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    animation: slideInRight 0.3s ease;
                    font-family: 'Inter', sans-serif;
                ">
                    🔔 ${action} - Módulo em desenvolvimento (Demo PIM)
                </div>
            `;
            document.body.appendChild(notificacao);
            
            
            setTimeout(() => {
                notificacao.style.opacity = '0';
                setTimeout(() => notificacao.remove(), 300);
            }, 2000);
            
            // Efeito de clique no card
            const card = link.closest('.card');
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
        
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
    });
});

// Animação para notificações
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
`;
document.head.appendChild(style);


function fazerLogout() {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("alunoLogado");
    localStorage.removeItem("professorLogado");
    window.location.href = "../../login.html";
}
document.addEventListener("DOMContentLoaded", () => {
    const s = document.getElementById("btnSair");
    if (s) s.addEventListener("click", fazerLogout);
});
