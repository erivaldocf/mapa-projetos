import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LegendaDirec from "./legendaDirec";

// Correção dos ícones do Leaflet para o React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapaProjetos() {
  const [projetosComCoordenadas, setProjetosComCoordenadas] = useState([]);
  const [geoJsonRN, setGeoJsonRN] = useState(null);

  // Estados para controle de destaque no mapa
  const [direcSelecionada, setDirecSelecionada] = useState(null);
  const [municipioInfo, setMunicipioInfo] = useState(null);

  // URLs das planilhas e do GeoJSON
  const URL_ESCOLAS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSy5iLlbtrxjoKlraHw-2G30n7RbBjkQg20Kp0xsT6yWZRt810McLpE78xboZqthPkjsUbosc87jajg/pub?gid=882632808&single=true&output=csv";
  const URL_PROJETOS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwGU8n8jWSdux5jqzQjrl4o48U4veCK0FwRxAkr3YrP7pX-CwPNDsuHlWyo02mtbN4_CgUUxsWUsxG/pub?gid=1221393457&single=true&output=csv";
  const URL_IBGE_RN =
    "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-24-mun.json";

  useEffect(() => {
    // Busca do GeoJSON das divisões municipais do RN
    fetch(URL_IBGE_RN)
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.type === "FeatureCollection" || data.type === "Feature")) {
          setGeoJsonRN(data);
        }
      })
      .catch((err) => console.error("Erro ao carregar GeoJSON:", err));

    // Cruzamento de dados de escolas e projetos
    async function carregarECruzarDados() {
      try {
        const resEscolas = await fetch(URL_ESCOLAS_CSV);
        const textEscolas = await resEscolas.text();
        const escolasData = Papa.parse(textEscolas, { header: true }).data;

        const resProjetos = await fetch(URL_PROJETOS_CSV);
        const textProjetos = await resProjetos.text();
        const projetosData = Papa.parse(textProjetos, { header: true }).data;

        const listaFinal = projetosData
          .map((projeto) => {
            const inepProjeto = projeto["INEP da Escola"] || projeto["INEP"];
            if (!inepProjeto) return null;

            const escolaEncontrada = escolasData.find((escola) => {
              const inepEscola =
                escola["INEP"] || escola["inep"] || escola["Código INEP"] || Object.values(escola)[0];
              return String(inepEscola).trim() === String(inepProjeto).trim();
            });

            if (escolaEncontrada) {
              const coordString =
                escolaEncontrada["Coordenadas"] ||
                escolaEncontrada["Coordenada"] ||
                escolaEncontrada["COORDENADAS"] ||
                Object.values(escolaEncontrada)[6];

              if (coordString && coordString.includes(",")) {
                const [lat, lng] = coordString
                  .split(",")
                  .map((coord) => parseFloat(coord.trim()));

                if (!isNaN(lat) && !isNaN(lng)) {
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

        setProjetosComCoordenadas(listaFinal);
      } catch (error) {
        console.error("Erro ao carregar ou cruzar dados:", error);
      }
    }

    carregarECruzarDados();
  }, []);

  // Funções utilitárias
  const normalizarTexto = (texto) => {
    return texto
      ? texto
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toUpperCase()
          .trim()
      : "";
  };

  const CORES_DIREC = {
    // 1ª DIREC - Natal
    NATAL: "#41909A", EXTREMOZ: "#41909A", MACAIBA: "#41909A", SAOGONCALODOAMARANTE: "#41909A",
    
    // 2ª DIREC - Parnamirim
    ARES: "#8D4170", BAIAFORMOSA: "#8D4170", CANGUARETAMA: "#8D4170", GOIANINHA: "#8D4170",
    MONTEALEGRE: "#8D4170", NISIAFLORESTA: "#8D4170", PARNAMIRIM: "#8D4170",
    SAOJOSEADEMIPIBU: "#8D4170", SAOJOSEDEMIPIBU: "#8D4170", SENADORGEORGINOAVELINO: "#8D4170",
    TIBAUDOSUL: "#8D4170", VERACRUZ: "#8D4170", VILAFLOR: "#8D4170",
    
    // 3ª DIREC - Nova Cruz
    BOASAUDE: "#B7DCCA", JANUARIOCICCO: "#B7DCCA", BREJINHO: "#B7DCCA", ESPIRITOSANTO: "#B7DCCA",
    JUNDIA: "#B7DCCA", LAGOADANTA: "#B7DCCA", LAGOADEDANTAS: "#B7DCCA", LAGOADEPEDRAS: "#B7DCCA",
    LAGOASALGADA: "#B7DCCA", MONTANHAS: "#B7DCCA", MONTEDASGAMELEIRAS: "#B7DCCA", NOVACRUZ: "#B7DCCA",
    PASSAEFICA: "#B7DCCA", PASSAGEM: "#B7DCCA", PEDROVELHO: "#B7DCCA", SANTOANTONIO: "#B7DCCA",
    SAOJOSEDOCAMPESTRE: "#B7DCCA", SERRADESAOBENTO: "#B7DCCA", SERRINHA: "#B7DCCA", VARZEA: "#B7DCCA",
    
    // 4ª DIREC - São Paulo do Potengi
    BARCELONA: "#98956C", BOMJESUS: "#98956C", CAICARADORIODOVENTO: "#98956C", IELMOMARINHO: "#98956C",
    LAGOADEVELHOS: "#98956C", RIACHUELO: "#98956C", RUYBARBOSA: "#98956C", SANTAMARIA: "#98956C",
    SAOPAULODOPOTENGI: "#98956C", SAOPEDRO: "#98956C", SAOTOME: "#98956C", SENADORELOIDESOUZA: "#98956C",
    SERRACAIADA: "#98956C", PRESIDENTEJUSCELINO: "#98956C",
    
    // 5ª DIREC - Ceará-Mirim
    CEARAMIRIM: "#FFF99C", MAXARANGUAPE: "#FFF99C", PUREZA: "#FFF99C", RIODOFOGO: "#FFF99C",
    SAOMIGUELDOGOSTOSO: "#FFF99C", TAIPU: "#FFF99C", TOUROS: "#FFF99C",
    
    // 6ª DIREC - Macau
    ALTODORODRIGUES: "#7A7198", GALINHOS: "#7A7198", GUAMARE: "#7A7198", MACAU: "#7A7198",
    PENDENCIAS: "#7A7198", PORTODOMANGUE: "#7A7198",
    
    // 7ª DIREC - Santa Cruz
    CAMPOREDONDO: "#E87878", CORONELEZEQUIEL: "#E87878", JACANA: "#E87878", JAPI: "#E87878",
    LAJESPINTADAS: "#E87878", SANTACRUZ: "#E87878", SAOBENTODOTRAIRI: "#E87878", SITIONOVO: "#E87878", TANGARA: "#E87878",
    
    // 8ª DIREC - Angicos
    AFONSOBEZERRA: "#97AEBE", ANGICOS: "#97AEBE", BODO: "#97AEBE", BODOBO: "#97AEBE",
    FERNANDOPEDROZA: "#97AEBE", LAJES: "#97AEBE", PEDROAVELINO: "#97AEBE", SANTANADOMATOS: "#97AEBE",
    
    // 9ª DIREC - Currais Novos
    ACARI: "#87C127", CARNAUBADOSDANTAS: "#87C127", CERROCORA: "#87C127", CRUZETA: "#87C127",
    CURRAISNOVOS: "#87C127", EQUADOR: "#87C127", FLORANIA: "#87C127", LAGOANOVA: "#87C127",
    PARELHAS: "#87C127", SANTANADOSERIDO: "#87C127", SAOVICENTE: "#87C127", TENENTELAURENTINOCRUZ: "#87C127",
    
    // 10ª DIREC - Caicó
    CAICO: "#007CC2", IPUEIRA: "#007CC2", JARDIMDEPIRANHAS: "#007CC2", JARDIMDOSERIDO: "#007CC2",
    JUCURUTU: "#007CC2", OUROBRANCO: "#007CC2", SAOFERNANDO: "#007CC2", SAOJOAODOSABUGI: "#007CC2",
    SAOJOSEDOSERIDO: "#007CC2", SERRANEGRADONORTE: "#007CC2", TIMBAUBADOSBATISTAS: "#007CC2",
    
    // 11ª DIREC - Assú
    ACU: "#DA251D", ASSU: "#DA251D", CAMPOGRANDE: "#DA251D", CARNAUBAIS: "#DA251D",
    IPANGUACU: "#DA251D", ITAJA: "#DA251D", PARAU: "#DA251D", SAORAFAEL: "#DA251D",
    TRIUNFOPOTIGUAR: "#DA251D", AUGUSTOSEVERO: "#DA251D",
    
    // 12ª DIREC - Mossoró
    AREIABRANCA: "#FFF420", BARAUNA: "#FFF420", GOVERNADORDIXSEPTROSADO: "#FFF420",
    GROSSOS: "#FFF420", MOSSORO: "#FFF420", SERRADOMEL: "#FFF420", TIBAU: "#FFF420", UPANEMA: "#FFF420",
    
    // 13ª DIREC - Apodi
    APODI: "#E77917", CARAUBAS: "#E77917", FELIPEGUERRA: "#E77917", ITAU: "#E77917",
    RODOLFOFERNANDES: "#E77917", SEVERIANOMELO: "#E77917", TABOLEIROGRANDE: "#E77917",
    
    // 14ª DIREC - Umarizal
    ALMINOAFONSO: "#DEDEDC", ANTONIOMARTINS: "#DEDEDC", FRUTUOSOGOMES: "#DEDEDC", JANDUIS: "#DEDEDC",
    JOAODIAS: "#DEDEDC", LUCRECIA: "#DEDEDC", MARTINS: "#DEDEDC", MESSIASTARGINO: "#DEDEDC",
    OLHODAGUADOSBORGES: "#DEDEDC", PATU: "#DEDEDC", RAFAELGODEIRO: "#DEDEDC", RIACHODACRUZ: "#DEDEDC",
    SERRINHADOSPINTOS: "#DEDEDC", UMARIZAL: "#DEDEDC", VICOSA: "#DEDEDC",
    
    // 15ª DIREC - Pau dos Ferros
    AGUANOVA: "#01923F", ALEXANDRIA: "#01923F", CORONELJOAOPESSOA: "#01923F", DOUTORSEVERIANO: "#01923F",
    ENCANTO: "#01923F", FRANCISCODANTAS: "#01923F", JOSEDAPENHA: "#01923F", LUISGOMES: "#01923F",
    MAJORSALES: "#01923F", MARCELINOVIEIRA: "#01923F", PARANA: "#01923F", PAUDOSFERROS: "#01923F",
    PILOES: "#01923F", PORTALEGRE: "#01923F", RAFAELFERNANDES: "#01923F", RIACHODESANTANA: "#01923F",
    SAOFRANCISCODOOESTE: "#01923F", SAOMIGUEL: "#01923F", TENENTEANANIAS: "#01923F", VENHAVER: "#01923F",
    
    // 16ª DIREC - João Câmara
    BENTOFERNANDES: "#485778", CAICARADONORTE: "#485778", JANDAIRA: "#485778", JARDIMDEANGICOS: "#485778",
    JOAOCAMARA: "#485778", PARAZINHO: "#485778", PEDRAGRANDE: "#485778", PEDRAPRETA: "#485778",
    POCOBRANCO: "#485778", SAOBENTODONORTE: "#485778",
  };

  const obterCorDirec = (nomeBruto) => {
    const nomeLimpo = normalizarTexto(nomeBruto);
    return CORES_DIREC[nomeLimpo] || null;
  };

  // Cálculo dinâmico do estilo visual dos municípios
  const getEstiloMunicipio = (feature) => {
    const nomeBruto =
      feature?.properties?.name ||
      feature?.properties?.description ||
      feature?.properties?.nome ||
      "";
    const corDirec = obterCorDirec(nomeBruto) || "#cbd5e1";

    if (!direcSelecionada) {
      return {
        color: "#ffffff",
        weight: 1,
        fillColor: corDirec,
        fillOpacity: 0.6,
      };
    }

    const eDaMesmaDirec = direcSelecionada === corDirec;

    if (eDaMesmaDirec) {
      return {
        color: "#ffffff",
        weight: 2.5,
        fillColor: corDirec,
        fillOpacity: 0.95,
      };
    }

    return {
      color: "rgba(255, 255, 255, 0.4)",
      weight: 0.8,
      fillColor: corDirec,
      fillOpacity: 0.18,
    };
  };

  // Evento acionado ao clicar em um item da legenda lateral
  const handleSelectDirecDaLegenda = (direcItem) => {
    if (direcSelecionada === direcItem.cor) {
      setDirecSelecionada(null);
      setMunicipioInfo(null);
    } else {
      setDirecSelecionada(direcItem.cor);
      setMunicipioInfo({
        nome: `${direcItem.id} - Sede: ${direcItem.sede}`,
        cor: direcItem.cor,
      });
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Componente Legenda Lateral */}
      <LegendaDirec
        onSelectDirec={handleSelectDirecDaLegenda}
        direcSelecionada={direcSelecionada}
      />

      {/* Card Flutuante de Informação do Filtro Ativo */}
      {municipioInfo && (
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "20px",
            zIndex: 1000,
            backgroundColor: "#ffffff",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
            minWidth: "220px",
            borderLeft: `6px solid ${municipioInfo.cor}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, color: "#1e293b", fontSize: "14px" }}>
              {municipioInfo.nome}
            </h4>
            <button
              onClick={() => {
                setDirecSelecionada(null);
                setMunicipioInfo(null);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              ✖
            </button>
          </div>
          <small style={{ color: "#64748b", display: "block", marginTop: "4px" }}>
            Exibindo destaque da DIREC
          </small>
        </div>
      )}

      {/* Renderização do Mapa Leaflet */}
      <MapContainer
        center={[-5.7, -36.5]}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution="&copy; CARTO &copy; OpenStreetMap"
        />

        {geoJsonRN && (
          <GeoJSON
            key={
              (direcSelecionada || "todas") +
              (geoJsonRN.features?.length || "geojson")
            }
            data={geoJsonRN}
            style={getEstiloMunicipio}
            onEachFeature={(feature, layer) => {
              const nomeMun =
                feature?.properties?.name ||
                feature?.properties?.description ||
                "Município";
              const corDirec = obterCorDirec(nomeMun);

              layer.bindTooltip(nomeMun, { sticky: true });

              layer.on({
                mouseover: (e) => {
                  e.target.setStyle({ weight: 2.5, fillOpacity: 0.9 });
                },
                mouseout: (e) => {
                  e.target.setStyle(getEstiloMunicipio(feature));
                },
                click: () => {
                  if (direcSelecionada === corDirec) {
                    setDirecSelecionada(null);
                    setMunicipioInfo(null);
                  } else {
                    setDirecSelecionada(corDirec);
                    setMunicipioInfo({
                      nome: nomeMun,
                      cor: corDirec || "#ccc",
                    });
                  }
                },
              });
            }}
          />
        )}

        {projetosComCoordenadas.map((item, index) => (
          <Marker key={index} position={[item.lat, item.lng]}>
            <Popup>
              <strong>{item.nomeEscola}</strong> <br />
              INEP: {item["INEP da Escola"] || item.INEP}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapaProjetos;