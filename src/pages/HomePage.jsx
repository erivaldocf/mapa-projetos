import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Imagem do lado esquerdo */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop"
          alt="Mapeamento"
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white hidden md:block" />
      </div>

      {/* Conteúdo e Botões do lado direito */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-16 lg:p-20 bg-white z-10">
        <div className="my-auto space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight">
              Sistema de Mapeamento de Projetos
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-md mt-5">
              Uma plataforma dedicada ao mapeamento e acompanhamento dos
              projetos de iniciação científica desenvolvidos nas escolas da rede
              estadual de ensino do Rio Grande do Norte.
            </p>
          </div>

          <div className="space-y-3 max-w-md">
            {/* Redireciona para /formulario */}
            <button
              onClick={() => navigate("/formulario")}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <FileText className="w-5 h-5" />
              <span className="uppercase tracking-wider text-sm">
                Cadastrar Projeto
              </span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Redireciona para /mapa */}
              <button
                onClick={() => navigate("/mapa")}
                className="w-full flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl transition text-xs tracking-wider uppercase cursor-pointer"
              >
                <span>Visualizar Mapa</span>
              </button>

              {/* Redireciona para /login */}
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl transition text-xs tracking-wider uppercase cursor-pointer"
              >
                <span>Login administrativo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
