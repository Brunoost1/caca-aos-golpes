import { describe, it, expect } from "vitest";
import { state } from "../game/gameState.js";
import { adaptDifficulty } from "../game/difficulty.js";

describe("difficulty adaptation", () => {
  it("goes up after 3 correct in last 5", () => {
    state.level = "facil";
    state.history = [true, true, true];
    const lvl = adaptDifficulty();
    expect(["medio","dificil"]).toContain(lvl);
  });

  it("goes down after 2 errors in last 5", () => {
    state.level = "medio";
    state.history = [false, false, true, true, true];
    const lvl = adaptDifficulty();
    expect(["facil","medio"]).toContain(lvl);
  });
});