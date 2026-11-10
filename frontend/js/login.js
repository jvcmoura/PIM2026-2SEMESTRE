
// ========== USUÁRIOS PRÉ-CADASTRADOS ==========
const usuariosPreCadastrados = [
   
    {
        id: 1,
        nome: "Administrador",
        email: "admin@ultrafit.com",
        senha: "admin123",
        tipo: "admin"
    },
    {
        id: 2,
        nome: "João Silva",
        email: "joao@email.com",
        senha: "123456",
        tipo: "aluno"
    },
    {
        id: 3,
        nome: "Maria Santos",
        email: "maria@email.com",
        senha: "123456",
        tipo: "aluno"
    },
    {
        id: 4,
        nome: "Carlos Oliveira",
        email: "carlos@email.com",
        senha: "123456",
        tipo: "aluno"
    },
    {
        id: 5,
        nome: "Professor Roberto",
        email: "professor@ultrafit.com",
        senha: "prof123",
        tipo: "professor"
    }
];

// ========== INICIALIZAR SISTEMA ==========
function initLoginSystem() {
    const usuariosExistentes = localStorage.getItem('usuarios');
    
    if (!usuariosExistentes) {
        localStorage.setItem('usuarios', JSON.stringify(usuariosPreCadastrados));
        console.log('✅ Usuários cadastrados com sucesso!');
    }
    
    // Limpar sessão anterior
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('alunoLogado');
    localStorage.removeItem('professorLogado');
}

// ========== FUNÇÃO DE LOGIN ==========
function fazerLogin(email, senha) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    const usuario = usuarios.find(user => 
        user.email === email && user.senha === senha
    );
    
    if (!usuario) {
        return {
            sucesso: false,
            mensagem: 'Email ou senha incorretos'
        };
    }
    
    const dadosUsuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        dataLogin: new Date().toISOString()
    };
    
    localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
    
    if (usuario.tipo === 'aluno') {
        localStorage.setItem('alunoLogado', JSON.stringify(dadosUsuario));
    }
    
    if (usuario.tipo === 'professor') {
        localStorage.setItem('professorLogado', JSON.stringify(dadosUsuario));
    }
    
    return {
        sucesso: true,
        tipo: usuario.tipo,
        usuario: dadosUsuario
    };
}

// ========== REDIRECIONAMENTO ==========
function redirecionarUsuario(tipo) {
    console.log('Redirecionando usuário tipo:', tipo);
    
    const caminhos = {
        'admin': 'Painel_Adm.html/paineladm.html',
        'aluno': 'Aluno/Alunos.html',
        'professor': 'Professores/professores.html'
    };
    
    const destino = caminhos[tipo];
    
    if (destino) {
        console.log('Redirecionando para:', destino);
        setTimeout(() => {
            window.location.href = destino;
        }, 500);
    } else {
        console.error('Tipo de usuário desconhecido:', tipo);
        mostrarErro('Erro ao redirecionar. Contate o suporte.');
    }
}

// ========== EXIBIR MENSAGEM DE ERRO ==========
function mostrarErro(mensagem) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = mensagem;
        errorDiv.classList.add('show');
        
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 3000);
    } else {
        alert(mensagem);
    }
}

// ========== VALIDAR FORMULÁRIO ==========
function validarFormulario(email, senha) {
    if (!email || !senha) {
        mostrarErro('Por favor, preencha todos os campos');
        return false;
    }
    
    if (!email.includes('@')) {
        mostrarErro('Por favor, insira um email válido');
        return false;
    }
    
    if (senha.length < 4) {
        mostrarErro('A senha deve ter no mínimo 4 caracteres');
        return false;
    }
    
    return true;
}

// ========== EVENTO DE SUBMIT ==========
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    
    if (!form) {
        console.error('Formulário não encontrado!');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        
        if (!validarFormulario(email, senha)) {
            return;
        }
        
        const btn = document.querySelector('.btn-login');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        btn.disabled = true;
        
        setTimeout(() => {
            const resultado = fazerLogin(email, senha);
            
            if (resultado.sucesso) {
                btn.innerHTML = '<i class="fas fa-check"></i> Sucesso!';
                mostrarMensagemSucesso(`Bem-vindo, ${resultado.usuario.nome}!`);
                redirecionarUsuario(resultado.tipo);
            } else {
                btn.innerHTML = originalText;
                btn.disabled = false;
                mostrarErro(resultado.mensagem);
                document.getElementById('senha').value = '';
                document.getElementById('senha').focus();
            }
        }, 1000);
    });
}

// ========== MENSAGEM DE SUCESSO ==========
function mostrarMensagemSucesso(mensagem) {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
            ✓ ${mensagem}
        </div>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 2000);
}

// ========== MOSTRAR/ESCONDER SENHA ==========
function togglePassword() {
    const senhaInput = document.getElementById('senha');
    if (senhaInput) {
        const icon = document.querySelector('.toggle-password i');
        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            senhaInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// ========== INICIALIZAR ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de login iniciado');
    initLoginSystem();
    setupLoginForm();
});

// ========== FUNÇÕES DE DEBUG ==========
function listarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    console.table(usuarios);
    alert(`Usuários cadastrados:\n${usuarios.map(u => `${u.nome} (${u.tipo}) - ${u.email}`).join('\n')}`);
}

function limparTudo() {
    if (confirm('⚠️ Remover todos os usuários?')) {
        localStorage.clear();
        alert('✅ Dados limpos! Recarregue a página.');
        location.reload();
    }
}

window.listarUsuarios = listarUsuarios;
window.limparTudo = limparTudo;
window.togglePassword = togglePassword;