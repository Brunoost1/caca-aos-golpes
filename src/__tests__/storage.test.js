import { describe, it, expect, beforeEach } from "vitest";
import { storage } from "../game/storage.js";

describe("storage wrapper", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it("sets and gets values under namespace", () => {
    storage.set("x", { a: 1 });
    const v = storage.get("x");
    expect(v).toEqual({ a: 1 });
  });
  it("returns fallback when missing", () => {
    const v = storage.get("missing", 42);
    expect(v).toBe(42);
  });
});