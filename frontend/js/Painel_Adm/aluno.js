// Dados iniciais para popular o localStorage
const alunosIniciais = [
    {
        id: 1,
        nome: "Ana Carolina Silva",
        email: "ana.silva@email.com",
        cpf: "123.456.789-00",
        plano: "Premium",
        status: "Ativo"
    },
    {
        id: 2,
        nome: "Bruno Mendes Costa",
        email: "bruno.mendes@email.com",
        cpf: "234.567.890-11",
        plano: "Ultra",
        status: "Ativo"
    },
    {
        id: 3,
        nome: "Carla Fernandes Lima",
        email: "carla.lima@email.com",
        cpf: "345.678.901-22",
        plano: "Básico",
        status: "Inadimplente"
    },
    {
        id: 4,
        nome: "Daniel Oliveira Souza",
        email: "daniel.souza@email.com",
        cpf: "456.789.012-33",
        plano: "Premium",
        status: "Ativo"
    },
    {
        id: 5,
        nome: "Elisa Santos Rocha",
        email: "elisa.rocha@email.com",
        cpf: "567.890.123-44",
        plano: "Básico",
        status: "Inadimplente"
    }
];

// Inicializar localStorage com dados padrão se estiver vazio
function inicializarDados() {
    if (!localStorage.getItem('alunos')) {
        localStorage.setItem('alunos', JSON.stringify(alunosIniciais));
    }
}

// Carregar alunos do localStorage
function carregarAlunos() {
    const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    return alunos;
}

// Salvar alunos no localStorage
function salvarAlunos(alunos) {
    localStorage.setItem('alunos', JSON.stringify(alunos));
}

// Atualizar estatísticas
function atualizarEstatisticas(alunos) {
    const total = alunos.length;
    const ativos = alunos.filter(aluno => aluno.status === 'Ativo').length;
    const inadimplentes = alunos.filter(aluno => aluno.status === 'Inadimplente').length;
    
    document.getElementById('totalAlunos').textContent = total;
    document.getElementById('alunosAtivos').textContent = ativos;
    document.getElementById('alunosInadimplentes').textContent = inadimplentes;
}

// Renderizar tabela de alunos
function renderizarTabela(alunos) {
    const tbody = document.getElementById('tableBody');
    const emptyMessage = document.getElementById('emptyMessage');
    
    if (alunos.length === 0) {
        tbody.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }
    
    emptyMessage.style.display = 'none';
    
    tbody.innerHTML = alunos.map(aluno => `
        <tr>
            <td>
                <strong>${aluno.nome}</strong><br>
                <small style="color: #666;">${aluno.cpf}</small>
            </td>
            <td>${aluno.email}</td>
            <td>
                <span class="plano-badge ${getPlanoClass(aluno.plano)}">
                    ${aluno.plano}
                </span>
            </td>
            <td>
                <span class="status-badge ${aluno.status === 'Ativo' ? 'status-ativo' : 'status-inadimplente'}">
                    ${aluno.status}
                </span>
            </td>
            <td>
                <button class="btn-delete" onclick="excluirAluno(${aluno.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        </tr>
    `).join('');
}

// Retornar classe CSS do plano
function getPlanoClass(plano) {
    switch(plano) {
        case 'Básico': return 'plano-basico';
        case 'Premium': return 'plano-premium';
        case 'Ultra': return 'plano-ultra';
        default: return '';
    }
}

// Excluir aluno
function excluirAluno(id) {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
        let alunos = carregarAlunos();
        alunos = alunos.filter(aluno => aluno.id !== id);
        salvarAlunos(alunos);
        carregarEExibirAlunos();
    }
}

// Buscar alunos (filtro)
function buscarAlunos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const alunos = carregarAlunos();
    
    const alunosFiltrados = alunos.filter(aluno => 
        aluno.nome.toLowerCase().includes(searchTerm) ||
        aluno.email.toLowerCase().includes(searchTerm) ||
        aluno.cpf.includes(searchTerm)
    );
    
    renderizarTabela(alunosFiltrados);
    atualizarEstatisticas(alunosFiltrados);
}

// Carregar e exibir todos os alunos
function carregarEExibirAlunos() {
    const alunos = carregarAlunos();
    renderizarTabela(alunos);
    atualizarEstatisticas(alunos);
}

// Cadastrar novo aluno
function cadastrarAluno(event) {
    event.preventDefault();
    
    const alunos = carregarAlunos();
    
    const novoAluno = {
        id: Date.now(), // ID único baseado no timestamp
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        cpf: document.getElementById('cpf').value,
        plano: document.getElementById('plano').value,
        status: document.getElementById('status').value
    };
    
    alunos.push(novoAluno);
    salvarAlunos(alunos);
    
    // Fechar modal e resetar formulário
    fecharModal();
    document.getElementById('formAluno').reset();
    
    // Recarregar tabela
    carregarEExibirAlunos();
}

// Abrir modal
function abrirModal() {
    const modal = document.getElementById('modalAluno');
    modal.style.display = 'flex';
}

// Fechar modal
function fecharModal() {
    const modal = document.getElementById('modalAluno');
    modal.style.display = 'none';
    document.getElementById('formAluno').reset();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    inicializarDados();
    carregarEExibirAlunos();
    
    // Eventos dos botões
    document.getElementById('btnNovoAluno').addEventListener('click', abrirModal);
    document.getElementById('cancelModal').addEventListener('click', fecharModal);
    document.querySelector('.close-modal').addEventListener('click', fecharModal);
    document.getElementById('formAluno').addEventListener('submit', cadastrarAluno);
    document.getElementById('searchInput').addEventListener('input', buscarAlunos);
    
    // Fechar modal clicando fora
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modalAluno');
        if (e.target === modal) {
            fecharModal();
        }
    });
});
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
