const pagamentosIniciais = [
    { id: 1, aluno: "Ana Carolina Silva",  plano: "Premium", valor: 149.90, vencimento: "2024-03-10", status: "Pago" },
    { id: 2, aluno: "Bruno Mendes Costa",  plano: "Ultra",   valor: 199.90, vencimento: "2024-03-15", status: "Pendente" },
    { id: 3, aluno: "Carla Fernandes Lima",plano: "Básico",  valor: 89.90,  vencimento: "2024-02-28", status: "Atrasado" },
    { id: 4, aluno: "Daniel Oliveira Souza",plano:"Premium", valor: 149.90, vencimento: "2024-03-05", status: "Pago" },
    { id: 5, aluno: "Elisa Santos Rocha",  plano: "Básico",  valor: 89.90,  vencimento: "2024-02-20", status: "Atrasado" },
    { id: 6, aluno: "Fernando Almeida",    plano: "Ultra",   valor: 199.90, vencimento: "2024-03-12", status: "Pendente" },
    { id: 7, aluno: "Gabriela Martins",    plano: "Premium", valor: 149.90, vencimento: "2024-03-08", status: "Pago" },
    { id: 8, aluno: "Henrique Souza",      plano: "Básico",  valor: 89.90,  vencimento: "2024-03-01", status: "Atrasado" }
];

function inicializarDados() {
    if (!localStorage.getItem('pagamentos'))
        localStorage.setItem('pagamentos', JSON.stringify(pagamentosIniciais));
}
function carregarPagamentos() { return JSON.parse(localStorage.getItem('pagamentos')) || []; }
function salvarPagamentos(p)  { localStorage.setItem('pagamentos', JSON.stringify(p)); }
function formatarData(d) { return new Date(d).toLocaleDateString('pt-BR'); }

function atualizarStatusAtrasados(pagamentos) {
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    return pagamentos.map(p => {
        if (p.status === "Pendente" && new Date(p.vencimento) < hoje) p.status = "Atrasado";
        return p;
    });
}

function atualizarResumo(pagamentos) {
    const soma = s => pagamentos.filter(p => p.status === s).reduce((a,p) => a+p.valor, 0);
    const pago = soma('Pago'), pend = soma('Pendente'), atras = soma('Atrasado');
    const total = pago + pend + atras;
    document.getElementById('totalPago').innerHTML     = `R$ ${pago.toFixed(2).replace('.',',')}`;
    document.getElementById('totalPendente').innerHTML = `R$ ${pend.toFixed(2).replace('.',',')}`;
    document.getElementById('totalAtrasado').innerHTML = `R$ ${atras.toFixed(2).replace('.',',')}`;
    document.getElementById('taxaAdimplencia').innerHTML = `${total > 0 ? ((pago/total)*100).toFixed(1) : 0}%`;
}

let filtroAtual = "todos", termoBusca = "";

function renderizarTabela() {
    let pags = atualizarStatusAtrasados(carregarPagamentos());
    salvarPagamentos(pags);
    let filtrados = pags;
    if (filtroAtual !== "todos") filtrados = filtrados.filter(p => p.status === filtroAtual);
    if (termoBusca) filtrados = filtrados.filter(p => p.aluno.toLowerCase().includes(termoBusca.toLowerCase()));

    const tbody = document.getElementById('tableBody');
    const empty = document.getElementById('emptyMessage');
    if (!filtrados.length) { tbody.innerHTML=''; empty.style.display='block'; atualizarResumo(pags); return; }
    empty.style.display = 'none';

    const cls = { Pago:'status-pago', Pendente:'status-pendente', Atrasado:'status-atrasado' };
    const ico = { Pago:'fa-check-circle', Pendente:'fa-clock', Atrasado:'fa-exclamation-circle' };
    tbody.innerHTML = filtrados.map(p => `
        <tr class="${p.status==='Atrasado'?'row-atrasado':''}">
            <td><strong>${p.aluno}</strong></td>
            <td>${p.plano}</td>
            <td>R$ ${p.valor.toFixed(2).replace('.',',')}</td>
            <td>${formatarData(p.vencimento)}</td>
            <td><span class="status-badge ${cls[p.status]}"><i class="fas ${ico[p.status]}"></i> ${p.status}</span></td>
            <td>
                ${p.status!=='Pago'?`<button class="btn-action btn-pagar" onclick="abrirConfirmacao(${p.id})"><i class="fas fa-dollar-sign"></i> Pagar</button>`:''}
                <button class="btn-action btn-detalhes" onclick="verDetalhes(${p.id})"><i class="fas fa-info-circle"></i> Detalhes</button>
            </td>
        </tr>`).join('');
    atualizarResumo(pags);
}

function marcarComoPago(id) {
    let pags = carregarPagamentos();
    const i = pags.findIndex(p => p.id === id);
    if (i !== -1) { pags[i].status = "Pago"; salvarPagamentos(pags); renderizarTabela(); fecharModalConfirmacao(); mostrarNotificacao('Pagamento confirmado!','success'); }
}

function verDetalhes(id) {
    const p = carregarPagamentos().find(p => p.id === id);
    if (!p) return;
    const sc = p.status==='Pago'?'status-pago':p.status==='Pendente'?'status-pendente':'status-atrasado';
    document.getElementById('detalhesContent').innerHTML = `
        <div class="detalhes-linha"><strong>Aluno:</strong><span>${p.aluno}</span></div>
        <div class="detalhes-linha"><strong>Plano:</strong><span>${p.plano}</span></div>
        <div class="detalhes-linha"><strong>Valor:</strong><span>R$ ${p.valor.toFixed(2).replace('.',',')}</span></div>
        <div class="detalhes-linha"><strong>Vencimento:</strong><span>${formatarData(p.vencimento)}</span></div>
        <div class="detalhes-linha"><strong>Status:</strong><span class="status-badge ${sc}">${p.status}</span></div>`;
    document.getElementById('modalDetalhes').style.display = 'flex';
}

let pagamentoIdParaConfirmar = null;
function abrirConfirmacao(id) {
    const p = carregarPagamentos().find(p => p.id === id);
    if (!p) return;
    pagamentoIdParaConfirmar = id;
    document.getElementById('confirmacaoInfo').innerHTML = `<i class="fas fa-user"></i> ${p.aluno}<br><i class="fas fa-dollar-sign"></i> R$ ${p.valor.toFixed(2).replace('.',',')}`;
    document.getElementById('modalConfirmacao').style.display = 'flex';
}
function fecharModalConfirmacao() { document.getElementById('modalConfirmacao').style.display='none'; pagamentoIdParaConfirmar=null; }
function fecharModalDetalhes()    { document.getElementById('modalDetalhes').style.display='none'; }

function mostrarNotificacao(msg, tipo='success') {
    const cores = { success:'#2ecc71', error:'#e74c3c', info:'#3498db' };
    const n = document.createElement('div');
    n.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:${cores[tipo]};color:white;
        padding:12px 24px;border-radius:12px;font-size:.9rem;font-weight:500;z-index:9999;
        animation:slideInRight .3s ease;">${msg}</div>`;
    document.body.appendChild(n);
    setTimeout(() => { n.style.opacity='0'; setTimeout(() => n.remove(),300); }, 2500);
}

function aplicarFiltro(f) {
    filtroAtual = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter===f));
    renderizarTabela();
}
function buscarPagamentos() { termoBusca = document.getElementById('searchInput').value; renderizarTabela(); }
function toggleFilters() { const b=document.getElementById('filtersBar'); b.style.display=b.style.display==='none'?'flex':'none'; }

// ── CORREÇÃO 1: download CSV real ──────────────────────────────────
function gerarRelatorio() {
    const pags = carregarPagamentos();
    const linhas = [
        ['Aluno','Plano','Valor (R$)','Vencimento','Status'],
        ...pags.map(p => [p.aluno, p.plano, p.valor.toFixed(2).replace('.',','), formatarData(p.vencimento), p.status])
    ];
    const soma = s => pags.filter(p=>p.status===s).reduce((a,p)=>a+p.valor,0);
    linhas.push([],[' RESUMO','','','','']);
    linhas.push(['Total Recebido','',`R$ ${soma('Pago').toFixed(2).replace('.',',')}`,'','']);
    linhas.push(['Valor Pendente','',`R$ ${soma('Pendente').toFixed(2).replace('.',',')}`,'','']);
    linhas.push(['Valor Atrasado','',`R$ ${soma('Atrasado').toFixed(2).replace('.',',')}`,'','']);
    linhas.push(['Gerado em','',new Date().toLocaleString('pt-BR'),'','']);

    const csv = '\uFEFF' + linhas.map(l => l.map(c=>`"${c}"`).join(';')).join('\r\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `relatorio_pagamentos_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    mostrarNotificacao('Relatório baixado com sucesso!','success');
}

// ── CORREÇÃO 2: logout ─────────────────────────────────────────────
function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('alunoLogado');
    localStorage.removeItem('professorLogado');
    window.location.href = '../../login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarDados(); renderizarTabela();
    document.getElementById('btnFiltrar').addEventListener('click', toggleFilters);
    document.getElementById('btnRelatorio').addEventListener('click', gerarRelatorio);
    document.getElementById('searchInput').addEventListener('input', buscarPagamentos);
    document.getElementById('confirmarPagamento').addEventListener('click', () => { if (pagamentoIdParaConfirmar) marcarComoPago(pagamentoIdParaConfirmar); });
    document.getElementById('cancelarConfirmacao').addEventListener('click', fecharModalConfirmacao);
    const btnSair = document.getElementById('btnSair');
    if (btnSair) btnSair.addEventListener('click', fazerLogout);
    document.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', () => {
        document.getElementById('modalDetalhes').style.display='none';
        document.getElementById('modalConfirmacao').style.display='none';
    }));
    window.addEventListener('click', e => {
        if (e.target===document.getElementById('modalDetalhes')) fecharModalDetalhes();
        if (e.target===document.getElementById('modalConfirmacao')) fecharModalConfirmacao();
    });
    document.querySelectorAll('.filter-btn').forEach(b => b.addEventListener('click', () => aplicarFiltro(b.dataset.filter)));
});

const style = document.createElement('style');
style.textContent = `@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`;
document.head.appendChild(style);
