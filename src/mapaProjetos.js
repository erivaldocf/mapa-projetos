import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, ZoomControl, useMap } from "react-leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LegendaDirec, { LISTA_DIRECS } from "./legendaDirec";

// Ícones padrão do Leaflet
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

// Listas de Opções para os Filtros
export const ETAPAS_ENSINO = [
  "Ensino Fundamental (1º ao 5º)",
  "Ensino Fundamental (6º ao 9º)",
  "Ensino Médio",
];

export const MODALIDADES_ENSINO = [
  "Educação de Jovens e Adultos (EJA)",
  "Educação Profissional e Tecnológica (EPT)",
  "Educação Especial",
  "Educação do Campo, Indígena e Quilombola",
  "Educação em Tempo Integral",
  "Educação a Distância (EaD)",
];

// 📌 Componente auxiliar interno para gerenciar o efeito flyTo de zoom animado no mapa
function ControladorDeFoco({ direcSelecionada }) {
  const map = useMap();

  useEffect(() => {
    if (direcSelecionada) {
      // Encontra a regional ativa para extrair as coordenadas da sede correspondente
      const regionalAtiva = LISTA_DIRECS.find((item) => item.cor === direcSelecionada);
      if (regionalAtiva) {
        // Aplica o zoom com transição suave na sede da DIREC
        map.flyTo([regionalAtiva.lat, regionalAtiva.lng], 10.5, {
          animate: true,
          duration: 1.5,
        });
      }
    } else {
      // Retorna ao enquadramento geral do RN quando a seleção é desfeita
      map.flyTo([-5.7, -36.5], 8, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [direcSelecionada, map]);

  return null;
}

function MapaProjetos() {
  const [projetosComCoordenadas, setProjetosComCoordenadas] = useState([]);
  const [geoJsonRN, setGeoJsonRN] = useState(null);

  // Estados de Seleção e Filtro
  const [direcSelecionada, setDirecSelecionada] = useState(null);
  const [municipioInfo, setMunicipioInfo] = useState(null);
  const [etapasSelecionadas, setEtapasSelecionadas] = useState([]);
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState([]);
  const [painelFiltrosAberto, setPainelFiltrosAberto] = useState(true);

  const URL_ESCOLAS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSy5iLlbtrxjoKlraHw-2G30n7RbBjkQg20Kp0xsT6yWZRt810McLpE78xboZqthPkjsUbosc87jajg/pub?gid=882632808&single=true&output=csv";
  const URL_PROJETOS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwGU8n8jWSdux5jqzQjrl4o48U4veCK0FwRxAkr3YrP7pX-CwPNDsuHlWyo02mtbN4_CgUUxsWUsxG/pub?gid=1221393457&single=true&output=csv";
  const URL_IBGE_RN =
    "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-24-mun.json";

  useEffect(() => {
    // Carrega GeoJSON do RN
    fetch(URL_IBGE_RN)
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.type === "FeatureCollection" || data.type === "Feature")) {
          setGeoJsonRN(data);
        }
      })
      .catch((err) => console.error("Erro ao carregar GeoJSON:", err));

    // Carrega e cruza planilhas de Escolas e Projetos
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
                    etapa: projeto["Etapa de Ensino"] || projeto["Etapa"] || "",
                    modalidade: project => projeto["Modalidade de Ensino"] || projeto["Modalidade"] || "",
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

  // Limpeza de texto para casamento dos municípios
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
    NATAL: "#41909A", EXTREMOZ: "#41909A", MACAIBA: "#41909A", SAOGONCALODOAMARANTE: "#41909A",
    ARES: "#8D4170", BAIAFORMOSA: "#8D4170", CANGUARETAMA: "#8D4170", GOIANINHA: "#8D4170",
    MONTEALEGRE: "#8D4170", NISIAFLORESTA: "#8D4170", PARNAMIRIM: "#8D4170",
    SAOJOSEADEMIPIBU: "#8D4170", SAOJOSEDEMIPIBU: "#8D4170", SENADORGEORGINOAVELINO: "#8D4170",
    TIBAUDOSUL: "#8D4170", VERACRUZ: "#8D4170", VILAFLOR: "#8D4170",
    BOASAUDE: "#B7DCCA", JANUARIOCICCO: "#B7DCCA", BREJINHO: "#B7DCCA", ESPIRITOSANTO: "#B7DCCA",
    JUNDIA: "#B7DCCA", LAGOADANTA: "#B7DCCA", LAGOADEDANTAS: "#B7DCCA", LAGOADEPEDRAS: "#B7DCCA",
    LAGOASALGADA: "#B7DCCA", MONTANHAS: "#B7DCCA", MONTEDASGAMELEIRAS: "#B7DCCA", NOVACRUZ: "#B7DCCA",
    PASSAEFICA: "#B7DCCA", PASSAGEM: "#B7DCCA", PEDROVELHO: "#B7DCCA", SANTOANTONIO: "#B7DCCA",
    SAOJOSEDOCAMPESTRE: "#B7DCCA", SERRADESAOBENTO: "#B7DCCA", SERRINHA: "#B7DCCA", VARZEA: "#B7DCCA",
    BARCELONA: "#98956C", BOMJESUS: "#98956C", CAICARADORIODOVENTO: "#98956C", IELMOMARINHO: "#98956C",
    LAGOADEVELHOS: "#98956C", RIACHUELO: "#98956C", RUYBARBOSA: "#98956C", SANTAMARIA: "#98956C",
    SAOPAULODOPOTENGI: "#98956C", SAOPEDRO: "#98956C", SAOTOME: "#98956C", SENADORELOIDESOUZA: "#98956C",
    SERRACAIADA: "#98956C", PRESIDENTEJUSCELINO: "#98956C",
    CEARAMIRIM: "#FFF99C", MAXARANGUAPE: "#FFF99C", PUREZA: "#FFF99C", RIODOFOGO: "#FFF99C",
    SAOMIGUELDOGOSTOSO: "#FFF99C", TAIPU: "#FFF99C", TOUROS: "#FFF99C",
    ALTODORODRIGUES: "#7A7198", GALINHOS: "#7A7198", GUAMARE: "#7A7198", MACAU: "#7A7198",
    PENDENCIAS: "#7A7198", PORTODOMANGUE: "#7A7198",
    CAMPOREDONDO: "#E87878", CORONELEZEQUIEL: "#E87878", JACANA: "#E87878", JAPI: "#E87878",
    LAJESPINTADAS: "#E87878", SANTACRUZ: "#E87878", SAOBENTODOTRAIRI: "#E87878", SITIONOVO: "#E87878", TANGARA: "#E87878",
    AFONSOBEZERRA: "#97AEBE", ANGICOS: "#97AEBE", BODO: "#97AEBE", BODOBO: "#97AEBE",
    FERNANDOPEDROZA: "#97AEBE", LAJES: "#97AEBE", PEDROAVELINO: "#97AEBE", SANTANADOMATOS: "#97AEBE",
    ACARI: "#87C127", CARNAUBADOSDANTAS: "#87C127", CERROCORA: "#87C127", CRUZETA: "#87C127",
    CURRAISNOVOS: "#87C127", EQUADOR: "#87C127", FLORANIA: "#87C127", LAGOANOVA: "#87C127",
    PARELHAS: "#87C127", SANTANADOSERIDO: "#87C127", SAOVICENTE: "#87C127", TENENTELAURENTINOCRUZ: "#87C127",
    CAICO: "#007CC2", IPUEIRA: "#007CC2", JARDIMDEPIRANHAS: "#007CC2", JARDIMDOSERIDO: "#007CC2",
    JUCURUTU: "#007CC2", OUROBRANCO: "#007CC2", SAOFERNANDO: "#007CC2", SAOJOAODOSABUGI: "#007CC2",
    SAOJOSEDADOSERIDO: "#007CC2", SAOJOSEDOSERIDO: "#007CC2", SERRANEGRADONORTE: "#007CC2", TIMBAUBADOSBATISTAS: "#007CC2",
    ACU: "#DA251D", ASSU: "#DA251D", CAMPOGRANDE: "#DA251D", CARNAUBAIS: "#DA251D",
    IPANGUACU: "#DA251D", ITAJA: "#DA251D", PARAU: "#DA251D", SAORAFAEL: "#DA251D",
    TRIUNFOPOTIGUAR: "#DA251D", AUGUSTOSEVERO: "#DA251D",
    AREIABRANCA: "#FFF420", BARAUNA: "#FFF420", GOVERNADORDIXSEPTROSADO: "#FFF420",
    GROSSOS: "#FFF420", MOSSORO: "#FFF420", SERRADOMEL: "#FFF420", TIBAU: "#FFF420", UPANEMA: "#FFF420",
    APODI: "#E77917", CARAUBAS: "#E77917", FELIPEGUERRA: "#E77917", ITAU: "#E77917",
    RODOLFOFERNANDES: "#E77917", SEVERIANOMELO: "#E77917", TABOLEIROGRANDE: "#E77917",
    ALMINOAFONSO: "#DEDEDC", ANTONIOMARTINS: "#DEDEDC", FRUTUOSOGOMES: "#DEDEDC", JANDUIS: "#DEDEDC",
    JOAODIAS: "#DEDEDC", LUCRECIA: "#DEDEDC", MARTINS: "#DEDEDC", MESSIASTARGINO: "#DEDEDC",
    OLHODAGUADOSBORGES: "#DEDEDC", PATU: "#DEDEDC", RAFAELGODEIRO: "#DEDEDC", RIACHODACRUZ: "#DEDEDC",
    SERRINHADOSPINTOS: "#DEDEDC", UMARIZAL: "#DEDEDC", VICOSA: "#DEDEDC",
    AGUANOVA: "#01923F", ALEXANDRIA: "#01923F", CORONELJOAOPESSOA: "#01923F", DOUTORSEVERIANO: "#01923F",
    ENCANTO: "#01923F", FRANCISCODANTAS: "#01923F", JOSEDAPENHA: "#01923F", LUISGOMES: "#01923F",
    MAJORSALES: "#01923F", MARCELINOVIEIRA: "#01923F", PARANA: "#01923F", PAUDOSFERROS: "#01923F",
    PILOES: "#01923F", PORTALEGRE: "#01923F", RAFAELFERNANDES: "#01923F", RIACHODESANTANA: "#01923F",
    SAOFRANCISCODOOESTE: "#01923F", SAOMIGUEL: "#01923F", TENENTEANANIAS: "#01923F", VENHAVER: "#01923F",
    BENTOFERNANDES: "#485778", CAICARADONORTE: "#485778", JANDAIRA: "#485778", JARDIMDEANGICOS: "#485778",
    JOAOCAMARA: "#485778", PARAZINHO: "#485778", PEDRAGRANDE: "#485778", PEDRAPRETA: "#485778",
    POCOBRANCO: "#485778", SAOBENTODONORTE: "#485778",
  };

  const obterCorDirec = (nomeBruto) => {
    const nomeLimpo = normalizarTexto(nomeBruto);
    return CORES_DIREC[nomeLimpo] || null;
  };

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

  const toggleEtapa = (etapa) => {
    setEtapasSelecionadas((prev) =>
      prev.includes(etapa) ? prev.filter((e) => e !== etapa) : [...prev, etapa]
    );
  };

  const toggleModalidade = (modalidade) => {
    setModalidadesSelecionadas((prev) =>
      prev.includes(modalidade)
        ? prev.filter((m) => m !== modalidade)
        : [...prev, modalidade]
    );
  };

  const projetosFiltrados = projetosComCoordenadas.filter((item) => {
    const passaEtapa =
      etapasSelecionadas.length === 0 || etapasSelecionadas.includes(item.etapa);
    const passaModalidade =
      modalidadesSelecionadas.length === 0 ||
      (item.modalidade && modalidadesSelecionadas.includes(item.modalidade));

    return passaEtapa && passaModalidade;
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* 📌 ESTILO EMBUTIDO COMPACTO PARA ALINHAMENTO HORIZONTAL NO CANTO SUPERIOR DIREITO */}
      <style>{`
        .painel-superior-direito-row {
          position: absolute !important;
          top: 15px !important;
          right: 15px !important;
          left: auto !important;
          z-index: 1000 !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start !important;
          gap: 15px !important;
          font-family: sans-serif !important;
        }

        .item-row-container {
          flex: 0 0 auto !important;
          max-height: calc(100vh - 40px) !important;
          overflow-y: auto !important;
        }
      `}</style>

      {/* CONTAINER SUPERIOR DIREITO FLEXBOX (ROW) */}
      <div
        className="painel-superior-direito-row"
        onMouseDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* 1. PAINEL DE FILTROS DE ENSINO */}
        <div
          className="item-row-container"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "12px 14px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            width: "260px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              marginBottom: painelFiltrosAberto ? "10px" : "0",
            }}
            onClick={() => setPainelFiltrosAberto(!painelFiltrosAberto)}
          >
            <strong style={{ fontSize: "13px", color: "#1e293b" }}>
              🎯 Filtros de Ensino
            </strong>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {painelFiltrosAberto ? "➖" : "➕"}
            </span>
          </div>

          {painelFiltrosAberto && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Etapa de Ensino */}
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#475569",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Etapa de Ensino:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {ETAPAS_ENSINO.map((etapa) => {
                    const ativa = etapasSelecionadas.includes(etapa);
                    return (
                      <button
                        key={etapa}
                        onClick={() => toggleEtapa(etapa)}
                        style={{
                          padding: "3px 8px",
                          fontSize: "10px",
                          borderRadius: "12px",
                          border: "1px solid #0284c7",
                          backgroundColor: ativa ? "#0284c7" : "#ffffff",
                          color: ativa ? "#ffffff" : "#0284c7",
                          cursor: "pointer",
                          fontWeight: ativa ? "bold" : "normal",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {etapa}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modalidade de Ensino */}
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#475569",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Modalidade de Ensino:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {MODALIDADES_ENSINO.map((modalidade) => {
                    const ativa = modalidadesSelecionadas.includes(modalidade);
                    return (
                      <button
                        key={modalidade}
                        onClick={() => toggleModalidade(modalidade)}
                        style={{
                          padding: "3px 8px",
                          fontSize: "10px",
                          borderRadius: "12px",
                          border: "1px solid #0d9488",
                          backgroundColor: ativa ? "#0d9488" : "#ffffff",
                          color: ativa ? "#ffffff" : "#0d9488",
                          cursor: "pointer",
                          fontWeight: ativa ? "bold" : "normal",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {modalidade}
                      </button>
                    );
                  })}
                </div>
              </div>

              {(etapasSelecionadas.length > 0 || modalidadesSelecionadas.length > 0) && (
                <button
                  onClick={() => {
                    setEtapasSelecionadas([]);
                    setModalidadesSelecionadas([]);
                  }}
                  style={{
                    padding: "2px 0",
                    fontSize: "10px",
                    color: "#ef4444",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "right",
                    textDecoration: "underline",
                  }}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {/* 2. LEGENDA DAS DIRECs */}
        <div className="item-row-container">
          <LegendaDirec
            onSelectDirec={handleSelectDirecDaLegenda}
            direcSelecionada={direcSelecionada}
          />
        </div>
      </div>

      {/* Card Flutuante de Informações da DIREC Selecionada */}
      {municipioInfo && (
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "15px",
            zIndex: 1000,
            backgroundColor: "#ffffff",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
            minWidth: "220px",
            borderLeft: `6px solid ${municipioInfo.cor}`,
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
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

      {/* MAPA LEAFLET */}
      <MapContainer
        center={[-5.7, -36.5]}
        zoom={8}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Controle nativo de Zoom realocado para a parte inferior esquerda do layout */}
        <ZoomControl position="bottomleft" />

        {/* 📌 Injeção do componente de controle de foco de aproximação automática */}
        <ControladorDeFoco direcSelecionada={direcSelecionada} />

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

        {projetosFiltrados.map((item, index) => (
          <Marker key={index} position={[item.lat, item.lng]}>
            <Popup>
              <strong>{item.nomeEscola}</strong> <br />
              {item.etapa && <span>Etapa: {item.etapa}<br /></span>}
              {item.modalidade && <span>Modalidade: {item.modalidade}<br /></span>}
              INEP: {item["INEP da Escola"] || item.INEP}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapaProjetos;