export function enableScanner(msg) {
  const $msg = document.querySelector(
    `.message-text[data-message-id="${msg.id}"], #phone-message`
  );
  if (!$msg) return;

  const text = msg.text;
  const chars = [...text];

  (msg.highlights || []).forEach((h) => {
    for (let i = h.start; i < h.end && i < chars.length; i++) {
      const ch = chars[i];
      if (!ch) continue;
      chars[i] = `<span class="highlight" title="${h.reason}">${escapeHtml(
        ch
      )}</span>`;
    }
  });

  $msg.innerHTML = chars.join("");
  $msg.dataset.messageId = msg.id;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}