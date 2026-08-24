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
  AlertCircle,
  CheckCircle2,
  Copy,
  RefreshCw
} from "lucide-react";
import { dimensions } from "../data/questions";
import { calculateScores, calculateOverallScore, getMaturityLevel } from "../core/engine";
import { getCompanyPortalData } from "../services/d1";

export default function AdminDashboard() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("");
  const [expandedCompanyId, setExpandedCompanyId] = useState(null);
  const [companyDetails, setCompanyDetails] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Carrega empresas cadastradas
  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    setLoading(true);
    try {
      // Mock de dados para renderização ou fetch real via D1
      const API_BASE = import.meta.env.VITE_API_BASE || "";
      const res = await fetch(`${API_BASE}/api/admin/companies`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      } else {
        // Estrutura fallback para ambiente local/desenvolvimento
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

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div className="admin-container header-flex">
          <div>
            <span className="admin-badge">PAINEL INTERNO GINGA AÍ</span>
            <h1>Gestão de Diagnósticos & Pipeline</h1>
          </div>
          <button className="secondary-button compact" onClick={fetchCompanies}>
            <RefreshCw size={14} /> Atualizar Dados
          </button>
        </div>
      </div>

      <div className="admin-container main-admin-content">
        {/* Métricas Rápidas no Topo */}
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

        {/* Filtros e Busca */}
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

        {/* Lista de Empresas */}
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

                  {/* Área Expandida: Choque de Respostas dos Colaboradores */}
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
/* ADMIN DASHBOARD */
.admin-shell { background: #f4f3ef; min-height: calc(100vh - 72px); padding-bottom: 60px; }
.admin-header { background: #121212; color: white; padding: 24px 0; border-bottom: 1px solid #2a2a2a; }
.admin-container { width: min(1150px, 92vw); margin: 0 auto; }
.header-flex { display: flex; justify-content: space-between; align-items: center; }
.admin-badge { color: #ff5a1f; font-size: 11px; font-weight: 900; letter-spacing: 0.12em; }
.admin-header h1 { margin: 4px 0 0; font-size: 26px; }

.admin-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 30px 0 20px; }
.admin-stat-card { background: white; border: 1px solid #dedbd4; padding: 20px; border-radius: 10px; display: flex; gap: 16px; align-items: center; }
.admin-stat-card strong { font-size: 24px; display: block; line-height: 1; }
.admin-stat-card span { font-size: 12px; color: #777; font-weight: 600; }

.admin-controls { display: flex; gap: 16px; margin-bottom: 20px; }
.search-box, .filter-box { background: white; border: 1px solid #dedbd4; border-radius: 8px; padding: 0 14px; display: flex; align-items: center; gap: 10px; flex: 1; height: 46px; }
.search-box input, .filter-box select { border: 0; outline: none; width: 100%; background: transparent; font-size: 14px; }

.company-admin-card { background: white; border: 1px solid #dedbd4; border-radius: 10px; margin-bottom: 12px; overflow: hidden; }
.company-main-row { padding: 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: background 0.15s; }
.company-main-row:hover { background: #faf8f5; }
.company-info h3 { margin: 0 0 8px; font-size: 18px; }
.company-tags { display: flex; gap: 8px; align-items: center; }
.tag { background: #efece6; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; color: #555; }
.tag-users { font-size: 12px; color: #777; display: flex; align-items: center; gap: 4px; }

.company-score-preview { display: flex; align-items: center; gap: 14px; }
.score-badge { text-align: center; background: #121212; color: white; padding: 6px 12px; border-radius: 8px; }
.score-badge strong { font-size: 18px; }
.score-badge small { font-size: 10px; color: #888; }
.maturity-tag { font-weight: 800; font-size: 13px; color: #ff5a1f; }
.company-actions-row { display: flex; gap: 12px; align-items: center; }

.company-expanded-pane { border-top: 1px solid #eee; background: #fafafa; padding: 20px; }
.collaborators-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 14px; }
.collaborator-card { background: white; border: 1px solid #e2dfd8; padding: 14px; border-radius: 8px; }
.collab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.role-badge { background: #ff5a1f; color: white; font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
.collab-email { font-size: 11px; color: #888; display: block; margin-bottom: 10px; }
.collab-score { display: flex; justify-content: space-between; font-size: 12px; border-top: 1px solid #eee; padding-top: 8px; margin-top: 8px; }
.collab-breakdown { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; margin-top: 8px; font-size: 11px; }
.mini-score-line { display: flex; justify-content: space-between; color: #666; }

@media (max-width: 768px) {
  .admin-stats-grid, .admin-controls, .collaborators-grid { grid-template-columns: 1fr; }
  .company-main-row { flex-direction: column; align-items: flex-start; gap: 14px; }
}
