(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const a={deck:[],currentIndex:0,score:0,combo:0,mistakesByTag:{},correctByTag:{},phase:"campaign"};function $(e="campaign"){a.deck=[],a.currentIndex=0,a.score=0,a.combo=0,a.mistakesByTag={},a.correctByTag={},a.phase=e}function T(e){a.deck=w(e),a.currentIndex=0}function w(e){return[...e].sort(()=>Math.random()-.5)}async function C(){const e=await fetch("/src/data/messages.json");if(!e.ok){console.error("Falha ao carregar messages.json",e.status);return}const s=await e.json();T(s)}const d={get(e,s=null){try{const t=localStorage.getItem(e);return t?JSON.parse(t):s}catch{return s}},set(e,s){try{localStorage.setItem(e,JSON.stringify(s))}catch{}},remove(e){try{localStorage.removeItem(e)}catch{}}},l="caca-golpes-analytics";function E(){const e=d.get(l,{});e.runs||(e.runs=[]),d.set(l,e)}function L(e,s){const t=d.get("caca-golpes-session",{startedAt:new Date().toISOString(),answers:[]});t.answers.push({messageId:e.id,isCorrect:s,tags:e.tags,phase:a.phase,ts:Date.now()}),d.set("caca-golpes-session",t)}function M(){const e=d.get(l,{runs:[]}),s=d.get("caca-golpes-session",null);if(s)return e.runs.push({...s,finishedAt:new Date().toISOString(),score:a.score}),d.set(l,e),d.remove("caca-golpes-session"),{analytics:e,lastRun:e.runs[e.runs.length-1]}}function B(){const e=new Set([...Object.keys(a.correctByTag),...Object.keys(a.mistakesByTag)]),s=[];return e.forEach(t=>{const o=a.correctByTag[t]||0,n=a.mistakesByTag[t]||0,r=o+n,c=r===0?0:Math.round(o/r*100);s.push({tag:t,ok:o,fail:n,total:r,acc:c})}),s.sort((t,o)=>t.acc-o.acc),s}function p(){return a.deck[a.currentIndex]??null}function I(e){const s=p();if(!s)return null;const t=e===s.isFraud;t?(a.combo++,a.score+=100*a.combo):(a.combo=0,a.score=Math.max(0,a.score-40));const o=t?a.correctByTag:a.mistakesByTag;s.tags.forEach(r=>{o[r]=(o[r]||0)+1}),L(s,t);const n={msg:s,isCorrect:t,combo:a.combo,score:a.score};return a.currentIndex++,a.currentIndex>=a.deck.length&&document.dispatchEvent(new CustomEvent("game:finished")),n}function P(e,s){const{msg:t,isCorrect:o,combo:n,score:r}=s,c=o?"✅":"⚠️",v=o?"success":"error",y=o?"ok":"bad",x=o?"Leitura segura":"Atenção redobrada",k=t.tags.map(S=>`<span class="tag-pill">
        <span>•</span><span>${A(S)}</span>
      </span>`).join("");e.innerHTML=`
    <div class="feedback-banner ${v}">
      <div class="feedback-label ${y}">${x}</div>
      <div>${c} ${o?"Boa! Você classificou corretamente a mensagem.":"Essa mensagem foi classificada de forma equivocada."}</div>
      <div class="text-muted">
        ${q(t)}
      </div>
      <div style="margin-top: 6px; display:flex; flex-wrap:wrap; gap:6px;">
        ${k}
      </div>
      <div class="text-muted" style="margin-top: 6px;">
        Score: <strong>${r}</strong> · Combo atual: <strong>${n}x</strong>
      </div>
    </div>
  `}function q(e){return e.isFraud?"A mensagem é um golpe. Observe como ela usa "+(e.tags.includes("urgency")?"urgência artificial, ":"")+(e.tags.includes("fake_url")?"links suspeitos, ":"")+(e.tags.includes("data_request")?"pedido de dados sensíveis ":"")+"para tentar forçar uma ação rápida.":"A mensagem é legítima dentro do contexto bancário. Mesmo assim, continue atento a domínios oficiais e canais de comunicação verificados."}function A(e){return{fake_url:"URL suspeita",urgency:"Urgência exagerada",reward:"Promessa de prêmio",data_request:"Pede dados sensíveis",attachment:"Anexo inesperado"}[e]||e}function O(e){const s=document.querySelector(`.message-text[data-message-id="${e.id}"], #phone-message`);if(!s)return;const o=[...e.text];(e.highlights||[]).forEach(n=>{for(let r=n.start;r<n.end&&r<o.length;r++){const c=o[r];c&&(o[r]=`<span class="highlight" title="${n.reason}">${D(c)}</span>`)}}),s.innerHTML=o.join(""),s.dataset.messageId=e.id}function D(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}let i,f,g=!1;function j(e,s){i=e,f=s,F(),h(),b()}function F(){i.innerHTML=`
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
  `,i.querySelector("#btn-safe").onclick=()=>u(!1),i.querySelector("#btn-fraud").onclick=()=>u(!0),i.querySelector("#btn-scanner").onclick=R,g||(document.addEventListener("keydown",H),g=!0)}function h(){const e=p(),s=i.querySelector("#phone-channel"),t=i.querySelector("#phone-sender"),o=i.querySelector("#phone-message"),n=i.querySelector("#phone-progress");if(!e){o.textContent="Fim das mensagens desta rodada!",s.textContent="",t.textContent="",n.textContent=`${a.currentIndex} / ${a.deck.length}`,i.querySelector(".phone-main-actions").classList.add("phone-main-actions--disabled");return}s.textContent=e.channelLabel,t.textContent=e.sender,o.textContent=e.text,n.textContent=`${a.currentIndex+1} / ${a.deck.length}`}function b(){f.innerHTML=`
    <div class="panel-title">Telemetria em tempo real</div>
    <div class="panel-subtitle">Como está sua leitura de risco neste momento?</div>

    <div class="stat-grid">
      <div class="stat-badge">
        <span>Score</span>
        <strong id="stat-score">${a.score}</strong>
      </div>
      <div class="stat-badge">
        <span>Combo</span>
        <strong id="stat-combo">${a.combo}x</strong>
      </div>
      <div class="stat-badge">
        <span>Mensagens</span>
        <strong>${a.deck.length}</strong>
      </div>
      <div class="stat-badge badge-phase">
        Fase: ${a.phase==="pretest"?"Pré-teste":"Campanha"}
      </div>
    </div>
    <p class="text-muted">
      Dica: não se deixe levar apenas pelo medo ou pela urgência da mensagem. Observe o domínio do link,
      o tipo de pedido e se faz sentido com a forma como seu banco se comunica com você.
    </p>
    <div id="side-extra"></div>
  `}function H(e){if(e.key==="ArrowLeft")u(!1);else if(e.key==="ArrowRight")u(!0);else if(e.key===" "||e.key==="Enter"){const s=i==null?void 0:i.querySelector("#btn-scanner");s&&(e.preventDefault(),s.click())}}function u(e){const s=I(e);P(s),b(),p()&&setTimeout(()=>{h()},900)}function R(){const e=p();e&&O(e)}function _(e,s){const{lastRun:t}=M(),o=B();e.innerHTML=`
    <div class="panel-title">Relatório de vulnerabilidades</div>
    <div class="panel-subtitle">Como a gamificação impactou sua capacidade de identificar golpes digitais?</div>
    <div class="dashboard-grid">
      <section class="dashboard-section">
        <h3>Resumo da sessão</h3>
        <p class="text-muted">
          Fase: <strong>${a.phase==="pretest"?"Pré-teste":"Campanha"}</strong><br/>
          Score total: <strong>${a.score}</strong><br/>
          Mensagens avaliadas: <strong>${(t==null?void 0:t.answers.length)??0}</strong>
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
            ${V(o)}
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
        ${o.map(n=>`
          <li>
            <span>${U(n.tag)}</span>
            <span>${n.acc}% de acerto (${n.ok}/${n.total})</span>
          </li>
        `).join("")}
      </ul>
    </section>
  `,s.innerHTML=`
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
  `}function U(e){return{fake_url:"URLs suspeitas",urgency:"Urgência exagerada",reward:"Prêmios falsos",data_request:"Pedidos de dados sensíveis",attachment:"Anexos duvidosos"}[e]||e}function V(e){const s=e.length===0?0:Math.round(e.reduce((t,o)=>t+o.acc,0)/e.length);return s>=90?"Escudo de Platina · Quase inhackeável":s>=75?"Escudo de Ouro · Muito atento a golpes":s>=55?"Escudo de Prata · Bom, mas ainda vulnerável":"Escudo de Bronze · Precisa de mais treino"}const N=document.getElementById("app");function G(){N.innerHTML=`
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
  `,document.getElementById("btn-pretest").onclick=()=>m("pretest"),document.getElementById("btn-campaign").onclick=()=>m("campaign")}async function m(e){$(e),await C(),E();const s=document.getElementById("panel-main"),t=document.getElementById("panel-side");j(s,t),document.addEventListener("game:finished",()=>{_(s,t)},{once:!0})}G();
