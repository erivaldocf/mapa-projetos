import React from "react";
// NavLink detecta automaticamente se a rota está ativa.
// Outlet é o ponto onde a página filha será renderizada.
import { NavLink, Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Barra de Navegação Superior */}
      <header className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center z-[1100] shadow-md border-b border-slate-800">
        {/* Clique no título direciona para a HomePage */}
        <Link
          to="/"
          className="text-lg font-bold tracking-wide hover:opacity-90 transition-opacity"
        >
          📍 Sistema de Mapeamento de Projetos
        </Link>

        {/* Botões de Navegação utilizando NavLink */}
        <div className="flex gap-2">
          <NavLink
            to="/mapa"
            className={({ isActive }) =>
              `px-4 py-1.5 text-xs rounded-lg font-semibold transition-colors ${
                isActive
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`
            }
          >
            🗺️ Ver Mapa
          </NavLink>

          <NavLink
            to="/formulario"
            className={({ isActive }) =>
              `px-4 py-1.5 text-xs rounded-lg font-semibold transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`
            }
          >
            📝 Cadastrar Projeto
          </NavLink>
        </div>
      </header>

      {/* Local onde as páginas /mapa ou /formulario serão exibidas */}
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
