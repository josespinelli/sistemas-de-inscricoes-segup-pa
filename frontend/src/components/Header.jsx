import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <span className="header-title">SEGUP/PA — Sistema de Inscrições</span>
        <nav>
          <Link to="/inscricoes" className="header-link">Ver inscrições</Link>
        </nav>
      </div>
    </header>
  );
}
