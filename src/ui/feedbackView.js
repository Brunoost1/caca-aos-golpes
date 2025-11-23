export function renderFeedback(container, result) {
  const { msg, isCorrect, combo, score } = result;

  const icon = isCorrect ? "✅" : "⚠️";
  const bannerClass = isCorrect ? "success" : "error";
  const labelClass = isCorrect ? "ok" : "bad";
  const labelText = isCorrect ? "Leitura segura" : "Atenção redobrada";

  const tagsHtml = msg.tags
    .map(
      (t) => `<span class="tag-pill">
        <span>•</span><span>${mapTagLabel(t)}</span>
      </span>`
    )
    .join("");

  container.innerHTML = `
    <div class="feedback-banner ${bannerClass}">
      <div class="feedback-label ${labelClass}">${labelText}</div>
      <div>${icon} ${isCorrect ? "Boa! Você classificou corretamente a mensagem." : "Essa mensagem foi classificada de forma equivocada."}</div>
      <div class="text-muted">
        ${buildExplanation(msg)}
      </div>
      <div style="margin-top: 6px; display:flex; flex-wrap:wrap; gap:6px;">
        ${tagsHtml}
      </div>
      <div class="text-muted" style="margin-top: 6px;">
        Score: <strong>${score}</strong> · Combo atual: <strong>${combo}x</strong>
      </div>
    </div>
  `;
}

function buildExplanation(msg) {
  if (msg.isFraud) {
    return (
      "A mensagem é um golpe. Observe como ela usa " +
      (msg.tags.includes("urgency") ? "urgência artificial, " : "") +
      (msg.tags.includes("fake_url") ? "links suspeitos, " : "") +
      (msg.tags.includes("data_request") ? "pedido de dados sensíveis " : "") +
      "para tentar forçar uma ação rápida."
    );
  }
  return "A mensagem é legítima dentro do contexto bancário. Mesmo assim, continue atento a domínios oficiais e canais de comunicação verificados.";
}

function mapTagLabel(tag) {
  const map = {
    fake_url: "URL suspeita",
    urgency: "Urgência exagerada",
    reward: "Promessa de prêmio",
    data_request: "Pede dados sensíveis",
    attachment: "Anexo inesperado",
  };
  return map[tag] || tag;
}