import { state } from "../core/gameState.js";
import { getCurrentMessage, answerCurrentMessage } from "../core/engine.js";
import { renderFeedback } from "./feedbackView.js";
import { enableScanner } from "./scanner.js";

let $panelMain;
let $panelSide;
let keyboardBound = false;

export function renderPhone(panelMain, panelSide) {
  $panelMain = panelMain;
  $panelSide = panelSide;
  renderLayout();
  renderCurrentMessage();
  renderSideInfo();
}

function renderLayout() {
  $panelMain.innerHTML = `
    <div class="panel-title">Simulador de Vida Digital</div>
    <div class="panel-subtitle">Analise as notificações e diga se são golpes ou comunicações legítimas.</div>
    <div class="phone-shell">
      <div class="phone-notch"></div>
      <div class="phone-inner">
        <header class="phone-header">
          <div>
            <div class="phone-channel" id="phone-channel"></div>
            <div class="phone-sender" id="phone-sender"></div>
          </div>
          <div class="chip">
            <span id="phone-progress">0 / 0</span>
          </div>
        </header>
        <main class="phone-body">
          <div class="message-bubble">
            <p class="message-text" id="phone-message"></p>
          </div>
        </main>
        <footer class="phone-footer">
          <div class="phone-main-actions">
            <button id="btn-safe" class="btn btn-primary">Mensagem verdadeira</button>
            <button id="btn-fraud" class="btn btn-danger">É golpe</button>
          </div>
          <div class="phone-tools">
            <button id="btn-scanner" class="btn btn-ghost">Scanner de risco 🔎</button>
            <span class="text-muted">Use o scanner para destacar sinais suspeitos.</span>
          </div>
          <div id="feedback-area" aria-live="polite" aria-atomic="true"></div>
        </footer>
      </div>
    </div>
  `;

  $panelMain.querySelector("#btn-safe").onclick = () => handleAnswer(false);
  $panelMain.querySelector("#btn-fraud").onclick = () => handleAnswer(true);
  $panelMain.querySelector("#btn-scanner").onclick = handleScanner;

  if (!keyboardBound) {
    document.addEventListener("keydown", handleKeydown);
    keyboardBound = true;
  }
}

function renderCurrentMessage() {
  const msg = getCurrentMessage();
  const $channel = $panelMain.querySelector("#phone-channel");
  const $sender = $panelMain.querySelector("#phone-sender");
  const $message = $panelMain.querySelector("#phone-message");
  const $progress = $panelMain.querySelector("#phone-progress");

  if (!msg) {
    $message.textContent = "Fim das mensagens desta rodada!";
    $channel.textContent = "";
    $sender.textContent = "";
    $progress.textContent = `${state.currentIndex} / ${state.deck.length}`;
    $panelMain
      .querySelector(".phone-main-actions")
      .classList.add("phone-main-actions--disabled");
    return;
  }

  $channel.textContent = msg.channelLabel;
  $sender.textContent = msg.sender;
  $message.textContent = msg.text;
  $progress.textContent = `${state.currentIndex + 1} / ${state.deck.length}`;
}

function renderSideInfo() {
  $panelSide.innerHTML = `
    <div class="panel-title">Telemetria em tempo real</div>
    <div class="panel-subtitle">Como está sua leitura de risco neste momento?</div>

    <div class="stat-grid">
      <div class="stat-badge">
        <span>Score</span>
        <strong id="stat-score">${state.score}</strong>
      </div>
      <div class="stat-badge">
        <span>Combo</span>
        <strong id="stat-combo">${state.combo}x</strong>
      </div>
      <div class="stat-badge">
        <span>Mensagens</span>
        <strong>${state.deck.length}</strong>
      </div>
      <div class="stat-badge badge-phase">
        Fase: ${state.phase === "pretest" ? "Pré-teste" : "Campanha"}
      </div>
    </div>
    <p class="text-muted">
      Dica: não se deixe levar apenas pelo medo ou pela urgência da mensagem. Observe o domínio do link,
      o tipo de pedido e se faz sentido com a forma como seu banco se comunica com você.
    </p>
    <div id="side-extra"></div>
  `;
}

function handleKeydown(event) {
  // Controles de acessibilidade via teclado:
  // ← mensagem verdadeira | → é golpe | Espaço/Enter aciona o scanner
  if (event.key === "ArrowLeft") {
    handleAnswer(false);
  } else if (event.key === "ArrowRight") {
    handleAnswer(true);
  } else if (event.key === " " || event.key === "Enter") {
    const btnScan = $panelMain?.querySelector("#btn-scanner");
    if (btnScan) {
      event.preventDefault();
      btnScan.click();
    }
  }
}

function handleAnswer(isFraud) {
  const result = answerCurrentMessage(isFraud);
  renderFeedback(result);
  renderSideInfo();

  // animação rápida de "feedback" no card (se quiser algo extra, dá pra adicionar classe CSS aqui)

  // se ainda houver próxima mensagem, agenda render
  const msg = getCurrentMessage();
  if (msg) {
    setTimeout(() => {
      renderCurrentMessage();
    }, 900);
  }
}

function handleScanner() {
  const msg = getCurrentMessage();
  if (!msg) return;
  enableScanner(msg);
}
