import React, { useState } from "react";

export default function Step4({
  formData,
  updateFormData,
  prevStep,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [erroMsg, setErroMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.concorda_lgpd) {
      alert(
        "Você precisa declarar o consentimento da LGPD e ECA Digital para enviar.",
      );
      return;
    }

    setLoading(true);
    setErroMsg("");

    const arrayParaString = (valor) =>
      Array.isArray(valor) ? valor.join(", ") : valor || "";

    try {
      const payload = {
        inep_escola: Number(formData.inep_escola),
        nome_gestor: formData.nome_gestor || "",
        email_institucional: formData.email_institucional || "",
        telefone: formData.telefone || "",

        modalidade_ensino: arrayParaString(formData.modalidade_ensino),
        etapa_ensino: arrayParaString(formData.etapa_ensino),
        ano_serie: arrayParaString(formData.ano_serie),
        jornada_escolar: formData.jornada_escolar || "",
        turno_escolar: formData.turno_escolar || "",
        oferta_ensino: arrayParaString(formData.oferta_ensino),
        disciplinas: arrayParaString(formData.disciplinas),
        areas_conhecimento: arrayParaString(formData.areas_conhecimento),
        temas_transversais: arrayParaString(formData.temas_transversais),
        habilidades_bncc: arrayParaString(formData.habilidades_bncc),
        eixos_bncc_computacao: arrayParaString(formData.eixos_bncc_computacao),
        habilidades_bncc_computacao: arrayParaString(
          formData.habilidades_bncc_computacao,
        ),

        titulo_projeto: formData.titulo_projeto || "",
        coordenador: formData.coordenador || "",
        colaboradores: formData.colaboradores || "",
        qtd_estudantes: Number(formData.qtd_estudantes) || 0,
        qtd_professores: Number(formData.qtd_professores) || 0,
        apresentacao_projeto: formData.apresentacao_projeto || "",
        objetivo: formData.objetivo || "",
        metodologia: formData.metodologia || "",
        metodologia_hibrida: Boolean(formData.metodologia_hibrida),
        praticas_inclusivas: formData.praticas_inclusivas || "",
        detalhe_praticas_inclusivas: formData.detalhe_praticas_inclusivas || "",
        situacao_projeto: formData.situacao_projeto || "",
        possuir_parceria: formData.possuir_parceria || "",
        detalhe_parceria: formData.detalhe_parceria || "",
        possuir_financiamento: formData.possuir_financiamento || "",
        detalhe_financiamento: formData.detalhe_financiamento || "",
        possuir_producao: formData.possuir_producao || "",
        producao_titulo: formData.producao_titulo || "",
        producao_ano: formData.producao_ano
          ? Number(formData.producao_ano)
          : null,
        producao_tipo: formData.producao_tipo || "",
        resultados: formData.resultados || "",
        ano_inicio: Number(formData.ano_inicio) || new Date().getFullYear(),
        ano_fim: formData.ano_fim ? Number(formData.ano_fim) : null,
        periodicidade: formData.periodicidade || "",

        concorda_lgpd: Boolean(formData.concorda_lgpd),
        link_projeto: formData.link_projeto || "",
      };

      const response = await fetch("http://localhost:3001/api/projetos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Ocorreu um erro ao enviar os dados.",
        );
      }

      onSuccess();
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
      setErroMsg(err.message || "Ocorreu um erro ao enviar os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-[#122318] border-b-2 border-[#8fb99f] pb-2">
        Link do Projeto
      </h2>

      {erroMsg && (
        <div className="p-3 bg-red-100 border-2 border-red-500 text-red-900 text-sm rounded-lg font-bold">
          {erroMsg}
        </div>
      )}

      {/* Aviso LGPD / ECA Digital */}
      <div className="bg-[#fef9c3] border-2 border-[#d97706] rounded-xl p-4 space-y-3 text-amber-950 shadow-md">
        <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
          ⚠️ Aviso Importante sobre Uso de Imagens (LGPD e ECA Digital)
        </h3>
        <p className="text-xs text-amber-900 font-semibold leading-relaxed">
          Certifique-se de que todas as fotos enviadas possuem os devidos Termos
          de Autorização de Uso de Imagem assinados pelos pais ou responsáveis
          legais (no caso de menores de idade), em conformidade com a Lei Geral
          de Proteção de Dados (LGPD - Lei nº 13.709/2018) e as diretrizes do
          ECA Digital. Não publique fotos que exponham os estudantes de forma
          indevida ou vexatória.
        </p>

        <label className="flex items-start space-x-2.5 pt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.concorda_lgpd || false}
            onChange={(e) =>
              updateFormData({ concorda_lgpd: e.target.checked })
            }
            required
            className="mt-0.5 w-4 h-4 rounded text-[#d97706] bg-white border-2 border-[#d97706] focus:ring-[#d97706] cursor-pointer"
          />
          <span className="text-xs font-bold text-amber-950 select-none">
            Declaro que as fotografias enviadas possuem autorização de uso de
            imagem e estão de acordo com as normas da LGPD e do ECA Digital.
          </span>
        </label>
      </div>

      {/* Link do Projeto */}
      <div className="md:col-span-3">
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Link do Projeto{" "}
          <span className="text-gray-700 font-normal text-xs">(Opcional)</span>
        </label>

        <input
          type="url"
          value={formData.link_projeto || ""}
          onChange={(e) => updateFormData({ link_projeto: e.target.value })}
          placeholder="Ex: https://drive.google.com/..."
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm text-sm"
        />

        <p className="text-xs text-[#143021] mt-1.5 font-semibold">
          Informe o link para acessar materiais, documentos, vídeos ou outras
          informações relacionadas ao projeto.
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={loading}
          className="px-6 py-2.5 border-2 border-[#315740] bg-[#eef5f1] text-[#143021] font-bold rounded-lg hover:bg-[#dcefe4] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
        >
          ← Voltar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-[#244231] text-white font-bold rounded-lg hover:bg-[#162e21] focus:ring-4 focus:ring-[#97bfa7] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
        >
          {loading ? "Enviando..." : "Finalizar e Enviar ✓"}
        </button>
      </div>
    </form>
  );
}
