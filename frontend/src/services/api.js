import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

export function criarInscricao(dados) {
  return api.post('/api/inscricoes', dados);
}

export function listarInscricoes() {
  return api.get('/api/inscricoes');
}

export function buscarInscricaoPorId(id) {
  return api.get(`/api/inscricoes/${id}`);
}

export function atualizarInscricao(id, dados) {
  return api.put(`/api/inscricoes/${id}`, dados);
}

export function cancelarInscricao(id) {
  return api.patch(`/api/inscricoes/${id}/cancelar`);
}
