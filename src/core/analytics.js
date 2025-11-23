import { state } from "./gameState.js";
import { storage } from "./storage.js";

const STORAGE_KEY = "caca-golpes-analytics";

export function initAnalytics() {
  // cria estrutura base se não existir
  const existing = storage.get(STORAGE_KEY, {});
  if (!existing.runs) existing.runs = [];
  storage.set(STORAGE_KEY, existing);
}

export function recordAnswer(message, isCorrect) {
  const session = storage.get("caca-golpes-session", {
    startedAt: new Date().toISOString(),
    answers: [],
  });

  session.answers.push({
    messageId: message.id,
    isCorrect,
    tags: message.tags,
    phase: state.phase,
    ts: Date.now(),
  });

  storage.set("caca-golpes-session", session);
}

export function closeSession() {
  const analytics = storage.get(STORAGE_KEY, { runs: [] });
  const session = storage.get("caca-golpes-session", null);
  if (!session) return;

  analytics.runs.push({
    ...session,
    finishedAt: new Date().toISOString(),
    score: state.score,
  });

  storage.set(STORAGE_KEY, analytics);
  storage.remove("caca-golpes-session");
  return { analytics, lastRun: analytics.runs[analytics.runs.length - 1] };
}

export function getTagStats() {
  const allTags = new Set([
    ...Object.keys(state.correctByTag),
    ...Object.keys(state.mistakesByTag),
  ]);
  const result = [];
  allTags.forEach((tag) => {
    const ok = state.correctByTag[tag] || 0;
    const fail = state.mistakesByTag[tag] || 0;
    const total = ok + fail;
    const acc = total === 0 ? 0 : Math.round((ok / total) * 100);
    result.push({ tag, ok, fail, total, acc });
  });
  result.sort((a, b) => a.acc - b.acc); // piores primeiro
  return result;
}