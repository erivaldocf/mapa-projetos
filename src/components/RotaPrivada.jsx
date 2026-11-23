import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Componente RotaPrivada
 * Verifica se existe um token salvo antes de renderizar páginas restritas.
 */
export default function RotaPrivada({ children }) {
  const token = localStorage.getItem("token_mapeamento");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
