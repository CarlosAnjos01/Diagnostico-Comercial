import { dimensions } from "../data/questions";

// Classificação proprietária G.I.N.G.A.
export const MATURITY_LEVELS = {
  REATIVA: { min: 0, max: 20, label: "Reativa", key: "reativa", description: "Vendas ocorrem por acaso, sem rotina ou previsão." },
  INFORMAL: { min: 21, max: 40, label: "Informal", key: "informal", description: "Depende de pessoas, experiência e improviso dos vendedores." },
  ESTRUTURANDO: { min: 41, max: 60, label: "Estruturando", key: "estruturando", description: "Processo em construção, mas ainda com gargalos de execução." },
  GERENCIADA: { min: 61, max: 80, label: "Gerenciada", key: "gerenciada", description: "Operação padronizada, previsível e acompanhada por indicadores." },
  ESCALAVEL: { min: 81, max: 100, label: "Escalável", key: "escalavel", description: "Alta maturidade, cultura de dados, automação e contínua evolução." }
};

/**
 * Calcula a pontuação por dimensão considerando pesos e respostas por papel.
 * Suporta respostas de múltiplos papéis (Dono, Gestor, Vendas, etc).
 */
export function calculateScores(answersList, questionsList) {
  const dimensionScores = {};
  const answersArray = Array.isArray(answersList) ? answersList : [answersList];

  dimensions.forEach((dim) => {
    const dimQuestions = questionsList.filter((q) => q.dimension === dim.id);
    if (!dimQuestions.length) {
      dimensionScores[dim.id] = 0;
      return;
    }

    let totalEarned = 0;
    let totalPossible = 0;

    dimQuestions.forEach((q) => {
      const weight = q.weight || 1;
      let qTotalScore = 0;
      let qResponses = 0;

      answersArray.forEach((resp) => {
        if (resp[q.id] !== undefined) {
          // Normaliza valor de 1 a 3 para escala percentual (1 = 33.3%, 2 = 66.6%, 3 = 100%)
          const normalized = ((Number(resp[q.id]) - 1) / 2) * 100;
          qTotalScore += normalized;
          qResponses += 1;
        }
      });

      if (qResponses > 0) {
        const qAvg = qTotalScore / qResponses;
        totalEarned += qAvg * weight;
        totalPossible += 100 * weight;
      }
    });

    dimensionScores[dim.id] = totalPossible > 0 
      ? Math.round((totalEarned / totalPossible) * 100) 
      : 0;
  });

  return dimensionScores;
}

export function calculateOverallScore(dimensionScores) {
  const values = Object.values(dimensionScores);
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function getMaturityLevel(overallScore) {
  return Object.values(MATURITY_LEVELS).find(
    (lvl) => overallScore >= lvl.min && overallScore <= lvl.max
  ) || MATURITY_LEVELS.REATIVA;
}
