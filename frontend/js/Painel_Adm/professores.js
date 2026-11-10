// DADOS INICIAIS
const professoresIniciais = [
    { id: 1, nome: "Carlos Eduardo", especialidade: "Musculação", horario: "Manhã (06h-12h)", status: "Ativo" },
    { id: 2, nome: "Fernanda Lima", especialidade: "Personal Trainer", horario: "Tarde (12h-18h)", status: "Ativo" },
    { id: 3, nome: "Roberto Alves", especialidade: "Cardio", horario: "Noite (18h-22h)", status: "Inativo" },
    { id: 4, nome: "Patrícia Rocha", especialidade: "Funcional", horario: "Integral", status: "Ativo" },
    { id: 5, nome: "Marcelo Costa", especialidade: "Pilates", horario: "Noite (18h-22h)", status: "Ativo" }
];

// INICIALIZAR
function init() {
    if (!localStorage.getItem('professores')) {
        localStorage.setItem('professores', JSON.stringify(professoresIniciais));
    }
}

// CARREGAR
function getProfessores() {
    return JSON.parse(localStorage.getItem('professores')) || [];
}

// SALVAR
function saveProfessores(professores) {
    localStorage.setItem('professores', JSON.stringify(professores));
}

// ATUALIZAR ESTATÍSTICAS
function updateStats() {
    const professores = getProfessores();
    const total = professores.length;
    const ativos = professores.filter(p => p.status === 'Ativo').length;
    const inativos = professores.filter(p => p.status === 'Inativo').length;
    
    document.getElementById('totalProfessores').textContent = total;
    document.getElementById('professoresAtivos').textContent = ativos;
    document.getElementById('professoresInativos').textContent = inativos;
}

// RENDERIZAR TABELA
let searchTerm = '';

function renderTable() {
    let professores = getProfessores();
    
    if (searchTerm) {
        professores = professores.filter(p => 
            p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.especialidade.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    const tbody = document.getElementById('tableBody');
    const emptyMsg = document.getElementById('emptyMessage');
    
    if (professores.length === 0) {
        tbody.innerHTML = '';
        emptyMsg.style.display = 'block';
        updateStats();
        return;
    }
    
    emptyMsg.style.display = 'none';
    
    tbody.innerHTML = professores.map(p => `
        <tr>
            <td><strong>${p.nome}</strong></td>
            <td><span class="especialidade-badge"><i class="fas fa-dumbbell"></i> ${p.especialidade}</span></td>
            <td><span class="horario-badge"><i class="fas fa-clock"></i> ${p.horario}</span></td>
            <td>
                <span class="status-badge ${p.status === 'Ativo' ? 'status-ativo' : 'status-inativo'}">
                    <i class="fas ${p.status === 'Ativo' ? 'fa-check-circle' : 'fa-circle'}"></i> ${p.status}
                </span>
            </td>
            <td>
                <button class="btn-action btn-edit" onclick="editProfessor(${p.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-action btn-delete" onclick="deleteProfessor(${p.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        </tr>
    `).join('');
    
    updateStats();
}

// EXCLUIR
function deleteProfessor(id) {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
        let professores = getProfessores();
        professores = professores.filter(p => p.id !== id);
        saveProfessores(professores);
        renderTable();
        showNotification('Professor excluído!', 'success');
    }
}

// EDITAR (SIMULADO)
function editProfessor(id) {
    const professores = getProfessores();
    const professor = professores.find(p => p.id === id);
    
    if (professor) {
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Professor';
        document.getElementById('professorId').value = professor.id;
        document.getElementById('nome').value = professor.nome;
        document.getElementById('especialidade').value = professor.especialidade;
        document.getElementById('horario').value = professor.horario;
        document.getElementById('status').value = professor.status;
        openModal();
    }
}

// SALVAR (NOVO/EDITAR)
function saveProfessor(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('professorId').value);
    const nome = document.getElementById('nome').value;
    const especialidade = document.getElementById('especialidade').value;
    const horario = document.getElementById('horario').value;
    const status = document.getElementById('status').value;
    
    if (!nome || !especialidade || !horario) {
        showNotification('Preencha todos os campos!', 'error');
        return;
    }
    
    const professores = getProfessores();
    
    if (id) {
        // Editar
        const index = professores.findIndex(p => p.id === id);
        if (index !== -1) {
            professores[index] = { ...professores[index], nome, especialidade, horario, status };
            saveProfessores(professores);
            showNotification('Professor editado!', 'success');
        }
    } else {
        // Novo
        const novo = { id: Date.now(), nome, especialidade, horario, status };
        professores.push(novo);
        saveProfessores(professores);
        showNotification('Professor cadastrado!', 'success');
    }
    
    closeModal();
    renderTable();
}

// BUSCAR
function searchProfessores() {
    searchTerm = document.getElementById('searchInput').value;
    renderTable();
}

// NOTIFICAÇÃO
function showNotification(msg, type = 'success') {
    const colors = { success: '#2ecc71', error: '#e74c3c' };
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle' };
    
    const notif = document.createElement('div');
    notif.innerHTML = `
        <div style="position:fixed; bottom:20px; right:20px; background:${colors[type]}; 
                    color:white; padding:10px 20px; border-radius:10px; font-size:0.85rem;
                    z-index:9999; animation:slideInRight 0.3s ease; display:flex; align-items:center; gap:8px;">
            <i class="fas ${icons[type]}"></i> ${msg}
        </div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2500);
}

// MODAL
function openModal() {
    document.getElementById('modalProfessor').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalProfessor').style.display = 'none';
    document.getElementById('formProfessor').reset();
    document.getElementById('professorId').value = '';
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Professor';
}

// EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    init();
    renderTable();
    
    document.getElementById('btnNovoProfessor').onclick = openModal;
    document.getElementById('cancelModal').onclick = closeModal;
    document.querySelector('.close-modal').onclick = closeModal;
    document.getElementById('formProfessor').onsubmit = saveProfessor;
    document.getElementById('searchInput').oninput = searchProfessores;
    
    window.onclick = (e) => {
        if (e.target === document.getElementById('modalProfessor')) closeModal();
    };
});

// ANIMAÇÃO
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
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
