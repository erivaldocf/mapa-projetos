import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  ZoomControl,
  useMap,
} from "react-leaflet";
import LegendaDirec from "./LegendaDirec";
import PainelFiltros from "./PainelFiltros";
import DetalhesEscola from "./DetalhesEscola";
import {
  LISTA_DIRECS,
  normalizarTexto,
  obterCorDirec,
  obterCorDoPin,
  criarIconePin,
} from "../../constants/dadosMapa";
import { listarProjetosAprovados } from "../../services/api";

// Componente auxiliar para ajustar o foco do mapa
function ControladorDeFoco({
  direcSelecionada,
  focoMunicipio,
  projetoSelecionado,
}) {
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
      const regionalAtiva = LISTA_DIRECS.find(
        (item) => item.cor === direcSelecionada,
      );
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
  const [carregando, setCarregando] = useState(true);

  // Estados de Seleção, Foco e Filtro
  const [direcSelecionada, setDirecSelecionada] = useState(null);
  const [focoMunicipio, setFocoMunicipio] = useState(null);
  const [municipioClicadoNome, setMunicipioClicadoNome] = useState(null);
  const [municipioInfo, setMunicipioInfo] = useState(null);
  const [etapasSelecionadas, setEtapasSelecionadas] = useState([]);
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState([]);
  const [areasSelecionadas, setAreasSelecionadas] = useState([]);
  const [componentesSelecionados, setComponentesSelecionados] = useState([]);
  const [metodologiaHibridaSelecionada, setMetodologiaHibridaSelecionada] =
    useState(false);
  const [painelFiltrosAberto, setPainelFiltrosAberto] = useState(false);

  const [projetoSelecionado, setProjetoSelecionado] = useState(null);

  const direcRef = useRef(direcSelecionada);
  const municipioNomeRef = useRef(municipioClicadoNome);

  useEffect(() => {
    direcRef.current = direcSelecionada;
    municipioNomeRef.current = municipioClicadoNome;
  }, [direcSelecionada, municipioClicadoNome]);

  const URL_IBGE_RN =
    "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-24-mun.json";

  useEffect(() => {
    // 1. Carrega GeoJSON do RN
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

    // 2. Busca projetos aprovados e escolas cruzados via serviço centralizado
    async function carregarDadosAPI() {
      setCarregando(true);
      try {
        const data = await listarProjetosAprovados();

        const listaFormatada = (data || [])
          .map((projeto) => {
            const escola = projeto.escolas;
            if (!escola) return null;

            const lat = parseFloat(escola.latitude);
            const lng = parseFloat(escola.longitude);

            if (isNaN(lat) || isNaN(lng)) return null;

            return {
              ...projeto,
              nomeEscola: escola.escola || `Escola INEP ${projeto.inep_escola}`,
              municipio: escola.municipio || "",
              corDirec: obterCorDirec(escola.municipio),

              lat: lat,
              lng: lng,

              modalidade: projeto.modalidade || projeto.modalidade_ensino || "",

              // Compatibiliza os nomes das colunas do PostgreSQL com o frontend
              nome_projeto:
                projeto.titulo_projeto ||
                projeto.nome_projeto ||
                projeto.nome ||
                "",
              responsavel:
                projeto.coordenador ||
                projeto.responsavel ||
                projeto.nome_responsavel ||
                "",
              qtd_professores:
                projeto.qtd_professores || projeto.quantidade_professores || "",
              qtd_estudantes:
                projeto.qtd_estudantes || projeto.quantidade_estudantes || "",
              link_projeto: projeto.link_projeto || projeto.link || "",
              descricao_projeto:
                projeto.apresentacao_projeto ||
                projeto.descricao_projeto ||
                projeto.descricao ||
                "",
              oferta_ensino:
                projeto.oferta_ensino || projeto.ofertas_ensino || "",

              objetivo: projeto.objetivo || "",
              metodologia: projeto.metodologia || "",
              tipo_projeto: projeto.tipo_projeto || projeto.tipo || "",
              periodicidade: projeto.periodicidade || "",
              ano_inicio: projeto.ano_inicio || projeto.ano_de_inicio || "",
              ano_fim: projeto.ano_fim || projeto.ano_de_fim || "",
              resultados: projeto.resultados || "",
              ano_serie: projeto.ano_serie || projeto.anos_series || "",
              etapa_ensino: projeto.etapa_ensino || projeto.etapas_ensino || "",
              area:
                projeto.area ||
                projeto.area_conhecimento ||
                projeto.areas_conhecimento ||
                "",

              componente:
                projeto.componente ||
                projeto.componente_curricular ||
                projeto.disciplinas ||
                "",
              habilidades_bncc: projeto.habilidades_bncc || "",
              habilidades_bncc_computacao:
                projeto.habilidades_bncc_computacao || "",

              dadosCompletosEscola: escola,
              dadosCompletosProjeto: projeto,
            };
          })
          .filter(Boolean);

        setProjetosComCoordenadas(listaFormatada);
      } catch (err) {
        console.error("Erro inesperado ao carregar API:", err.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarDadosAPI();
  }, [URL_IBGE_RN]);

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
      prev.includes(etapa) ? prev.filter((e) => e !== etapa) : [...prev, etapa],
    );
  };

  const toggleModalidade = (modalidade) => {
    setModalidadesSelecionadas((prev) =>
      prev.includes(modalidade)
        ? prev.filter((m) => m !== modalidade)
        : [...prev, modalidade],
    );
  };

  const toggleArea = (area) => {
    setAreasSelecionadas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  };

  const toggleComponente = (componente) => {
    setComponentesSelecionados((prev) =>
      prev.includes(componente)
        ? prev.filter((c) => c !== componente)
        : [...prev, componente],
    );
  };

  const toggleMetodologiaHibrida = () => {
    setMetodologiaHibridaSelecionada((prev) => !prev);
  };

  const checarEtapaMatch = (
    etapaProjeto,
    anoSerieProjeto,
    filtroSelecionado,
  ) => {
    // Analisa apenas os campos de etapa e ano/série para evitar falsos positivos com INEP ou telefone
    const textoBase =
      normalizarTexto(etapaProjeto) + " " + normalizarTexto(anoSerieProjeto);

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

  const contemTextoGenerico = (
    valorPlanilha,
    listaFiltros,
    dadosProjetoCompleto,
  ) => {
    if (!listaFiltros || listaFiltros.length === 0) return false;

    const textoPlanilha =
      normalizarTexto(valorPlanilha) +
      " " +
      normalizarTexto(JSON.stringify(dadosProjetoCompleto || {}));

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
        checarEtapaMatch(item.etapa_ensino, item.ano_serie, etapaFiltro),
      );

    const passaModalidade = contemTextoGenerico(
      item.modalidade,
      modalidadesSelecionadas,
      item.dadosCompletosProjeto,
    );

    const passaArea = contemTextoGenerico(
      item.area,
      areasSelecionadas,
      item.dadosCompletosProjeto,
    );

    const passaComponente = contemTextoGenerico(
      item.componente,
      componentesSelecionados,
      item.dadosCompletosProjeto,
    );

    const passaMetodologiaHibrida =
      !metodologiaHibridaSelecionada || item.metodologia_hibrida === true;

    const passaCategoria =
      !temFiltroCategoriaAtivo ||
      passaEtapa ||
      passaModalidade ||
      passaArea ||
      passaComponente;

    const passaDirec = !direcSelecionada || item.corDirec === direcSelecionada;

    const passaMunicipio =
      !municipioClicadoNome ||
      normalizarTexto(item.municipio) === normalizarTexto(municipioClicadoNome);

    return (
      passaCategoria && passaMetodologiaHibrida && passaDirec && passaMunicipio
    );
  });

  return (
    <div className="relative w-full h-screen flex flex-row overflow-hidden">
      {carregando && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-[2000] flex items-center justify-center text-white font-bold text-lg">
          Carregando projetos do servidor...
        </div>
      )}

      {/* BARRA LATERAL ESQUERDA */}
      <DetalhesEscola
        projetoSelecionado={projetoSelecionado}
        onClose={() => setProjetoSelecionado(null)}
      />

      {/* CONTAINER DO MAPA */}
      <div className="flex-1 relative h-full">
        {/* PAINEL SUPERIOR DIREITO */}
        <div className="absolute top-[15px] right-[15px] z-[1000] flex flex-row items-start gap-3.5 font-sans pointer-events-none">
          <div className="flex-none max-h-[calc(100vh-40px)] overflow-y-auto pointer-events-none">
            <div className="pointer-events-auto">
              <PainelFiltros
                painelFiltrosAberto={painelFiltrosAberto}
                setPainelFiltrosAberto={setPainelFiltrosAberto}
                projetosFiltradosCount={projetosFiltrados.length}
                etapasSelecionadas={etapasSelecionadas}
                toggleEtapa={toggleEtapa}
                modalidadesSelecionadas={modalidadesSelecionadas}
                toggleModalidade={toggleModalidade}
                areasSelecionadas={areasSelecionadas}
                toggleArea={toggleArea}
                componentesSelecionados={componentesSelecionados}
                toggleComponente={toggleComponente}
                metodologiaHibridaSelecionada={metodologiaHibridaSelecionada}
                toggleMetodologiaHibrida={toggleMetodologiaHibrida}
                limparFiltros={() => {
                  setEtapasSelecionadas([]);
                  setModalidadesSelecionadas([]);
                  setAreasSelecionadas([]);
                  setComponentesSelecionados([]);
                  setMetodologiaHibridaSelecionada(false);
                }}
              />
            </div>
          </div>

          <div className="flex-none max-h-[calc(100vh-40px)] overflow-y-auto pointer-events-none">
            <div className="pointer-events-auto">
              <LegendaDirec
                onSelectDirec={handleSelectDirecDaLegenda}
                direcSelecionada={direcSelecionada}
              />
            </div>
          </div>
        </div>

        {/* Card Flutuante de Seleção Ativa */}
        {municipioInfo && (
          <div
            className="absolute bottom-7.5 right-3.5 z-[1000] bg-white p-3 px-4 rounded-lg shadow-lg min-w-[220px] font-sans border-l-4"
            style={{ borderLeftColor: municipioInfo.cor }}
          >
            <div className="flex justify-between items-center gap-2">
              <h4 className="m-0 text-slate-800 text-sm font-semibold">
                {municipioInfo.nome}
              </h4>
              <button
                onClick={() => {
                  setDirecSelecionada(null);
                  setFocoMunicipio(null);
                  setMunicipioClicadoNome(null);
                  setMunicipioInfo(null);
                }}
                className="bg-transparent border-none cursor-pointer text-sm text-slate-500 hover:text-slate-800"
              >
                ✖
              </button>
            </div>
            <small className="text-slate-500 block mt-1">
              {focoMunicipio
                ? "Aproximação detalhada do Município"
                : "Exibindo destaque da DIREC"}
            </small>
          </div>
        )}

        {/* MAPA LEAFLET */}
        <MapContainer
          center={[-5.7, -36.5]}
          zoom={8}
          zoomControl={false}
          className="h-full w-full"
        >
          <ZoomControl position="bottomleft" />
          <ControladorDeFoco
            direcSelecionada={direcSelecionada}
            focoMunicipio={focoMunicipio}
            projetoSelecionado={projetoSelecionado}
          />

          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
            maxZoom={16}
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
                    } else if (direcAtual === corDirec && corDirec) {
                      setFocoMunicipio({ lat: centro.lat, lng: centro.lng });
                      setMunicipioClicadoNome(nomeMun);
                      setMunicipioInfo({
                        nome: `Município: ${nomeMun}`,
                        cor: corDirec || "#0284c7",
                      });
                    } else {
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

          {/* PINS DAS ESCOLAS/PROJETOS */}
          {projetosFiltrados.map((item, index) => {
            const corPin = obterCorDoPin(item.modalidade);
            const iconeCustomizado = criarIconePin(corPin);

            return (
              <Marker
                key={`${item.id || index}-${item.lat}-${item.lng}`}
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
                  {item.municipio && (
                    <span>
                      Município: {item.municipio}
                      <br />
                    </span>
                  )}
                  {item.modalidade && (
                    <span>
                      Modalidade: {item.modalidade}
                      <br />
                    </span>
                  )}
                  <small className="text-sky-600 font-bold">
                    Clique para ver os detalhes
                  </small>
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
