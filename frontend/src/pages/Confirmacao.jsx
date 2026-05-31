import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Confirmacao.css';

export default function Confirmacao() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate('/inscricoes/nova', { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const { protocolo, nomeCompleto, status } = state;

  return (
    <div className="confirmacao-container">
      <div className="confirmacao-card">
        <div className="confirmacao-icone">✓</div>
        <h1>Inscrição realizada com sucesso!</h1>

        <div className="confirmacao-info">
          <div className="confirmacao-protocolo">
            <span>Protocolo</span>
            <strong>{protocolo}</strong>
          </div>
          <div className="confirmacao-linha">
            <span>Nome:</span>
            <span>{nomeCompleto}</span>
          </div>
          <div className="confirmacao-linha">
            <span>Status:</span>
            <span className="badge badge-confirmada">{status}</span>
          </div>
        </div>

        <div className="confirmacao-acoes">
          <button className="btn-primario" onClick={() => navigate('/inscricoes/nova')}>
            Nova inscrição
          </button>
          <button className="btn-secundario" onClick={() => navigate('/inscricoes')}>
            Ver todas as inscrições
          </button>
        </div>
      </div>
    </div>
  );
}
