import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FormularioInscricao from './pages/FormularioInscricao';
import Confirmacao from './pages/Confirmacao';
import ListaInscricoes from './pages/ListaInscricoes';
import DetalheInscricao from './pages/DetalheInscricao';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/inscricoes/nova" replace />} />
            <Route path="/inscricoes/nova" element={<FormularioInscricao />} />
            <Route path="/inscricoes/confirmacao" element={<Confirmacao />} />
            <Route path="/inscricoes" element={<ListaInscricoes />} />
            <Route path="/inscricoes/:id" element={<DetalheInscricao />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
