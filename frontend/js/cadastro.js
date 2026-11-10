/**
 * Ultra Fit Academia - Sistema de Cadastro
 * Funcionalidades: Validação, localStorage, integração com planos
 */

// ========== BENEFÍCIOS DOS PLANOS ==========
const beneficiosPlanos = {
    basico: [
        "Musculação completa",
        "Acesso em horário comercial (06h-18h)",
        "Avaliação física inicial",
        "App de acompanhamento",
        "Suporte via WhatsApp"
    ],
    premium: [
        "Musculação completa",
        "Aulas de grupo (Yoga, Pilates, Zumba)",
        "Avaliação física mensal",
        "Área cardio liberada",
        "Estacionamento incluso",
        "Toalha e chaveiro"
    ],
    ultra: [
        "Musculação completa",
        "Todas as aulas liberadas",
        "Personal trainer incluso",
        "Acesso 24h por dia",
        "Área premium VIP",
        "Cadeira de massagem",
        "Estacionamento VIP",
        "Acompanhamento nutricional"
    ]
};

// ========== PREÇOS DOS PLANOS ==========
const precosPlanos = {
    basico: 79,
    premium: 109,
    ultra: 149
};

// ========== NOMES DOS PLANOS ==========
const nomesPlanos = {
    basico: "Básico",
    premium: "Premium",
    ultra: "Ultra"
};

// ========== VARIÁVEIS GLOBAIS ==========
let planoAtual = null;

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    initPlano();
    setupForm();
    setupCPFMask();
    setupPasswordToggles();
    loadSavedPlano();
});

// ========== 1. INICIALIZAR PLANO ==========
function initPlano() {
    const planoSaved = localStorage.getItem('planoEscolhido');
    
    if (planoSaved) {
        try {
            const plano = JSON.parse(planoSaved);
            planoAtual = plano.tipo;
            exibirPlanoSelecionado(plano.tipo);
            esconderOpcoesPlano();
            atualizarBeneficios(plano.tipo);
        } catch (e) {
            console.error('Erro ao ler plano:', e);
            mostrarOpcoesPlano();
        }
    } else {
        mostrarOpcoesPlano();
        setupPlanoButtons();
    }
}

// ========== 2. EXIBIR PLANO SELECIONADO ==========
function exibirPlanoSelecionado(plano) {
    const container = document.getElementById('planoSelecionado');
    
    container.innerHTML = `
        <div class="plano-nome">Plano ${nomesPlanos[plano]}</div>
        <div class="plano-preco">R$ ${precosPlanos[plano]} / mês</div>
        <div class="plano-badge">
            <i class="fas fa-check-circle"></i> Plano pré-selecionado
        </div>
    `;
    container.classList.add('show');
}

// ========== 3. MOSTRAR/ESCONDER OPÇÕES DE PLANO ==========
function mostrarOpcoesPlano() {
    const opcoes = document.getElementById('planosOpcoes');
    if (opcoes) opcoes.style.display = 'block';
}

function esconderOpcoesPlano() {
    const opcoes = document.getElementById('planosOpcoes');
    if (opcoes) opcoes.style.display = 'none';
}

// ========== 4. CONFIGURAR BOTÕES DE PLANO ==========
function setupPlanoButtons() {
    const buttons = document.querySelectorAll('.plano-option');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            planoAtual = this.getAttribute('data-plano');
            atualizarBeneficios(planoAtual);
            
            const container = document.getElementById('planoSelecionado');
            container.classList.remove('show');
        });
    });
}

// ========== 5. ATUALIZAR BENEFÍCIOS ==========
function atualizarBeneficios(plano) {
    const beneficios = beneficiosPlanos[plano];
    const lista = document.getElementById('beneficiosList');
    
    if (beneficios) {
        lista.innerHTML = beneficios.map(beneficio => 
            `<li><i class="fas fa-check-circle"></i> ${beneficio}</li>`
        ).join('');
    }
}

// ========== 6. MÁSCARA DE CPF ==========
function setupCPFMask() {
    const cpfInput = document.getElementById('cpf');
    
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
        } else if (value.length > 0) {
            value = value.replace(/(\d{3})/, '$1');
        }
        
        e.target.value = value;
    });
}

// ========== 7. CONFIGURAR TOGGLE DE SENHA ==========
function setupPasswordToggles() {
    const toggles = document.querySelectorAll('.toggle-password');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// ========== 8. VALIDAR CPF ==========
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

// ========== 9. VALIDAR IDADE ==========
function validarIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    return idade >= 12;
}

// ========== 10. VALIDAR FORMULÁRIO ==========
function validarFormulario() {
    const nome = document.getElementById('nome').value.trim();
    const sobrenome = document.getElementById('sobrenome').value.trim();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    
    if (!nome || !sobrenome || !dataNascimento || !cpf || !email || !senha || !confirmarSenha) {
        mostrarErro('Por favor, preencha todos os campos');
        return false;
    }
    
    if (nome.length < 2) {
        mostrarErro('Nome deve ter pelo menos 2 caracteres');
        return false;
    }
    
    if (!validarCPF(cpf)) {
        mostrarErro('CPF inválido');
        return false;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        mostrarErro('Email inválido');
        return false;
    }
    
    if (senha.length < 4) {
        mostrarErro('A senha deve ter no mínimo 4 caracteres');
        return false;
    }
    
    if (senha !== confirmarSenha) {
        mostrarErro('As senhas não coincidem');
        return false;
    }
    
    if (!planoAtual) {
        mostrarErro('Por favor, selecione um plano');
        return false;
    }
    
    if (!validarIdade(dataNascimento)) {
        mostrarErro('Idade mínima para cadastro é 12 anos');
        return false;
    }
    
    return true;
}

// ========== 11. VERIFICAR EMAIL DUPLICADO ==========
function emailDuplicado(email) {
    const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const todosUsuarios = [...alunos, ...usuarios];
    return todosUsuarios.some(user => user.email === email);
}

// ========== 12. SALVAR ALUNO ==========
function salvarAluno() {
    const nome = document.getElementById('nome').value.trim();
    const sobrenome = document.getElementById('sobrenome').value.trim();
    const nomeCompleto = `${nome} ${sobrenome}`;
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const cpf = document.getElementById('cpf').value;
    
    if (emailDuplicado(email)) {
        mostrarErro('Este email já está cadastrado. Use outro email ou faça login.');
        return false;
    }
    
    const aluno = {
        id: Date.now(),
        nome: nomeCompleto,
        nomeCompleto: nomeCompleto,
        email: email,
        senha: senha,
        cpf: cpf,
        dataNascimento: dataNascimento,
        plano: planoAtual,
        planoNome: nomesPlanos[planoAtual],
        planoPreco: precosPlanos[planoAtual],
        dataMatricula: new Date().toISOString(),
        tipo: 'aluno',
        status: 'ativo'
    };
    
    const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    alunos.push(aluno);
    localStorage.setItem('alunos', JSON.stringify(alunos));
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioExistente = usuarios.find(u => u.email === email);
    
    if (!usuarioExistente) {
        usuarios.push({
            id: aluno.id,
            nome: nomeCompleto,
            email: email,
            senha: senha,
            tipo: 'aluno',
            plano: planoAtual
        });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    
    localStorage.removeItem('planoEscolhido');
    
    return true;
}

// ========== 13. CONFIGURAR FORMULÁRIO ==========
function setupForm() {
    const form = document.getElementById('cadastroForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }
        
        const btn = document.querySelector('.btn-cadastrar');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
        btn.disabled = true;
        
        setTimeout(() => {
            const sucesso = salvarAluno();
            
            if (sucesso) {
                mostrarSucesso('Cadastro realizado com sucesso! Redirecionando...');
                
                setTimeout(() => {
                    // CORREÇÃO: Redireciona para login.html na mesma pasta
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }, 800);
    });
}

// ========== 14. MOSTRAR MENSAGEM DE ERRO ==========
function mostrarErro(mensagem) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    successDiv.classList.remove('show');
    errorDiv.textContent = mensagem;
    errorDiv.classList.add('show');
    
    const form = document.querySelector('.cadastro-form');
    form.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        form.style.animation = '';
    }, 500);
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 4000);
}

// ========== 15. MOSTRAR MENSAGEM DE SUCESSO ==========
function mostrarSucesso(mensagem) {
    const successDiv = document.getElementById('successMessage');
    const errorDiv = document.getElementById('errorMessage');
    
    errorDiv.classList.remove('show');
    successDiv.textContent = mensagem;
    successDiv.classList.add('show');
}

// ========== 16. CARREGAR PLANO SALVO ==========
function loadSavedPlano() {
    const planoSaved = localStorage.getItem('planoEscolhido');
    if (planoSaved) {
        try {
            const plano = JSON.parse(planoSaved);
            const buttons = document.querySelectorAll('.plano-option');
            buttons.forEach(btn => {
                if (btn.getAttribute('data-plano') === plano.tipo) {
                    btn.classList.add('active');
                }
            });
        } catch (e) {}
    }
}