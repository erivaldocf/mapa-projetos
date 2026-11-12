import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Componente AdminPage
 * Exibe as solicitações de projetos pendentes e permite aprovar ou recusar.
 */
export default function AdminPage() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null); // Projeto exibido no Modal
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // Carrega informações do usuário logado e busca as solicitações pendentes
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario_mapeamento");
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    buscarSolicitacoesPendentes();
  }, []);

  // Busca lista de solicitações pendentes do backend enviando o Token JWT
  const buscarSolicitacoesPendentes = async () => {
    setCarregando(true);
    try {
      const token = localStorage.getItem("token_mapeamento");

      const resposta = await fetch(
        "http://localhost:3001/api/admin/projetos/pendentes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Passa o token no cabeçalho para o backend filtrar a DIREC
          },
        },
      );

      if (resposta.ok) {
        const dados = await resposta.json();
        setSolicitacoes(dados);
      } else {
        console.error("Erro ao carregar solicitações:", resposta.statusText);
      }
    } catch (erro) {
      console.error("Erro ao carregar solicitações:", erro);
    } finally {
      setCarregando(false);
    }
  };

  // Atualiza o status do projeto para 'aprovado' ou 'recusado'
  const handleAlterarStatus = async (id, novoStatus) => {
    try {
      const token = localStorage.getItem("token_mapeamento");

      const resposta = await fetch(
        `http://localhost:3001/api/projetos/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Autentica a ação no backend
          },
          body: JSON.stringify({ status: novoStatus }),
        },
      );

      if (resposta.ok) {
        // Fecha o modal e recarrega a lista
        setProjetoSelecionado(null);
        buscarSolicitacoesPendentes();
      } else {
        const erroDados = await resposta.json();
        alert(erroDados.error || "Erro ao atualizar o status do projeto.");
      }
    } catch (erro) {
      console.error("Erro ao enviar alteração:", erro);
    }
  };

  // Encerra a sessão do administrador
  const handleLogout = () => {
    localStorage.removeItem("token_mapeamento");
    localStorage.removeItem("usuario_mapeamento");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Barra de Navegação do Administrador */}
      <header className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <h1 className="font-bold text-lg leading-tight">
              Painel de Administração
            </h1>
            <p className="text-xs text-slate-400">
              Gestão de Solicitações de Mapeamento
            </p>
          </div>
        </div>

        {/* Perfil do Administrador e Botão Sair */}
        <div className="flex items-center gap-4">
          {usuario && (
            <div className="flex items-center gap-3 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              {usuario.foto ? (
                <img
                  src={usuario.foto}
                  alt="Perfil"
                  className="w-7 h-7 rounded-full"
                />
              ) : (
                <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {usuario.nome?.charAt(0)}
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200">
                  {usuario.nome}
                </span>
                {usuario.direc && (
                  <span className="text-[10px] text-indigo-400 font-medium">
                    {usuario.direc}
                  </span>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="text-xs bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold transition"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 max-w-6xl w-full mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Solicitações Pendentes
            </h2>
            <p className="text-slate-500 text-sm">
              Análise e aprovação de novos projetos cadastrados.
            </p>
          </div>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
            {solicitacoes.length} pendente(s)
          </span>
        </div>

        {/* Tabela de Solicitações */}
        {carregando ? (
          <p className="text-center py-12 text-slate-500 text-sm animate-pulse">
            Carregando solicitações...
          </p>
        ) : solicitacoes.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center space-y-2 border border-slate-200">
            <span className="text-4xl">🎉</span>
            <h3 className="font-bold text-slate-700 mt-5">
              Nenhuma solicitação pendente
            </h3>
            <p className="text-xs text-slate-500">
              Todos os projetos enviados foram analisados.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                  <th className="p-4">Título do Projeto</th>
                  <th className="p-4">Escola / Município</th>
                  <th className="p-4">Coordenador</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {solicitacoes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-semibold text-slate-800">
                      {item.titulo_projeto}
                    </td>
                    <td className="p-4 text-slate-600">
                      {item.escola_nome || item.inep_escola} <br />
                      <span className="text-xs text-slate-400">
                        {item.escola_municipio} ({item.escola_direc})
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{item.coordenador}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setProjetoSelecionado(item)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODAL DE DETALHES DA SOLICITAÇÃO */}
      {projetoSelecionado && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            {/* Cabeçalho do Modal */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Solicitação #{projetoSelecionado.id}
                </span>
                <h3 className="text-xl font-bold">
                  {projetoSelecionado.titulo_projeto}
                </h3>
              </div>
              <button
                onClick={() => setProjetoSelecionado(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Corpo com Informações do Projeto */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <h1 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
                Informações da Escola
              </h1>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <strong className="block text-slate-500 uppercase">
                    Gestor da Escola:
                  </strong>
                  <span>{projetoSelecionado.nome_gestor}</span>
                </div>
                <div>
                  <strong className="block text-slate-500 uppercase">
                    E-mail Institucional:
                  </strong>
                  <span>{projetoSelecionado.email_institucional}</span>
                </div>
                <div>
                  <strong className="block text-slate-500 uppercase">
                    Telefone:
                  </strong>
                  <span>{projetoSelecionado.telefone}</span>
                </div>
                <div>
                  <strong className="block text-slate-500 uppercase">
                    Coordenador do Projeto:
                  </strong>
                  <span>{projetoSelecionado.coordenador}</span>
                </div>
              </div>

              <h1 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
                Informações do Projeto
              </h1>
              <div>
                <strong className="block text-slate-500 uppercase mb-1">
                  Apresentação do Projeto:
                </strong>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600">
                  {projetoSelecionado.apresentacao_projeto ||
                    "Sem descrição fornecida."}
                </p>
              </div>
              <div>
                <strong className="block text-slate-500 uppercase mb-1">
                  Objetivo do Projeto:
                </strong>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600">
                  {projetoSelecionado.objetivo || "Sem objetivo fornecido."}
                </p>
              </div>
              <div>
                <strong className="block text-slate-500 uppercase mb-1">
                  Metodologia do Projeto:
                </strong>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600">
                  {projetoSelecionado.metodologia ||
                    "Sem metodologia fornecida."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="block text-slate-500 uppercase">
                    Etapa / Oferta:
                  </strong>
                  <span>
                    {projetoSelecionado.etapa_ensino} -{" "}
                    {projetoSelecionado.oferta_ensino}
                  </span>
                </div>
                <div>
                  <strong className="block text-slate-500 uppercase">
                    Estudantes Impactados:
                  </strong>
                  <span>{projetoSelecionado.qtd_estudantes || 0} alunos</span>
                </div>
              </div>
            </div>

            {/* Rodapé do Modal com Botões de Ação */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() =>
                  handleAlterarStatus(projetoSelecionado.id, "recusado")
                }
                className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                Recusar
              </button>

              <button
                onClick={() =>
                  handleAlterarStatus(projetoSelecionado.id, "aprovado")
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md"
              >
                ✓ Aceitar (Virar PIN no Mapa)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
