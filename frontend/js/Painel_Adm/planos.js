// Dados iniciais dos planos
const planosIniciais = [
    {
        id: 1,
        nome: "Básico",
        preco: 89.90,
        duracao: "Mensal",
        beneficios: ["Acesso 24h", "Aulas em grupo", "Avaliação Física"],
        status: "Ativo"
    },
    {
        id: 2,
        nome: "Premium",
        preco: 149.90,
        duracao: "Mensal",
        beneficios: ["Acesso 24h", "Aulas em grupo", "Personal Trainer", "Estacionamento", "Avaliação Física"],
        status: "Ativo"
    },
    {
        id: 3,
        nome: "Ultra",
        preco: 199.90,
        duracao: "Mensal",
        beneficios: ["Acesso 24h", "Aulas em grupo", "Personal Trainer", "Estacionamento", "Avaliação Física", "App exclusivo"],
        status: "Ativo"
    }
];

// Inicializar localStorage
function inicializarDados() {
    if (!localStorage.getItem('planos')) {
        localStorage.setItem('planos', JSON.stringify(planosIniciais));
    }
}

// Carregar planos
function carregarPlanos() {
    return JSON.parse(localStorage.getItem('planos')) || [];
}

// Salvar planos
function salvarPlanos(planos) {
    localStorage.setItem('planos', JSON.stringify(planos));
}

// Renderizar cards dos planos
function renderizarPlanos() {
    const planos = carregarPlanos();
    const container = document.getElementById('planosGrid');
    const emptyMessage = document.getElementById('emptyMessage');
    
    if (planos.length === 0) {
        container.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }
    
    emptyMessage.style.display = 'none';
    
    container.innerHTML = planos.map(plano => `
        <div class="plano-card ${plano.nome === 'Premium' ? 'premium' : ''} ${plano.status === 'Inativo' ? 'inativo' : ''}">
            ${plano.nome === 'Premium' ? '<div class="premium-badge"><i class="fas fa-crown"></i> Mais Popular</div>' : ''}
            <div class="plano-header">
                <h2>${plano.nome}</h2>
                <div class="plano-preco">
                    R$ ${plano.preco.toFixed(2)}<small>/mês</small>
                </div>
                <div class="plano-duracao">
                    <i class="fas fa-calendar-alt"></i> ${plano.duracao}
                </div>
                <div class="status-badge ${plano.status === 'Ativo' ? 'status-ativo' : 'status-inativo'}">
                    ${plano.status}
                </div>
            </div>
            <div class="plano-body">
                <ul class="beneficios-list">
                    ${plano.beneficios.map(beneficio => `
                        <li><i class="fas fa-check-circle"></i> ${beneficio}</li>
                    `).join('')}
                </ul>
            </div>
            <div class="plano-footer">
                <button class="btn-edit" onclick="editarPlano(${plano.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-delete" onclick="excluirPlano(${plano.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// Excluir plano
function excluirPlano(id) {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
        let planos = carregarPlanos();
        planos = planos.filter(p => p.id !== id);
        salvarPlanos(planos);
        renderizarPlanos();
        mostrarNotificacao('Plano excluído com sucesso!');
    }
}

// Editar plano (simulado)
function editarPlano(id) {
    const planos = carregarPlanos();
    const plano = planos.find(p => p.id === id);
    
    if (plano) {
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Plano';
        document.getElementById('planoId').value = plano.id;
        document.getElementById('nome').value = plano.nome;
        document.getElementById('preco').value = plano.preco;
        document.getElementById('duracao').value = plano.duracao;
        document.getElementById('status').value = plano.status;
        
        // Marcar checkboxes dos benefícios
        const checkboxes = document.querySelectorAll('.beneficios-group input');
        checkboxes.forEach(cb => {
            cb.checked = plano.beneficios.includes(cb.value);
        });
        
        abrirModal();
    }
}

// Cadastrar/Editar plano
function salvarPlano(event) {
    event.preventDefault();
    
    const planos = carregarPlanos();
    const id = parseInt(document.getElementById('planoId').value);
    
    // Coletar benefícios marcados
    const beneficios = [];
    const checkboxes = document.querySelectorAll('.beneficios-group input:checked');
    checkboxes.forEach(cb => {
        beneficios.push(cb.value);
    });
    
    const planoData = {
        nome: document.getElementById('nome').value,
        preco: parseFloat(document.getElementById('preco').value),
        duracao: document.getElementById('duracao').value,
        beneficios: beneficios,
        status: document.getElementById('status').value
    };
    
    if (id) {
        // Editar plano existente
        const index = planos.findIndex(p => p.id === id);
        if (index !== -1) {
            planos[index] = { ...planoData, id: id };
            salvarPlanos(planos);
            mostrarNotificacao('Plano editado com sucesso!');
        }
    } else {
        // Novo plano
        const novoPlano = {
            ...planoData,
            id: Date.now()
        };
        planos.push(novoPlano);
        salvarPlanos(planos);
        mostrarNotificacao('Plano cadastrado com sucesso!');
    }
    
    fecharModal();
    renderizarPlanos();
}

// Mostrar notificação
function mostrarNotificacao(mensagem) {
    const notif = document.createElement('div');
    notif.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        ">
            <i class="fas fa-check-circle"></i> ${mensagem}
        </div>
    `;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 300);
    }, 2500);
}

// Abrir modal
function abrirModal() {
    document.getElementById('modalPlano').style.display = 'flex';
}

// Fechar modal e resetar formulário
function fecharModal() {
    document.getElementById('modalPlano').style.display = 'none';
    document.getElementById('formPlano').reset();
    document.getElementById('planoId').value = '';
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Novo Plano';
    
    // Desmarcar checkboxes
    const checkboxes = document.querySelectorAll('.beneficios-group input');
    checkboxes.forEach(cb => cb.checked = false);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    inicializarDados();
    renderizarPlanos();
    
    document.getElementById('btnNovoPlano').addEventListener('click', () => {
        document.getElementById('planoId').value = '';
        document.getElementById('formPlano').reset();
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Novo Plano';
        abrirModal();
    });
    
    document.getElementById('cancelModal').addEventListener('click', fecharModal);
    document.querySelector('.close-modal').addEventListener('click', fecharModal);
    document.getElementById('formPlano').addEventListener('submit', salvarPlano);
    
    // Fechar modal clicando fora
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modalPlano');
        if (e.target === modal) fecharModal();
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
// ── CORREÇÃO: logout ──────────────────────────────────────────────
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
