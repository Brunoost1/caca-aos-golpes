import { DIFFICULTIES, state } from "./gameState.js";

export function pointsFor(difficulty) {
  if (difficulty === "facil") return 10;
  if (difficulty === "medio") return 15;
  return 20; // dificil
}

export function streakMultiplier(streak) {
  if (streak >= 10) return 2;
  if (streak >= 6) return 1.5;
  if (streak >= 3) return 1.2;
  return 1;
}

export function adaptDifficulty() {
  const last5 = state.history.slice(-5);
  const errors = last5.filter((x) => !x).length;
  const correct = last5.filter((x) => x).length;

  let idx = DIFFICULTIES.indexOf(state.level);
  if (correct >= 3 && idx < DIFFICULTIES.length - 1) idx += 1;
  if (errors >= 2 && idx > 0) idx -= 1;
  state.level = DIFFICULTIES[idx];
  return state.level;
}