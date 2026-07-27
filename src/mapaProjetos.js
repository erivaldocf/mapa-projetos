import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correção dos ícones do Leaflet para o React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapaProjetos() {
  const [projetosComCoordenadas, setProjetosComCoordenadas] = useState([]);

  const URL_ESCOLAS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSy5iLlbtrxjoKlraHw-2G30n7RbBjkQg20Kp0xsT6yWZRt810McLpE78xboZqthPkjsUbosc87jajg/pub?gid=882632808&single=true&output=csv";
  const URL_PROJETOS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwGU8n8jWSdux5jqzQjrl4o48U4veCK0FwRxAkr3YrP7pX-CwPNDsuHlWyo02mtbN4_CgUUxsWUsxG/pub?gid=1221393457&single=true&output=csv";

  useEffect(() => {
    async function carregarECruzarDados() {
      try {
        // 1. Busca os dados das Escolas
        const resEscolas = await fetch(URL_ESCOLAS_CSV);
        const textEscolas = await resEscolas.text();
        const escolasData = Papa.parse(textEscolas, { header: true }).data;

        // 2. Busca os dados dos Projetos
        const resProjetos = await fetch(URL_PROJETOS_CSV);
        const textProjetos = await resProjetos.text();
        const projetosData = Papa.parse(textProjetos, { header: true }).data;

        // Logs no console para ajudar a inspecionar os nomes das colunas
        console.log("Dados da 1ª Escola:", escolasData[0]);
        console.log("Dados do 1º Projeto:", projetosData[0]);

        // 3. Cruza os Projetos com as Escolas
        const listaFinal = projetosData
          .map((projeto) => {
            // Pega o INEP vindo da Coluna S ("INEP da Escola")
            const inepProjeto = projeto["INEP da Escola"] || projeto["INEP"];

            if (!inepProjeto) return null;

            // Procura a escola correspondente
            const escolaEncontrada = escolasData.find((escola) => {
              // Tenta pegar o INEP da escola (testa variações comuns ou pega a 1ª coluna se necessário)
              const inepEscola =
                escola["INEP"] ||
                escola["inep"] ||
                escola["Código INEP"] ||
                Object.values(escola)[0];
              return String(inepEscola).trim() === String(inepProjeto).trim();
            });

            if (escolaEncontrada) {
              // Procura a coluna de Coordenadas (Coluna G / 7ª coluna)
              const coordString =
                escolaEncontrada["Coordenadas"] ||
                escolaEncontrada["Coordenada"] ||
                escolaEncontrada["COORDENADAS"] ||
                Object.values(escolaEncontrada)[6]; // Coluna G é o índice 6

              if (coordString && coordString.includes(",")) {
                const [lat, lng] = coordString
                  .split(",")
                  .map((coord) => parseFloat(coord.trim()));

                if (!isNaN(lat) && !isNaN(lng)) {
                  // Nome da escola (testa algumas colunas comuns)
                  const nomeEscola =
                    escolaEncontrada["Nome"] ||
                    escolaEncontrada["NOME DA ESCOLA"] ||
                    escolaEncontrada["Escola"] ||
                    `Escola INEP ${inepProjeto}`;

                  return {
                    ...projeto,
                    nomeEscola: nomeEscola,
                    lat: lat,
                    lng: lng,
                  };
                }
              }
            }

            return null;
          })
          .filter(Boolean);

        console.log("Projetos com coordenadas encontrados:", listaFinal);
        setProjetosComCoordenadas(listaFinal);
      } catch (error) {
        console.error("Erro ao carregar ou cruzar dados:", error);
      }
    }

    carregarECruzarDados();
  }, []);

  return (
    <MapContainer
      center={[-5.7, -36.5]}
      zoom={8}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {projetosComCoordenadas.map((item, index) => (
        <Marker key={index} position={[item.lat, item.lng]}>
          <Popup>
            <strong>{item.nomeEscola}</strong> <br />
            INEP: {item["INEP da Escola"] || item.INEP}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapaProjetos;
