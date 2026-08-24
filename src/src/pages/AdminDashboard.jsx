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
import { dimensions } from "../data/questions";
import { calculateScores, calculateOverallScore } from "../core/engine";
import { getCompanyPortalData } from "../services/d1";

// Senha padrão de acesso interno (Pode ser configurada no .env como VITE_ADMIN_PASSWORD)
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "ginga2026";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("");
  const [expandedCompanyId, setExpandedCompanyId] = useState(null);
  const [companyDetails, setCompanyDetails] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Verifica se já está autenticado na sessão atual
  useEffect(() => {
    const authStatus = sessionStorage.getItem("ginga_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchCompanies();
    }
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("ginga_admin_auth", "true");
      setIsAuthenticated(true);
      setErrorMsg("");
      fetchCompanies();
    } else {
      setErrorMsg("Senha incorreta. Tente novamente.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("ginga_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  }

  async function fetchCompanies() {
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "";
      const res = await fetch(`${API_BASE}/api/admin/companies`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      } else {
        // Fallback de demonstração
        setCompanies([
          {
            id: "empresa-demo-01",
            name: "Tech Solutions LTDA",
            segment: "Tecnologia",
            revenue: "R$ 1,5 a 5 milhões",
            sellers: "3–5",
            created_at: new Date().toISOString(),
            responseCount: 3,
            overallScore: 38,
            maturityLabel: "Informal"
          }
        ]);
      }
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleCompanyExpand(companyId) {
    if (expandedCompanyId === companyId) {
      setExpandedCompanyId(null);
      return;
    }

    setExpandedCompanyId(companyId);

    if (!companyDetails[companyId]) {
      try {
        const portalData = await getCompanyPortalData(companyId);
        setCompanyDetails((prev) => ({
          ...prev,
          [companyId]: portalData
        }));
      } catch (err) {
        console.error("Erro ao carregar detalhes da empresa:", err);
      }
    }
  }

  function copyPortalLink(companyId) {
    const url = `${window.location.origin}/portal/${companyId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(companyId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = !selectedSegment || c.segment === selectedSegment;
    return matchesSearch && matchesSegment;
  });

  // TELA DE LOGIN RESTAURAÇÃO DE ACESSO
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

  // PAINEL LIBERADO
  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div className="admin-container header-flex">
          <div>
            <span className="admin-badge">PAINEL INTERNO GINGA AÍ</span>
            <h1>Gestão de Diagnósticos & Pipeline</h1>
          </div>
          <div className="admin-header-actions">
            <button className="secondary-button compact" onClick={fetchCompanies}>
              <RefreshCw size={14} /> Atualizar
            </button>
            <button className="text-button text-white" onClick={handleLogout} title="Sair do painel">
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="admin-container main-admin-content">
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <Building2 size={22} className="icon-orange" />
            <div>
              <strong>{companies.length}</strong>
              <span>Empresas Auditadas</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <Users size={22} className="icon-orange" />
            <div>
              <strong>
                {companies.reduce((acc, c) => acc + (c.responseCount || 1), 0)}
              </strong>
              <span>Colaboradores Respondentes</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <BarChart3 size={22} className="icon-orange" />
            <div>
              <strong>
                {companies.length
                  ? Math.round(
                      companies.reduce((acc, c) => acc + (c.overallScore || 0), 0) /
                        companies.length
                    )
                  : 0}
                /100
              </strong>
              <span>Maturidade Média Geral</span>
            </div>
          </div>
        </div>

        <div className="admin-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por nome da empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <Filter size={16} />
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
            >
              <option value="">Todos os Segmentos</option>
              <option value="Indústria">Indústria</option>
              <option value="Comércio">Comércio</option>
              <option value="Serviços">Serviços</option>
              <option value="Tecnologia">Tecnologia</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Carregando carteira de diagnósticos...</div>
        ) : (
          <div className="companies-list">
            {filteredCompanies.map((comp) => {
              const isExpanded = expandedCompanyId === comp.id;
              const details = companyDetails[comp.id];

              return (
                <div key={comp.id} className="company-admin-card">
                  <div className="company-main-row" onClick={() => toggleCompanyExpand(comp.id)}>
                    <div className="company-info">
                      <h3>{comp.name}</h3>
                      <div className="company-tags">
                        <span className="tag">{comp.segment || "Sem segmento"}</span>
                        <span className="tag">{comp.revenue || "Faturamento N/A"}</span>
                        <span className="tag-users"><Users size={12} /> {comp.responseCount || 1} respondente(s)</span>
                      </div>
                    </div>

                    <div className="company-score-preview">
                      <div className="score-badge">
                        <strong>{comp.overallScore || 0}</strong>
                        <small>/100</small>
                      </div>
                      <span className="maturity-tag">{comp.maturityLabel || "Diagnóstico"}</span>
                    </div>

                    <div className="company-actions-row">
                      <button
                        className="text-button"
                        title="Copiar link do Portal"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyPortalLink(comp.id);
                        }}
                      >
                        {copiedId === comp.id ? <CheckCircle2 size={16} color="#2ecc71" /> : <Copy size={16} />}
                      </button>
                      <button
                        className="text-button"
                        title="Abrir Portal do Cliente"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/portal/${comp.id}`, "_blank");
                        }}
                      >
                        <ExternalLink size={16} />
                      </button>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="company-expanded-pane">
                      <h4>Análise de Percepção por Papel / Colaborador</h4>

                      {!details ? (
                        <p className="loading-small">Carregando respostas dos colaboradores...</p>
                      ) : (
                        <div className="collaborators-grid">
                          {details.responses?.map((resp, idx) => {
                            const scores = calculateScores(resp.answers_json, dimensions);
                            const overall = calculateOverallScore(scores);

                            return (
                              <div key={idx} className="collaborator-card">
                                <div className="collab-header">
                                  <strong>{resp.respondent_name}</strong>
                                  <span className="role-badge">{resp.respondent_role}</span>
                                </div>
                                <span className="collab-email">{resp.respondent_email}</span>
                                <div className="collab-score">
                                  <span>Maturidade Percebida:</span>
                                  <strong>{overall}/100</strong>
                                </div>

                                <div className="collab-breakdown">
                                  {dimensions.map((d) => (
                                    <div key={d.id} className="mini-score-line">
                                      <small>{d.short}:</small>
                                      <span>{scores[d.id] || 0}%</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
/* TELA DE LOGIN ADMIN */
.admin-login-shell {
  min-height: calc(100vh - 72px);
  background: var(--asphalt);
  display: grid;
  place-items: center;
  padding: 20px;
}
.admin-login-card {
  background: white;
  border-radius: 14px;
  padding: 40px;
  width: min(420px, 90vw);
  text-align: center;
}
.login-icon-box {
  width: 56px;
  height: 56px;
  background: #fff8f4;
  border-radius: 12px;
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
}
.admin-login-card h2 {
  margin: 8px 0;
  font-size: 24px;
  color: var(--ink);
}
.admin-login-card p {
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.5;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.login-input-group input {
  width: 100%;
  height: 48px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0 16px;
  font-size: 15px;
  outline: none;
  text-align: center;
}
.login-input-group input:focus {
  border-color: var(--orange);
}
.login-error {
  color: #e74c3c;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
}
.full-width {
  width: 100%;
}
.admin-header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
.text-white {
  color: white !important;
}
