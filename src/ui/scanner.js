export function enableScanner(msg) {
  const $msg = document.querySelector("#phone-message");
  if (!$msg) return;

  const chars = [...msg.text];

  (msg.highlights || []).forEach((h) => {
    for (let i = h.start; i < h.end; i++) {
      chars[i] = `<span class="highlight" title="${h.reason}">${escapeHtml(chars[i])}</span>`;
    }
  });

  $msg.innerHTML = chars.join("");
}


function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}