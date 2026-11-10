// ========= CARREGAR USUÁRIO LOGADO DO LOCALSTORAGE =========
const _usuarioSessao = JSON.parse(localStorage.getItem('alunoLogado')) || null;

if (!_usuarioSessao) {
    window.location.href = '../login.html';
}

const _todosAlunos = JSON.parse(localStorage.getItem('alunos')) || [];
const _dadosCompletos = _todosAlunos.find(a => a.email === (_usuarioSessao && _usuarioSessao.email)) || {};

const alunoLogado = {
    id: _usuarioSessao ? _usuarioSessao.id : 1,
    nome: _usuarioSessao ? _usuarioSessao.nome : 'Aluno',
    email: _usuarioSessao ? _usuarioSessao.email : '',
    cpf: _dadosCompletos.cpf || '000.000.000-00',
    plano: (_usuarioSessao && _usuarioSessao.plano)
        ? _usuarioSessao.plano.charAt(0).toUpperCase() + _usuarioSessao.plano.slice(1).toLowerCase()
        : (_dadosCompletos.plano
            ? _dadosCompletos.plano.charAt(0).toUpperCase() + _dadosCompletos.plano.slice(1).toLowerCase()
            : 'Básico'),
    planoValor: _dadosCompletos.planoPreco || 89.90,
    dataCadastro: _dadosCompletos.dataMatricula || new Date().toISOString().split('T')[0],
    statusPagamento: 'Ativo',
    proximoVencimento: (() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().split('T')[0];
    })(),
    peso: _dadosCompletos.peso || 70,
    altura: _dadosCompletos.altura || 1.70,
    ultimaAvaliacao: _dadosCompletos.ultimaAvaliacao || new Date().toISOString().split('T')[0]
};

// ========= DADOS DOS PLANOS =========
const planos = {
    Básico: {
        valor: 89.90,
        beneficios: ['Acesso 24h', 'Aulas em grupo', 'Avaliação Física']
    },
    Premium: {
        valor: 149.90,
        beneficios: ['Acesso 24h', 'Aulas em grupo', 'Personal Trainer', 'Avaliação Física', 'Estacionamento']
    },
    Ultra: {
        valor: 199.90,
        beneficios: ['Acesso 24h', 'Aulas em grupo', 'Personal Trainer', 'Avaliação Física', 'Estacionamento', 'App exclusivo', 'Área VIP']
    },
    Basico: {
        valor: 89.90,
        beneficios: ['Acesso 24h', 'Aulas em grupo', 'Avaliação Física']
    },
    basico: {
        valor: 89.90,
        beneficios: ['Acesso 24h', 'Aulas em grupo', 'Avaliação Física']
    },
    premium: {
        valor: 149.90,
        beneficios: ['Acesso 24h', 'Aulas em grupo', 'Personal Trainer', 'Avaliação Física', 'Estacionamento']
    },
    ultra: {
        valor: 199.90,
        beneficios: ['Acesso 24h', 'Aulas em grupo', 'Personal Trainer', 'Avaliação Física', 'Estacionamento', 'App exclusivo', 'Área VIP']
    }
};

// ========= HISTÓRICO SIMULADO =========
const historicoSimulado = [
    { titulo: 'Check-in realizado', data: 'Hoje, 07:30', icone: 'fa-check-circle' },
    { titulo: 'Avaliação física', data: 'Ontem, 09:00', icone: 'fa-heartbeat' },
    { titulo: 'Pagamento confirmado', data: '3 dias atrás', icone: 'fa-credit-card' },
    { titulo: 'Plano renovado', data: '1 semana atrás', icone: 'fa-sync' }
];


// ========= UTILITÁRIOS =========
function formatarData(dataStr) {
    if (!dataStr) return '-';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
}

function getCheckinsAluno() {
    const key = `checkins_${alunoLogado.id}`;
    return JSON.parse(localStorage.getItem(key)) || [];
}

function salvarCheckins(checkins) {
    const key = `checkins_${alunoLogado.id}`;
    localStorage.setItem(key, JSON.stringify(checkins));
}

function getCheckins() {
    return getCheckinsAluno();
}

// ========= ATUALIZAR DASHBOARD =========
function atualizarDashboard() {
    // Nome
    const welcomeEl = document.getElementById('welcomeNome');
    const sidebarEl = document.getElementById('sidebarNome');
    if (welcomeEl) welcomeEl.textContent = alunoLogado.nome.split(' ')[0];
    if (sidebarEl) sidebarEl.textContent = alunoLogado.nome.split(' ')[0];

    // Plano
    const planoEl = document.getElementById('planoAtual');
    if (planoEl) planoEl.textContent = alunoLogado.plano;

    // Vencimento
    const vencEl = document.getElementById('proximoVencimento');
    if (vencEl) vencEl.textContent = formatarData(alunoLogado.proximoVencimento);

    // Status
    const hoje = new Date();
    const vencDate = new Date(alunoLogado.proximoVencimento);
    const diasRestantes = Math.ceil((vencDate - hoje) / (1000 * 60 * 60 * 24));
    const statusEl = document.getElementById('statusPlano');
    if (statusEl) {
        if (diasRestantes < 0) {
            statusEl.textContent = 'Vencido';
            statusEl.className = 'status-badge status-vencido';
        } else if (diasRestantes <= 5) {
            statusEl.textContent = `Vence em ${diasRestantes}d`;
            statusEl.className = 'status-badge status-alerta';
        } else {
            statusEl.textContent = 'Ativo';
            statusEl.className = 'status-badge status-ativo';
        }
    }

    // Frequência do mês
    const checkins = getCheckinsAluno();
    const mesAtualNum = new Date().getMonth();
    const anoAtualNum = new Date().getFullYear();
    const checkinsMes = checkins.filter(c => {
        const d = new Date(c.data);
        return d.getMonth() === mesAtualNum && d.getFullYear() === anoAtualNum;
    });
    const freqEl = document.getElementById('frequencia');
    if (freqEl) freqEl.textContent = `${checkinsMes.length} dias`;

    // Treinos semana
    const semanaInicio = new Date();
    semanaInicio.setDate(semanaInicio.getDate() - semanaInicio.getDay());
    const treinosSemana = checkins.filter(c => new Date(c.data) >= semanaInicio).length;
    const treinosEl = document.getElementById('mensagemSemana');
    if (treinosEl) treinosEl.textContent = `Você treinou ${treinosSemana} ${treinosSemana === 1 ? 'vez' : 'vezes'} essa semana. Continue assim!`;
}

// RENDERIZAR HISTÓRICO
function renderizarHistorico() {
    const container = document.getElementById('historyList');
    container.innerHTML = historicoSimulado.map(item => `
        <div class="history-item">
            <div class="history-icon"><i class="fas ${item.icone}"></i></div>
            <div class="history-info">
                <div class="history-title">${item.titulo}</div>
                <div class="history-date">${item.data}</div>
            </div>
        </div>
    `).join('');
}

// RENDERIZAR PLANO
function renderizarPlano() {
    const plano = planos[alunoLogado.plano];
    document.getElementById('planoNome').textContent = alunoLogado.plano;
    document.getElementById('planoValor').innerHTML = `R$ ${plano.valor.toFixed(2)} <span>/mês</span>`;
    document.getElementById('vencimentoData').textContent = formatarData(alunoLogado.proximoVencimento);
    
    const beneficiosList = document.getElementById('beneficiosList');
    beneficiosList.innerHTML = plano.beneficios.map(b => `
        <li><i class="fas fa-check"></i> ${b}</li>
    `).join('');
}

// RENDERIZAR CALENDÁRIO DE PRESENÇA
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

function renderizarCalendario() {
    const checkins = getCheckinsAluno();
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    document.getElementById('mesAtual').textContent = `${meses[mesAtual]} ${anoAtual}`;
    
    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaInicioSemana = primeiroDia.getDay();
    
    const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    let html = diasSemana.map(d => `<div class="dia-semana">${d}</div>`).join('');
    
    let diasTotais = 0;
    let diasPresentes = 0;
    
    // Dias vazios
    for (let i = 0; i < diaInicioSemana; i++) {
        html += `<div class="dia-calendario outro-mes"></div>`;
    }
    
    // Dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dataStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const temCheckin = checkins.some(c => c.data === dataStr);
        
        let classe = 'dia-calendario';
        if (temCheckin) {
            classe += ' presente';
            diasPresentes++;
        } else if (new Date(dataStr) < new Date()) {
            classe += ' ausente';
        }
        
        diasTotais++;
        html += `<div class="${classe}">${dia}</div>`;
    }
    
    document.getElementById('calendarioPresenca').innerHTML = html;
    document.getElementById('totalPresencas').textContent = diasPresentes;
    document.getElementById('totalDiasMes').textContent = diasTotais;
    document.getElementById('diasPresentes').textContent = diasPresentes;
    document.getElementById('diasAusentes').textContent = diasTotais - diasPresentes;
}

// RENDERIZAR AVALIAÇÃO FÍSICA
function renderizarAvaliacao() {
    const imc = calcularIMC();
    const classificacao = getClassificacaoIMC();
    const recomendacao = getRecomendacaoIMC();
    
    document.getElementById('peso').textContent = alunoLogado.peso;
    document.getElementById('altura').textContent = alunoLogado.altura;
    document.getElementById('imc').textContent = imc;
    document.getElementById('imcClassificacao').textContent = classificacao;
    document.getElementById('recomendacao').textContent = recomendacao;
    document.getElementById('ultimaAvaliacao').textContent = `Última: ${formatarData(alunoLogado.ultimaAvaliacao)}`;
}

// REGISTRAR CHECK-IN
function registrarCheckin() {
    if (fezCheckinHoje()) {
        mostrarNotificacao('❌ Você já fez check-in hoje! Volte amanhã.', 'error');
        return;
    }
    
    const novoCheckin = {
        id: Date.now(),
        nome: alunoLogado.nome,
        email: alunoLogado.email,
        data: getDataAtual(),
        dataFormatada: getDataFormatada(),
        hora: getHoraAtual(),
        plano: alunoLogado.plano
    };
    
    const checkins = getCheckins();
    checkins.push(novoCheckin);
    salvarCheckins(checkins);
    
    mostrarNotificacao('✅ Check-in realizado com sucesso!', 'success');
    
    document.getElementById('btnCheckin').disabled = true;
    document.getElementById('checkinStatus').style.display = 'block';
    
    atualizarDashboard();
    renderizarCalendario();
}

// MOSTRAR NOTIFICAÇÃO
function mostrarNotificacao(mensagem, tipo = 'success') {
    const cores = { success: '#2ecc71', error: '#e74c3c', info: '#3498db' };
    const icones = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    
    const notif = document.createElement('div');
    notif.className = 'custom-notification';
    notif.innerHTML = `
        <div style="background:${cores[tipo]}; color:white; padding:14px 24px; border-radius:12px;
                    display:flex; align-items:center; gap:12px; box-shadow:0 5px 20px rgba(0,0,0,0.3);">
            <i class="fas ${icones[tipo]}" style="font-size:1.1rem;"></i>
            <span>${mensagem}</span>
        </div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// NAVEGAÇÃO
function navegarPara(pagina) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.getElementById(`pagina${pagina}`).classList.add('active');
    
    // Converter PascalCase de volta para kebab-case para bater com data-page
    // Ex: MeuPlano -> meu-plano, Presenca -> presenca
    const kebab = pagina.replace(/([A-Z])/g, (m, l, i) => (i > 0 ? '-' : '') + l.toLowerCase());
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[data-page="${kebab}"]`);
    if (navItem) navItem.classList.add('active');
    
    const titulos = {
        Dashboard: 'Dashboard',
        MeuPlano: 'Meu Plano',
        Presenca: 'Presença',
        Avaliacao: 'Avaliação Física'
    };
    
    document.getElementById('pageTitle').textContent = titulos[pagina];
    
    if (pagina === 'Presenca') renderizarCalendario();
    if (pagina === 'Avaliacao') renderizarAvaliacao();
    if (pagina === 'MeuPlano') renderizarPlano();
}

// INICIALIZAR
document.addEventListener('DOMContentLoaded', () => {
    atualizarDashboard();
    renderizarHistorico();
    renderizarPlano();
    renderizarCalendario();
    renderizarAvaliacao();
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pagina = item.getAttribute('data-page');
            // Convert kebab-case (meu-plano) to PascalCase (MeuPlano)
            const paginaPascal = pagina.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
            navegarPara(paginaPascal);
        });
    });
    
    document.getElementById('btnCheckin').addEventListener('click', registrarCheckin);
    
    document.getElementById('mesAnterior').addEventListener('click', () => {
        mesAtual--;
        if (mesAtual < 0) {
            mesAtual = 11;
            anoAtual--;
        }
        renderizarCalendario();
    });
    
    document.getElementById('mesProximo').addEventListener('click', () => {
        mesAtual++;
        if (mesAtual > 11) {
            mesAtual = 0;
            anoAtual++;
        }
        renderizarCalendario();
    });
    
    document.getElementById('btnLogout').addEventListener('click', () => {
        mostrarNotificacao('Saindo do sistema...', 'info');
        setTimeout(() => window.location.href = '../login.html', 1500);
    });
});

// ANIMAÇÃO
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .custom-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    }
`;
document.head.appendChild(style);

// ── CORREÇÃO: funções ausentes que quebravam o check-in ───────────

function getDataAtual() {
    const h = new Date();
    return `${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,'0')}-${String(h.getDate()).padStart(2,'0')}`;
}
function getHoraAtual() {
    return new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
}
function getDataFormatada() {
    return new Date().toLocaleDateString('pt-BR',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
}
function fezCheckinHoje() {
    return getCheckins().some(c => c.data === getDataAtual());
}
function calcularIMC() {
    return (alunoLogado.peso / (alunoLogado.altura * alunoLogado.altura)).toFixed(1);
}
function getClassificacaoIMC() {
    const imc = parseFloat(calcularIMC());
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25)   return 'Peso normal';
    if (imc < 30)   return 'Sobrepeso';
    if (imc < 35)   return 'Obesidade grau I';
    if (imc < 40)   return 'Obesidade grau II';
    return 'Obesidade grau III';
}
function getRecomendacaoIMC() {
    const imc = parseFloat(calcularIMC());
    if (imc < 18.5) return 'Considere aumentar a ingestão calórica e fazer musculação para ganho de massa.';
    if (imc < 25)   return 'Parabéns! Seu peso está na faixa ideal. Continue com a rotina de exercícios.';
    if (imc < 30)   return 'Recomenda-se aumentar treinos aeróbicos e rever a alimentação.';
    return 'Consulte um profissional de saúde para um plano personalizado de emagrecimento.';
}
