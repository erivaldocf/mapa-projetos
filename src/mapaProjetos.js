import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, ZoomControl, useMap } from "react-leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LegendaDirec, { LISTA_DIRECS } from "./legendaDirec";

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

export const AREAS_CONHECIMENTO = [
  "Linguagens",
  "Matemática",
  "Ciências da Natureza",
  "Ciências Humanas",
];

export const COMPONENTES_CURRICULARES = [
  "Língua Portuguesa",
  "Matemática",
  "História",
  "Geografia",
  "Ciências",
  "Biologia",
  "Química",
  "Física",
  "Artes",
  "Educação Física",
  "Língua Inglesa",
  "Língua Espanhola",
  "Filosofia",
  "Sociologia",
];

// PALETA DE CORES DAS MODALIDADES
const CORES_MODALIDADES = {
  EJA: "#10b981",          // Verde
  EPT: "#1e40af",          // Azul Escuro
  ESPECIAL: "#8b5cf6",     // Roxo
  CAMPO: "#d97706",        // Laranja/Terra
  INTEGRAL: "#e11d48",     // Vermelho/Rosa
  EAD: "#78350f",          // Marrom
  PADRAO: "#0284c7"        // Azul Padrão
};

// Função para definir a cor do Pin com base na Modalidade (ou Etapa)
const obterCorDoPin = (modalidade, etapa) => {
  const modNorm = normalizarTexto(modalidade);

  if (modNorm.includes("EJA") || modNorm.includes("JOVENS")) return CORES_MODALIDADES.EJA;
  if (modNorm.includes("EPT") || modNorm.includes("PROFISSIONAL")) return CORES_MODALIDADES.EPT;
  if (modNorm.includes("ESPECIAL")) return CORES_MODALIDADES.ESPECIAL;
  if (modNorm.includes("CAMPO") || modNorm.includes("INDIGENA") || modNorm.includes("QUILOMBOLA")) return CORES_MODALIDADES.CAMPO;
  if (modNorm.includes("INTEGRAL")) return CORES_MODALIDADES.INTEGRAL;
  if (modNorm.includes("EAD") || modNorm.includes("DISTANCIA")) return CORES_MODALIDADES.EAD;

  return CORES_MODALIDADES.PADRAO;
};

// Gerador de Ícones SVG com Contorno Destacado e Sombra
const criarIconePin = (corPreenchimento) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
      </filter>
      <g filter="url(#shadow)">
        <!-- Borda Externa Branca -->
        <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="#ffffff"/>
        <!-- Corpo Colorido do Pin -->
        <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 8 10.5 21.2 10.5 21.2S22.5 20 22.5 12c0-5.8-4.7-10.5-10.5-10.5z" fill="${corPreenchimento}"/>
        <!-- Círculo Central Branco com Contorno -->
        <circle cx="12" cy="11" r="4.5" fill="#ffffff" stroke="#0f172a" stroke-width="1"/>
      </g>
    </svg>
  `;

  return L.divIcon({
    className: "custom-pin-icon",
    html: svg,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -38],
  });
};

// Mapeamento das cores das DIRECs por município
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

// Funções utilitárias
const normalizarTexto = (texto) => {
  return texto
    ? String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .trim()
    : "";
};

const obterCorDirec = (nomeBruto) => {
  const nomeLimpo = normalizarTexto(nomeBruto);
  return CORES_DIREC[nomeLimpo] || null;
};

// Componente auxiliar para ajustar o foco do mapa
function ControladorDeFoco({ direcSelecionada, focoMunicipio, projetoSelecionado }) {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    if (focoMunicipio) {
      map.flyTo([focoMunicipio.lat, focoMunicipio.lng], 11.5, {
        animate: true,
        duration: 1.5,
      });
    } else if (direcSelecionada) {
      const regionalAtiva = LISTA_DIRECS.find((item) => item.cor === direcSelecionada);
      if (regionalAtiva) {
        map.flyTo([regionalAtiva.lat, regionalAtiva.lng], 10.5, {
          animate: true,
          duration: 1.5,
        });
      }
    } else {
      map.flyTo([-5.7, -36.5], 8, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [direcSelecionada, focoMunicipio, projetoSelecionado, map]);

  return null;
}

function MapaProjetos() {
  const [projetosComCoordenadas, setProjetosComCoordenadas] = useState([]);
  const [geoJsonRN, setGeoJsonRN] = useState(null);

  // Estados de Seleção, Foco e Filtro
  const [direcSelecionada, setDirecSelecionada] = useState(null);
  const [focoMunicipio, setFocoMunicipio] = useState(null);
  const [municipioClicadoNome, setMunicipioClicadoNome] = useState(null);
  const [municipioInfo, setMunicipioInfo] = useState(null);
  const [etapasSelecionadas, setEtapasSelecionadas] = useState([]);
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState([]);
  const [areasSelecionadas, setAreasSelecionadas] = useState([]);
  const [componentesSelecionados, setComponentesSelecionados] = useState([]);
  const [painelFiltrosAberto, setPainelFiltrosAberto] = useState(true);
  
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);

  const direcRef = useRef(direcSelecionada);
  const municipioNomeRef = useRef(municipioClicadoNome);

  useEffect(() => {
    direcRef.current = direcSelecionada;
    municipioNomeRef.current = municipioClicadoNome;
  }, [direcSelecionada, municipioClicadoNome]);

  const URL_ESCOLAS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSy5iLlbtrxjoKlraHw-2G30n7RbBjkQg20Kp0xsT6yWZRt810McLpE78xboZqthPkjsUbosc87jajg/pub?gid=882632808&single=true&output=csv";
  const URL_PROJETOS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwGU8n8jWSdux5jqzQjrl4o48U4veCK0FwRxAkr3YrP7pX-CwPNDsuHlWyo02mtbN4_CgUUxsWUsxG/pub?gid=1221393457&single=true&output=csv";
  const URL_IBGE_RN =
    "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-24-mun.json";

  useEffect(() => {
    fetch(URL_IBGE_RN)
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.type === "FeatureCollection" || data.type === "Feature")) {
          setGeoJsonRN(data);
        }
      })
      .catch((err) => console.error("Erro ao carregar GeoJSON:", err));

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
            const chaveInepProj = Object.keys(projeto).find(k => k.trim().toUpperCase().includes("INEP")) || "";
            const inepProjeto = projeto[chaveInepProj] || projeto["INEP da Escola"] || projeto["INEP"];
            
            if (!inepProjeto) return null;

            const escolaEncontrada = escolasData.find((escola) => {
              const chaveInepEscola = Object.keys(escola).find(k => k.trim().toUpperCase().includes("INEP")) || "";
              const inepEscola = escola[chaveInepEscola] || escola["INEP"] || Object.values(escola)[0];
              return String(inepEscola).trim() === String(inepProjeto).trim();
            });

            if (escolaEncontrada) {
              const chaveCoord = Object.keys(escolaEncontrada).find(k => k.trim().toUpperCase().includes("COORD")) || "";
              const coordString = escolaEncontrada[chaveCoord] || escolaEncontrada["Coordenadas"] || Object.values(escolaEncontrada)[6];

              if (coordString && String(coordString).includes(",")) {
                const [lat, lng] = String(coordString)
                  .split(",")
                  .map((coord) => parseFloat(coord.trim()));

                if (!isNaN(lat) && !isNaN(lng)) {
                  const chaveNomeEscola = Object.keys(escolaEncontrada).find(k => k.trim().toUpperCase().includes("NOME")) || "";
                  const nomeEscola = escolaEncontrada[chaveNomeEscola] || escolaEncontrada["Nome"] || `Escola INEP ${inepProjeto}`;

                  const chaveMunEscola = Object.keys(escolaEncontrada).find(k => k.trim().toUpperCase().includes("MUNICIPIO") || k.trim().toUpperCase().includes("MUNICÍPIO")) || "";
                  const chaveMunProj = Object.keys(projeto).find(k => k.trim().toUpperCase().includes("MUNICIPIO") || k.trim().toUpperCase().includes("MUNICÍPIO")) || "";
                  const nomeMunicipio = escolaEncontrada[chaveMunEscola] || projeto[chaveMunProj] || "";

                  const obterValorFlexivel = (obj, termos) => {
                    const chave = Object.keys(obj).find(k => 
                      termos.some(t => k.trim().toUpperCase().includes(t.toUpperCase()))
                    );
                    if (chave && obj[chave]) return String(obj[chave]);

                    const valorEncontrado = Object.values(obj).find(v => {
                      if (!v) return false;
                      const normV = normalizarTexto(v);
                      return termos.some(t => normV.includes(t.toUpperCase()));
                    });
                    return valorEncontrado ? String(valorEncontrado) : "";
                  };

                  const etapaVal = obterValorFlexivel(projeto, ["ETAPA", "SERIE", "ANO"]);
                  const modalidadeVal = obterValorFlexivel(projeto, ["MODALIDADE", "MODAL"]);
                  const areaVal = obterValorFlexivel(projeto, ["AREA", "ÁREA"]);
                  const componenteVal = obterValorFlexivel(projeto, ["COMPONENTE", "DISCIPLINA", "MATERIA"]);

                  return {
                    ...escolaEncontrada,
                    ...projeto,
                    nomeEscola: nomeEscola,
                    municipio: nomeMunicipio,
                    corDirec: obterCorDirec(nomeMunicipio),
                    etapa: etapaVal,
                    modalidade: modalidadeVal,
                    area: areaVal,
                    componente: componenteVal,
                    lat: lat,
                    lng: lng,
                    dadosCompletosEscola: escolaEncontrada,
                    dadosCompletosProjeto: projeto,
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
  }, [URL_ESCOLAS_CSV, URL_PROJETOS_CSV, URL_IBGE_RN]);

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
        fillOpacity: 0.85,
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
      setFocoMunicipio(null);
      setMunicipioClicadoNome(null);
      setMunicipioInfo(null);
    } else {
      setDirecSelecionada(direcItem.cor);
      setFocoMunicipio(null);
      setMunicipioClicadoNome(null);
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

  const toggleArea = (area) => {
    setAreasSelecionadas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleComponente = (componente) => {
    setComponentesSelecionados((prev) =>
      prev.includes(componente)
        ? prev.filter((c) => c !== componente)
        : [...prev, componente]
    );
  };

  const checarEtapaMatch = (etapaProjeto, filtroSelecionado, dadosProjetoCompleto) => {
    const textoBase = normalizarTexto(etapaProjeto) + " " + normalizarTexto(JSON.stringify(dadosProjetoCompleto || {}));

    if (filtroSelecionado.includes("1º ao 5º")) {
      return (
        textoBase.includes("1") ||
        textoBase.includes("2") ||
        textoBase.includes("3") ||
        textoBase.includes("4") ||
        textoBase.includes("5") ||
        textoBase.includes("INICIAIS") ||
        textoBase.includes("FUNDAMENTALI")
      );
    }

    if (filtroSelecionado.includes("6º ao 9º")) {
      return (
        textoBase.includes("6") ||
        textoBase.includes("7") ||
        textoBase.includes("8") ||
        textoBase.includes("9") ||
        textoBase.includes("FINAIS") ||
        textoBase.includes("FUNDAMENTALII")
      );
    }

    if (filtroSelecionado.includes("Médio")) {
      return (
        textoBase.includes("MEDIO") ||
        textoBase.includes("HIGH") ||
        textoBase.includes("EM")
      );
    }

    return false;
  };

  const contemTextoGenerico = (valorPlanilha, listaFiltros, dadosProjetoCompleto) => {
    if (!listaFiltros || listaFiltros.length === 0) return false;

    const textoPlanilha = normalizarTexto(valorPlanilha) + " " + normalizarTexto(JSON.stringify(dadosProjetoCompleto || {}));

    return listaFiltros.some((filtro) => {
      const filtroNorm = normalizarTexto(filtro);
      return textoPlanilha.includes(filtroNorm);
    });
  };

  const projetosFiltrados = projetosComCoordenadas.filter((item) => {
    const temFiltroCategoriaAtivo =
      etapasSelecionadas.length > 0 ||
      modalidadesSelecionadas.length > 0 ||
      areasSelecionadas.length > 0 ||
      componentesSelecionados.length > 0;

    const passaEtapa =
      etapasSelecionadas.length > 0 &&
      etapasSelecionadas.some((etapaFiltro) =>
        checarEtapaMatch(item.etapa, etapaFiltro, item.dadosCompletosProjeto)
      );

    const passaModalidade = contemTextoGenerico(
      item.modalidade,
      modalidadesSelecionadas,
      item.dadosCompletosProjeto
    );

    const passaArea = contemTextoGenerico(
      item.area,
      areasSelecionadas,
      item.dadosCompletosProjeto
    );

    const passaComponente = contemTextoGenerico(
      item.componente,
      componentesSelecionados,
      item.dadosCompletosProjeto
    );

    const passaCategoria =
      !temFiltroCategoriaAtivo ||
      (passaEtapa || passaModalidade || passaArea || passaComponente);

    const passaDirec =
      !direcSelecionada || item.corDirec === direcSelecionada;

    const passaMunicipio =
      !municipioClicadoNome ||
      normalizarTexto(item.municipio) === normalizarTexto(municipioClicadoNome);

    return passaCategoria && passaDirec && passaMunicipio;
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", display: "flex", flexDirection: "row", overflow: "hidden" }}>
      <style>{`
        .rotulo-municipio-destacado {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid #0f172a !important;
          border-radius: 4px !important;
          color: #0f172a !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          padding: 3px 8px !important;
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2) !important;
        }

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

        .coluna-detalhes-esquerda {
          width: 33.33vw;
          min-width: 360px;
          height: 100vh;
          background-color: #ffffff;
          box-shadow: 4px 0px 15px rgba(0, 0, 0, 0.15);
          z-index: 1010;
          display: flex;
          flex-direction: column;
          font-family: sans-serif;
          transition: all 0.3s ease;
          border-right: 1px solid #e2e8f0;
        }

        .custom-pin-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      {/* BARRA LATERAL ESQUERDA */}
      {projetoSelecionado && (
        <div className="coluna-detalhes-esquerda">
          <div style={{ padding: "18px 22px", backgroundColor: "#0f172a", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "17px", fontWeight: "bold", letterSpacing: "0.3px" }}>📋 Detalhes da Escola e Projeto</span>
            <button 
              onClick={() => setProjetoSelecionado(null)}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "22px", fontWeight: "bold" }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "22px" }}>
            {/* BLOCO 1: ESCOLA */}
            <div style={{ backgroundColor: "#f8fafc", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold", color: "#0284c7", textTransform: "uppercase", display: "block", marginBottom: "14px", letterSpacing: "0.5px" }}>
                🏫 Informações da Instituição
              </span>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>Nome da Escola:</label>
                <h3 style={{ margin: "4px 0 0 0", color: "#0f172a", fontSize: "18px", fontWeight: "700", lineHeight: "1.35" }}>
                  {projetoSelecionado.nomeEscola}
                </h3>
              </div>

              {projetoSelecionado.municipio && (
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>Município:</label>
                  <p style={{ margin: "3px 0 0 0", color: "#334155", fontSize: "14px", fontWeight: "600" }}>{projetoSelecionado.municipio}</p>
                </div>
              )}

              {Object.entries(projetoSelecionado.dadosCompletosEscola || {}).map(([chave, valor]) => {
                if (!valor || ["Nome", "NOME DA ESCOLA", "Escola", "Coordenadas", "Coordenada", "COORDENADAS"].includes(chave)) return null;
                return (
                  <div key={`escola_${chave}`} style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>{chave}:</label>
                    <p style={{ margin: "2px 0 0 0", color: "#334155", fontSize: "14px", lineHeight: "1.5" }}>{String(valor)}</p>
                  </div>
                );
              })}
            </div>

            {/* BLOCO 2: PROJETO */}
            <div style={{ backgroundColor: "#f0fdf4", padding: "18px", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold", color: "#166534", textTransform: "uppercase", display: "block", marginBottom: "14px", letterSpacing: "0.5px" }}>
                💡 Detalhes da Ação Tecnológica
              </span>

              {projetoSelecionado.etapa && (
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", color: "#166534", fontWeight: "bold" }}>Etapa de Ensino:</label>
                  <span style={{ display: "block", marginTop: "4px", padding: "5px 10px", fontSize: "13px", borderRadius: "6px", backgroundColor: "#e0f2fe", color: "#0369a1", fontWeight: "600", width: "fit-content" }}>
                    {projetoSelecionado.etapa}
                  </span>
                </div>
              )}

              {projetoSelecionado.modalidade && (
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", color: "#166534", fontWeight: "bold" }}>Modalidade:</label>
                  <span style={{ display: "block", marginTop: "4px", padding: "5px 10px", fontSize: "13px", borderRadius: "6px", backgroundColor: "#ccfbf1", color: "#0f766e", fontWeight: "600", width: "fit-content" }}>
                    {projetoSelecionado.modalidade}
                  </span>
                </div>
              )}

              {projetoSelecionado.area && (
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", color: "#166534", fontWeight: "bold" }}>Área do Conhecimento:</label>
                  <span style={{ display: "block", marginTop: "4px", padding: "5px 10px", fontSize: "13px", borderRadius: "6px", backgroundColor: "#fef3c7", color: "#92400e", fontWeight: "600", width: "fit-content" }}>
                    {projetoSelecionado.area}
                  </span>
                </div>
              )}

              {projetoSelecionado.componente && (
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", color: "#166534", fontWeight: "bold" }}>Componente Curricular:</label>
                  <span style={{ display: "block", marginTop: "4px", padding: "5px 10px", fontSize: "13px", borderRadius: "6px", backgroundColor: "#e0e7ff", color: "#3730a3", fontWeight: "600", width: "fit-content" }}>
                    {projetoSelecionado.componente}
                  </span>
                </div>
              )}

              {Object.entries(projetoSelecionado.dadosCompletosProjeto || {}).map(([chave, valor]) => {
                if (!valor || ["INEP da Escola", "INEP", "Etapa de Ensino", "Etapa", "Modalidade de Ensino", "Modalidade", "Área de Conhecimento", "Area de Conhecimento", "Área", "Area", "Componente Curricular", "Componente", "Disciplina"].includes(chave)) return null;
                return (
                  <div key={`proj_${chave}`} style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", color: "#166534", fontWeight: "bold" }}>{chave}:</label>
                    <p style={{ margin: "3px 0 0 0", color: "#14532d", fontSize: "14px", lineHeight: "1.5" }}>{String(valor)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONTAINER DO MAPA */}
      <div style={{ flex: 1, position: "relative", height: "100%" }}>
        
        {/* CONTAINER SUPERIOR DIREITO */}
        <div className="painel-superior-direito-row">
          
          {/* PAINEL DE FILTROS */}
          <div
            className="item-row-container"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: "12px 14px",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              width: "290px",
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
                🎯 Filtros do Projeto ({projetosFiltrados.length} pins)
              </strong>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                {painelFiltrosAberto ? "➖" : "➕"}
              </span>
            </div>

            {painelFiltrosAberto && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Etapa de Ensino */}
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>
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
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>
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

                {/* Área de Conhecimento */}
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>
                    Área de Conhecimento:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {AREAS_CONHECIMENTO.map((area) => {
                      const ativa = areasSelecionadas.includes(area);
                      return (
                        <button
                          key={area}
                          onClick={() => toggleArea(area)}
                          style={{
                            padding: "3px 8px",
                            fontSize: "10px",
                            borderRadius: "12px",
                            border: "1px solid #b45309",
                            backgroundColor: ativa ? "#b45309" : "#ffffff",
                            color: ativa ? "#ffffff" : "#b45309",
                            cursor: "pointer",
                            fontWeight: ativa ? "bold" : "normal",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Componente Curricular */}
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>
                    Componente Curricular:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {COMPONENTES_CURRICULARES.map((componente) => {
                      const ativa = componentesSelecionados.includes(componente);
                      return (
                        <button
                          key={componente}
                          onClick={() => toggleComponente(componente)}
                          style={{
                            padding: "3px 8px",
                            fontSize: "10px",
                            borderRadius: "12px",
                            border: "1px solid #4338ca",
                            backgroundColor: ativa ? "#4338ca" : "#ffffff",
                            color: ativa ? "#ffffff" : "#4338ca",
                            cursor: "pointer",
                            fontWeight: ativa ? "bold" : "normal",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {componente}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {(etapasSelecionadas.length > 0 || modalidadesSelecionadas.length > 0 || areasSelecionadas.length > 0 || componentesSelecionados.length > 0) && (
                  <button
                    onClick={() => {
                      setEtapasSelecionadas([]);
                      setModalidadesSelecionadas([]);
                      setAreasSelecionadas([]);
                      setComponentesSelecionados([]);
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
                    Limpar filtros de categoria
                  </button>
                )}
              </div>
            )}
          </div>

          {/* LEGENDA DAS DIRECs */}
          <div className="item-row-container">
            <LegendaDirec
              onSelectDirec={handleSelectDirecDaLegenda}
              direcSelecionada={direcSelecionada}
            />
          </div>
        </div>

        {/* Card Flutuante de Seleção Ativa */}
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
                  setFocoMunicipio(null);
                  setMunicipioClicadoNome(null);
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
              {focoMunicipio ? "Aproximação detalhada do Município" : "Exibindo destaque da DIREC"}
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
          <ZoomControl position="bottomleft" />
          <ControladorDeFoco direcSelecionada={direcSelecionada} focoMunicipio={focoMunicipio} projetoSelecionado={projetoSelecionado} />

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='https://carto.com/attributions'>CARTO</a>"
          />

          {geoJsonRN && (
            <GeoJSON
              key={
                (direcSelecionada || "todas") +
                "_" +
                (municipioClicadoNome || "nenhum") +
                "_" +
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

                layer.bindTooltip(nomeMun, {
                  sticky: true,
                  direction: "auto",
                  className: "rotulo-municipio-destacado",
                });

                layer.on({
                  mouseover: (e) => {
                    e.target.setStyle({ weight: 2.5, fillOpacity: 0.95 });
                  },
                  mouseout: (e) => {
                    e.target.setStyle(getEstiloMunicipio(feature));
                  },
                  click: (e) => {
                    const centro = e.target.getBounds().getCenter();
                    const direcAtual = direcRef.current;
                    const munAtual = municipioNomeRef.current;

                    if (munAtual === nomeMun) {
                      setDirecSelecionada(null);
                      setFocoMunicipio(null);
                      setMunicipioInfo(null);
                      setMunicipioClicadoNome(null);
                    } 
                    else if (direcAtual === corDirec && corDirec) {
                      setFocoMunicipio({ lat: centro.lat, lng: centro.lng });
                      setMunicipioClicadoNome(nomeMun);
                      setMunicipioInfo({
                        nome: `Município: ${nomeMun}`,
                        cor: corDirec || "#0284c7",
                      });
                    } 
                    else {
                      setDirecSelecionada(corDirec);
                      setFocoMunicipio(null);
                      setMunicipioClicadoNome(null);
                      setMunicipioInfo({
                        nome: `DIREC: ${corDirec || "Regional"} (${nomeMun})`,
                        cor: corDirec || "#0284c7",
                      });
                    }
                  },
                });
              }}
            />
          )}

          {/* RENDERIZAÇÃO DOS PINS COM COR E CONTORNO PERSONALIZADO */}
          {projetosFiltrados.map((item, index) => {
            const corPin = obterCorDoPin(item.modalidade, item.etapa);
            const iconeCustomizado = criarIconePin(corPin);

            return (
              <Marker 
                key={`${item.lat}-${item.lng}-${index}`} 
                position={[item.lat, item.lng]}
                icon={iconeCustomizado}
                eventHandlers={{
                  click: () => {
                    setProjetoSelecionado(item);
                  },
                }}
              >
                <Popup>
                  <strong>{item.nomeEscola}</strong> <br />
                  {item.municipio && <span>Município: {item.municipio}<br /></span>}
                  {item.modalidade && <span>Modalidade: {item.modalidade}<br /></span>}
                  <small style={{ color: "#0284c7", fontWeight: "bold" }}>Clique para abrir a barra lateral com detalhes</small>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapaProjetos;