import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarInscricao } from '../services/api';
import { formatarCPF, formatarTelefone } from '../utils/formatters';
import './FormularioInscricao.css';

const dadosIniciais = {
  nomeCompleto: '',
  cpf: '',
  email: '',
  telefone: '',
  servico: '',
  observacao: '',
};

export default function FormularioInscricao() {
  const [dados, setDados] = useState(dadosIniciais);
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    let valorFormatado = value;

    if (name === 'cpf') valorFormatado = formatarCPF(value);
    if (name === 'telefone') valorFormatado = formatarTelefone(value);

    setDados(prev => ({ ...prev, [name]: valorFormatado }));
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }));
  }

  function validar() {
    const novosErros = {};

    if (!dados.nomeCompleto.trim())
      novosErros.nomeCompleto = 'Nome completo é obrigatório';

    if (!dados.cpf.trim())
      novosErros.cpf = 'CPF é obrigatório';
    else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(dados.cpf))
      novosErros.cpf = 'CPF inválido (use 000.000.000-00)';

    if (!dados.email.trim())
      novosErros.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email))
      novosErros.email = 'E-mail inválido';

    if (!dados.telefone.trim())
      novosErros.telefone = 'Telefone é obrigatório';

    if (!dados.servico.trim())
      novosErros.servico = 'Serviço é obrigatório';

    return novosErros;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErroApi('');

    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setEnviando(true);
    try {
      const resposta = await criarInscricao(dados);
      navigate('/inscricoes/confirmacao', {
        state: {
          protocolo: resposta.data.protocolo,
          nomeCompleto: resposta.data.nomeCompleto,
          status: resposta.data.status,
        },
      });
    } catch (err) {
      if (err.response?.status === 400) {
        setErroApi(err.response.data?.message || 'Dados inválidos. Verifique o formulário.');
      } else {
        setErroApi('Erro ao conectar com o servidor. Tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="formulario-container">
      <h1>Nova Inscrição</h1>

      {erroApi && <div className="erro-api">{erroApi}</div>}

      <form onSubmit={handleSubmit} className="formulario">
        <div className="campo">
          <label htmlFor="nomeCompleto">Nome completo *</label>
          <input
            id="nomeCompleto"
            name="nomeCompleto"
            type="text"
            value={dados.nomeCompleto}
            onChange={handleChange}
          />
          {erros.nomeCompleto && <span className="erro-campo">{erros.nomeCompleto}</span>}
        </div>

        <div className="campo">
          <label htmlFor="cpf">CPF *</label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            value={dados.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            maxLength={14}
          />
          {erros.cpf && <span className="erro-campo">{erros.cpf}</span>}
        </div>

        <div className="campo">
          <label htmlFor="email">E-mail *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={dados.email}
            onChange={handleChange}
          />
          {erros.email && <span className="erro-campo">{erros.email}</span>}
        </div>

        <div className="campo">
          <label htmlFor="telefone">Telefone *</label>
          <input
            id="telefone"
            name="telefone"
            type="text"
            value={dados.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
            maxLength={15}
          />
          {erros.telefone && <span className="erro-campo">{erros.telefone}</span>}
        </div>

        <div className="campo">
          <label htmlFor="servico">Serviço/curso/evento desejado *</label>
          <input
            id="servico"
            name="servico"
            type="text"
            value={dados.servico}
            onChange={handleChange}
          />
          {erros.servico && <span className="erro-campo">{erros.servico}</span>}
        </div>

        <div className="campo">
          <label htmlFor="observacao">Observação</label>
          <textarea
            id="observacao"
            name="observacao"
            value={dados.observacao}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <button type="submit" className="btn-primario" disabled={enviando}>
          {enviando ? 'Aguarde...' : 'Enviar inscrição'}
        </button>
      </form>
    </div>
  );
}
