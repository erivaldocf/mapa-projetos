import React, { useState } from "react";
import Select from "react-select";

import { DIRECS } from "../../constants/formOptions";

export default function Step1({ formData, updateFormData, escolas, nextStep }) {
  const [erroEscola, setErroEscola] = useState(false);
  const [erroEmail, setErroEmail] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");

  // Expressões Regulares de Validação (aceita celular com 9 dígitos ou fixo com 8 dígitos)
  const EMAIL_INSTITUCIONAL_REGEX = /^[a-zA-Z0-9._%+-]+@educar\.rn\.gov\.br$/i;
  const TELEFONE_REGEX = /^\(\d{2}\) \d{4,5}-\d{4}$/;

  const normalizar = (texto) =>
    texto ? String(texto).trim().toUpperCase() : "";

  // 1. Filtra as escolas pertencentes à DIREC selecionada (ignorando maiúsculas/espaços)
  const escolasDaDirec = formData.direc
    ? escolas.filter(
        (item) => normalizar(item.direc) === normalizar(formData.direc),
      )
    : [];

  // 2. Extrai a lista de municípios únicos disponíveis dentro da DIREC selecionada
  const municipiosDisponiveis = Array.from(
    new Set(escolasDaDirec.map((item) => item.municipio)),
  )
    .filter(Boolean)
    .sort();

  // 3. Filtra as escolas pertencentes ao Município selecionado
  const escolasFiltradas = formData.municipio
    ? escolasDaDirec.filter(
        (item) => normalizar(item.municipio) === normalizar(formData.municipio),
      )
    : [];

  // Validação centralizada ao submeter a etapa
  const handleSubmit = (e) => {
    e.preventDefault();

    let temErro = false;

    if (!formData.inep_escola) {
      setErroEscola(true);
      temErro = true;
    } else {
      setErroEscola(false);
    }

    if (!formData.telefone || !TELEFONE_REGEX.test(formData.telefone)) {
      setErroTelefone(
        "Informe um telefone válido no formato (00) 90000-0000 ou (00) 0000-0000.",
      );
      temErro = true;
    } else {
      setErroTelefone("");
    }

    if (
      !formData.email_institucional ||
      !EMAIL_INSTITUCIONAL_REGEX.test(formData.email_institucional)
    ) {
      setErroEmail(
        "Insira um e-mail institucional válido terminado em @educar.rn.gov.br",
      );
      temErro = true;
    } else {
      setErroEmail("");
    }

    if (temErro) return;

    nextStep();
  };

  const handleDirecChange = (e) => {
    updateFormData({
      direc: e.target.value,
      municipio: "",
      inep_escola: "",
      nome_escola: "",
    });
  };

  const handleMunicipioChange = (e) => {
    updateFormData({
      municipio: e.target.value,
      inep_escola: "",
      nome_escola: "",
    });
  };

  const handleEscolaChange = (option) => {
    if (!option) {
      setErroEscola(true);
      updateFormData({
        inep_escola: "",
        nome_escola: "",
      });
      return;
    }

    setErroEscola(false);

    const escola = escolas.find(
      (item) => String(item.inep) === String(option.value),
    );

    updateFormData({
      inep_escola: option.value,
      nome_escola: escola?.escola || "",
    });
  };

  /**
   * Formata telefone fixo (10 dígitos) ou celular (11 dígitos) automaticamente.
   */
  const formatarTelefone = (valor) => {
    if (!valor) return "";

    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);

    if (apenasNumeros.length <= 10) {
      return apenasNumeros
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
    }

    return apenasNumeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-[#122318] border-b-2 border-[#8fb99f] pb-2">
        Identificação da Escola e da Gestão
      </h2>

      {/* 1. SELEÇÃO DE DIREC */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          DIREC
        </label>
        <select
          value={formData.direc || ""}
          onChange={handleDirecChange}
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 font-semibold shadow-sm"
        >
          <option value="">Selecione a DIREC...</option>
          {DIRECS.map((direc) => (
            <option key={direc} value={direc}>
              {direc}
            </option>
          ))}
        </select>
      </div>

      {/* 2. SELEÇÃO DE MUNICÍPIO */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Município
        </label>
        <select
          value={formData.municipio || ""}
          onChange={handleMunicipioChange}
          disabled={!formData.direc}
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 font-semibold shadow-sm disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          <option value="">
            {formData.direc
              ? "Selecione o município..."
              : "Selecione uma DIREC primeiro"}
          </option>
          {municipiosDisponiveis.map((mun) => (
            <option key={mun} value={mun}>
              {mun}
            </option>
          ))}
        </select>
      </div>

      {/* 3. SELEÇÃO DE ESCOLA */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Escola
        </label>

        <Select
          isDisabled={!formData.municipio}
          placeholder={
            formData.municipio
              ? "Digite o nome da escola..."
              : "Selecione um município primeiro"
          }
          options={escolasFiltradas.map((item) => ({
            value: item.inep,
            label: item.escola,
          }))}
          value={
            formData.inep_escola
              ? escolasFiltradas
                  .map((item) => ({
                    value: item.inep,
                    label: item.escola,
                  }))
                  .find(
                    (op) => String(op.value) === String(formData.inep_escola),
                  ) || null
              : null
          }
          onChange={handleEscolaChange}
          isSearchable
          styles={{
            control: (base, state) => ({
              ...base,
              backgroundColor: state.isDisabled ? "#e5e7eb" : "#ffffff",
              borderWidth: "2px",
              borderColor: erroEscola
                ? "#dc2626"
                : state.isFocused
                  ? "#244231"
                  : "#315740",
              borderRadius: "0.5rem",
              padding: "2px",
              boxShadow: state.isFocused
                ? "0 0 0 2px rgba(36, 66, 49, 0.3)"
                : "none",
              "&:hover": {
                borderColor: erroEscola ? "#dc2626" : "#244231",
              },
            }),
            singleValue: (base) => ({
              ...base,
              color: "#111827",
              fontWeight: 600,
            }),
            placeholder: (base) => ({
              ...base,
              color: "#4b5563",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              zIndex: 50,
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? "#244231"
                : state.isFocused
                  ? "#d9eadf"
                  : "#ffffff",
              color: state.isSelected ? "#ffffff" : "#111827",
              fontWeight: 500,
              cursor: "pointer",
            }),
          }}
        />
        {erroEscola && (
          <p className="mt-1 text-sm font-bold text-red-700">
            Selecione uma escola.
          </p>
        )}
      </div>

      {/* E-mail Institucional */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          E-mail Institucional da Escola (@educar.rn.gov.br)
        </label>
        <input
          type="email"
          value={formData.email_institucional || ""}
          onChange={(e) => {
            setErroEmail("");
            updateFormData({
              email_institucional: e.target.value.toLowerCase().trim(),
            });
          }}
          placeholder="escola@educar.rn.gov.br"
          required
          pattern="[a-zA-Z0-9._%+-]+@educar\.rn\.gov\.br"
          title="O e-mail deve terminar obrigatoriamente com @educar.rn.gov.br"
          className={`w-full p-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm ${
            erroEmail ? "border-red-600" : "border-[#315740]"
          }`}
        />
        {erroEmail && (
          <p className="mt-1 text-sm font-bold text-red-700">{erroEmail}</p>
        )}
      </div>

      {/* Nome do Gestor */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Nome do Gestor da Escola
        </label>
        <input
          type="text"
          value={formData.nome_gestor || ""}
          onChange={(e) => updateFormData({ nome_gestor: e.target.value })}
          placeholder="Nome completo do gestor"
          required
          className="w-full p-2.5 border-2 border-[#315740] rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm"
        />
      </div>

      {/* Telefone */}
      <div>
        <label className="block text-sm font-bold text-[#143021] mb-1.5">
          Telefone do gestor (de preferência WhatsApp)
        </label>
        <input
          type="tel"
          value={formData.telefone || ""}
          onChange={(e) => {
            setErroTelefone("");
            updateFormData({ telefone: formatarTelefone(e.target.value) });
          }}
          placeholder="(84) 99999-9999"
          required
          maxLength={15}
          pattern="\(\d{2}\) \d{4,5}-\d{4}"
          title="Insira o telefone no formato (00) 90000-0000 ou (00) 0000-0000"
          className={`w-full p-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#244231] focus:border-[#244231] bg-white text-gray-900 placeholder-gray-500 font-semibold shadow-sm ${
            erroTelefone ? "border-red-600" : "border-[#315740]"
          }`}
        />
        {erroTelefone && (
          <p className="mt-1 text-sm font-bold text-red-700">{erroTelefone}</p>
        )}
      </div>

      {/* Botão Próximo */}
      <div className="flex justify-end pt-4">
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
