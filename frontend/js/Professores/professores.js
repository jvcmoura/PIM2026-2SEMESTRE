// ========= SISTEMA CENTRALIZADO DE DADOS =========

const dadosIniciais = {
    alunos: [
        { id: 1, nome: "Ana Carolina Silva", email: "ana.silva@email.com", cpf: "123.456.789-00", plano: "Premium", status: "Ativo" },
        { id: 2, nome: "Bruno Mendes Costa", email: "bruno.mendes@email.com", cpf: "234.567.890-11", plano: "Ultra", status: "Ativo" },
        { id: 3, nome: "Carla Fernandes Lima", email: "carla.lima@email.com", cpf: "345.678.901-22", plano: "Básico", status: "Inadimplente" },
        { id: 4, nome: "Daniel Oliveira Souza", email: "daniel.souza@email.com", cpf: "456.789.012-33", plano: "Premium", status: "Ativo" },
        { id: 5, nome: "Elisa Santos Rocha", email: "elisa.rocha@email.com", cpf: "567.890.123-44", plano: "Básico", status: "Ativo" },
        { id: 6, nome: "Fernando Almeida", email: "fernando@email.com", cpf: "678.901.234-55", plano: "Ultra", status: "Ativo" },
        { id: 7, nome: "Gabriela Martins", email: "gabriela@email.com", cpf: "789.012.345-66", plano: "Premium", status: "Ativo" }
    ],
    checkins: []
};


// ========= CARREGAR PROFESSOR LOGADO =========
const _profSessao = JSON.parse(localStorage.getItem('professorLogado')) || null;

if (!_profSessao) {
    window.location.href = '../login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (_profSessao) {
        const primeiroNome = _profSessao.nome ? _profSessao.nome.split(' ')[0] : 'Professor';
        const sidebarEl = document.getElementById('sidebarNomeProf');
        const welcomeEl = document.getElementById('welcomeNomeProf');
        if (sidebarEl) sidebarEl.textContent = 'Prof. ' + _profSessao.nome;
        if (welcomeEl) welcomeEl.textContent = primeiroNome;
    }
});

// FUNÇÕES DE ACESSO AOS DADOS
function getAlunos() {
    return JSON.parse(localStorage.getItem('alunos')) || dadosIniciais.alunos;
}

function getCheckins() {
    return JSON.parse(localStorage.getItem('checkins')) || [];
}

function salvarCheckins(checkins) {
    localStorage.setItem('checkins', JSON.stringify(checkins));
}

// INICIALIZAR DADOS (se não existirem)
function inicializarDados() {
    if (!localStorage.getItem('alunos')) {
        localStorage.setItem('alunos', JSON.stringify(dadosIniciais.alunos));
    }
    if (!localStorage.getItem('checkins')) {
        localStorage.setItem('checkins', JSON.stringify(dadosIniciais.checkins));
    }
}

// FUNÇÕES AUXILIARES
function getDataAtual() {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
}

function getHoraAtual() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function getDataFormatada() {
    const hoje = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return hoje.toLocaleDateString('pt-BR', options);
}

function fezCheckinHoje(alunoId) {
    const checkins = getCheckins();
    const dataHoje = getDataAtual();
    return checkins.some(c => c.alunoId === alunoId && c.data === dataHoje);
}

function getCheckinsHoje() {
    const checkins = getCheckins();
    const dataHoje = getDataAtual();
    return checkins.filter(c => c.data === dataHoje);
}

// ATUALIZAR GRÁFICO CIRCULAR
function atualizarGraficoCircular(percentual) {
    const circle = document.getElementById('progressCircle');
    const circumference = 251.2;
    const offset = circumference - (percentual / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    document.getElementById('presencaPercentual').textContent = `${percentual}%`;
}

// ATUALIZAR CARDS DO PAINEL
function atualizarPainel() {
    const alunos = getAlunos();
    const checkinsHoje = getCheckinsHoje();
    
    const total = alunos.length;
    const presentes = checkinsHoje.length;
    const faltas = total - presentes;
    const percentual = total > 0 ? Math.round((presentes / total) * 100) : 0;
    
    document.getElementById('totalAlunos').textContent = total;
    document.getElementById('presentesHoje').textContent = presentes;
    document.getElementById('faltasHoje').textContent = faltas;
    document.getElementById('presenteValor').textContent = presentes;
    document.getElementById('ausenteValor').textContent = faltas;
    
    atualizarGraficoCircular(percentual);
}

// RENDERIZAR LISTA DE ALUNOS
let termoBusca = '';

function renderizarListaAlunos() {
    let alunos = getAlunos();
    
    if (termoBusca) {
        alunos = alunos.filter(a => 
            a.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
            a.email.toLowerCase().includes(termoBusca.toLowerCase())
        );
    }
    
    const tbody = document.getElementById('listaAlunos');
    const emptyMsg = document.getElementById('emptyAlunos');
    const alunosCount = document.getElementById('alunosCount');
    
    if (alunosCount) {
        alunosCount.textContent = alunos.length;
    }
    
    if (alunos.length === 0) {
        tbody.innerHTML = '';
        if (emptyMsg) emptyMsg.style.display = 'block';
        return;
    }
    
    if (emptyMsg) emptyMsg.style.display = 'none';
    
    tbody.innerHTML = alunos.map(aluno => {
        const presente = fezCheckinHoje(aluno.id);
        const statusClass = presente ? 'status-presente' : 'status-ausente';
        const statusIcon = presente ? 'fa-check-circle' : 'fa-times-circle';
        const statusText = presente ? 'Presente' : 'Ausente';
        
        return `
            <tr>
                <td>
                    <div class="aluno-info">
                        <strong>${aluno.nome}</strong>
                        <small>${aluno.email}</small>
                    </div>
                </td>
                <td>
                    <span class="plano-badge ${aluno.plano.toLowerCase()}">${aluno.plano}</span>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">
                        <i class="fas ${statusIcon}"></i>
                        ${statusText}
                    </span>
                </td>
                <td>
                    ${!presente ? `
                        <button class="btn-checkin-action" onclick="registrarCheckin(${aluno.id}, '${aluno.nome}', '${aluno.email}')">
                            <i class="fas fa-fingerprint"></i> Check-in
                        </button>
                    ` : `
                        <span class="checkin-success">
                            <i class="fas fa-check-circle"></i> Check-in realizado
                        </span>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

// REGISTRAR CHECK-IN
function registrarCheckin(alunoId, alunoNome, alunoEmail) {
    const hoje = getDataAtual();
    const hora = getHoraAtual();
    
    if (fezCheckinHoje(alunoId)) {
        mostrarNotificacao(`${alunoNome} já fez check-in hoje!`, 'error');
        return;
    }
    
    const checkins = getCheckins();
    const novoCheckin = {
        id: Date.now(),
        alunoId: alunoId,
        nome: alunoNome,
        email: alunoEmail,
        data: hoje,
        hora: hora
    };
    
    checkins.push(novoCheckin);
    salvarCheckins(checkins);
    
    mostrarNotificacao(`✅ Check-in de ${alunoNome} registrado com sucesso!`, 'success');
    
    // Atualizar todas as telas
    atualizarPainel();
    renderizarListaAlunos();
    atualizarSelectAlunos();
    renderizarCheckinsHoje();
}

// ATUALIZAR SELECT DE ALUNOS
function atualizarSelectAlunos() {
    const alunos = getAlunos();
    const select = document.getElementById('alunoCheckin');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">📋 Escolha um aluno...</option>';
    
    const alunosSemCheckin = alunos.filter(aluno => !fezCheckinHoje(aluno.id));
    
    if (alunosSemCheckin.length === 0) {
        select.innerHTML += '<option disabled>✨ Todos os alunos já fizeram check-in hoje!</option>';
    } else {
        alunosSemCheckin.forEach(aluno => {
            select.innerHTML += `<option value="${aluno.id}" data-nome="${aluno.nome}" data-email="${aluno.email}">
                ${aluno.nome} - ${aluno.plano}
            </option>`;
        });
    }
}

// RENDERIZAR CHECK-INS DE HOJE
function renderizarCheckinsHoje() {
    const checkins = getCheckinsHoje();
    const container = document.getElementById('checkinsHoje');
    const checkinsCount = document.getElementById('checkinsCount');
    
    if (!container) return;
    
    if (checkinsCount) {
        checkinsCount.textContent = checkins.length;
    }
    
    if (checkins.length === 0) {
        container.innerHTML = `
            <div class="empty-checkins">
                <i class="fas fa-clock"></i>
                <p>Nenhum check-in registrado hoje</p>
                <small>Registre a presença dos alunos</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = checkins.map((c, index) => `
        <div class="checkin-item" style="animation-delay: ${index * 0.05}s">
            <i class="fas fa-check-circle"></i>
            <div class="checkin-info">
                <div class="checkin-nome">${c.nome}</div>
                <div class="checkin-hora">
                    <i class="fas fa-clock"></i> ${c.hora}
                </div>
            </div>
            <div class="checkin-status">
                <span class="status-badge status-presente">Confirmado</span>
            </div>
        </div>
    `).join('');
}

// REGISTRAR CHECK-IN PELO SELECT
function registrarCheckinPorSelect() {
    const select = document.getElementById('alunoCheckin');
    const alunoId = parseInt(select.value);
    
    if (!alunoId) {
        mostrarNotificacao('⚠️ Por favor, selecione um aluno!', 'error');
        return;
    }
    
    const option = select.options[select.selectedIndex];
    const alunoNome = option.getAttribute('data-nome');
    const alunoEmail = option.getAttribute('data-email');
    
    registrarCheckin(alunoId, alunoNome, alunoEmail);
    
    // Resetar select
    select.value = '';
}

// MOSTRAR NOTIFICAÇÃO
function mostrarNotificacao(mensagem, tipo = 'success') {
    const cores = { 
        success: '#2ecc71', 
        error: '#e74c3c',
        info: '#3498db'
    };
    
    const icones = { 
        success: 'fa-check-circle', 
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    const notif = document.createElement('div');
    notif.className = 'custom-notification';
    notif.innerHTML = `
        <div style="position:fixed; bottom:20px; right:20px; background:${cores[tipo]}; 
                    color:white; padding:14px 24px; border-radius:12px; font-size:0.85rem;
                    z-index:9999; animation:slideInRight 0.3s ease; display:flex; align-items:center; gap:12px;
                    box-shadow:0 5px 20px rgba(0,0,0,0.3);">
            <i class="fas ${icones[tipo]}" style="font-size:1.1rem;"></i>
            <span>${mensagem}</span>
        </div>
    `;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// NAVEGAÇÃO ENTRE PÁGINAS
function navegarPara(pagina) {
    // Esconder todas as páginas
    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.remove('active');
    });
    
    // Mostrar página selecionada
    const paginaAtiva = document.getElementById(`pagina${pagina}`);
    if (paginaAtiva) {
        paginaAtiva.classList.add('active');
    }
    
    // Atualizar menu ativo
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const menuAtivo = document.querySelector(`.nav-item[data-page="${pagina.toLowerCase()}"]`);
    if (menuAtivo) {
        menuAtivo.classList.add('active');
    }
    
    // Atualizar título
    const titulos = {
        'Painel': 'Painel do Professor',
        'Alunos': 'Meus Alunos',
        'Presenca': 'Controle de Presença'
    };
    
    const subtitulos = {
        'Painel': 'Visão geral da presença dos alunos',
        'Alunos': 'Lista completa de alunos matriculados',
        'Presenca': 'Registro de presença diária'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    
    if (pageTitle) pageTitle.textContent = titulos[pagina] || pagina;
    if (pageSubtitle) pageSubtitle.textContent = subtitulos[pagina] || '';
    
    // Recarregar dados específicos da página
    if (pagina === 'Presenca') {
        atualizarSelectAlunos();
        renderizarCheckinsHoje();
    }
    if (pagina === 'Alunos') {
        renderizarListaAlunos();
    }
    if (pagina === 'Painel') {
        atualizarPainel();
    }
}

// EXIBIR DATA ATUAL
function exibirDataAtual() {
    const dataElement = document.getElementById('dataAtual');
    if (dataElement) {
        dataElement.textContent = getDataFormatada();
    }
}

// INICIALIZAR
document.addEventListener('DOMContentLoaded', () => {
    inicializarDados();
    exibirDataAtual();
    atualizarPainel();
    renderizarListaAlunos();
    atualizarSelectAlunos();
    renderizarCheckinsHoje();
    
    // Eventos de navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pagina = item.getAttribute('data-page');
            if (pagina) {
                navegarPara(pagina.charAt(0).toUpperCase() + pagina.slice(1));
            }
        });
    });
    
    // Busca de alunos
    const searchInput = document.getElementById('searchAluno');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            termoBusca = e.target.value;
            renderizarListaAlunos();
        });
    }
    
    // Botão check-in
    const btnCheckin = document.getElementById('btnCheckin');
    if (btnCheckin) {
        btnCheckin.addEventListener('click', registrarCheckinPorSelect);
    }
});

// Adicionar estilos para notificações e badges
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
    
    .aluno-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .aluno-info strong {
        font-size: 0.9rem;
    }
    
    .aluno-info small {
        font-size: 0.7rem;
        color: #888;
    }
    
    .plano-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
    }
    
    .plano-badge.básico {
        background: rgba(52, 152, 219, 0.15);
        color: #3498db;
    }
    
    .plano-badge.premium {
        background: rgba(255, 77, 0, 0.15);
        color: #ff4d00;
    }
    
    .plano-badge.ultra {
        background: rgba(241, 196, 15, 0.15);
        color: #f1c40f;
    }
    
    .checkin-success {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.7rem;
        color: #2ecc71;
    }
    
    .checkin-success i {
        font-size: 0.8rem;
    }
    
    .custom-notification {
        animation: slideInRight 0.3s ease;
    }
    
    .checkin-item {
        animation: fadeInUp 0.3s ease;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
// ========= LOGOUT =========
function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('professorLogado');
    window.location.href = '../login.html';
}

