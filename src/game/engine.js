import { state } from "./gameState.js";
import { pointsFor, streakMultiplier, adaptDifficulty } from "./difficulty.js";

// Fisher-Yates
export function shuffle(arr, seed = Date.now()) {
  const a = [...arr];
  let m = a.length, i;
  let s = seed;
  function rnd() {
    // xorshift-ish deterministic PRNG
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return Math.abs(s) / 2 ** 31;
  }
  while (m) {
    i = Math.floor(rnd() * m--);
    [a[m], a[i]] = [a[i], a[m]];
  }
  return a;
}

export function evaluateAnswer(card, answer /* 'real' | 'golpe' */) {
  const isCorrect = card.label === answer;
  if (isCorrect) {
    state.streak += 1;
    const mult = streakMultiplier(state.streak);
    state.score += Math.round(pointsFor(card.difficulty) * mult);
  } else {
    state.streak = 0;
  }
  state.history.push(isCorrect);
  state.progress += 1;
  if (state.progress >= 5) {
    adaptDifficulty();
    state.progress = 0;
  }
  state.best = Math.max(state.best, state.score);
  return isCorrect;
}