import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarInscricaoPorId, atualizarInscricao, cancelarInscricao } from '../services/api';
import { formatarCPF, formatarTelefone, formatarData } from '../utils/formatters';
import Loading from '../components/Loading';
import './DetalheInscricao.css';

export default function DetalheInscricao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inscricao, setInscricao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [erroForm, setErroForm] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarInscricaoPorId(id)
      .then(res => {
        setInscricao(res.data);
        setForm(res.data);
      })
      .catch(err => {
        if (err.response?.status === 404) setErro('Inscrição não encontrada.');
        else setErro('Erro ao conectar com o servidor. Tente novamente.');
      })
      .finally(() => setCarregando(false));
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    let valorFormatado = value;
    if (name === 'cpf') valorFormatado = formatarCPF(value);
    if (name === 'telefone') valorFormatado = formatarTelefone(value);
    setForm(prev => ({ ...prev, [name]: valorFormatado }));
  }

  async function handleSalvar() {
    setSalvando(true);
    setErroForm('');
    try {
      const res = await atualizarInscricao(id, {
        nomeCompleto: form.nomeCompleto,
        cpf: form.cpf,
        email: form.email,
        telefone: form.telefone,
        servico: form.servico,
        observacao: form.observacao,
      });
      setInscricao(res.data);
      setEditando(false);
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 409) {
        setErroForm(err.response.data?.message || 'Dados inválidos.');
      } else {
        setErroForm('Erro ao conectar com o servidor. Tente novamente.');
      }
    } finally {
      setSalvando(false);
    }
  }

  async function handleCancelarInscricao() {
    if (!window.confirm('Tem certeza que deseja cancelar esta inscrição? Esta ação não pode ser desfeita.')) return;
    try {
      const res = await cancelarInscricao(id);
      setInscricao(res.data);
    } catch (err) {
      if (err.response?.status === 409) {
        alert(err.response.data?.message || 'A inscrição já está cancelada.');
      } else {
        alert('Erro ao conectar com o servidor. Tente novamente.');
      }
    }
  }

  if (carregando) return <Loading />;

  if (erro) {
    return (
      <div className="detalhe-container">
        <div className="erro-api">{erro}</div>
        <button className="btn-voltar" onClick={() => navigate('/inscricoes')}>
          ← Voltar para a lista
        </button>
      </div>
    );
  }

  const confirmada = inscricao.status === 'CONFIRMADA';

  return (
    <div className="detalhe-container">
      <div className="detalhe-header">
        <h1>Detalhe da Inscrição</h1>
        <button className="btn-voltar" onClick={() => navigate('/inscricoes')}>
          ← Voltar
        </button>
      </div>

      {erroForm && <div className="erro-api">{erroForm}</div>}

      <div className="detalhe-card">
        <div className="detalhe-status">
          <span className={`badge badge-${inscricao.status.toLowerCase()}`}>
            {inscricao.status}
          </span>
        </div>

        <div className="detalhe-protocolo">
          <span>Protocolo:</span>
          <strong>{inscricao.protocolo}</strong>
        </div>

        {editando ? (
          <div className="detalhe-form">
            <div className="campo">
              <label>Nome completo</label>
              <input name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} />
            </div>
            <div className="campo">
              <label>CPF</label>
              <input name="cpf" value={form.cpf} onChange={handleChange} maxLength={14} />
            </div>
            <div className="campo">
              <label>E-mail</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="campo">
              <label>Telefone</label>
              <input name="telefone" value={form.telefone} onChange={handleChange} maxLength={15} />
            </div>
            <div className="campo">
              <label>Serviço</label>
              <input name="servico" value={form.servico} onChange={handleChange} />
            </div>
            <div className="campo">
              <label>Observação</label>
              <textarea
                name="observacao"
                value={form.observacao || ''}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="detalhe-acoes">
              <button className="btn-primario" onClick={handleSalvar} disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                className="btn-secundario"
                onClick={() => { setEditando(false); setErroForm(''); setForm(inscricao); }}
              >
                Cancelar edição
              </button>
            </div>
          </div>
        ) : (
          <div className="detalhe-ficha">
            <div className="ficha-linha"><span>Nome:</span><span>{inscricao.nomeCompleto}</span></div>
            <div className="ficha-linha"><span>CPF:</span><span>{inscricao.cpf}</span></div>
            <div className="ficha-linha"><span>E-mail:</span><span>{inscricao.email}</span></div>
            <div className="ficha-linha"><span>Telefone:</span><span>{inscricao.telefone}</span></div>
            <div className="ficha-linha"><span>Serviço:</span><span>{inscricao.servico}</span></div>
            {inscricao.observacao && (
              <div className="ficha-linha"><span>Observação:</span><span>{inscricao.observacao}</span></div>
            )}
            <div className="ficha-linha">
              <span>Criado em:</span><span>{formatarData(inscricao.dataCriacao)}</span>
            </div>
            <div className="ficha-linha">
              <span>Atualizado em:</span><span>{formatarData(inscricao.dataAtualizacao)}</span>
            </div>

            {confirmada && (
              <div className="detalhe-acoes">
                <button className="btn-primario" onClick={() => setEditando(true)}>
                  Editar
                </button>
                <button className="btn-cancelar" onClick={handleCancelarInscricao}>
                  Cancelar inscrição
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
