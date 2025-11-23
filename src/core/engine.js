import { state } from "./gameState.js";
import { recordAnswer } from "./analytics.js";

export function getCurrentMessage() {
  return state.deck[state.currentIndex] ?? null;
}

export function answerCurrentMessage(userThinksIsFraud) {
  const msg = getCurrentMessage();
  if (!msg) return null;

  const isCorrect = userThinksIsFraud === msg.isFraud;

  if (isCorrect) {
    state.combo++;
    state.score += 100 * state.combo;
  } else {
    state.combo = 0;
    state.score = Math.max(0, state.score - 40);
  }

  const bucket = isCorrect ? state.correctByTag : state.mistakesByTag;
  msg.tags.forEach((tag) => {
    bucket[tag] = (bucket[tag] || 0) + 1;
  });

  recordAnswer(msg, isCorrect);

  const result = {
    msg,
    isCorrect,
    combo: state.combo,
    score: state.score,
  };

  state.currentIndex++;

  if (state.currentIndex >= state.deck.length) {
    document.dispatchEvent(new CustomEvent("game:finished"));
  }

  return result;
}