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

  // URLs das planilhas e do GeoJSON
  const URL_ESCOLAS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSy5iLlbtrxjoKlraHw-2G30n7RbBjkQg20Kp0xsT6yWZRt810McLpE78xboZqthPkjsUbosc87jajg/pub?gid=882632808&single=true&output=csv";
  const URL_PROJETOS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwGU8n8jWSdux5jqzQjrl4o48U4veCK0FwRxAkr3YrP7pX-CwPNDsuHlWyo02mtbN4_CgUUxsWUsxG/pub?gid=1221393457&single=true&output=csv";
  // URL alternativa do GeoJSON do RN com os nomes dos municípios garantidos
  const URL_IBGE_RN =
    "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-24-mun.json";
  useEffect(() => {
    // 1. Busca os contornos dos municípios (IBGE)
    fetch(URL_IBGE_RN)
      .then((res) => res.json())
      .then((data) => {
        if (
          data &&
          (data.type === "FeatureCollection" || data.type === "Feature")
        ) {
          setGeoJsonRN(data);
        }
      })
      .catch((err) => console.error("Erro ao carregar GeoJSON:", err));

    // 2. Busca e cruza os dados das planilhas (Escolas x Projetos)
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
                escola["INEP"] ||
                escola["inep"] ||
                escola["Código INEP"] ||
                Object.values(escola)[0];
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

  // 1. Helper para remover acentos e padronizar o texto em MAIÚSCULAS
  const normalizarTexto = (texto) => {
    return texto
      ? texto
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase()
          .trim()
      : "";
  };

  // 2. Mapeamento de cada município para a cor da sua DIREC
  // (Você pode ir adicionando as outras 14 DIRECs aqui com suas respectivas cores)
  const CORES_DIREC = {
    // 1ª DIREC - Natal
    NATAL: "#41909A",
    EXTREMOZ: "#41909A",
    MACAIBA: "#41909A",
    "SAO GONCALO DO AMARANTE": "#41909A",

    // 2ª DIREC - Parnamirim
    ARES: "#8D4170",
    "BAIA FORMOSA": "#8D4170",
    CANGUARETAMA: "#8D4170",
    GOIANINHA: "#8D4170",
    "MONTE ALEGRE": "#8D4170",
    "NISIA FLORESTA": "#8D4170",
    PARNAMIRIM: "#8D4170",
    "SAO JOSE DE MIPIBU": "#8D4170",
    "SENADOR GEORGINO AVELINO": "#8D4170",
    "TIBAU DO SUL": "#8D4170",
    "VERA CRUZ": "#8D4170",
    "VILA FLOR": "#8D4170",

    // 3ª DIREC - Nova Cruz
    "JANUARIO CICCO": "#B7DCCA",
    "BOA SAUDE": "#B7DCCA",
    BREJINHO: "#B7DCCA",
    "ESPIRITO SANTO": "#B7DCCA",
    JUNDIA: "#B7DCCA",
    "LAGOA D'ANTA": "#B7DCCA",
    "LAGOA DE PEDRAS": "#B7DCCA",
    "LAGOA SALGADA": "#B7DCCA",
    MONTANHAS: "#B7DCCA",
    "MONTE DAS GAMELEIRAS": "#B7DCCA",
    "NOVA CRUZ": "#B7DCCA",
    "PASSA E FICA": "#B7DCCA",
    PASSAGEM: "#B7DCCA",
    "PEDRO VELHO": "#B7DCCA",
    "SANTO ANTONIO": "#B7DCCA",
    "SAO JOSE DO CAMPESTRE": "#B7DCCA",
    "SERRA DE SAO BENTO": "#B7DCCA",
    SERRINHA: "#B7DCCA",
    VARZEA: "#B7DCCA",

    // 4ª DIREC - São Paulo do Potengi
    BARCELONA: "#98956C",
    "BOM JESUS": "#98956C",
    "CAICARA DO RIO DO VENTO": "#98956C",
    "IELMO MARINHO": "#98956C",
    "LAGOA DE VELHOS": "#98956C",
    RIACHUELO: "#98956C",
    "RUY BARBOSA": "#98956C",
    "SANTA MARIA": "#98956C",
    "SAO PAULO DO POTENGI": "#98956C",
    "SAO PEDRO": "#98956C",
    "SAO TOME": "#98956C",
    "SENADOR ELOI DE SOUZA": "#98956C",
    "SERRA CAIADA": "#98956C",
    "PRESIDENTE JUSCELINO": "#98956C",

    // 5ª DIREC - Ceará-Mirim
    "CEARA-MIRIM": "#FFF99C",
    MAXARANGUAPE: "#FFF99C",
    PUREZA: "#FFF99C",
    "RIO DO FOGO": "#FFF99C",
    "SAO MIGUEL DO GOSTOSO": "#FFF99C",
    TAIPU: "#FFF99C",
    TOUROS: "#FFF99C",

    // 6ª DIREC - Macau
    "ALTO DO RODRIGUES": "#7A7198",
    GALINHOS: "#7A7198",
    GUAMARE: "#7A7198",
    MACAU: "#7A7198",
    PENDENCIAS: "#7A7198",
    "PORTO DO MANGUE": "#7A7198",

    // 7ª DIREC - Santa Cruz
    "CAMPO REDONDO": "#E87878",
    "CORONEL EZEQUIEL": "#E87878",
    JACANA: "#E87878",
    JAPI: "#E87878",
    "LAJES PINTADAS": "#E87878",
    "SANTA CRUZ": "#E87878",
    "SAO BENTO DO TRAIRI": "#E87878",
    "SITIO NOVO": "#E87878",
    TANGARA: "#E87878",

    // 8ª DIREC - Angicos
    "AFONSO BEZERRA": "#97AEBE",
    ANGICOS: "#97AEBE",
    BODO: "#97AEBE",
    "FERNANDO PEDROZA": "#97AEBE",
    LAJES: "#97AEBE",
    "PEDRO AVELINO": "#97AEBE",
    "SANTANA DO MATOS": "#97AEBE",

    // 9ª DIREC - Currais Novos
    ACARI: "#87C127",
    "CARNAUBA DOS DANTAS": "#87C127",
    "CERRO CORA": "#87C127",
    CRUZETA: "#87C127",
    "CURRAIS NOVOS": "#87C127",
    EQUADOR: "#87C127",
    FLORANIA: "#87C127",
    "LAGOA NOVA": "#87C127",
    PARELHAS: "#87C127",
    "SANTANA DO SERIDO": "#87C127",
    "SAO VICENTE": "#87C127",
    "TENENTE LAURENTINO CRUZ": "#87C127",

    // 10ª DIREC - Caicó
    CAICO: "#007CC2",
    IPUEIRA: "#007CC2",
    "JARDIM DE PIRANHAS": "#007CC2",
    "JARDIM DO SERIDO": "#007CC2",
    JUCURUTU: "#007CC2",
    "OURO BRANCO": "#007CC2",
    "SAO FERNANDO": "#007CC2",
    "SAO JOAO DO SABUGI": "#007CC2",
    "SAO JOSE DO SERIDO": "#007CC2",
    "SERRA NEGRA DO NORTE": "#007CC2",
    "TIMBAUBA DOS BATISTAS": "#007CC2",

    // 11ª DIREC - Assú
    ACU: "#DA251D",
    "CAMPO GRANDE": "#DA251D",
    CARNAUBAIS: "#DA251D",
    IPANGUACU: "#DA251D",
    ITAJA: "#DA251D",
    PARAU: "#DA251D",
    "SAO RAFAEL": "#DA251D",
    "TRIUNFO POTIGUAR": "#DA251D",
    "AUGUSTO SEVERO": "#DA251D",

    // 12ª DIREC - Mossoró
    "AREIA BRANCA": "#FFF420",
    BARAUNA: "#FFF420",
    "GOVERNADOR DIX-SEPT ROSADO": "#FFF420",
    GROSSOS: "#FFF420",
    MOSSORO: "#FFF420",
    "SERRA DO MEL": "#FFF420",
    TIBAU: "#FFF420",
    UPANEMA: "#FFF420",

    // 13ª DIREC - Apodi
    APODI: "#E77917",
    CARAUBAS: "#E77917",
    "FELIPE GUERRA": "#E77917",
    ITAU: "#E77917",
    "RODOLFO FERNANDES": "#E77917",
    "SEVERIANO MELO": "#E77917",
    "TABOLEIRO GRANDE": "#E77917",

    // 14ª DIREC - Umarizal
    "ALMINO AFONSO": "#DEDEDC",
    "ANTONIO MARTINS": "#DEDEDC",
    "FRUTUOSO GOMES": "#DEDEDC",
    JANDUIS: "#DEDEDC",
    "JOAO DIAS": "#DEDEDC",
    LUCRECIA: "#DEDEDC",
    MARTINS: "#DEDEDC",
    "MESSIAS TARGINO": "#DEDEDC", //OLHO-D'AGUA DO BORGES
    "OLHO-D'AGUA DO BORGES": "#DEDEDC",
    PATU: "#DEDEDC",
    "RAFAEL GODEIRO": "#DEDEDC",
    "RIACHO DA CRUZ": "#DEDEDC",
    "SERRINHA DOS PINTOS": "#DEDEDC",
    UMARIZAL: "#DEDEDC",
    VICOSA: "#DEDEDC",

    // 15ª DIREC - Pau dos Ferros
    "AGUA NOVA": "#01923F",
    ALEXANDRIA: "#01923F",
    "CORONEL JOAO PESSOA": "#01923F",
    "DOUTOR SEVERIANO": "#01923F",
    ENCANTO: "#01923F",
    "FRANCISCO DANTAS": "#01923F",
    "JOSE DA PENHA": "#01923F",
    "LUIS GOMES": "#01923F",
    "MAJOR SALES": "#01923F",
    "MARCELINO VIEIRA": "#01923F",
    PARANA: "#01923F",
    "PAU DOS FERROS": "#01923F",
    PILOES: "#01923F",
    PORTALEGRE: "#01923F",
    "RAFAEL FERNANDES": "#01923F",
    "RIACHO DE SANTANA": "#01923F",
    "SAO FRANCISCO DO OESTE": "#01923F",
    "SAO MIGUEL": "#01923F",
    "TENENTE ANANIAS": "#01923F",
    "VENHA-VER": "#01923F",

    // 16ª DIREC - João Câmara
    "BENTO FERNANDES": "#485778",
    "CAICARA DO NORTE": "#485778",
    JANDAIRA: "#485778",
    "JARDIM DE ANGICOS": "#485778",
    "JOAO CAMARA": "#485778",
    PARAZINHO: "#485778",
    "PEDRA GRANDE": "#485778",
    "PEDRA PRETA": "#485778",
    "POCO BRANCO": "#485778",
    "SAO BENTO DO NORTE": "#485778",
  };

  // Função para buscar a cor com base no nome do município
  const getEstiloMunicipio = (feature) => {
    // Esse GeoJSON traz os nomes nas propriedades 'name' ou 'description'
    const nomeBruto =
      feature?.properties?.name ||
      feature?.properties?.description ||
      feature?.properties?.nome ||
      "";

    console.log("Nome original:", nomeBruto);
    const nomeLimpo = normalizarTexto(nomeBruto);

    console.log("Nome normalizado:", nomeLimpo);
    const corDirec = CORES_DIREC[nomeLimpo];

    if (corDirec) {
      return {
        color: "#ffffff", // Linha de divisa branca
        weight: 1.2,
        fillColor: corDirec, // Cor da DIREC
        fillOpacity: 0.6, // Opacidade para dar destaque
      };
    }

    // Estilo cinza claro para municípios que ainda não foram adicionados ao CORES_DIREC
    return {
      color: "#d3d3d3",
      weight: 0.8,
      fillColor: "#e9ecef",
      fillOpacity: 0.25,
    };
  };

  // Estilo visual dos municípios
  const estiloMunicipios = {
    color: "#0056b3", // Cor da linha da divisa
    weight: 1, // Espessura da linha
    fillColor: "#0056b3", // Cor do preenchimento
    fillOpacity: 0.05, // Opacidade discreta
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ weight: 2, fillOpacity: 0.2, color: "#003366" });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(estiloMunicipios);
      },
    });
  };

  return (
    // 2. Adicione essa div envoltória com position relative
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* 3. Componente da Legenda */}
      <LegendaDirec />

      <MapContainer
        center={[-5.7, -36.5]}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution="&copy; CARTO &copy; OpenStreetMap"
        />

        {/* Camada GeoJSON */}
        {geoJsonRN && (
          <GeoJSON
            key={JSON.stringify(geoJsonRN.features?.length || "geojson-rn")}
            data={geoJsonRN}
            style={getEstiloMunicipio}
            onEachFeature={(feature, layer) => {
              const nomeMun =
                feature?.properties?.name ||
                feature?.properties?.description ||
                "Município";

              layer.bindTooltip(nomeMun, { sticky: true });

              layer.on({
                mouseover: (e) => {
                  e.target.setStyle({ weight: 2.5, fillOpacity: 0.85 });
                },
                mouseout: (e) => {
                  e.target.setStyle(getEstiloMunicipio(feature));
                },
              });
            }}
          />
        )}

        {/* Marcadores */}
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
