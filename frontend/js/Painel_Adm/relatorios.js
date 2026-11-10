// DADOS SIMULADOS DO SISTEMA
const dadosSistema = {
    alunos: {
        total: 386,
        crescimento: [312, 328, 347, 359, 372, 386], // Últimos 6 meses
        porPlano: {
            Básico: 145,
            Premium: 156,
            Ultra: 85
        }
    },
    planos: {
        Básico: { preco: 89.90, alunos: 145 },
        Premium: { preco: 149.90, alunos: 156 },
        Ultra: { preco: 199.90, alunos: 85 }
    },
    pagamentos: {
        recebidos: 46280,
        pendentes: 11340,
        inadimplentes: 32
    }
};

// VARIÁVEIS GLOBAIS DOS GRÁFICOS
let barChart, lineChart, pieChart;

// INICIALIZAR DADOS
function inicializarDados() {
    if (!localStorage.getItem('relatorios')) {
        localStorage.setItem('relatorios', JSON.stringify(dadosSistema));
    }
    return JSON.parse(localStorage.getItem('relatorios'));
}

// ATUALIZAR CARDS
function atualizarCards(dados) {
    // Total de alunos
    document.getElementById('totalAlunos').textContent = dados.alunos.total;
    
    // Faturamento mensal
    const faturamento = dados.pagamentos.recebidos;
    document.getElementById('faturamento').textContent = `R$ ${faturamento.toLocaleString('pt-BR')}`;
    
    // Plano mais vendido
    const planos = dados.alunos.porPlano;
    let maisVendido = 'Básico';
    let maxAlunos = 0;
    for (const [plano, qtd] of Object.entries(planos)) {
        if (qtd > maxAlunos) {
            maxAlunos = qtd;
            maisVendido = plano;
        }
    }
    document.getElementById('planoMaisVendido').textContent = maisVendido;
    
    // Taxa de inadimplência
    const taxa = ((dados.pagamentos.inadimplentes / dados.alunos.total) * 100).toFixed(1);
    document.getElementById('taxaInadimplencia').textContent = `${taxa}%`;
    
    // Informações adicionais
    const receitaTotal = dados.pagamentos.recebidos;
    const receitaPendente = dados.pagamentos.pendentes;
    const ticketMedio = (receitaTotal / dados.alunos.total).toFixed(2);
    
    document.getElementById('receitaTotal').textContent = `R$ ${receitaTotal.toLocaleString('pt-BR')}`;
    document.getElementById('receitaPendente').textContent = `R$ ${receitaPendente.toLocaleString('pt-BR')}`;
    document.getElementById('ticketMedio').textContent = `R$ ${parseFloat(ticketMedio).toLocaleString('pt-BR')}`;
    
    // Mês referência
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
    const mesAtual = meses[new Date().getMonth()];
    document.getElementById('mesReferencia').textContent = `${mesAtual} ${new Date().getFullYear()}`;
}

// ATUALIZAR RANKING DE PLANOS
function atualizarRanking(dados) {
    const planos = [
        { nome: 'Premium', alunos: dados.alunos.porPlano.Premium, receita: dados.alunos.porPlano.Premium * 149.90 },
        { nome: 'Básico', alunos: dados.alunos.porPlano.Básico, receita: dados.alunos.porPlano.Básico * 89.90 },
        { nome: 'Ultra', alunos: dados.alunos.porPlano.Ultra, receita: dados.alunos.porPlano.Ultra * 199.90 }
    ].sort((a, b) => b.receita - a.receita);
    
    const rankingHTML = planos.map((plano, index) => `
        <div class="ranking-item">
            <div class="ranking-position ${index === 0 ? 'top' : ''}">
                ${index === 0 ? '<i class="fas fa-crown"></i>' : index + 1}
            </div>
            <div class="ranking-info">
                <div class="ranking-name">${plano.nome}</div>
                <div class="ranking-count">${plano.alunos} alunos</div>
            </div>
            <div class="ranking-value">R$ ${plano.receita.toLocaleString('pt-BR')}</div>
        </div>
    `).join('');
    
    document.getElementById('rankingPlanos').innerHTML = rankingHTML;
}

// CRIAR GRÁFICO DE BARRAS
function criarBarChart(dados) {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    if (barChart) barChart.destroy();
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Alunos', 'Planos Ativos', 'Pagamentos (R$)'],
            datasets: [
                {
                    label: 'Quantidade',
                    data: [
                        dados.alunos.total,
                        Object.values(dados.alunos.porPlano).reduce((a, b) => a + b, 0),
                        dados.pagamentos.recebidos / 100
                    ],
                    backgroundColor: 'rgba(255, 77, 0, 0.7)',
                    borderRadius: 10,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { labels: { color: '#aaa', font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.raw;
                            if (context.dataIndex === 2) {
                                return `${label}: R$ ${(value * 100).toLocaleString('pt-BR')}`;
                            }
                            return `${label}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#2a2a2a' },
                    ticks: { color: '#aaa' }
                },
                x: {
                    ticks: { color: '#aaa' }
                }
            }
        }
    });
}

// CRIAR GRÁFICO DE LINHA
function criarLineChart(dados) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    const meses = ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev'];
    
    if (lineChart) lineChart.destroy();
    
    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Total de Alunos',
                data: dados.alunos.crescimento,
                borderColor: '#ff4d00',
                backgroundColor: 'rgba(255, 77, 0, 0.05)',
                borderWidth: 3,
                pointBackgroundColor: '#ff4d00',
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
                legend: { labels: { color: '#aaa' } },
                tooltip: { callbacks: { label: (ctx) => `${ctx.raw} alunos` } }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 300,
                    grid: { color: '#2a2a2a' },
                    ticks: { color: '#aaa' }
                },
                x: {
                    ticks: { color: '#aaa' }
                }
            }
        }
    });
}

// CRIAR GRÁFICO DE PIZZA
function criarPieChart(dados) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    if (pieChart) pieChart.destroy();
    
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Básico', 'Premium', 'Ultra'],
            datasets: [{
                data: [
                    dados.alunos.porPlano.Básico,
                    dados.alunos.porPlano.Premium,
                    dados.alunos.porPlano.Ultra
                ],
                backgroundColor: ['#3498db', '#ff4d00', '#2ecc71'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#aaa', font: { size: 11 } }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const label = ctx.label || '';
                            const value = ctx.raw || 0;
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const percent = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} alunos (${percent}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ATUALIZAR TODOS OS DADOS
function atualizarTodosDados() {
    const dados = inicializarDados();
    atualizarCards(dados);
    atualizarRanking(dados);
    criarBarChart(dados);
    criarLineChart(dados);
    criarPieChart(dados);
    
    // Mostrar notificação
    mostrarNotificacao('Dados atualizados com sucesso!', 'success');
}

// NOTIFICAÇÃO
function mostrarNotificacao(mensagem, tipo = 'success') {
    const cores = { success: '#2ecc71', error: '#e74c3c', info: '#3498db' };
    const icones = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    
    const notif = document.createElement('div');
    notif.innerHTML = `
        <div style="position:fixed; bottom:20px; right:20px; background:${cores[tipo]}; 
                    color:white; padding:12px 20px; border-radius:10px; font-size:0.85rem;
                    z-index:9999; animation:slideInRight 0.3s ease; display:flex; align-items:center; gap:8px;">
            <i class="fas ${icones[tipo]}"></i> ${mensagem}
        </div>
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2500);
}

// SIMULAR ATUALIZAÇÃO DE DADOS (para demonstração)
function simularAtualizacao() {
    const dados = inicializarDados();
    
    // Pequena variação nos dados para simular atualização
    dados.alunos.total = 386 + Math.floor(Math.random() * 10);
    dados.pagamentos.recebidos = 46280 + Math.floor(Math.random() * 2000);
    dados.pagamentos.pendentes = 11340 + Math.floor(Math.random() * 1000);
    dados.pagamentos.inadimplentes = 32 + Math.floor(Math.random() * 5);
    
    // Atualizar último mês do crescimento
    const ultimoMes = dados.alunos.crescimento[dados.alunos.crescimento.length - 1];
    dados.alunos.crescimento[dados.alunos.crescimento.length - 1] = dados.alunos.total;
    
    localStorage.setItem('relatorios', JSON.stringify(dados));
    atualizarTodosDados();
}

// EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    inicializarDados();
    atualizarTodosDados();
    
    document.getElementById('btnAtualizar').addEventListener('click', () => {
        simularAtualizacao();
    });
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

// ========= FUNÇÃO PARA GERAR EXCEL =========
function gerarExcel() {
    // Pega os dados da tabela existente
    const tabela = document.getElementById('tabelaPagamentos');
    if (!tabela) {
        console.error('Tabela não encontrada');
        return;
    }
    
    // Extrai dados da tabela HTML
    const dados = [];
    const cabecalhos = [];
    
    // Pega cabeçalhos
    const ths = tabela.querySelectorAll('thead th');
    ths.forEach(th => {
        cabecalhos.push(th.innerText);
    });
    dados.push(cabecalhos);
    
    // Pega dados das linhas
    const linhas = tabela.querySelectorAll('tbody tr');
    linhas.forEach(linha => {
        const linhaDados = [];
        const tds = linha.querySelectorAll('td');
        tds.forEach(td => {
            // Remove spans e pega texto puro
            const texto = td.innerText.trim();
            linhaDados.push(texto);
        });
        if (linhaDados.length > 0) {
            dados.push(linhaDados);
        }
    });
    
    // Adiciona resumo financeiro se existir
    const sumario = document.getElementById('sumario');
    if (sumario) {
        dados.push(['', '', '', '', '', '']);
        dados.push(['RESUMO DO RELATÓRIO', '', '', '', '', '']);
        
        const cards = sumario.querySelectorAll('.summary-card');
        cards.forEach(card => {
            const label = card.querySelector('h4')?.innerText || '';
            const valor = card.querySelector('.value')?.innerText || '';
            dados.push([label, '', '', '', '', valor]);
        });
        
        dados.push(['', '', '', '', '', '']);
        dados.push([`Gerado em: ${new Date().toLocaleString('pt-BR')}`, '', '', '', '', '']);
    }
    
    // Criar planilha
    const ws = XLSX.utils.aoa_to_sheet(dados);
    
    // Ajustar largura das colunas
    ws['!cols'] = [
        {wch:10}, {wch:20}, {wch:15}, {wch:15}, {wch:15}, {wch:12}
    ];
    
    // Criar workbook e salvar
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatorio');
    
    // Baixar arquivo
    XLSX.writeFile(wb, `relatorio_${new Date().toISOString().slice(0,10)}.xlsx`);
    
    // Mostrar notificação (opcional)
    if (typeof mostrarNotificacao === 'function') {
        mostrarNotificacao('Relatório Excel gerado com sucesso!', 'success');
    } else {
        alert('Relatório Excel gerado com sucesso!');
    }
}
