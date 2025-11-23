import { handleChoice, currentCard } from "./ui.js";

export function initAccessibility() {
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === "r") { e.preventDefault(); handleChoice("real"); }
    if (k === "g") { e.preventDefault(); handleChoice("golpe"); }
    if (k === "enter") {
      const card = currentCard();
      if (card) {
        // Enter confirma a última escolha (preferimos repetir a última interação)
      }
    }
  });
}