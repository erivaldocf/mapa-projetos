import React, { useState } from "react";

// Mapeamento organizado das 16 DIRECs e suas respectivas cores
export const LISTA_DIRECS = [
  { id: "1ª DIREC", sede: "Natal", cor: "#41909A" },
  { id: "2ª DIREC", sede: "Parnamirim", cor: "#8D4170" },
  { id: "3ª DIREC", sede: "Nova Cruz", cor: "#B7DCCA" },
  { id: "4ª DIREC", sede: "São Paulo do Potengi", cor: "#98956C" },
  { id: "5ª DIREC", sede: "Ceará-Mirim", cor: "#FFF99C" },
  { id: "6ª DIREC", sede: "Macau", cor: "#7A7198" },
  { id: "7ª DIREC", sede: "Santa Cruz", cor: "#E87878" },
  { id: "8ª DIREC", sede: "Angicos", cor: "#97AEBE" },
  { id: "9ª DIREC", sede: "Currais Novos", cor: "#87C127" },
  { id: "10ª DIREC", sede: "Caicó", cor: "#007CC2" },
  { id: "11ª DIREC", sede: "Assú", cor: "#DA251D" },
  { id: "12ª DIREC", sede: "Mossoró", cor: "#FFF420" },
  { id: "13ª DIREC", sede: "Apodi", cor: "#E77917" },
  { id: "14ª DIREC", sede: "Umarizal", cor: "#DEDEDC" },
  { id: "15ª DIREC", sede: "Pau dos Ferros", cor: "#01923F" },
  { id: "16ª DIREC", sede: "João Câmara", cor: "#485778" },
];

function LegendaDirec({ onSelectDirec, direcSelecionada }) {
  const [aberto, setAberto] = useState(true);

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "12px 16px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
        fontFamily: "sans-serif",
        maxHeight: "80vh",
        width: aberto ? "250px" : "auto",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Cabeçalho retrátil */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: aberto ? "10px" : "0",
          cursor: "pointer",
        }}
        onClick={() => setAberto(!aberto)}
      >
        <strong style={{ fontSize: "14px", color: "#333" }}>
          {aberto ? "Legenda - DIRECs" : "Legenda 📍"}
        </strong>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            color: "#666",
            padding: "2px 6px",
          }}
        >
          {aberto ? "➖" : "➕"}
        </button>
      </div>

      {/* Conteúdo com a lista das DIRECs */}
      {aberto && (
        <div
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            paddingRight: "4px",
          }}
        >
          {LISTA_DIRECS.map((item) => {
            const estaAtiva = direcSelecionada === item.cor;

            return (
              <div
                key={item.id}
                onClick={() => onSelectDirec && onSelectDirec(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12px",
                  color: "#333",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  backgroundColor: estaAtiva ? "rgba(0, 0, 0, 0.08)" : "transparent",
                  fontWeight: estaAtiva ? "bold" : "normal",
                  transition: "background 0.2s ease",
                }}
              >
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    backgroundColor: item.cor,
                    borderRadius: "3px",
                    border: "1px solid rgba(0,0,0,0.2)",
                    flexShrink: 0,
                  }}
                />
                <span>
                  {item.id} ({item.sede})
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