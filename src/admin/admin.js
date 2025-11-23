import Ajv from "ajv";
import schema from "../data/messages.schema.json";
import defaultCards from "../data/messages.json";
import { v4 as uuidv4 } from "uuid";

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

export function mountAdmin($root) {
  let cards = JSON.parse(JSON.stringify(defaultCards));

  function renderList() {
    $root.innerHTML = `
    <div class="mb-3 flex gap-2">
      <button id="add" class="rounded bg-sky-600 px-3 py-2 text-white">Novo card</button>
      <button id="export" class="rounded bg-emerald-600 px-3 py-2 text-white">Exportar JSON</button>
      <label class="rounded border px-3 py-2 cursor-pointer">
        Importar JSON <input id="import" type="file" accept="application/json" class="hidden" />
      </label>
      <span class="text-sm text-slate-600">Total: ${cards.length}</span>
    </div>
    <table class="w-full text-sm">
      <thead><tr class="text-left">
        <th>ID</th><th>Canal</th><th>Dificuldade</th><th>Rótulo</th><th>Texto</th><th></th>
      </tr></thead>
      <tbody>
        ${cards.map(c => `
          <tr class="border-b align-top">
            <td class="pr-2">${c.id}</td>
            <td class="pr-2">${c.channel}</td>
            <td class="pr-2">${c.difficulty}</td>
            <td class="pr-2">${c.label}</td>
            <td class="pr-2 max-w-[480px] truncate" title="${c.text}">${c.text}</td>
            <td class="pr-2 whitespace-nowrap">
              <button data-id="${c.id}" class="edit underline text-sky-600">Editar</button>
              <button data-id="${c.id}" class="del underline text-rose-600 ml-2">Excluir</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;

    document.getElementById("add").onclick = () => editCard(null);
    document.getElementById("export").onclick = () => {
      const blob = new Blob([JSON.stringify(cards, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "messages.json";
      a.click();
    };
    document.getElementById("import").onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      file.text().then((t) => {
        const arr = JSON.parse(t);
        if (!Array.isArray(arr)) return alert("JSON inválido (espera-se um array).");
        if (!validate(arr)) return alert("Falhou na validação do schema.");
        cards = arr;
        renderList();
      });
    };
    [...$root.querySelectorAll(".edit")].forEach(btn => btn.onclick = () => editCard(btn.dataset.id));
    [...$root.querySelectorAll(".del")].forEach(btn => btn.onclick = () => {
      const id = btn.dataset.id;
      if (confirm("Excluir este card?")) {
        cards = cards.filter(c => c.id !== id);
        renderList();
      }
    });
  }

  function editCard(id) {
    const card = id ? cards.find(c => c.id === id) : {
      id: uuidv4(),
      channel: "sms",
      text: "",
      label: "golpe",
      difficulty: "facil",
      rationale: "",
      hints: [],
      risks: "medio",
      metadata: {}
    };

    $root.innerHTML = `
    <div class="mb-3"><button id="back" class="underline text-sky-600">← Voltar</button></div>
    <form id="f" class="grid grid-cols-1 gap-2">
      <label>Texto <textarea name="text" class="rounded border p-2" rows="6">${card.text}</textarea></label>
      <label>Canal
        <select name="channel" class="rounded border p-2">
          ${["sms","email","whatsapp","push","ligacao"].map(v => `<option ${v===card.channel?"selected":""}>${v}</option>`).join("")}
        </select>
      </label>
      <label>Rótulo
        <select name="label" class="rounded border p-2">
          ${["real","golpe"].map(v => `<option ${v===card.label?"selected":""}>${v}</option>`).join("")}
        </select>
      </label>
      <label>Dificuldade
        <select name="difficulty" class="rounded border p-2">
          ${["facil","medio","dificil"].map(v => `<option ${v===card.difficulty?"selected":""}>${v}</option>`).join("")}
        </select>
      </label>
      <label>Rationale <input name="rationale" class="rounded border p-2" value="${card.rationale}" /></label>
      <label>Dicas (separe por ;)
        <input name="hints" class="rounded border p-2" value="${(card.hints||[]).join("; ")}" />
      </label>
      <label>Risco
        <select name="risks" class="rounded border p-2">
          ${["baixo","medio","alto"].map(v => `<option ${v===card.risks?"selected":""}>${v}</option>`).join("")}
        </select>
      </label>
      <label>Metadata (JSON) <textarea name="metadata" class="rounded border p-2" rows="4">${JSON.stringify(card.metadata||{}, null, 2)}</textarea></label>
      <div>
        <button class="rounded bg-emerald-600 px-3 py-2 text-white">Salvar</button>
      </div>
    </form>`;

    document.getElementById("back").onclick = renderList;
    document.getElementById("f").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const updated = {
        id: card.id,
        channel: fd.get("channel"),
        text: String(fd.get("text")||"").trim(),
        label: fd.get("label"),
        difficulty: fd.get("difficulty"),
        rationale: String(fd.get("rationale")||"").trim(),
        hints: String(fd.get("hints")||"").split(";").map(s => s.trim()).filter(Boolean),
        risks: fd.get("risks"),
        metadata: JSON.parse(fd.get("metadata")||"{}"),
      };
      const newArr = id ? cards.map(c => c.id===id?updated:c) : [...cards, updated];
      if (!validate(newArr)) {
        console.warn(validate.errors);
        return alert("Falhou na validação do schema. Revise os campos.");
      }
      cards = newArr;
      renderList();
    };
  }

  renderList();
}