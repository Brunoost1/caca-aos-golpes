export function feedbackMessage(card, isCorrect) {
  const base = isCorrect ? "✅ Acertou!" : "❌ Errou.";
  const tip = Array.isArray(card.hints) && card.hints.length
    ? " Dica: " + card.hints.join(" • ")
    : "";
  return `${base} ${card.rationale}${tip ? " —" + tip : ""}`;
}