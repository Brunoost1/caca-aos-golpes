import { describe, it, expect } from "vitest";
import { evaluateAnswer } from "../game/engine.js";
import { state } from "../game/gameState.js";

describe("evaluateAnswer scoring & progression", () => {
  it("awards points and updates streak", () => {
    state.score = 0; state.streak = 0; state.progress = 0;
    const card = { label: "real", difficulty: "facil" };
    const ok = evaluateAnswer(card, "real");
    expect(ok).toBe(true);
    expect(state.score).toBeGreaterThan(0);
    expect(state.streak).toBe(1);
  });
});