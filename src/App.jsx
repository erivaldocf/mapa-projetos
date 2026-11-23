import React from "react";
import { Routes, Route } from "react-router-dom";

// Importação das Páginas
import HomePage from "./pages/HomePage";
import FormPage from "./pages/FormPage";
import MapPage from "./pages/MapPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

// Layout e Proteção de Rotas
import MainLayout from "./layouts/MainLayout";
import RotaPrivada from "./components/RotaPrivada";

function App() {
  return (
    <Routes>
      {/* Rotas Públicas sem cabeçalho */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rota Administrativa Protegida */}
      <Route
        path="/admin"
        element={
          <RotaPrivada>
            <AdminPage />
          </RotaPrivada>
        }
      />

      {/* Rotas do Sistema com cabeçalho (MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/formulario" element={<FormPage />} />
      </Route>
    </Routes>
  );
}

export default App;
