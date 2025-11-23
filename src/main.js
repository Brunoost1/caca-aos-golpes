import { resetState, state } from "./core/gameState.js";
import "../style.css";
import { loadMessages } from "./core/messagesLoader.js";
import { renderPhone } from "./ui/phoneView.js";
import { renderDashboard } from "./ui/dashboardView.js";
import { initAnalytics } from "./core/analytics.js";

const $app = document.getElementById("app");

function renderShell() {
  $app.innerHTML = `
    <header class="app-header">
      <div>
        <div class="app-title">
          <span>Caça aos Golpes Digitais</span>
          <span class="badge badge-animated">Bank Edition · MVP</span>
        </div>
        <div class="text-muted">Treine sua capacidade de identificar golpes em contextos bancários, em tempo real.</div>
      </div>
      <div class="btn-group">
        <button id="btn-pretest" class="btn btn-ghost">Pré-teste</button>
        <button id="btn-campaign" class="btn btn-primary">Jogar campanha</button>
      </div>
    </header>
    <main class="app-main">
      <section class="panel">
        <div class="panel-content" id="panel-main"></div>
      </section>
      <aside class="panel">
        <div class="panel-content" id="panel-side"></div>
      </aside>
    </main>
    <footer class="app-footer">
      <span>Protótipo educacional · Dados apenas no seu navegador (localStorage).</span>
      <span>Grupo: Caça aos Golpes Digitais · Banking & Phishing</span>
    </footer>
  `;

  document.getElementById("btn-pretest").onclick = () => startFlow("pretest");
  document.getElementById("btn-campaign").onclick = () => startFlow("campaign");
}

async function startFlow(phase) {
  resetState(phase);
  await loadMessages();
  initAnalytics();

  const $panelMain = document.getElementById("panel-main");
  const $panelSide = document.getElementById("panel-side");

  renderPhone($panelMain, $panelSide);

  document.addEventListener("game:finished", () => {
    renderDashboard($panelMain, $panelSide);
  }, { once: true });
}

renderShell();