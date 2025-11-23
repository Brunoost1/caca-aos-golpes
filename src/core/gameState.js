export const DIFFICULTIES = ["easy", "medium", "hard"];

export const state = {
  deck: [],
  currentIndex: 0,
  score: 0,
  combo: 0,
  mistakesByTag: {},
  correctByTag: {},
  phase: "campaign",
};

export function resetState(phase = "campaign") {
  state.deck = [];
  state.currentIndex = 0;
  state.score = 0;
  state.combo = 0;
  state.mistakesByTag = {};
  state.correctByTag = {};
  state.phase = phase;
}

export function setDeck(messages) {
  // Em uma versão futura, podemos filtrar por dificuldade
  state.deck = shuffle(messages);
  state.currentIndex = 0;
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}