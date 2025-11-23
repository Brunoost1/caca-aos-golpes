import { setDeck } from "./gameState.js";
import messages from "../data/messages.json" assert { type: "json" };

export async function loadMessages() {
  // aqui poderíamos futuramente buscar API; por enquanto, usa JSON local
  setDeck(messages);
}