# Ultra Fit Academia - PIM2

## Estrutura do Projeto

```
PIM/
├── academia-api/     → Backend .NET 8 + MongoDB
└── frontend/         → HTML/CSS/JS puro
```

## Como Rodar

### Pré-requisitos
- .NET 8 SDK
- MongoDB rodando localmente (porta 27017)
- Um servidor web para o frontend (ex: Live Server, http-server, nginx)

---

### Backend (API)

```bash
cd academia-api
dotnet run --launch-profile http
```

A API sobe em: **http://localhost:5263**
Swagger disponível em: **http://localhost:5263/swagger**

> **Usuário padrão (admin):** Crie via POST /api/auth/registrar ou use o frontend de cadastro.

---

### Frontend

Serve a pasta `frontend/` com qualquer servidor web com root em `/frontend/`:

**Opção 1 — VS Code Live Server:**
- Clique com o botão direito em `frontend/index.html` → "Open with Live Server"
- Certifique-se de que o Live Server serve a partir de `frontend/` (root do servidor)

**Opção 2 — npx http-server:**
```bash
cd frontend
npx http-server -p 3000 --cors
```
Acesse: http://localhost:3000

**Opção 3 — Python:**
```bash
cd frontend
python3 -m http.server 3000
```

---

## Credenciais de Acesso (localStorage - sem backend)

| Usuário       | Email                    | Senha    | Tipo       |
|---------------|--------------------------|----------|------------|
| Administrador | admin@ultrafit.com       | admin123 | admin      |
| João Silva    | joao@email.com           | 123456   | aluno      |
| Maria Santos  | maria@email.com          | 123456   | aluno      |
| Prof. teste   | prof.teste@ultrafit.com  | 123456   | professor  |

---

## Módulos

| Módulo           | Arquivo HTML                                      |
|------------------|---------------------------------------------------|
| Home             | `frontend/index.html`                             |
| Login            | `frontend/html/login.html`                        |
| Cadastro         | `frontend/html/cadastro.html`                     |
| Painel Admin     | `frontend/html/Painel_Adm.html/paineladm.html`    |
| Admin - Alunos   | `frontend/html/Painel_Adm.html/alunos.html`       |
| Admin - Pagtos   | `frontend/html/Painel_Adm.html/pagamentos.html`   |
| Admin - Planos   | `frontend/html/Painel_Adm.html/planos.html`       |
| Admin - Profs    | `frontend/html/Painel_Adm.html/professores.html`  |
| Admin - Relatórios | `frontend/html/Painel_Adm.html/relatorios.html` |
| Área do Aluno    | `frontend/html/Aluno/Alunos.html`                 |
| Área do Prof     | `frontend/html/Professores/professores.html`      |

---

## Correções Aplicadas

1. **alunos.js** — variável `alunos` indefinida corrigida para `data` em `buscarAlunos()`
2. **alunos.js** — navegação kebab-case (`meu-plano`) convertida corretamente para PascalCase (`MeuPlano`)
3. **alunos.js** — chamada solta de `buscarAlunos()` removida do escopo global
4. **alunos.js** — logout redireciona para o caminho correto do `login.html`
5. **Alunos.html** — scripts no `<head>` receberam `defer` para esperar o DOM
6. **api.js** — protocolo `https://` corrigido para `http://` (consistente com config.js)
7. **script.js** — protocolo `https://` corrigido para `http://`
8. **AlunoController.cs** — namespace `AcademiaApi.Controllers` adicionado
9. **Program.cs** — `AddSwaggerGen()` duplicado removido
10. **Program.cs** — `UseHttpsRedirection()` desabilitado para dev local (evita redirect loop)
11. **index.html** — caminho `JS/script.js` corrigido para `js/script.js` (case-sensitive)
12. **paineladm.html** — itens do nav eram `<div>` sem href; convertidos para `<a>` com links corretos
13. **login.js** — path de redirect do admin corrigido: `/Painel_Adm/` → `Painel_Adm.html/`
14. **pagamentos.html / planos.html** — href `dashboard.html` (inexistente) corrigido para `paineladm.html`
15. **professores.html / relatorios.html** — mesmo fix do item anterior
