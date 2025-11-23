# Protocolo de Pesquisa — Caça aos Golpes Digitais

## Desenho
- **A/B**: Grupo A (gamificado: nosso jogo) vs **Grupo B** (material estático: `/public/estudo.pdf`).
- **Amostra mínima**: 24 participantes (12 por grupo).
- **Randomização**: alocação simples (pares/ímpares no registro local, sem identificação).

## Instrumentos
1. **Pré-teste** (10 itens, sem feedback): cards sorteados do banco *pré*.
2. **Exposição**:
   - Grupo A joga 5 minutos (ou 2 fases).
   - Grupo B lê o PDF por 5 minutos.
3. **Pós-teste** (10 itens, diferentes dos do pré, sem feedback).
4. **Questionários**:
   - **SUS** (System Usability Scale) — 10 afirmações (Likert 1–5).
   - **NASA‑TLX** — 6 dimensões (Likert 1–21).

## Métricas
- **Primárias**: Δ Acurácia = (pós − pré); tempo médio por item; taxa de **falsos positivos** (classificar real como golpe) e **falsos negativos** (classificar golpe como real).
- **Secundárias**: evolução por canal/dificuldade; streak média; desistência.

## Coleta
- **LocalStorage** apenas (sem PII). Use chaves agregadas: `metrics` e `study:A|B`.
- Tempos: `Date.now()` em ms.

## Análise
- Normalidade: Shapiro–Wilk (se possível). Caso contrário, usar teste **Wilcoxon** pareado; caso normal, **t de Student** pareado.
- **Efeito**: Cohen’s *d*.
- Reportar média ± DP e *p*‑valor; incluir gráficos simples (opcional).

## Ética
- Consentimento informado simplificado no PDF (`/public/estudo.pdf`).
- Sem coleta de dados pessoais; os participantes podem fechar o navegador para limpar dados.

## Procedimento passo a passo
1. Abrir aplicação e direcionar participante ao **pré‑teste** (pode ser a própria fase 1 sem feedback).
2. Randomizar A/B (local).
3. Exposição (5 min).
4. Pós‑teste (outra fase sem feedback).
5. Aplicar SUS e NASA‑TLX (formulários simples em papel/Google Forms).
6. Exportar métricas (Console → Application → Local Storage → copiar JSON).

## Itens dos testes
- Usar o banco `/src/data/messages.json`; separar subconjuntos para pré/pós.