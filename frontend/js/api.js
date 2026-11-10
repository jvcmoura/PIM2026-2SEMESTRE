const API_URL = "http://localhost:5263/api";

export async function getAlunos() {
    const res = await fetch(`${API_URL}/aluno`);
    return res.json();
}