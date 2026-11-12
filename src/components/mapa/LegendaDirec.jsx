import React, { useState } from "react";
import { LISTA_DIRECS } from "../../constants/dadosMapa";

function LegendaDirec({ onSelectDirec, direcSelecionada }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div
      className={`bg-white/95 p-3 px-4 rounded-lg shadow-lg font-sans max-h-[80vh] flex flex-col transition-all duration-300 ${
        aberto ? "w-60" : "w-auto"
      }`}
      onMouseDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Cabeçalho da Legenda */}
      <div
        className={`flex justify-between items-center cursor-pointer ${
          aberto ? "mb-2.5" : "mb-0"
        }`}
        onClick={() => setAberto(!aberto)}
      >
        <strong className="text-sm text-neutral-800">
          {aberto ? "Legenda - DIRECs" : "Legenda 📍"}
        </strong>
        <button className="bg-transparent border-none cursor-pointer text-xs text-neutral-500 p-1">
          {aberto ? "➖" : "➕"}
        </button>
      </div>

      {/* Lista das DIRECs */}
      {aberto && (
        <div className="overflow-y-auto flex flex-col gap-2 pr-1">
          {LISTA_DIRECS.map((item) => {
            const selecionada = direcSelecionada === item.cor;
            return (
              <div
                key={item.id}
                onClick={() => onSelectDirec && onSelectDirec(item)}
                className={`flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer p-1 rounded transition-colors ${
                  selecionada
                    ? "bg-black/5 border border-neutral-500"
                    : "border border-transparent hover:bg-neutral-100"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded border border-black/15 shrink-0"
                  style={{ backgroundColor: item.cor }}
                />
                <span>
                  <strong>{item.id}</strong> ({item.sede})
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LegendaDirec;
