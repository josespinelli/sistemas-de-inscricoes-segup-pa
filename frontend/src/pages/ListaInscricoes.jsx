import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarInscricoes } from '../services/api';
import { formatarData } from '../utils/formatters';
import Loading from '../components/Loading';
import './ListaInscricoes.css';

export default function ListaInscricoes() {
  const [inscricoes, setInscricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    listarInscricoes()
      .then(res => setInscricoes(res.data))
      .catch(() => setErro('Erro ao conectar com o servidor. Tente novamente.'))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <Loading />;

  return (
    <div className="lista-container">
      <div className="lista-header">
        <h1>Inscrições</h1>
        <button className="btn-primario" onClick={() => navigate('/inscricoes/nova')}>
          Nova inscrição
        </button>
      </div>

      {erro && <div className="erro-api">{erro}</div>}

      {!erro && inscricoes.length === 0 ? (
        <p className="lista-vazia">Nenhuma inscrição encontrada.</p>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Nome</th>
                <th>Serviço</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {inscricoes.map(inscricao => (
                <tr key={inscricao.id}>
                  <td>{inscricao.protocolo}</td>
                  <td>{inscricao.nomeCompleto}</td>
                  <td>{inscricao.servico}</td>
                  <td>
                    <span className={`badge badge-${inscricao.status.toLowerCase()}`}>
                      {inscricao.status}
                    </span>
                  </td>
                  <td>{formatarData(inscricao.dataCriacao)}</td>
                  <td>
                    <button
                      className="btn-ver"
                      onClick={() => navigate(`/inscricoes/${inscricao.id}`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
