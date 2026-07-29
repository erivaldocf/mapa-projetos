import React, { useState } from "react";

// Mapeamento organizado das 16 DIRECs com cores e coordenadas geográficas das sedes para o efeito de zoom
export const LISTA_DIRECS = [
  { id: "1ª DIREC", sede: "Natal", cor: "#41909A", lat: -5.7944, lng: -35.2110 },
  { id: "2ª DIREC", sede: "Parnamirim", cor: "#8D4170", lat: -5.9156, lng: -35.2628 },
  { id: "3ª DIREC", sede: "Nova Cruz", cor: "#B7DCCA", lat: -6.4782, lng: -35.4344 },
  { id: "4ª DIREC", sede: "São Paulo do Potengi", cor: "#98956C", lat: -5.8945, lng: -35.7634 },
  { id: "5ª DIREC", sede: "Ceará-Mirim", cor: "#FFF99C", lat: -5.6343, lng: -35.4262 },
  { id: "6ª DIREC", sede: "Macau", cor: "#7A7198", lat: -5.1156, lng: -36.6344 },
  { id: "7ª DIREC", sede: "Santa Cruz", cor: "#E87878", lat: -6.2289, lng: -36.0195 },
  { id: "8ª DIREC", sede: "Angicos", cor: "#97AEBE", lat: -5.6575, lng: -36.5222 },
  { id: "9ª DIREC", sede: "Currais Novos", cor: "#87C127", lat: -6.2608, lng: -36.5147 },
  { id: "10ª DIREC", sede: "Caicó", cor: "#007CC2", lat: -6.4564, lng: -37.0978 },
  { id: "11ª DIREC", sede: "Assú", cor: "#DA251D", lat: -5.5775, lng: -36.9136 },
  { id: "12ª DIREC", sede: "Mossoró", cor: "#FFF420", lat: -5.1881, lng: -37.3442 },
  { id: "13ª DIREC", sede: "Apodi", cor: "#E77917", lat: -5.6617, lng: -37.7997 },
  { id: "14ª DIREC", sede: "Umarizal", cor: "#DEDEDC", lat: -5.9861, lng: -37.8136 },
  { id: "15ª DIREC", sede: "Pau dos Ferros", cor: "#01923F", lat: -6.1108, lng: -38.2042 },
  { id: "16ª DIREC", sede: "João Câmara", cor: "#485778", lat: -5.5375, lng: -35.8197 },
];

function LegendaDirec({ onSelectDirec, direcSelecionada }) {
  const [aberto, setAberto] = useState(true);

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "12px 16px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
        fontFamily: "sans-serif",
        maxHeight: "80vh",
        width: aberto ? "240px" : "auto",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Cabeçalho da Legenda com Botão de Minimizar */}
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
            gap: "8px",
            paddingRight: "4px",
          }}
        >
          {LISTA_DIRECS.map((item) => {
            const selecionada = direcSelecionada === item.cor;
            return (
              <div
                key={item.id}
                onClick={() => onSelectDirec && onSelectDirec(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12px",
                  color: "#444",
                  cursor: "pointer",
                  padding: "2px",
                  borderRadius: "4px",
                  backgroundColor: selecionada ? "rgba(0, 0, 0, 0.05)" : "transparent",
                  border: selecionada ? "1px solid #666" : "1px solid transparent",
                }}
              >
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    backgroundColor: item.cor,
                    borderRadius: "3px",
                    border: "1px solid rgba(0,0,0,0.15)",
                    flexShrink: 0,
                  }}
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