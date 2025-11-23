// src/core/messagesLoader.js
import { setDeck } from "./gameState.js";

export async function loadMessages() {
  // Carrega o JSON como arquivo estático no navegador
  const res = await fetch("/src/data/messages.json");

  if (!res.ok) {
    console.error("Falha ao carregar messages.json", res.status);
    return;
  }

  const messages = await res.json();
  setDeck(messages);
}
