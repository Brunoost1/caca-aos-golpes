# Jogo Educativo — Caça aos Golpes Digitais

**Objetivo:** ensinar usuários a identificar fraudes (phishing, SMS falso, WhatsApp, e‑mail, “link do boleto”, etc.) com **feedback imediato** e dicas.

**Pergunta de pesquisa:** *Gamificação pode melhorar a capacidade de identificar fraudes digitais em contextos bancários?*

## Créditos (Equipe)
- Bruno Santos Teixeira
- João Vitor Miranda Veras
- Leonardo Affonso de Freitas
- Rafael Oliveira Marcelino

## Stack
- **HTML + CSS (Tailwind via CDN)** + **JS puro (ESM)** e **Vite** para dev/build.
- Qualidade: ESLint + Prettier; commits convencionais (recomendado).
- Testes: Vitest (schema dos cards, avaliação de resposta, progressão de dificuldade, persistência).
- PWA leve com Service Worker (cache estático).

## Como rodar
```bash
npm i
npm run dev      # abre em http://localhost:5173
npm run test     # roda os testes unitários (Vitest)
npm run build    # gera /dist
npm run preview  # serve /dist
```

> **Importante:** este projeto usa Vite com raiz em `/src`. O diretório `/public` é servido estaticamente.

## Como jogar
1. Abra **#/jogar** (padrão ao iniciar). Você verá **cards** com mensagens simuladas.
2. Para cada card, escolha **“É real”** ou **“É golpe”**. Use atalhos do teclado: **R** (real), **G** (golpe), **Enter** confirma.
3. Você recebe **feedback imediato** (acertou/errou) + **explicação** e **dicas de prevenção**.
4. O jogo tem **5 perguntas por fase**. A **dificuldade adaptativa** aumenta/diminui conforme seu desempenho.
5. **HUD** mostra nível, streak, placar e progresso.
6. **Acessibilidade:** foco visível, ARIA, teclado, contraste AA.

Dados em **localStorage**: melhor pontuação, último nível e agregados de métricas (sem PII).

## Como editar/adicionar cards (Admin)
1. Acesse **#/admin**. Informe a senha didática **`prof123`**.
2. CRUD local (no navegador) com **validação por JSON Schema**.
3. Exporte/importe `messages.json`. O schema está em `/src/data/messages.schema.json`.

## Pesquisa (A/B)
- Protocolo completo em `/src/research/experiment.md`.
- Grupo A: nosso jogo. Grupo B: **material estático** (`/public/estudo.pdf`).
- Amostra mínima: 24 (12/12). Instrumentos: **pré** (10 itens), **pós** (10 itens), **SUS** e **NASA-TLX**.
- Métricas primárias: Δ acurácia, tempo médio por item, falsos positivos/negativos.
- Template de relatório: `/src/research/report-template.md`.

## LGPD/Privacidade
- **Não coleta PII**. Tudo fica **local** no navegador (localStorage).
- Métricas são **agregadas**, sem identificação.
- O estudo inclui **consentimento informado** simplificado no PDF (`/public/estudo.pdf`).

## Compatibilidade
- Navegadores modernos (desktop e mobile). PWA instala e tem **offline básico** para **Jogar** e **Sobre**.

## Publicar
- **GitHub Pages**: faça `npm run build` e publique a pasta `/dist`.
- **Vercel**: importe o repo; *Root Directory* = `src`; *Build Command* = `npm run build`; *Output* = `dist`.

---

## Capturas
*(adicione prints da sua execução local aqui)*

## Licença
MIT — veja `LICENSE`.