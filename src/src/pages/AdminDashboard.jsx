import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Search,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BarChart3,
  CheckCircle2,
  Copy,
  RefreshCw,
  Lock,
  LogOut,
  ShieldAlert
} from "lucide-react";

const ADMIN_PASSWORD = "ginga2026";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const authStatus = sessionStorage.getItem("ginga_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("ginga_admin_auth", "true");
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Senha incorreta. Tente novamente.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("ginga_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  }

  // TELA DE BLOQUEIO / CADEADO
  if (!isAuthenticated) {
    return (
      <div className="admin-login-shell">
        <div className="admin-login-card">
          <div className="login-icon-box">
            <Lock size={28} className="icon-orange" />
          </div>
          <span className="admin-badge">ACESSO RESTRITO GINGA AÍ</span>
          <h2>Painel da Diretoria</h2>
          <p>Digite a chave de acesso para visualizar o pipeline e diagnósticos.</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-input-group">
              <input
                type="password"
                placeholder="Sua senha de acesso"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
            </div>

            {errorMsg && (
              <div className="login-error">
                <ShieldAlert size={14} /> {errorMsg}
              </div>
            )}

            <button type="submit" className="primary-button full-width">
              Acessar Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // TELA ADMIN LIBERADA
  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div className="admin-container header-flex">
          <div>
            <span className="admin-badge">PAINEL INTERNO GINGA AÍ</span>
            <h1>Gestão de Diagnósticos & Pipeline</h1>
          </div>
          <button className="text-button text-white" onClick={handleLogout}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>
      <div className="admin-container main-admin-content" style={{ padding: "40px 0" }}>
        <p>Acesso autorizado! Bem-vindo ao Painel Interno da Ginga Aí.</p>
      </div>
    </div>
  );
}
