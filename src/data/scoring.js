import { dimensions, questions } from "./questions";

export function calculateDimensionScores(answers) {
  const scores = {};

  for (const dimension of dimensions) {
    const dimQuestions = questions.filter((q) => q.dimension === dimension.id);

    if (!dimQuestions.length) {
      scores[dimension.id] = 0;
      continue;
    }

    let totalPoints = 0;
    let maxPossiblePoints = 0;

    dimQuestions.forEach((q) => {
      const userVal = Number(answers[q.id] || 0);
      const weight = q.weight || 1;

      if (userVal > 0) {
        const normalizedScore = ((userVal - 1) / 4) * 100;
        totalPoints += normalizedScore * weight;
        maxPossiblePoints += 100 * weight;
      }
    });

    scores[dimension.id] = maxPossiblePoints > 0
      ? Math.round(totalPoints / maxPossiblePoints)
      : 0;
  }

  return scores;
}

export function calculateOverall(scores) {
  const values = Object.values(scores);
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function maturityLevel(score) {
  if (score < 30) return { key: "informal", label: "Informal", description: "O comercial depende fortemente de pessoas e improviso." };
  if (score < 50) return { key: "emergente", label: "Emergente", description: "Existem boas práticas, mas falta padrão e consistência." };
  if (score < 70) return { key: "estruturacao", label: "Estruturação", description: "A base existe, mas há gargalos travando a previsibilidade." };
  if (score < 85) return { key: "gerenciado", label: "Gerenciado", description: "O processo é consistente e orientado por dados." };
  return { key: "escalavel", label: "Escalável", description: "Alta padronização, automação e capacidade de crescimento." };
}

export function getGaps(scores) {
  return Object.entries(scores)
    .sort(([, a], [, b]) => a - b)
    .map(([dimension, score]) => ({ dimension, score }));
}

const recommendations = {
  estrategia: { title: "Definir Direção e ICP Claro", action: "Mapear Perfil de Cliente Ideal, proposta de valor e segmentos de maior margem." },
  processo: { title: "Padronizar o Funil de Vendas", action: "Desenhar etapas, gatilhos de passagem e cadência de follow-up." },
  pessoas: { title: "Reduzir Dependência e Organizar Rotina", action: "Tirar a venda da cabeça do fundador, definir metas e criar Playbook." },
  gestao: { title: "Implantar Gestão por Indicadores", action: "Estabelecer reuniões semanais de pipeline e acompanhar conversões." },
  tecnologia: { title: "Garantir Uso Real do CRM", action: "Configurar o CRM ao processo e criar governança de uso pelo time." },
  marketing: { title: "Conectar Demanda ao Pipeline", action: "Estruturar canais previsíveis de prospecção e alinhar SLA de lead qualificado." },
  retencao: { title: "Estruturar Pós-Venda e Expansão", action: "Criar régua de onboarding, gestão de satisfação e processo de indicação." },
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
  const sorted = Object.entries(scores).sort(([, a], [, b]) => a - b);
  const [dimension, score] = sorted[0] || ["processo", 0];
  return { dimension, score, ...recommendations[dimension] };
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
