// Lê a URL da API definida no arquivo .env do Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Função auxiliar padronizada para fazer requisições ao backend.
 * @param {string} endpoint - Caminho da rota (ex: "/api/projetos")
 * @param {Object} opcoes - Configurações do fetch (method, body, autenticado)
 */
async function request(
  endpoint,
  { method = "GET", body, autenticado = false } = {},
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (autenticado) {
    const token = localStorage.getItem("token_mapeamento");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const resposta = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Se o token expirou ou foi rejeitado pelo backend, encerra a sessão local
  if (autenticado && (resposta.status === 401 || resposta.status === 403)) {
    localStorage.removeItem("token_mapeamento");
    localStorage.removeItem("usuario_mapeamento");
    window.location.href = "/login";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.error || "Erro ao se comunicar com o servidor.");
  }

  return dados;
}

// ============================================================================
// FUNÇÕES DE SERVIÇO EXPORTADAS PARA AS PÁGINAS
// ============================================================================

/** Autentica o administrador enviando o token do Google */
export function loginComGoogle(idToken) {
  return request("/auth/google", {
    method: "POST",
    body: { idToken },
  });
}

/** Busca lista de escolas (FormPage) */
export function listarEscolas() {
  return request("/api/escolas");
}

/** Busca projetos aprovados para exibir no mapa (MapaProjetos) */
export function listarProjetosAprovados() {
  return request("/api/projetos");
}

/** Cadastra um novo projeto a partir do formulário (Step4) */
export function cadastrarProjeto(dadosProjeto) {
  return request("/api/projetos", {
    method: "POST",
    body: dadosProjeto,
  });
}

/** Busca solicitações pendentes da DIREC do admin logado (AdminPage) */
export function listarProjetosPendentes() {
  return request("/api/admin/projetos/pendentes", {
    autenticado: true,
  });
}

/** Aprova ou recusa uma solicitação de projeto (AdminPage) */
export function atualizarStatusProjeto(id, status) {
  return request(`/api/projetos/${id}/status`, {
    method: "PATCH",
    body: { status },
    autenticado: true,
  });
}
