import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Calendar,
  CheckSquare,
  ChevronRight,
  Download,
  FileText,
  Layers,
  ShieldCheck,
  Square,
  Target,
  Zap,
} from "lucide-react";
import { dimensions } from "../data/questions";

export default function PortalClient({ diagnosticData, onPrint }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [completedTasks, setCompletedTasks] = useState({});

  if (!diagnosticData) {
    return (
      <div className="portal-loading">
        <p>Carregando dados do portal operacional...</p>
      </div>
    );
  }

  const { overall, maturity, dimensionScores, gaps, productFit, company } = diagnosticData;

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Mock do Plano de Ação 30/60/90 baseado nos gargalos
  const actionPlan = [
    {
      period: "30 Dias",
      badge: "Fundação",
      tasks: [
        { id: "t1", text: gaps[0]?.action || "Definir o Perfil de Cliente Ideal (ICP)", resp: "Ginga Aí" },
        { id: "t2", text: "Mapear o funil de vendas e etapas de qualificação", resp: "Ginga + Cliente" },
        { id: "t3", text: "Alinhar metas de pipeline e cadência de follow-up", resp: "Cliente" },
      ],
    },
    {
      period: "60 Dias",
      badge: "Estruturação",
      tasks: [
        { id: "t4", text: gaps[1]?.action || "Organizar a governança e campos obrigatórios do CRM", resp: "Ginga + Cliente" },
        { id: "t5", text: "Implantar reuniões semanais de acompanhamento comercial (Ritmo)", resp: "Cliente" },
        { id: "t6", text: "Treinar a equipe no novo processo comercial padronizado", resp: "Ginga Aí" },
      ],
    },
    {
      period: "90 Dias",
      badge: "Aceleração",
      tasks: [
        { id: "t7", text: gaps[2]?.action || "Estruturar régua de relacionamento pós-venda", resp: "Cliente" },
        { id: "t8", text: "Consolidar dashboard de taxa de conversão e ticket médio", resp: "Ginga Aí" },
        { id: "t9", text: "Revisão trimestral de resultados e ajustes do playbook", resp: "Ginga + Cliente" },
      ],
    },
  ];

  return (
    <div className="portal-shell">
      {/* Sub-header de navegação do Portal */}
      <div className="portal-nav-bar">
        <div className="portal-container nav-content">
          <div className="portal-title-area">
            <span className="portal-badge">PORTAL OPERACIONAL</span>
            <h2>{company?.company || "Empresa"}</h2>
          </div>
          <div className="portal-actions">
            <button className="secondary-button compact" onClick={onPrint}>
              <Download size={15} /> Baixar PDF
            </button>
            <button
              className="primary-button compact"
              onClick={() => window.open("https://wa.me/", "_blank")}
            >
              Falar com Consultor <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="portal-container main-content">
        {/* Tabs de navegação interna */}
        <div className="portal-tabs">
          <button
            className={`tab-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart2 size={16} /> Visão Geral & Maturidade
          </button>
          <button
            className={`tab-item ${activeTab === "gaps" ? "active" : ""}`}
            onClick={() => setActiveTab("gaps")}
          >
            <AlertTriangle size={16} /> Matriz de Gargalos ({gaps?.length || 0})
          </button>
          <button
            className={`tab-item ${activeTab === "roadmap" ? "active" : ""}`}
            onClick={() => setActiveTab("roadmap")}
          >
            <Calendar size={16} /> Plano 30/60/90
          </button>
        </div>

        {/* TAB 1: VISÃO GERAL */}
        {activeTab === "overview" && (
          <div className="tab-pane">
            {/* Hero Panel de Maturidade */}
            <div className="portal-card maturity-hero">
              <div className="maturity-score-box">
                <div className="score-circle">
                  <strong>{overall}</strong>
                  <span>/100</span>
                </div>
                <div className="maturity-info">
                  <span className="eyebrow dark">ÍNDICE G.I.N.G.A. DE MATURIDADE</span>
                  <h1>Maturidade {maturity?.label}</h1>
                  <p>{maturity?.description}</p>
                </div>
              </div>
            </div>

            {/* Radar das 7 Dimensões */}
            <div className="portal-card">
              <div className="card-header">
                <Layers size={20} className="icon-orange" />
                <h3>Desempenho por Dimensão Comercial</h3>
              </div>
              <div className="dimension-bars-grid">
                {dimensions.map((dim) => {
                  const score = dimensionScores[dim.id] || 0;
                  return (
                    <div key={dim.id} className="bar-item">
                      <div className="bar-info">
                        <span>{dim.name}</span>
                        <strong>{score}/100</strong>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${score}%`,
                            backgroundColor: score < 40 ? "#e74c3c" : score < 70 ? "#ff5a1f" : "#2ecc71",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recomendação do Produto Ginga Aí */}
            {productFit && (
              <div className="portal-card product-fit-card">
                <div className="fit-badge">
                  <Zap size={16} /> RECOMENDAÇÃO DE PRÓXIMO PASSO
                </div>
                <h2>Fit Ideal: {productFit.product}</h2>
                <p className="fit-reason">{productFit.reason}</p>

                <div className="fit-focus-list">
                  <h4>Foco Prioritário da Intervenção:</h4>
                  <ul>
                    {productFit.focus.map((item, idx) => (
                      <li key={idx}>
                        <ShieldCheck size={16} className="icon-orange" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MATRIZ DE GARGALOS */}
        {activeTab === "gaps" && (
          <div className="tab-pane">
            <div className="section-intro">
              <h2>Matriz de Diagnóstico Consultivo</h2>
              <p>Mapeamento de evidências, impactos e ações imediatas para destravar o crescimento comercial.</p>
            </div>

            <div className="gaps-list">
              {gaps.map((gap, index) => (
                <div key={gap.gapId} className="portal-card gap-card">
                  <div className="gap-header">
                    <span className="gap-priority-tag">{gap.priority} PRIORIDADE</span>
                    <span className="gap-number">0{index + 1}</span>
                  </div>
                  <h3>{gap.title}</h3>

                  <div className="gap-grid">
                    <div className="gap-block">
                      <strong>Evidência Encontrada:</strong>
                      <p>{gap.evidence}</p>
                    </div>
                    <div className="gap-block">
                      <strong>Impacto Financeiro / Operacional:</strong>
                      <p>{gap.impact}</p>
                    </div>
                  </div>

                  <div className="gap-action-box">
                    <strong><Target size={16} /> Ação Recomendada:</strong>
                    <p>{gap.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PLANO DE AÇÃO 30/60/90 */}
        {activeTab === "roadmap" && (
          <div className="tab-pane">
            <div className="section-intro">
              <h2>Plano de Execução 30 / 60 / 90 Dias</h2>
              <p>Sequenciamento de ações recomendadas para elevar o índice de maturidade da empresa.</p>
            </div>

            <div className="roadmap-grid">
              {actionPlan.map((phase) => (
                <div key={phase.period} className="portal-card roadmap-card">
                  <div className="roadmap-header">
                    <span className="period-title">{phase.period}</span>
                    <span className="period-badge">{phase.badge}</span>
                  </div>

                  <div className="task-list">
                    {phase.tasks.map((task) => {
                      const isDone = !!completedTasks[task.id];
                      return (
                        <div
                          key={task.id}
                          className={`task-item ${isDone ? "done" : ""}`}
                          onClick={() => toggleTask(task.id)}
                        >
                          {isDone ? (
                            <CheckSquare size={18} className="icon-orange" />
                          ) : (
                            <Square size={18} className="icon-muted" />
                          )}
                          <div className="task-content">
                            <span>{task.text}</span>
                            <small>Resp: {task.resp}</small>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/* PORTAL OPERACIONAL */
.portal-shell {
  background: var(--chalk);
  min-height: calc(100vh - 72px);
  padding-bottom: 60px;
}
.portal-nav-bar {
  background: var(--asphalt);
  color: var(--chalk);
  padding: 20px 0;
  border-bottom: 1px solid #333;
}
.portal-container {
  width: min(1100px, 92vw);
  margin: 0 auto;
}
.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.portal-badge {
  color: var(--orange);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
}
.portal-title-area h2 {
  margin: 4px 0 0;
  font-size: 24px;
}
.portal-actions {
  display: flex;
  gap: 12px;
}
.compact {
  min-height: 38px;
  padding: 0 14px;
  font-size: 13px;
}

/* TABS */
.portal-tabs {
  display: flex;
  gap: 10px;
  margin: 30px 0 20px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
}
.tab-item {
  border: 0;
  background: transparent;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 14px;
  color: #666;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.tab-item.active {
  background: var(--asphalt);
  color: var(--chalk);
}

/* CARDS */
.portal-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 20px;
}
.maturity-hero {
  background: var(--asphalt);
  color: var(--chalk);
}
.maturity-score-box {
  display: flex;
  gap: 24px;
  align-items: center;
}
.score-circle {
  width: 100px;
  height: 100px;
  border: 6px solid var(--orange);
  border-radius: 50%;
  display: grid;
  place-content: center;
  text-align: center;
  flex-shrink: 0;
}
.score-circle strong { font-size: 32px; }
.score-circle span { font-size: 11px; color: #888; }
.maturity-info h1 { margin: 6px 0; font-size: 28px; }
.maturity-info p { margin: 0; color: #aaa; font-size: 14px; }

/* BARRAS DE DIMENSÃO */
.dimension-bars-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 20px;
}
.bar-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 6px;
  font-weight: 700;
}
.bar-track {
  height: 8px;
  background: #eee;
  border-radius: 99px;
  overflow: hidden;
}
.bar-fill { height: 100%; transition: width 0.4s ease; }

/* PRODUCT FIT & GARGALOS */
.product-fit-card { border-left: 5px solid var(--orange); }
.fit-badge { color: var(--orange); font-size: 12px; font-weight: 900; gap: 6px; display: flex; align-items: center; }
.fit-focus-list ul { list-style: none; padding: 0; margin-top: 10px; display: grid; gap: 8px; }
.fit-focus-list li { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; }

.gap-card { border-left: 4px solid #e74c3c; }
.gap-header { display: flex; justify-content: space-between; font-weight: 900; margin-bottom: 10px; }
.gap-priority-tag { color: #e74c3c; font-size: 11px; letter-spacing: 0.1em; }
.gap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; background: #fafafa; padding: 14px; border-radius: 8px; }
.gap-action-box { background: #fff8f4; border: 1px solid #ffd8c7; padding: 14px; border-radius: 8px; }

/* ROADMAP */
.roadmap-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.roadmap-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.period-title { font-weight: 900; font-size: 18px; }
.period-badge { background: #f0f0f0; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
.task-list { display: grid; gap: 10px; }
.task-item { display: flex; gap: 10px; cursor: pointer; padding: 10px; border-radius: 6px; border: 1px solid #eee; background: #fafafa; }
.task-item.done { opacity: 0.5; text-decoration: line-through; }
.task-content { display: grid; font-size: 13px; }
.task-content small { color: #888; font-size: 11px; }

@media (max-width: 768px) {
  .dimension-bars-grid, .gap-grid, .roadmap-grid { grid-template-columns: 1fr; }
  .maturity-score-box { flex-direction: column; text-align: center; }
}
