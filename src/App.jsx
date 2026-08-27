import { useEffect, useMemo, useState } from "react";
import logoImg from "./logo.jpeg";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Gauge,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { answerOptions, dimensions, questions } from "./data/questions";
import { runEngineV2 } from "./core/recommender";
import { saveDiagnostic } from "./services/api";
import AdminDashboard from "./pages/AdminDashboard";
import PortalClient from "./pages/PortalClient";

const initialCompany = {
  company: "",
  cnpj: "",
  contact: "",
  role: "",
  email: "",
  whatsapp: "",
  segment: "",
  city: "",
  revenue: "",
  employees: "",
  sellers: "",
};

export default function App() {
  // Leitura direta e imediata da URL completa para ignorar a landing page se for /admin ou /portal
  const getScreenFromUrl = () => {
    const url = window.location.href.toLowerCase();
    if (url.includes("/admin")) return "admin";
    if (url.includes("/portal")) return "portal";
    return "landing";
  };

  const [screen, setScreen] = useState(getScreenFromUrl);
  const [company, setCompany] = useState(initialCompany);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [portalData, setPortalData] = useState(null);

  // Garante a reavaliação da rota na inicialização
  useEffect(() => {
    const currentScreen = getScreenFromUrl();
    setScreen(currentScreen);
  }, []);

  const currentQuestion = questions[current];
  const progress = Math.round(((current + 1) / questions.length) * 100);
  const currentDimension = dimensions.find((d) => d.id === currentQuestion?.dimension);

  const answered = useMemo(() => Object.keys(answers).length, [answers]);

  function start() {
    setScreen("company");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateCompany(field, value) {
    setCompany((prev) => ({ ...prev, [field]: value }));
  }

  function beginDiagnostic() {
    if (!company.company || !company.contact || !company.email) return;
    setScreen("diagnostic");
  }

  function answer(value) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: Number(value) }));
  }

  async function finish() {
    const built = runEngineV2(answers, company, questions);
    setResult(built);
    
    const formattedPortalData = {
      overall: built.overall,
      maturity: built.maturity,
      dimensionScores: built.dimensionScores,
      gaps: built.gaps,
      productFit: built.productFit,
      company: company
    };

    setPortalData(formattedPortalData);
    setSaving(true);

    try {
      await saveDiagnostic({
        company,
        answers,
        result: built,
        source: new URLSearchParams(window.location.search).get("utm_source") || "direct",
      });
    } catch (error) {
      console.error("Erro ao persistir diagnóstico no D1:", error);
    } finally {
      setSaving(false);
      setScreen("portal");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function next() {
    if (!answers[currentQuestion.id]) return;
    if (current === questions.length - 1) {
      finish();
      return;
    }
    setCurrent((v) => v + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function previous() {
    if (current === 0) {
      setScreen("company");
      return;
    }
    setCurrent((v) => v - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      {screen !== "admin" && screen !== "portal" && (
        <header className="topbar">
          <div className="brand">
            <img src={logoImg} alt="Ginga Aí" className="brand-logo" />
          </div>
          <div className="topbar-note">Diagnóstico Comercial</div>
        </header>
      )}

      {/* ROTA ADMIN DA DIRETORIA GINGA AÍ */}
      {screen === "admin" && <AdminDashboard />}

      {/* PORTAL OPERACIONAL DO CLIENTE */}
      {screen === "portal" && (
        <PortalClient
          diagnosticData={portalData}
          onPrint={() => window.print()}
        />
      )}

      {/* FLUXO TRADICIONAL DE COLETA */}
      {screen === "landing" && <Landing onStart={start} />}
      {screen === "company" && (
        <CompanyForm
          company={company}
          updateCompany={updateCompany}
          onBack={() => setScreen("landing")}
          onNext={beginDiagnostic}
        />
      )}
      {screen === "diagnostic" && (
        <Diagnostic
          question={currentQuestion}
          dimension={currentDimension}
          current={current}
          total={questions.length}
          progress={progress}
          answers={answers}
          answered={answered}
          onAnswer={answer}
          onNext={next}
          onPrevious={previous}
        />
      )}
    </div>
  );
}

function Landing({ onStart }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={15} /> DIAGNÓSTICO COMERCIAL GINGA AÍ
          </div>
          <h1>
            Seu comercial vende.<br />
            <span>Mas ele está preparado para crescer?</span>
          </h1>
          <p className="hero-lead">
            Em poucos minutos, descubra o nível de maturidade comercial da sua empresa,
            seus principais gargalos e onde faz mais sentido concentrar esforço.
          </p>
          <button className="primary-button" onClick={onStart}>
            Começar diagnóstico <ArrowRight size={19} />
          </button>
          <div className="microcopy">
            <LockKeyhole size={14} /> Diagnóstico confidencial
          </div>
        </div>

        <div className="hero-card">
          <div className="card-kicker">O QUE VOCÊ VAI RECEBER</div>
          <div className="hero-stat">
            <Gauge size={25} />
            <strong>Índice de maturidade</strong>
          </div>
          <div className="hero-stat">
            <Target size={25} />
            <strong>Gargalo principal</strong>
          </div>
          <div className="hero-stat">
            <TrendingUp size={25} />
            <strong>Prioridades de evolução</strong>
          </div>
          <div className="hero-stat">
            <ClipboardCheck size={25} />
            <strong>Recomendação de próximos passos</strong>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="section-heading">
          <span className="eyebrow dark">O JOGO COMERCIAL</span>
          <h2>Não é sorte. É sistema. E dá pra treinar.</h2>
          <p>
            A Ginga Aí transforma conhecimento comercial em processo replicável,
            mensurável e evolutivo.
          </p>
        </div>
        <div className="dimension-grid">
          {dimensions.map((d) => (
            <div className="dimension-card" key={d.id}>
              <span>{d.short}</span>
              <p>{d.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function CompanyForm({ company, updateCompany, onBack, onNext }) {
  const valid = company.company && company.contact && company.email;
  return (
    <main className="form-page">
      <div className="form-container">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar
        </button>
        <div className="eyebrow dark">ETAPA 01 · CONTEXTO</div>
        <h1>
          Antes de olhar o comercial,<br />
          vamos conhecer a empresa.
        </h1>
        <p className="form-intro">
          Essas informações ajudam a interpretar suas respostas dentro do contexto correto.
        </p>

        <div className="form-grid">
          <Field label="Empresa *" value={company.company} onChange={(v) => updateCompany("company", v)} />
          <Field label="CNPJ" value={company.cnpj} onChange={(v) => updateCompany("cnpj", v)} />
          <Field label="Seu nome *" value={company.contact} onChange={(v) => updateCompany("contact", v)} />
          <Field label="Cargo / função" value={company.role} onChange={(v) => updateCompany("role", v)} />
          <Field label="E-mail *" type="email" value={company.email} onChange={(v) => updateCompany("email", v)} />
          <Field label="WhatsApp" value={company.whatsapp} onChange={(v) => updateCompany("whatsapp", v)} />
          <SelectField
            label="Segmento"
            value={company.segment}
            onChange={(v) => updateCompany("segment", v)}
            options={["Indústria", "Comércio", "Serviços", "Tecnologia", "Construção", "Saúde", "Outro"]}
          />
          <Field label="Cidade / UF" value={company.city} onChange={(v) => updateCompany("city", v)} />
          <SelectField
            label="Faturamento anual"
            value={company.revenue}
            onChange={(v) => updateCompany("revenue", v)}
            options={["Até R$ 1,5 milhão", "R$ 1,5 a 5 milhões", "R$ 5 a 15 milhões", "Acima de R$ 15 milhões"]}
          />
          <SelectField
            label="Número de colaboradores"
            value={company.employees}
            onChange={(v) => updateCompany("employees", v)}
            options={["1–4", "5–15", "16–30", "31–60", "61+"]}
          />
          <SelectField
            label="Pessoas em vendas"
            value={company.sellers}
            onChange={(v) => updateCompany("sellers", v)}
            options={["Só o dono", "1–2", "3–5", "6–10", "11+"]}
          />
        </div>

        <div className="form-actions">
          <button className="primary-button" disabled={!valid} onClick={onNext}>
            Continuar <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Diagnostic({ question, dimension, current, total, progress, answers, answered, onAnswer, onNext, onPrevious }) {
  return (
    <main className="diagnostic-page">
      <div className="diagnostic-container">
        <div className="diagnostic-meta">
          <span>{dimension?.short}</span>
          <span>
            {current + 1} de {total}
          </span>
        </div>
        <div className="progress">
          <div style={{ width: `${progress}%` }} />
        </div>

        <div className="question-area">
          <div className="question-icon">
            <CircleHelp size={26} />
          </div>
          <div className="eyebrow dark">COMO ISSO FUNCIONA HOJE NA SUA EMPRESA?</div>
          <h1>{question.text}</h1>
          <p className="question-helper">Escolha a alternativa que mais se aproxima da realidade atual.</p>

          <div className="answer-list">
            {answerOptions.map((option) => (
              <button
                key={option.value}
                className={`answer-option ${answers[question.id] === option.value ? "selected" : ""}`}
                onClick={() => onAnswer(option.value)}
              >
                <span className="answer-number">{option.value}</span>
                <span className="answer-copy">
                  <strong>{option.label}</strong>
                  <small>{option.helper}</small>
                </span>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="diagnostic-actions">
          <button className="secondary-button" onClick={onPrevious}>
            <ArrowLeft size={17} /> Voltar
          </button>
          <button className="primary-button" disabled={!answers[question.id]} onClick={onNext}>
            {current === total - 1 ? "Ver meu diagnóstico" : "Próxima"} <ArrowRight size={17} />
          </button>
        </div>

        <div className="answered-note">
          <CheckCircle2 size={14} /> {answered} respostas registradas
        </div>
      </div>
    </main>
  );
}
