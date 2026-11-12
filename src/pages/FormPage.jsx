// src/pages/FormPage.jsx

import React, { useState, useEffect, useRef } from "react";
import Step1 from "../components/forms/Step1";
import Step2 from "../components/forms/Step2";
import Step3 from "../components/forms/Step3";
import Step4 from "../components/forms/Step4";
import backgroundForm from "../assets/background_form.jpg";
import { INITIAL_FORM_DATA } from "../constants/InitialFormData";

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [escolas, setEscolas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);
  const formRef = useRef(null);

  // Estado inicializado com a constante externa
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    // Busca a lista de escolas diretamente da sua API Backend (PostgreSQL)
    async function fetchEscolas() {
      try {
        const response = await fetch("http://localhost:3001/api/escolas");

        if (!response.ok) {
          throw new Error("Falha ao carregar escolas da API local.");
        }

        const data = await response.json();
        setEscolas(data || []);
      } catch (err) {
        console.error("Erro ao carregar escolas:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEscolas();
  }, []);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentStep]);

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  // Redefine o formulário para o estado inicial sem recarregar a página
  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setEnviadoComSucesso(false);
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-[#b8d1c2]">
        <p className="text-[#122318] font-bold">Carregando formulário...</p>
      </div>
    );
  }

  // Tela exibida após o envio com sucesso
  if (enviadoComSucesso) {
    return (
      <div
        className="w-full h-full p-4 flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundForm})` }}
      >
        <div className="max-w-md w-full bg-[#b8d1c2] rounded-2xl shadow-2xl border-2 border-[#244231] p-8 text-center space-y-4 text-[#122318]">
          <div className="w-16 h-16 bg-[#97bfa7] text-[#122318] rounded-full flex items-center justify-center mx-auto text-3xl font-bold border border-[#6b997e]">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-[#122318]">
            Formulário Enviado!
          </h2>
          <p className="text-gray-800 text-sm font-medium">
            O projeto foi registrado com sucesso no banco de dados.
          </p>
          <button
            onClick={resetForm}
            className="w-full py-2.5 bg-[#244231] text-white font-semibold rounded-lg hover:bg-[#162e21] transition-all cursor-pointer shadow-md"
          >
            Cadastrar Novo Projeto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full p-4 md:p-6 flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundForm})` }}
    >
      <div className="max-w-3xl w-full bg-[#b8d1c2] text-[#122318] rounded-2xl shadow-2xl border-2 border-[#244231] flex flex-col max-h-full">
        {/* Barra de Progresso */}
        <div className="p-6 pb-4 border-b border-[#a3c4b0] flex-none bg-[#abc7b5] rounded-t-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold inline-block py-1 px-3 uppercase rounded-full text-[#122318] bg-[#97bfa7] border border-[#6b997e]">
              Etapa {currentStep} de 4
            </span>
          </div>
          <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-[#8fb99f]">
            <div
              style={{ width: `${(currentStep / 4) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#244231] transition-all duration-300"
            ></div>
          </div>
        </div>

        {/* Passo do formulário */}
        <div ref={formRef} className="p-6 md:p-8 flex-1 overflow-y-auto">
          {currentStep === 1 && (
            <Step1
              formData={formData}
              updateFormData={updateFormData}
              escolas={escolas}
              nextStep={nextStep}
            />
          )}

          {currentStep === 2 && (
            <Step2
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {currentStep === 3 && (
            <Step3
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {currentStep === 4 && (
            <Step4
              formData={formData}
              updateFormData={updateFormData}
              prevStep={prevStep}
              onSuccess={() => setEnviadoComSucesso(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
