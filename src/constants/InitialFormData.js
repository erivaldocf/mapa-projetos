/**
 * Estado inicial padronizado para o formulário de cadastro de projetos.
 */
export const INITIAL_FORM_DATA = {
  // Step 1: Identificação da Escola e da Gestão

  direc: "",
  municipio: "",
  inep_escola: "",
  nome_escola: "",
  email_institucional: "",
  nome_gestor: "",
  telefone: "",

  // Step 2: Informações Iniciais do Projeto

  modalidade_ensino: [],
  etapa_ensino: [],
  ano_serie: [],
  jornada_escolar: "",
  turno_escolar: "",
  oferta_ensino: [],
  disciplinas: [],
  areas_conhecimento: [],
  temas_transversais: [],
  habilidades_bncc: [],
  eixos_bncc_computacao: [],
  habilidades_bncc_computacao: [],

  // Step 3: Informações Específicas do Projeto

  titulo_projeto: "",
  coordenador: "",
  colaboradores: "",
  qtd_estudantes: "",
  qtd_professores: "",
  apresentacao_projeto: "",
  palavras_chave: "",
  objetivo: "",
  metodologia: "",
  metodologia_hibrida: false,
  praticas_inclusivas: "",
  detalhe_praticas_inclusivas: "",
  situacao_projeto: "",
  possuir_parceria: "",
  detalhe_parceria: "",
  possuir_financiamento: "",
  detalhe_financiamento: "",
  possuir_producao: "",
  producao_titulo: "",
  producao_ano: "",
  producao_tipo: "",
  resultados: "",
  ano_inicio: "",
  ano_fim: "",
  periodicidade: "",

  // Step 4: Finalização e LGPD

  concorda_lgpd: false,
  link_projeto: "",
};
