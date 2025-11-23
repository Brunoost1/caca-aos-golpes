import { setDeck } from "./gameState.js";

export async function loadMessages() {
  try {
    const res = await fetch("/data/messages.json");

    if (!res.ok) {
      console.error("Falha ao carregar messages.json", res.status);
      return;
    }

    const messages = await res.json();
    setDeck(messages);
  } catch (err) {
    console.error("Erro ao buscar mensagens:", err);
  }
}
