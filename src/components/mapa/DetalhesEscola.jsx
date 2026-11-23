import React from "react";

const DetalhesEscola = ({ projetoSelecionado, onClose }) => {
  if (!projetoSelecionado) return null;

  const linkValido =
    projetoSelecionado.link_projeto &&
    /^https?:\/\//i.test(projetoSelecionado.link_projeto.trim())
      ? projetoSelecionado.link_projeto.trim()
      : null;

  return (
    <div className="w-full md:w-1/3 min-w-0 sm:min-w-[360px] h-screen bg-white shadow-2xl z-[1010] flex flex-col font-sans transition-all duration-300 border-r border-slate-200">
      {/* Cabeçalho */}
      <div className="p-4 px-5 bg-slate-900 text-white flex justify-between items-center">
        <span className="text-base font-bold tracking-wide">
          📋 Detalhes da Escola e Projeto
        </span>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-slate-400 hover:text-white text-2xl font-bold cursor-pointer"
        >
          ×
        </button>
      </div>

      {/* Conteúdo com Scroll */}
      <div className="p-6 overflow-y-auto flex flex-col gap-5">
        {/* BLOCO 1: ESCOLA */}
        <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-3.5">
            🏫 Informações da Instituição
          </span>

          {projetoSelecionado.nomeEscola && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Nome da Escola:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.nomeEscola}
              </p>
            </div>
          )}

          {projetoSelecionado.municipio && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Município:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.municipio}
              </p>
            </div>
          )}

          {projetoSelecionado.dadosCompletosEscola?.inep && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                INEP:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.dadosCompletosEscola.inep}
              </p>
            </div>
          )}

          {projetoSelecionado.dadosCompletosEscola?.direc && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                DIREC:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.dadosCompletosEscola.direc}
              </p>
            </div>
          )}
        </div>

        {/* BLOCO 2: PROJETO */}
        <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-3.5">
            💡 Detalhes da Ação Tecnológica
          </span>

          {projetoSelecionado.titulo_projeto && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Título do Projeto:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.titulo_projeto}
              </p>
            </div>
          )}

          {projetoSelecionado.coordenador && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Coordenador do Projeto:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.coordenador}
              </p>
            </div>
          )}

          {projetoSelecionado.qtd_professores != null &&
            projetoSelecionado.qtd_professores !== "" && (
              <div className="mb-3.5">
                <label className="text-[12px] text-slate-500 font-bold uppercase">
                  Quantidade de Professores:
                </label>
                <p className="m-0 mt-0.5 text-slate-700 text-sm">
                  {projetoSelecionado.qtd_professores}
                </p>
              </div>
            )}

          {projetoSelecionado.qtd_estudantes != null &&
            projetoSelecionado.qtd_estudantes !== "" && (
              <div className="mb-3.5">
                <label className="text-[12px] text-slate-500 font-bold uppercase">
                  Quantidade de Estudantes:
                </label>
                <p className="m-0 mt-0.5 text-slate-700 text-sm">
                  {projetoSelecionado.qtd_estudantes}
                </p>
              </div>
            )}

          {projetoSelecionado.apresentacao_projeto && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Apresentação do Projeto:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.apresentacao_projeto}
              </p>
            </div>
          )}

          {/* Palavras-chave */}
          {projetoSelecionado.palavras_chave && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Palavras-chave:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.palavras_chave}
              </p>
            </div>
          )}

          {projetoSelecionado.objetivo && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Objetivo:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.objetivo}
              </p>
            </div>
          )}

          {projetoSelecionado.metodologia && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Metodologia:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.metodologia}
              </p>
            </div>
          )}

          {projetoSelecionado.resultados && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Resultados:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.resultados}
              </p>
            </div>
          )}

          {projetoSelecionado.ano_inicio && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Ano de Início:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.ano_inicio}
              </p>
            </div>
          )}

          {projetoSelecionado.ano_fim && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Ano de Fim:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.ano_fim}
              </p>
            </div>
          )}

          {projetoSelecionado.periodicidade && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Periodicidade:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.periodicidade}
              </p>
            </div>
          )}

          {projetoSelecionado.etapa_ensino && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Etapa de Ensino:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.etapa_ensino}
              </p>
            </div>
          )}

          {projetoSelecionado.ano_serie && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Ano / Série:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.ano_serie}
              </p>
            </div>
          )}

          {projetoSelecionado.oferta_ensino && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Oferta de Ensino:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.oferta_ensino}
              </p>
            </div>
          )}

          {projetoSelecionado.modalidade && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Modalidade:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.modalidade}
              </p>
            </div>
          )}

          {projetoSelecionado.componente && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Componente Curricular:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.componente}
              </p>
            </div>
          )}

          {projetoSelecionado.area && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Área do Conhecimento:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.area}
              </p>
            </div>
          )}

          {projetoSelecionado.habilidades_bncc && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Habilidades da BNCC:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.habilidades_bncc}
              </p>
            </div>
          )}

          {projetoSelecionado.habilidades_bncc_computacao && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Habilidades da BNCC Computação:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm">
                {projetoSelecionado.habilidades_bncc_computacao}
              </p>
            </div>
          )}

          {linkValido && (
            <div className="mb-3.5">
              <label className="text-[12px] text-slate-500 font-bold uppercase">
                Link do Projeto:
              </label>
              <p className="m-0 mt-0.5 text-slate-700 text-sm break-all">
                <a
                  href={linkValido}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {linkValido}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhesEscola;
