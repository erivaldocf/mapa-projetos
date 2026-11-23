import L from "leaflet";

// Listas de Opções para os Filtros (alinhadas com formOptions.js)
export const ETAPAS_ENSINO = [
  "Ensino Fundamental (1º ao 5º)",
  "Ensino Fundamental (6º ao 9º)",
  "Ensino Médio",
];

export const MODALIDADES_ENSINO = [
  "Regular",
  "Educação de Jovens e Adultos (EJA)",
  "Educação Profissional e Tecnológica (EPT)",
  "Educação Especial",
  "Educação do Campo, Educação Quilombola ou Educação Indígena",
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
  "Arte",
  "Educação Física",
  "Língua Inglesa",
  "Língua Espanhola",
  "Ensino Religioso",
  "Filosofia",
  "Sociologia",
];

// Mapeamento organizado das 16 DIRECs com cores e coordenadas geográficas das sedes
export const LISTA_DIRECS = [
  { id: "1ª DIREC", sede: "Natal", cor: "#41909A", lat: -5.7944, lng: -35.211 },
  {
    id: "2ª DIREC",
    sede: "Parnamirim",
    cor: "#8D4170",
    lat: -5.9156,
    lng: -35.2628,
  },
  {
    id: "3ª DIREC",
    sede: "Nova Cruz",
    cor: "#B7DCCA",
    lat: -6.4782,
    lng: -35.4344,
  },
  {
    id: "4ª DIREC",
    sede: "São Paulo do Potengi",
    cor: "#98956C",
    lat: -5.8945,
    lng: -35.7634,
  },
  {
    id: "5ª DIREC",
    sede: "Ceará-Mirim",
    cor: "#FFF99C",
    lat: -5.6343,
    lng: -35.4262,
  },
  {
    id: "6ª DIREC",
    sede: "Macau",
    cor: "#7A7198",
    lat: -5.1156,
    lng: -36.6344,
  },
  {
    id: "7ª DIREC",
    sede: "Santa Cruz",
    cor: "#E87878",
    lat: -6.2289,
    lng: -36.0195,
  },
  {
    id: "8ª DIREC",
    sede: "Angicos",
    cor: "#97AEBE",
    lat: -5.6575,
    lng: -36.5222,
  },
  {
    id: "9ª DIREC",
    sede: "Currais Novos",
    cor: "#87C127",
    lat: -6.2608,
    lng: -36.5147,
  },
  {
    id: "10ª DIREC",
    sede: "Caicó",
    cor: "#007CC2",
    lat: -6.4564,
    lng: -37.0978,
  },
  {
    id: "11ª DIREC",
    sede: "Assú",
    cor: "#DA251D",
    lat: -5.5775,
    lng: -36.9136,
  },
  {
    id: "12ª DIREC",
    sede: "Mossoró",
    cor: "#FFF420",
    lat: -5.1881,
    lng: -37.3442,
  },
  {
    id: "13ª DIREC",
    sede: "Apodi",
    cor: "#E77917",
    lat: -5.6617,
    lng: -37.7997,
  },
  {
    id: "14ª DIREC",
    sede: "Umarizal",
    cor: "#DEDEDC",
    lat: -5.9861,
    lng: -37.8136,
  },
  {
    id: "15ª DIREC",
    sede: "Pau dos Ferros",
    cor: "#01923F",
    lat: -6.1108,
    lng: -38.2042,
  },
  {
    id: "16ª DIREC",
    sede: "João Câmara",
    cor: "#485778",
    lat: -5.5375,
    lng: -35.8197,
  },
];

// PALETA DE CORES DAS MODALIDADES
export const CORES_MODALIDADES = {
  EJA: "#10b981", // Verde
  EPT: "#1e40af", // Azul Escuro
  ESPECIAL: "#8b5cf6", // Roxo
  CAMPO: "#d97706", // Laranja/Terra
  INTEGRAL: "#e11d48", // Vermelho/Rosa
  EAD: "#78350f", // Marrom
  PADRAO: "#0284c7", // Azul Padrão
};

// Mapeamento das cores das DIRECs por município
export const CORES_DIREC = {
  NATAL: "#41909A",
  EXTREMOZ: "#41909A",
  MACAIBA: "#41909A",
  SAOGONCALODOAMARANTE: "#41909A",
  ARES: "#8D4170",
  BAIAFORMOSA: "#8D4170",
  CANGUARETAMA: "#8D4170",
  GOIANINHA: "#8D4170",
  MONTEALEGRE: "#8D4170",
  NISIAFLORESTA: "#8D4170",
  PARNAMIRIM: "#8D4170",
  SAOJOSEADEMIPIBU: "#8D4170",
  SAOJOSEDEMIPIBU: "#8D4170",
  SENADORGEORGINOAVELINO: "#8D4170",
  TIBAUDOSUL: "#8D4170",
  VERACRUZ: "#8D4170",
  VILAFLOR: "#8D4170",
  BOASAUDE: "#B7DCCA",
  JANUARIOCICCO: "#B7DCCA",
  BREJINHO: "#B7DCCA",
  ESPIRITOSANTO: "#B7DCCA",
  JUNDIA: "#B7DCCA",
  LAGOADANTA: "#B7DCCA",
  LAGOADEDANTAS: "#B7DCCA",
  LAGOADEPEDRAS: "#B7DCCA",
  LAGOASALGADA: "#B7DCCA",
  MONTANHAS: "#B7DCCA",
  MONTEDASGAMELEIRAS: "#B7DCCA",
  NOVACRUZ: "#B7DCCA",
  PASSAEFICA: "#B7DCCA",
  PASSAGEM: "#B7DCCA",
  PEDROVELHO: "#B7DCCA",
  SANTOANTONIO: "#B7DCCA",
  SAOJOSEDOCAMPESTRE: "#B7DCCA",
  SERRADESAOBENTO: "#B7DCCA",
  SERRINHA: "#B7DCCA",
  VARZEA: "#B7DCCA",
  BARCELONA: "#98956C",
  BOMJESUS: "#98956C",
  CAICARADORIODOVENTO: "#98956C",
  IELMOMARINHO: "#98956C",
  LAGOADEVELHOS: "#98956C",
  RIACHUELO: "#98956C",
  RUYBARBOSA: "#98956C",
  SANTAMARIA: "#98956C",
  SAOPAULODOPOTENGI: "#98956C",
  SAOPEDRO: "#98956C",
  SAOTOME: "#98956C",
  SENADORELOIDESOUZA: "#98956C",
  SERRACAIADA: "#98956C",
  PRESIDENTEJUSCELINO: "#98956C",
  CEARAMIRIM: "#FFF99C",
  MAXARANGUAPE: "#FFF99C",
  PUREZA: "#FFF99C",
  RIODOFOGO: "#FFF99C",
  SAOMIGUELDOGOSTOSO: "#FFF99C",
  TAIPU: "#FFF99C",
  TOUROS: "#FFF99C",
  ALTODORODRIGUES: "#7A7198",
  GALINHOS: "#7A7198",
  GUAMARE: "#7A7198",
  MACAU: "#7A7198",
  PENDENCIAS: "#7A7198",
  PORTODOMANGUE: "#7A7198",
  CAMPOREDONDO: "#E87878",
  CORONELEZEQUIEL: "#E87878",
  JACANA: "#E87878",
  JAPI: "#E87878",
  LAJESPINTADAS: "#E87878",
  SANTACRUZ: "#E87878",
  SAOBENTODOTRAIRI: "#E87878",
  SITIONOVO: "#E87878",
  TANGARA: "#E87878",
  AFONSOBEZERRA: "#97AEBE",
  ANGICOS: "#97AEBE",
  BODO: "#97AEBE",
  BODOBO: "#97AEBE",
  FERNANDOPEDROZA: "#97AEBE",
  LAJES: "#97AEBE",
  PEDROAVELINO: "#97AEBE",
  SANTANADOMATOS: "#97AEBE",
  ACARI: "#87C127",
  CARNAUBADOSDANTAS: "#87C127",
  CERROCORA: "#87C127",
  CRUZETA: "#87C127",
  CURRAISNOVOS: "#87C127",
  EQUADOR: "#87C127",
  FLORANIA: "#87C127",
  LAGOANOVA: "#87C127",
  PARELHAS: "#87C127",
  SANTANADOSERIDO: "#87C127",
  SAOVICENTE: "#87C127",
  TENENTELAURENTINOCRUZ: "#87C127",
  CAICO: "#007CC2",
  IPUEIRA: "#007CC2",
  JARDIMDEPIRANHAS: "#007CC2",
  JARDIMDOSERIDO: "#007CC2",
  JUCURUTU: "#007CC2",
  OUROBRANCO: "#007CC2",
  SAOFERNANDO: "#007CC2",
  SAOJOAODOSABUGI: "#007CC2",
  SAOJOSEDADOSERIDO: "#007CC2",
  SAOJOSEDOSERIDO: "#007CC2",
  SERRANEGRADONORTE: "#007CC2",
  TIMBAUBADOSBATISTAS: "#007CC2",
  ACU: "#DA251D",
  ASSU: "#DA251D",
  CAMPOGRANDE: "#DA251D",
  CARNAUBAIS: "#DA251D",
  IPANGUACU: "#DA251D",
  ITAJA: "#DA251D",
  PARAU: "#DA251D",
  SAORAFAEL: "#DA251D",
  TRIUNFOPOTIGUAR: "#DA251D",
  AUGUSTOSEVERO: "#DA251D",
  AREIABRANCA: "#FFF420",
  BARAUNA: "#FFF420",
  GOVERNADORDIXSEPTROSADO: "#FFF420",
  GROSSOS: "#FFF420",
  MOSSORO: "#FFF420",
  SERRADOMEL: "#FFF420",
  TIBAU: "#FFF420",
  UPANEMA: "#FFF420",
  APODI: "#E77917",
  CARAUBAS: "#E77917",
  FELIPEGUERRA: "#E77917",
  ITAU: "#E77917",
  RODOLFOFERNANDES: "#E77917",
  SEVERIANOMELO: "#E77917",
  TABOLEIROGRANDE: "#E77917",
  ALMINOAFONSO: "#DEDEDC",
  ANTONIOMARTINS: "#DEDEDC",
  FRUTUOSOGOMES: "#DEDEDC",
  JANDUIS: "#DEDEDC",
  JOAODIAS: "#DEDEDC",
  LUCRECIA: "#DEDEDC",
  MARTINS: "#DEDEDC",
  MESSIASTARGINO: "#DEDEDC",
  OLHODAGUADOBORGES: "#DEDEDC",
  PATU: "#DEDEDC",
  RAFAELGODEIRO: "#DEDEDC",
  RIACHODACRUZ: "#DEDEDC",
  SERRINHADOSPINTOS: "#DEDEDC",
  UMARIZAL: "#DEDEDC",
  VICOSA: "#DEDEDC",
  AGUANOVA: "#01923F",
  ALEXANDRIA: "#01923F",
  CORONELJOAOPESSOA: "#01923F",
  DOUTORSEVERIANO: "#01923F",
  ENCANTO: "#01923F",
  FRANCISCODANTAS: "#01923F",
  JOSEDAPENHA: "#01923F",
  LUISGOMES: "#01923F",
  MAJORSALES: "#01923F",
  MARCELINOVIEIRA: "#01923F",
  PARANA: "#01923F",
  PAUDOSFERROS: "#01923F",
  PILOES: "#01923F",
  PORTALEGRE: "#01923F",
  RAFAELFERNANDES: "#01923F",
  RIACHODESANTANA: "#01923F",
  SAOFRANCISCODOOESTE: "#01923F",
  SAOMIGUEL: "#01923F",
  TENENTEANANIAS: "#01923F",
  VENHAVER: "#01923F",
  BENTOFERNANDES: "#485778",
  CAICARADONORTE: "#485778",
  JANDAIRA: "#485778",
  JARDIMDEANGICOS: "#485778",
  JOAOCAMARA: "#485778",
  PARAZINHO: "#485778",
  PEDRAGRANDE: "#485778",
  PEDRAPRETA: "#485778",
  POCOBRANCO: "#485778",
  SAOBENTODONORTE: "#485778",
};

// Funções Utilitárias
export const normalizarTexto = (texto) => {
  return texto
    ? String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .trim()
    : "";
};

export const obterCorDirec = (nomeBruto) => {
  const nomeLimpo = normalizarTexto(nomeBruto);
  return CORES_DIREC[nomeLimpo] || null;
};

export const obterCorDoPin = (modalidade) => {
  const modNorm = normalizarTexto(modalidade);

  if (modNorm.includes("EJA") || modNorm.includes("JOVENS"))
    return CORES_MODALIDADES.EJA;
  if (modNorm.includes("EPT") || modNorm.includes("PROFISSIONAL"))
    return CORES_MODALIDADES.EPT;
  if (modNorm.includes("ESPECIAL")) return CORES_MODALIDADES.ESPECIAL;
  if (
    modNorm.includes("CAMPO") ||
    modNorm.includes("INDIGENA") ||
    modNorm.includes("QUILOMBOLA")
  )
    return CORES_MODALIDADES.CAMPO;
  if (modNorm.includes("INTEGRAL")) return CORES_MODALIDADES.INTEGRAL;
  if (modNorm.includes("EAD") || modNorm.includes("DISTANCIA"))
    return CORES_MODALIDADES.EAD;

  return CORES_MODALIDADES.PADRAO;
};

export const criarIconePin = (corPreenchimento) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
      </filter>
      <g filter="url(#shadow)">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="#ffffff"/>
        <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 8 10.5 21.2 10.5 21.2S22.5 20 22.5 12c0-5.8-4.7-10.5-10.5-10.5z" fill="${corPreenchimento}"/>
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
