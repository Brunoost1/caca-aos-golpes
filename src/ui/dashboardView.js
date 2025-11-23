import { closeSession, getTagStats } from "../core/analytics.js";
import { state } from "../core/gameState.js";

export function renderDashboard(panelMain, panelSide) {
  const { lastRun } = closeSession();
  const stats = getTagStats();

  panelMain.innerHTML = `
    <div class="panel-title">Relatório de vulnerabilidades</div>
    <div class="panel-subtitle">Como a gamificação impactou sua capacidade de identificar golpes digitais?</div>
    <div class="dashboard-grid">
      <section class="dashboard-section">
        <h3>Resumo da sessão</h3>
        <p class="text-muted">
          Fase: <strong>${state.phase === "pretest" ? "Pré-teste" : "Campanha"}</strong><br/>
          Score total: <strong>${state.score}</strong><br/>
          Mensagens avaliadas: <strong>${lastRun?.answers.length ?? 0}</strong>
        </p>
        <p class="text-muted">
          Use estes dados no seu relatório de pesquisa para discutir se o jogo ajudou
          na identificação de fraudes. Você pode comparar sessões de pré-teste e pós-teste,
          analisando principalmente os percentuais de acerto por categoria de golpe.
        </p>
      </section>
      <section class="dashboard-section">
        <h3>Badge de risco</h3>
        <p>
          <span class="badge-level">
            ${buildRiskLabel(stats)}
          </span>
        </p>
        <p class="text-muted">
          Quanto mais próximo de 100% em todas as categorias, mais difícil é para golpes
          digitais te enganarem.
        </p>
      </section>
    </div>
    <section class="dashboard-section" style="margin-top: 10px;">
      <h3>Precisão por categoria de golpe</h3>
      <ul class="dashboard-list">
        ${stats
          .map(
            (s) => `
          <li>
            <span>${mapTagLabel(s.tag)}</span>
            <span>${s.acc}% de acerto (${s.ok}/${s.total})</span>
          </li>
        `
          )
          .join("")}
      </ul>
    </section>
  `;

  panelSide.innerHTML = `
    <div class="panel-title">Próximos passos</div>
    <div class="panel-subtitle">Como usar este MVP no seu trabalho acadêmico</div>
    <p class="text-muted">
      • Aplique o pré-teste para medir a taxa de acerto inicial dos participantes.<br/>
      • Deixe-os jogar a campanha algumas vezes, explorando o scanner e as dicas.<br/>
      • Aplique um pós-teste com novas mensagens e compare os resultados.
    </p>
    <p class="text-muted">
      Você pode extrair os dados do <code>localStorage</code> (chave <code>caca-golpes-analytics</code>)
      para gerar gráficos adicionais (por exemplo, no Excel ou Python) e fortalecer seu relatório.
    </p>
    <button class="btn btn-primary" onclick="location.reload()">Jogar novamente</button>
  `;
}

function mapTagLabel(tag) {
  const map = {
    fake_url: "URLs suspeitas",
    urgency: "Urgência exagerada",
    reward: "Prêmios falsos",
    data_request: "Pedidos de dados sensíveis",
    attachment: "Anexos duvidosos",
  };
  return map[tag] || tag;
}

function buildRiskLabel(stats) {
  const avg =
    stats.length === 0
      ? 0
      : Math.round(
          stats.reduce((sum, s) => sum + s.acc, 0) / stats.length
        );
  if (avg >= 90) return "Escudo de Platina · Quase inhackeável";
  if (avg >= 75) return "Escudo de Ouro · Muito atento a golpes";
  if (avg >= 55) return "Escudo de Prata · Bom, mas ainda vulnerável";
  return "Escudo de Bronze · Precisa de mais treino";
}