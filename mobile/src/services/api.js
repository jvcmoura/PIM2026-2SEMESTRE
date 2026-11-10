import { API_URL } from '../config';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Se o servidor não responder em 10 segundos, desiste
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (e) {
    const erro = new Error(
      'Não foi possível conectar ao servidor. Confira se a API está ligada e se o celular está no mesmo Wi-Fi.'
    );
    erro.semConexao = true;
    throw erro;
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let message = `Erro inesperado (${response.status}).`;
    try {
      const data = await response.json();
      if (data.message) message = data.message;
    } catch (e) {}
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

export function login(email, senha) {
  return request('/api/auth/login', { method: 'POST', body: { email, senha } });
}
export function getPerfil(token) {
  return request('/api/me', { token });
}
export function getMatriculas(token) {
  return request('/api/me/matriculas', { token });
}

export function getPagamentos(token) {
  return request('/api/me/pagamentos', { token });
}
export function cadastrarAluno(dados) {
  return request('/api/alunos', { method: 'POST', body: dados });
}