import React, { useState } from "react";
import { TIPOS_PRODUCAO } from "../../constants/formOptions";

export default function Step3({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) {
  const [erroAnoFim, setErroAnoFim] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação: Garante que ano_fim não seja anterior a ano_inicio
    if (
      formData.ano_inicio &&
      formData.ano_fim &&
      Number(formData.ano_fim) < Number(formData.ano_inicio)
    ) {
      setErroAnoFim("O Ano de Fim não pode ser anterior ao Ano de Início.");
      return;
    }

    setErroAnoFim("");
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-[#122318] border-b-2 border-[#8fb99f] pb-2">
        Informações Específicas do Projeto
      </h2>

      {/* Título do Projeto */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Título do Projeto / Atividade Científica / Evento Científico
        </label>
        <input
          type="text"
          value={formData.titulo_projeto || ""}
          onChange={(e) => updateFormData({ titulo_projeto: e.target.value })}
          placeholder="Digite o título do projeto"
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
        />
      </div>

      {/* Coordenador(a) do projeto */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Coordenador(a) do projeto
        </label>
        <input
          type="text"
          value={formData.coordenador || ""}
          onChange={(e) => updateFormData({ coordenador: e.target.value })}
          placeholder="Nome do coordenador(a) responsável"
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
        />
      </div>

      {/* Colaboradores do projeto */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Colaboradores do projeto (Opcional)
        </label>
        <input
          type="text"
          value={formData.colaboradores || ""}
          onChange={(e) => updateFormData({ colaboradores: e.target.value })}
          placeholder="Nomes dos colaboradores"
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
        />
      </div>

      {/* Quantitativo de Estudantes Envolvidos */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Quantitativo de Estudantes Envolvidos
        </label>
        <input
          type="number"
          min="1"
          value={formData.qtd_estudantes || ""}
          onChange={(e) => updateFormData({ qtd_estudantes: e.target.value })}
          placeholder="Ex: 25"
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
        />
      </div>

      {/* Quantitativo de Professores Envolvidos */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Quantitativo de Professores Envolvidos
        </label>
        <input
          type="number"
          min="1"
          value={formData.qtd_professores || ""}
          onChange={(e) => updateFormData({ qtd_professores: e.target.value })}
          placeholder="Ex: 25"
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
        />
      </div>

      {/* Apresentação do Projeto */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Apresentação do Projeto
        </label>
        <textarea
          rows={4}
          value={formData.apresentacao_projeto || ""}
          onChange={(e) =>
            updateFormData({ apresentacao_projeto: e.target.value })
          }
          placeholder="Descreva de forma clara a proposta do projeto..."
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
        />
      </div>

      {/* Palavras-chave */}

      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Palavras-chave
        </label>
        <input
          type="text"
          value={formData.palavras_chave || ""}
          onChange={(e) => updateFormData({ palavras_chave: e.target.value })}
          placeholder="Ex: robótica, ensino, pesquisa"
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
        />
      </div>

      {/* Objetivo */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Objetivos Geral e Específicos
        </label>
        <textarea
          rows={3}
          value={formData.objetivo || ""}
          onChange={(e) => updateFormData({ objetivo: e.target.value })}
          placeholder="Descreva o objetivo principal do projeto..."
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
        />
      </div>

      {/* Metodologia */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Metodologia
        </label>
        <textarea
          rows={3}
          value={formData.metodologia || ""}
          onChange={(e) => updateFormData({ metodologia: e.target.value })}
          placeholder="Ex: Aulas práticas, oficinas, pesquisa de campo, uso de kits de robótica..."
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
        />
      </div>

      {/* Metodologia Híbrida */}
      <div className="flex items-center bg-[#a8cbb4] p-3 rounded-lg border-2 border-[#315740] shadow-sm">
        <input
          type="checkbox"
          id="metodologia_hibrida"
          checked={formData.metodologia_hibrida || false}
          onChange={(e) =>
            updateFormData({ metodologia_hibrida: e.target.checked })
          }
          className="w-4 h-4 text-[#244231] bg-white border-2 border-[#315740] rounded focus:ring-[#244231] cursor-pointer"
        />
        <label
          htmlFor="metodologia_hibrida"
          className="ml-2.5 text-sm font-bold text-[#143021] cursor-pointer select-none"
        >
          Utiliza metodologia híbrida (presencial e online)
        </label>
      </div>

      {/* 1. Práticas Inclusivas ou de Acessibilidade */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#143021]">
          O projeto contempla práticas inclusivas ou de acessibilidade?
        </label>
        <div className="flex items-center space-x-6 border-2 border-[#315740] p-3 rounded-lg bg-[#a8cbb4] shadow-sm">
          <label className="flex items-center space-x-2 text-sm text-[#143021] font-bold cursor-pointer">
            <input
              type="radio"
              name="praticas_inclusivas"
              value="Sim"
              checked={formData.praticas_inclusivas === "Sim"}
              onChange={() => updateFormData({ praticas_inclusivas: "Sim" })}
              required
              className="w-4 h-4 text-[#244231] bg-white border-2 border-[#315740] focus:ring-[#244231] cursor-pointer"
            />
            <span>Sim</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-[#143021] font-bold cursor-pointer">
            <input
              type="radio"
              name="praticas_inclusivas"
              value="Não"
              checked={formData.praticas_inclusivas === "Não"}
              onChange={() =>
                updateFormData({
                  praticas_inclusivas: "Não",
                  detalhe_praticas_inclusivas: "",
                })
              }
              required
              className="w-4 h-4 text-[#244231] bg-white border-2 border-[#315740] focus:ring-[#244231] cursor-pointer"
            />
            <span>Não</span>
          </label>
        </div>

        {formData.praticas_inclusivas === "Sim" && (
          <input
            type="text"
            value={formData.detalhe_praticas_inclusivas || ""}
            onChange={(e) =>
              updateFormData({ detalhe_praticas_inclusivas: e.target.value })
            }
            placeholder="Qual(is) prática(s) inclusiva(s) ou de acessibilidade?"
            required
            className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm mt-2"
          />
        )}
      </div>

      {/* Situação do Projeto */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Situação do Projeto
        </label>
        <div className="flex items-center space-x-6 border-2 border-[#315740] p-3 rounded-lg bg-[#a8cbb4] shadow-sm">
          {["Em Andamento", "Concluído"].map((situacao) => (
            <label
              key={situacao}
              className="flex items-center space-x-2 text-sm text-[#143021] font-bold cursor-pointer"
            >
              <input
                type="radio"
                name="situacao_projeto"
                value={situacao}
                checked={formData.situacao_projeto === situacao}
                onChange={() => updateFormData({ situacao_projeto: situacao })}
                required
                className="w-4 h-4 text-[#244231] bg-white border-2 border-[#315740] focus:ring-[#244231] cursor-pointer"
              />
              <span>{situacao}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Parceria ou Cooperação Interinstitucional */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#143021]">
          O projeto possui parceria ou cooperação interinstitucional?
        </label>
        <div className="flex items-center space-x-6 border-2 border-[#315740] p-3 rounded-lg bg-[#a8cbb4] shadow-sm">
          <label className="flex items-center space-x-2 text-sm text-[#143021] font-bold cursor-pointer">
            <input
              type="radio"
              name="possuir_parceria"
              value="Sim"
              checked={formData.possuir_parceria === "Sim"}
              onChange={() => updateFormData({ possuir_parceria: "Sim" })}
              required
              className="w-4 h-4 text-[#244231] bg-white border-2 border-[#315740] focus:ring-[#244231] cursor-pointer"
            />
            <span>Sim</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-[#143021] font-bold cursor-pointer">
            <input
              type="radio"
              name="possuir_parceria"
              value="Não"
              checked={formData.possuir_parceria === "Não"}
              onChange={() =>
                updateFormData({
                  possuir_parceria: "Não",
                  detalhe_parceria: "",
                })
              }
              required
              className="w-4 h-4 text-[#244231] bg-white border-2 border-[#315740] focus:ring-[#244231] cursor-pointer"
            />
            <span>Não</span>
          </label>
        </div>

        {formData.possuir_parceria === "Sim" && (
          <input
            type="text"
            value={formData.detalhe_parceria || ""}
            onChange={(e) =>
              updateFormData({ detalhe_parceria: e.target.value })
            }
            placeholder="Informe qual(is) instituição(ões) parceira(s)"
            required
            className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm mt-2"
          />
        )}
      </div>

      {/* Financiamento */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#143021]">
          O projeto possui financiamento?
        </label>
        <div className="flex items-center space-x-6 border-2 border-[#315740] p-3 rounded-lg bg-[#a8cbb4] shadow-sm">
          <label className="flex items-center space-x-2 text-sm text-[#143021] font-bold cursor-pointer">
            <input
              type="radio"
              name="possuir_financiamento"
              value="Sim"
              checked={formData.possuir_financiamento === "Sim"}
              onChange={() => updateFormData({ possuir_financiamento: "Sim" })}
              required
              className="w-4 h-4 text-[#244231] bg-white border-2 border-[#315740] focus:ring-[#244231] cursor-pointer"
            />
            <span>Sim</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-[#143021] font-bold cursor-pointer">
            <input
              type="radio"
              name="possuir_financiamento"
              value="Não"
              checked={formData.possuir_financiamento === "Não"}
              onChange={() =>
                updateFormData({
                  possuir_financiamento: "Não",
                  detalhe_financiamento: "",
                })
              }
              required
              className="w-4 h-4 text-[#244231] bg-white border-2 border-[#315740] focus:ring-[#244231] cursor-pointer"
            />
            <span>Não</span>
          </label>
        </div>

        {formData.possuir_financiamento === "Sim" && (
          <input
            type="text"
            value={formData.detalhe_financiamento || ""}
            onChange={(e) =>
              updateFormData({ detalhe_financiamento: e.target.value })
            }
            placeholder="Qual a fonte / órgão de financiamento?"
            required
            className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm mt-2"
          />
        )}
      </div>

      {/* Produção Acadêmica / Científica */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#143021]">
          O projeto possui alguma produção?
        </label>
        <div className="flex items-center space-x-6 border-2 border-[#315740] p-3 rounded-lg bg-[#a8cbb4] shadow-sm">
          <label className="flex items-center space-x-2 text-sm text-[#143021] font-bold cursor-pointer">
            <input
              type="radio"
              name="possuir_producao"
              value="Sim"
              checked={formData.possuir_producao === "Sim"}
              onChange={() => updateFormData({ possuir_producao: "Sim" })}
              required
              className="w-4 h-4 text-[#244231] bg-white border-2 border-[#315740] focus:ring-[#244231] cursor-pointer"
            />
            <span>Sim</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-[#143021] font-bold cursor-pointer">
            <input
              type="radio"
              name="possuir_producao"
              value="Não"
              checked={formData.possuir_producao === "Não"}
              onChange={() =>
                updateFormData({
                  possuir_producao: "Não",
                  producao_titulo: "",
                  producao_ano: "",
                  producao_tipo: "",
                })
              }
              required
              className="w-4 h-4 text-[#244231] bg-white border-2 border-[#315740] focus:ring-[#244231] cursor-pointer"
            />
            <span>Não</span>
          </label>
        </div>

        {/* Sub-campos da Produção caso "Sim" */}
        {formData.possuir_producao === "Sim" && (
          <div className="p-4 border-2 border-[#315740] rounded-lg bg-[#d9eadf] space-y-4 mt-2">
            <div>
              <label className="block text-sm font-bold text-[#143021] mb-1">
                Título da Produção
              </label>
              <input
                type="text"
                value={formData.producao_titulo || ""}
                onChange={(e) =>
                  updateFormData({ producao_titulo: e.target.value })
                }
                placeholder="Digite o título da produção..."
                required
                className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] bg-white text-gray-900 font-semibold text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#143021] mb-1">
                  Ano da Produção
                </label>
                <input
                  type="number"
                  min="2000"
                  max="2030"
                  value={formData.producao_ano || ""}
                  onChange={(e) =>
                    updateFormData({ producao_ano: e.target.value })
                  }
                  placeholder="Ex: 2024"
                  required
                  className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] bg-white text-gray-900 font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#143021] mb-1">
                  Tipo da Produção
                </label>
                <select
                  value={formData.producao_tipo || ""}
                  onChange={(e) =>
                    updateFormData({ producao_tipo: e.target.value })
                  }
                  required
                  className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] bg-white text-gray-900 font-semibold text-sm"
                >
                  <option value="">Selecione um tipo...</option>
                  {TIPOS_PRODUCAO.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resultados Alcançados */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Resultados Esperados ou Alcançados pelo Projeto
        </label>
        <textarea
          rows={4}
          value={formData.resultados || ""}
          onChange={(e) => updateFormData({ resultados: e.target.value })}
          placeholder="Descreva os principais impactos e conquistas observados nos estudantes..."
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
        />
      </div>

      {/* Datas e Periodicidade em Grid de 3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ano de Início */}
        <div>
          <label className="block text-sm font-bold text-[#143021] mb-1.5">
            Ano de Início
          </label>
          <input
            type="number"
            min="2000"
            max="2030"
            value={formData.ano_inicio || ""}
            onChange={(e) => {
              setErroAnoFim("");
              updateFormData({ ano_inicio: e.target.value });
            }}
            placeholder="Ex: 2024"
            required
            className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
          />
        </div>

        {/* Ano de Fim */}
        <div>
          <label className="block text-sm font-bold text-[#143021] mb-1.5">
            Ano de Fim{" "}
            <span className="text-gray-700 font-normal text-xs">
              (Opcional)
            </span>
          </label>
          <input
            type="number"
            min="2000"
            max="2030"
            value={formData.ano_fim || ""}
            onChange={(e) => {
              setErroAnoFim("");
              updateFormData({ ano_fim: e.target.value });
            }}
            placeholder="Ex: 2025"
            className={`w-full p-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm ${
              erroAnoFim ? "border-red-600" : "border-[#315740]"
            }`}
          />
          {erroAnoFim && (
            <p className="mt-1 text-sm font-bold text-red-700">{erroAnoFim}</p>
          )}
        </div>

        {/* Periodicidade */}
        <div>
          <label className="block text-sm font-bold text-[#143021] mb-1.5">
            Periodicidade das Atividades
          </label>
          <input
            type="text"
            value={formData.periodicidade || ""}
            onChange={(e) => updateFormData({ periodicidade: e.target.value })}
            placeholder="Ex: Semanal, Quinzenal, Mensal"
            required
            className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
          />
        </div>
      </div>

      {/* Botões de Navegação */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2.5 border-2 border-[#315740] bg-[#eef5f1] text-[#143021] font-bold rounded-lg hover:bg-[#dcefe4] transition-all cursor-pointer shadow-sm"
        >
          ← Voltar
        </button>
        <button
          type="submit"
          className="px-7 py-2.5 bg-[#244231] text-white font-bold rounded-lg hover:bg-[#162e21] focus:ring-4 focus:ring-[#97bfa7] transition-all shadow-md cursor-pointer"
        >
          Próximo →
        </button>
      </div>
    </form>
  );
}
