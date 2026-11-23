import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginComGoogle } from "../services/api";

/**
 * Componente LoginPage
 * Autenticação exclusiva via Google Workspace com suporte a seleção de contas.
 */
export default function LoginPage() {
  const [mensagemErro, setMensagemErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setCarregando(true);
    setMensagemErro("");

    try {
      const dados = await loginComGoogle(credentialResponse.credential);

      // Guarda os dados da sessão no navegador
      localStorage.setItem("token_mapeamento", dados.token);
      localStorage.setItem("usuario_mapeamento", JSON.stringify(dados.user));

      // Redireciona para o painel administrativo
      navigate("/admin");
    } catch (erro) {
      setMensagemErro(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleGoogleError = () => {
    setMensagemErro(
      "Não foi possível autenticar com a conta selecionada. Tente novamente.",
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6 text-center">
        {/* Cabeçalho */}
        <div className="space-y-2">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl">
            🛡️
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Painel Administrativo
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Acesso restrito a servidores autorizados do domínio <br />
            <strong className="text-slate-700">@educar.rn.gov.br</strong>
          </p>
        </div>

        {/* Mensagem de erro */}
        {mensagemErro && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold leading-relaxed">
            ⚠️ {mensagemErro}
          </div>
        )}

        {/* Status de validação */}
        {carregando && (
          <p className="text-xs font-semibold text-indigo-600 animate-pulse py-2">
            Verificando permissões da conta no banco de dados...
          </p>
        )}

        {/* Botão de Login do Google */}
        <div className="flex justify-center py-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            shape="pill"
            theme="outline"
            size="large"
            text="signin_with"
            locale="pt-BR"
            useOneTap={false}
          />
        </div>

        {/* Link para voltar */}
        <div className="pt-4 border-t border-slate-100">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            ← Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
