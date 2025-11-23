import { storage } from "./storage.js";

export const DIFFICULTIES = ["facil", "medio", "dificil"];

const lastScore = storage.get("lastScore", 0);

export const state = {
  // Nome do jogador (agente)
  playerName: storage.get("playerName", ""),

  // Dificuldade atual
  level: storage.get("level", "facil"),

  // Pontuação atual e pontuação inicial desta sessão
  score: lastScore,
  initialScore: lastScore,

  // Melhor pontuação histórica
  best: storage.get("best", 0),

  // Dados usados pelo motor do jogo
  streak: 0,
  progress: 0, // 0..5 por fase
  history: [], // últimos resultados (true/false)
  seed: Date.now() % 1_000_000,
};

export function resetPhase() {
  state.progress = 0;
  state.streak = 0;
  state.history = [];
}

export function savePersistent() {
  storage.set("level", state.level);
  storage.set("best", Math.max(state.best, state.score));
  storage.set("lastScore", state.score);
  if (state.playerName) {
    storage.set("playerName", state.playerName);
  }
}
