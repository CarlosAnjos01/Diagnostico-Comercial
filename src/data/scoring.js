import { dimensions } from "./questions";

export function calculateDimensionScores(answers) {
  const scores = {};

  for (const dimension of dimensions) {
    const items = Object.entries(answers).filter(([id]) => {
      return id.startsWith(prefixFor(dimension.id));
    });

    if (!items.length) {
      scores[dimension.id] = 0;
      continue;
    }

    const total = items.reduce((sum, [, value]) => sum + Number(value), 0);
    const max = items.length * 5;
    scores[dimension.id] = Math.round((total / max) * 100);
  }

  return scores;
}

function prefixFor(dimensionId) {
  const map = {
    estrategia: "estr-",
    processo: "proc-",
    pessoas: "pess-",
    gestao: "gest-",
    tecnologia: "tec-",
    marketing: "mkt-",
    retencao: "ret-",
  };
  return map[dimensionId];
}

export function calculateOverall(scores) {
  const values = Object.values(scores);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function maturityLevel(score) {
  if (score < 30) return {
    key: "informal",
    label: "Informal",
    description: "O comercial depende fortemente de pessoas, experiência e improviso.",
  };
  if (score < 50) return {
    key: "emergente",
    label: "Emergente",
    description: "Existem boas práticas, mas ainda falta consistência e padrão.",
  };
  if (score < 70) return {
    key: "estruturacao",
    label: "Estruturação",
    description: "A base existe, mas há gargalos importantes impedindo previsibilidade.",
  };
  if (score < 85) return {
    key: "gerenciado",
    label: "Gerenciado",
    description: "O processo é relativamente consistente e começa a ser orientado por dados.",
  };
  return {
    key: "escalavel",
    label: "Escalável",
    description: "A operação apresenta alto nível de padronização, gestão e capacidade de evolução.",
  };
}

export function getGaps(scores) {
  return Object.entries(scores)
    .sort(([, a], [, b]) => a - b)
    .map(([dimension, score]) => ({ dimension, score }));
}

const recommendations = {
  estrategia: {
    title: "Definir direção comercial",
    action: "Construir ICP, proposta de valor, segmentos prioritários e foco de crescimento.",
  },
  processo: {
    title: "Padronizar o processo comercial",
    action: "Desenhar etapas, critérios de passagem, qualificação, proposta e follow-up.",
  },
  pessoas: {
    title: "Organizar papéis e rotina do time",
    action: "Definir responsabilidades, metas, treinamento e cadência de gestão.",
  },
  gestao: {
    title: "Implantar gestão por indicadores",
    action: "Definir metas, indicadores, conversões, forecast e rotina de acompanhamento.",
  },
  tecnologia: {
    title: "Organizar dados e ferramentas",
    action: "Estruturar CRM e dados depois de validar o processo que a tecnologia irá suportar.",
  },
  marketing: {
    title: "Conectar geração de demanda ao pipeline",
    action: "Definir canais, ICP, critérios de lead qualificado e métricas de impacto comercial.",
  },
  retencao: {
    title: "Estruturar pós-venda e expansão",
    action: "Criar onboarding, rotina de relacionamento, recompra, indicação e expansão.",
  },
};

export function getRecommendations(scores) {
  return getGaps(scores).slice(0, 3).map(({ dimension, score }, index) => ({
    priority: index + 1,
    dimension,
    score,
    ...recommendations[dimension],
  }));
}

export function getPrimaryBottleneck(scores) {
  const [dimension, score] = Object.entries(scores).sort(([, a], [, b]) => a - b)[0];
  return {
    dimension,
    score,
    ...recommendations[dimension],
  };
}

export function buildResult(answers) {
  const dimensionScores = calculateDimensionScores(answers);
  const overall = calculateOverall(dimensionScores);
  return {
    dimensionScores,
    overall,
    maturity: maturityLevel(overall),
    bottleneck: getPrimaryBottleneck(dimensionScores),
    recommendations: getRecommendations(dimensionScores),
  };
}
