import React from "react";
import {
  ETAPAS_ENSINO,
  MODALIDADES_ENSINO,
  AREAS_CONHECIMENTO,
  COMPONENTES_CURRICULARES,
} from "../../constants/dadosMapa";

function PainelFiltros({
  painelFiltrosAberto,
  setPainelFiltrosAberto,
  projetosFiltradosCount,
  etapasSelecionadas,
  toggleEtapa,
  modalidadesSelecionadas,
  toggleModalidade,
  areasSelecionadas,
  toggleArea,
  componentesSelecionados,
  toggleComponente,
  metodologiaHibridaSelecionada,
  toggleMetodologiaHibrida,
  limparFiltros,
}) {
  const temFiltroAtivo =
    etapasSelecionadas.length > 0 ||
    modalidadesSelecionadas.length > 0 ||
    areasSelecionadas.length > 0 ||
    componentesSelecionados.length > 0 ||
    metodologiaHibridaSelecionada;

  return (
    <div
      className="bg-white/95 p-3 px-3.5 rounded-lg shadow-md w-[290px] font-sans"
      onMouseDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className={`flex justify-between items-center cursor-pointer ${
          painelFiltrosAberto ? "mb-2.5" : "mb-0"
        }`}
        onClick={() => setPainelFiltrosAberto(!painelFiltrosAberto)}
      >
        <strong className="text-xs text-slate-800">
          🎯 Filtros do Projeto ({projetosFiltradosCount} pins)
        </strong>
        <span className="text-xs text-slate-500">
          {painelFiltrosAberto ? "➖" : "➕"}
        </span>
      </div>

      {painelFiltrosAberto && (
        <div className="flex flex-col gap-3">
          {/* Etapa de Ensino */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 block mb-1">
              Etapa de Ensino:
            </span>
            <div className="flex flex-wrap gap-1">
              {ETAPAS_ENSINO.map((etapa) => {
                const ativa = etapasSelecionadas.includes(etapa);
                return (
                  <button
                    type="button"
                    key={etapa}
                    onClick={() => toggleEtapa(etapa)}
                    className={`px-2 py-0.5 text-[10px] rounded-full border transition-all cursor-pointer ${
                      ativa
                        ? "border-sky-600 bg-sky-600 text-white font-bold"
                        : "border-sky-600 bg-white text-sky-600 hover:bg-sky-50"
                    }`}
                  >
                    {etapa}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modalidade de Ensino */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 block mb-1">
              Modalidade de Ensino:
            </span>
            <div className="flex flex-wrap gap-1">
              {MODALIDADES_ENSINO.map((modalidade) => {
                const ativa = modalidadesSelecionadas.includes(modalidade);
                return (
                  <button
                    type="button"
                    key={modalidade}
                    onClick={() => toggleModalidade(modalidade)}
                    className={`px-2 py-0.5 text-[10px] rounded-full border transition-all cursor-pointer ${
                      ativa
                        ? "border-teal-600 bg-teal-600 text-white font-bold"
                        : "border-teal-600 bg-white text-teal-600 hover:bg-teal-50"
                    }`}
                  >
                    {modalidade}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Área de Conhecimento */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 block mb-1">
              Área de Conhecimento:
            </span>
            <div className="flex flex-wrap gap-1">
              {AREAS_CONHECIMENTO.map((area) => {
                const ativa = areasSelecionadas.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`px-2 py-0.5 text-[10px] rounded-full border transition-all cursor-pointer ${
                      ativa
                        ? "border-amber-700 bg-amber-700 text-white font-bold"
                        : "border-amber-700 bg-white text-amber-700 hover:bg-amber-50"
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Componente Curricular */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 block mb-1">
              Componente Curricular:
            </span>
            <div className="flex flex-wrap gap-1">
              {COMPONENTES_CURRICULARES.map((componente) => {
                const ativa = componentesSelecionados.includes(componente);
                return (
                  <button
                    type="button"
                    key={componente}
                    onClick={() => toggleComponente(componente)}
                    className={`px-2 py-0.5 text-[10px] rounded-full border transition-all cursor-pointer ${
                      ativa
                        ? "border-indigo-700 bg-indigo-700 text-white font-bold"
                        : "border-indigo-700 bg-white text-indigo-700 hover:bg-indigo-50"
                    }`}
                  >
                    {componente}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metodologia Híbrida */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 block mb-1">
              Metodologia:
            </span>

            <button
              type="button"
              onClick={toggleMetodologiaHibrida}
              className={`px-2 py-0.5 text-[10px] rounded-full border transition-all cursor-pointer ${
                metodologiaHibridaSelecionada
                  ? "border-purple-700 bg-purple-700 text-white font-bold"
                  : "border-purple-700 bg-white text-purple-700 hover:bg-purple-50"
              }`}
            >
              Metodologia Híbrida
            </button>
          </div>

          {temFiltroAtivo && (
            <button
              type="button"
              onClick={limparFiltros}
              className="py-0.5 text-[10px] text-red-500 hover:underline bg-transparent border-none text-right cursor-pointer"
            >
              Limpar filtros de categoria
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PainelFiltros;
