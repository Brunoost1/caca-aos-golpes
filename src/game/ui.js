// src/game/ui.js
import { navigate } from "../router.js";
import { state, savePersistent, resetPhase } from "./gameState.js";
import { evaluateAnswer, shuffle } from "./engine.js";
import { feedbackMessage } from "./feedback.js";
import { storage } from "./storage.js";
import cardsRaw from "../data/messages.json";
import whitelist from "../data/banks-whitelist.json"; // ainda disponível se quiser usar depois

let $app;
let deck = [];
let idx = 0;
let lastFeedback = "";
let _current = null;

export function initUI() {
  $app = document.getElementById("app");
}

function pickDeck(level) {
  const byLevel = cardsRaw.filter((c) => c.difficulty === level);
  // 5 cards por fase, embaralhados com a seed do estado
  return shuffle(byLevel, state.seed).slice(0, 5);
}

/**
 * Layout base futurista do jogo:
 * - card grandão com bordas neon
 * - fundo com gradientes radiais
 * - header com logo e atalhos para Sobre/Admin
 */
function renderGameLayout(inner) {
  // garante que o app ocupe a tela toda e tenha fundo escuro
  if ($app) {
    $app.className = "min-h-screen w-full bg-slate-950 text-slate-100";
  }

  $app.innerHTML = `
    <div class="min-h-screen w-full flex items-center justify-center">
      <div class="relative w-full max-w-6xl mx-auto overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950/90 text-slate-100 shadow-[0_0_40px_rgba(8,145,178,0.8)]">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(244,63,94,0.18),transparent_50%)]"></div>
        <div class="relative p-4 sm:p-6 space-y-4">
          <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900/80 ring-1 ring-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.7)]">
                <img src="/icon-192.png" alt="" class="h-7 w-7 rounded-xl" />
              </span>
              <div>
                <p class="text-xs font-medium uppercase tracking-[0.22em] text-cyan-400">
                  Caça aos Golpes • Modo Futurista
                </p>
                <h1 class="text-lg sm:text-xl font-semibold text-slate-50">
                  Simulador de golpes digitais
                </h1>
              </div>
            </div>
            <div class="flex gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">
              <a href="#/sobre" class="rounded-full border border-slate-600/50 px-3 py-1 hover:border-cyan-400/70 hover:text-cyan-200 transition">
                Sobre
              </a>
              <a href="#/admin" class="rounded-full border border-slate-600/50 px-3 py-1 hover:border-cyan-400/70 hover:text-cyan-200 transition">
                Admin
              </a>
            </div>
          </header>

          <main class="space-y-4">
            ${inner}
          </main>
        </div>
      </div>
    </div>
  `;
}


/**
 * HUD futurista com:
 * - nome do agente
 * - pontuação inicial (carregada do localStorage)
 * - placar atual, melhor, streak, progresso
 */
function hud() {
  const name = state.playerName || "Agente anônimo";
  const initial = typeof state.initialScore === "number" ? state.initialScore : 0;
  const progressPercent = Math.min((state.progress / 5) * 100, 100);

  return /*html*/ `
    <section class="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-start">
      <div class="rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-900/80 p-4 sm:p-5 shadow-[0_0_35px_rgba(8,145,178,0.6)]">
        <p class="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-cyan-300">
          Painel do agente
        </p>
        <h2 class="text-lg sm:text-xl font-semibold text-cyan-100 mb-1">
          ${name}
        </h2>
        <p class="text-xs text-slate-300 mb-3">
          Pontuação inicial desta sessão:
          <span class="font-semibold text-emerald-300">${initial}</span>
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-[0.8rem]">
          <div class="flex flex-col rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2">
            <span class="text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">Nível</span>
            <span class="mt-1 text-sm font-semibold text-cyan-200 capitalize">${state.level}</span>
          </div>
          <div class="flex flex-col rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2">
            <span class="text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">Streak</span>
            <span class="mt-1 text-sm font-semibold text-emerald-300">${state.streak}</span>
          </div>
          <div class="flex flex-col rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2">
            <span class="text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">Placar</span>
            <span class="mt-1 text-sm font-semibold text-slate-50">${state.score}</span>
          </div>
          <div class="flex flex-col rounded-2xl border border-slate-700/70 bg-slate-950/70 px-3 py-2">
            <span class="text-[0.6rem] uppercase tracking-[0.18em] text-slate-400">Melhor</span>
            <span class="mt-1 text-sm font-semibold text-fuchsia-300">${state.best}</span>
          </div>
        </div>

        <button
          id="change-player"
          type="button"
          class="mt-3 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.2em] text-slate-400 hover:text-cyan-300"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-cyan-400/70 animate-pulse"></span>
          Trocar agente
        </button>
      </div>

      <div class="rounded-3xl border border-fuchsia-500/30 bg-slate-900/70 p-4 sm:p-5 shadow-[0_0_25px_rgba(217,70,239,0.5)]">
        <p class="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-fuchsia-300">
          Progresso da fase
        </p>
        <div class="mb-1 flex items-center justify-between text-[0.7rem] text-slate-300">
          <span>${state.progress}/5 mensagens</span>
          <span>${Math.round(progressPercent)}%</span>
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-slate-800/90">
          <div
            class="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-fuchsia-400 transition-all duration-300"
            style="width: ${progressPercent}%;"
          ></div>
        </div>
        <p class="mt-3 text-[0.7rem] text-slate-400">
          Dica: use
          <kbd class="rounded border border-slate-500/70 bg-slate-900/70 px-1">R</kbd>
          para real e
          <kbd class="rounded border border-slate-500/70 bg-slate-900/70 px-1">G</kbd>
          para golpe.
        </p>
      </div>
    </section>
  `;
}

/**
 * Card principal da mensagem com visual neon/cyberpunk e botões “fora do comum”
 */
function renderCard(card) {
  _current = card;

  const channel = String(card.channel || "").toUpperCase();
  const risk = card.risks || "desconhecido";

  return /*html*/ `
    <article class="group relative mt-2 overflow-hidden rounded-3xl border border-cyan-500/40 bg-slate-900/80 p-4 sm:p-5 shadow-[0_0_35px_rgba(8,145,178,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(34,211,238,0.9)]">
      <div class="pointer-events-none absolute -left-16 top-0 h-40 w-40 rotate-12 bg-gradient-to-br from-cyan-400/40 via-emerald-400/20 to-transparent opacity-70 blur-2xl group-hover:opacity-100"></div>

      <header class="relative mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <div class="inline-flex items-center gap-2">
          <span class="inline-flex items-center gap-1 rounded-full border border-cyan-400/60 bg-slate-950/80 px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-cyan-200">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>${channel}</span>
          </span>
          <span class="inline-flex items-center gap-1 rounded-full border border-amber-400/60 bg-amber-500/10 px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-amber-200">
            <span class="h-1 w-1 rounded-full bg-amber-300"></span>
            <span>Risco: ${risk}</span>
          </span>
        </div>
        <span class="text-[0.65rem] font-mono uppercase tracking-[0.22em] text-slate-400">
          ID ${String(card.id || "").slice(0, 8).toUpperCase()}
        </span>
      </header>

      <p class="relative mb-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-50">
        ${card.text}
      </p>

      <div class="relative mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          id="btn-real"
          class="flex-1 rounded-full border border-emerald-400/50 bg-emerald-500/15 px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.45)] transition-transform duration-200 hover:-translate-y-[1px] hover:bg-emerald-500/25 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Marcar como mensagem real"
        >
          É real (R)
        </button>
        <button
          id="btn-golpe"
          class="flex-1 rounded-full border border-rose-400/60 bg-rose-500/15 px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-rose-100 shadow-[0_0_20px_rgba(248,113,113,0.55)] transition-transform duration-200 hover:-translate-y-[1px] hover:bg-rose-500/25 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          aria-label="Marcar como golpe"
        >
          É golpe (G)
        </button>
      </div>

      <div id="feedback" class="mt-4 text-sm text-slate-200">${lastFeedback}</div>
    </article>
  `;
}

/**
 * Tela inicial pedindo o nome do jogador (agente) e mostrando a pontuação inicial
 */
function renderNameStep() {
  const savedName = state.playerName || storage.get("playerName", "");
  const initial = typeof state.initialScore === "number" ? state.initialScore : 0;

  return /*html*/ `
    <section class="mt-2">
      <div class="rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-5 py-6 shadow-[0_0_40px_rgba(34,211,238,0.6)]">
        <p class="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-cyan-300">
          Missão anti-golpes • Identificação do agente
        </p>
        <h2 class="mb-3 text-2xl font-semibold text-slate-50">
          Quem está jogando hoje?
        </h2>
        <p class="mb-5 text-sm text-slate-300">
          Digite seu nome para registrar a pontuação e acompanhar sua evolução no combate a golpes digitais.
        </p>

        <form id="player-form" class="flex flex-col gap-3 sm:flex-row">
          <div class="relative flex-1">
            <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-cyan-400">
              Agente
            </span>
            <input
              id="player-name"
              type="text"
              autocomplete="name"
              class="mt-5 w-full rounded-2xl border border-cyan-500/50 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 shadow-[0_0_24px_rgba(8,145,178,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              placeholder="Digite seu codinome (ex: Bruno, Agente 01...)"
              value="${savedName}"
            />
          </div>
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-fuchsia-500 px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.7)] transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Entrar na missão
          </button>
        </form>

        <p class="mt-4 text-xs text-slate-400">
          Pontuação inicial carregada do último jogo:
          <span class="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-emerald-200">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
            <span><strong>${initial}</strong> pontos</span>
          </span>
        </p>
      </div>
    </section>
  `;
}

/**
 * Fluxo principal do jogo:
 * 1. Se não tiver nome → tela de agente
 * 2. Se tiver nome → HUD + card + botões
 */
function renderHome() {
  // 1) Sem nome ainda → pede antes de começar
  if (!state.playerName) {
    renderGameLayout(renderNameStep());

    const form = document.getElementById("player-form");
    const input = document.getElementById("player-name");

    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = input.value.trim();
        if (!name) {
          input.focus();
          return;
        }

        state.playerName = name;

        // Sempre que um novo agente entra, fixamos a pontuação inicial desta sessão
        const lastScore = storage.get("lastScore", 0);
        const initial = typeof lastScore === "number" ? lastScore : 0;
        state.initialScore = initial;
        state.score = initial;

        savePersistent();
        renderHome();
      });
    }

    return;
  }

  // 2) Já temos agente → segue o jogo normal
  if (!deck.length || state.progress === 0) {
    deck = pickDeck(state.level);
    idx = 0;
    resetPhase();
  }

  const card = deck[idx];
  renderGameLayout(`
    ${hud()}
    ${renderCard(card)}
  `);

  const realBtn = document.getElementById("btn-real");
  const golpeBtn = document.getElementById("btn-golpe");
  if (realBtn) realBtn.addEventListener("click", () => handleChoice("real"));
  if (golpeBtn) golpeBtn.addEventListener("click", () => handleChoice("golpe"));

  const change = document.getElementById("change-player");
  if (change) {
    change.addEventListener("click", (e) => {
      e.preventDefault();
      state.playerName = "";
      savePersistent();
      renderHome();
    });
  }
}

/**
 * Mantido para o módulo de acessibilidade:
 * - atualiza estado
 * - salva em localStorage (score, best, lastScore, playerName)
 * - chama o próximo card
 */
export function handleChoice(answer) {
  const card = deck[idx];
  const correct = evaluateAnswer(card, answer);
  lastFeedback = feedbackMessage(card, correct);
  storage.set("lastPlayedAt", Date.now());

  if (state.progress === 0) {
    // fase terminou -> novo deck
    deck = pickDeck(state.level);
    idx = 0;
  } else {
    idx = Math.min(idx + 1, deck.length - 1);
  }

  savePersistent();
  renderHome();
}

export function currentCard() {
  return _current;
}

/**
 * Função exportada usada pelo router para desenhar o jogo
 */
export function renderGame() {
  renderHome();
}

/**
 * As telas de Sobre/Admin continuam simples, usando o navbar antigo
 * (se quiser, depois dá pra aplicar o mesmo tema futurista aqui também)
 */
export function renderAbout() {
  renderNavbar();
  $app.innerHTML = `
  <section class="prose max-w-none">
    <h1>Sobre</h1>
    <p><strong>Caça aos Golpes Digitais</strong> — mini-jogo educativo para identificar fraudes.</p>
    <p><strong>Créditos:</strong> Bruno Santos Teixeira; João Victor da Silva Santos; Leonardo Affonso de Freitas; Rafael Oliveira Marcelino.</p>
    <p>Este projeto é open-source (MIT) e não coleta dados pessoais. Métricas são agregadas localmente.</p>
    <p><a class="underline text-sky-600" href="/public/estudo.pdf" target="_blank" rel="noopener">Material estático do estudo (PDF)</a></p>
  </section>`;
}

export function renderAdmin() {
  renderNavbar();
  $app.innerHTML = `
  <section>
    <h1 class="mb-3 text-2xl font-semibold">Admin (offline)</h1>
    <form id="gate" class="mb-4 flex gap-2 items-center" aria-label="Proteção por senha didática">
      <input id="pwd" type="password" class="rounded border px-3 py-2" placeholder="senha didática" aria-label="Senha didática" />
      <button class="rounded bg-sky-600 px-3 py-2 text-white">Entrar</button>
      <p class="text-sm text-slate-600">Dica: <code>prof123</code></p>
    </form>
    <div id="panel" class="hidden"></div>
  </section>`;

  document.getElementById("gate").addEventListener("submit", async (e) => {
    e.preventDefault();
    const ok = document.getElementById("pwd").value === "prof123";
    if (!ok) return alert("Senha incorreta.");
    const { mountAdmin } = await import("../admin/admin.js");
    document.getElementById("panel").classList.remove("hidden");
    document.getElementById("gate").classList.add("hidden");
    mountAdmin(document.getElementById("panel"));
  });
}

function renderNavbar() {
  $app.innerHTML = `
  <nav class="mb-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <img src="/icon-192.png" alt="" class="h-8 w-8" />
      <a href="#/jogar" class="font-semibold">Caça aos Golpes</a>
    </div>
    <div class="flex gap-2">
      <a class="rounded px-3 py-1 hover:bg-slate-200" href="#/jogar">Jogar</a>
      <a class="rounded px-3 py-1 hover:bg-slate-200" href="#/sobre">Sobre</a>
      <a class="rounded px-3 py-1 hover:bg-slate-200" href="#/admin">Admin</a>
    </div>
  </nav>`;
}
