/**
 * blocks.js
 * Logique de rendu propre à chaque "type" de bloc :
 *  - vue lecture (carte aperçu / Cadre conceptuel final)
 *  - éditeur interactif (entrevue / modale d'édition)
 *
 * Convention : chaque bloc a un `block.type` parmi
 *   "qa" | "list" | "list-tags" | "list-columns" | "split" | "table" | "tools" | "tagline"
 *
 * Les données spécifiques (autres que les réponses texte simples) vivent dans
 * `state.blockData[block.id]`. `ensureBlockData()` initialise ces données avec
 * des valeurs de départ inspirées du cadre original (modifiables/supprimables).
 */

(function () {
const { UI_ICONS, getToolIcon, PATTERNS } = window.CADRE_ICONS;

function icon(name) {
  return UI_ICONS[name] || "";
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2list(text) {
  return String(text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ----------------------------------------------------------------------- */
/* Initialisation des données par bloc                                      */
/* ----------------------------------------------------------------------- */
function ensureBlockData(state, block) {
  if (!state.blockData[block.id]) {
    switch (block.type) {
      case "list":
      case "list-tags":
        state.blockData[block.id] = { items: [...(block.placeholderItems || [])] };
        break;
      case "split":
        state.blockData[block.id] = {
          leftPercent: block.left?.defaultPercent ?? 40,
          rightPercent: block.right?.defaultPercent ?? 60,
        };
        break;
      case "table":
        state.blockData[block.id] = {
          rows: (block.rows || []).map((r) => ({ ...r })),
          cells: {},
        };
        (block.rows || []).forEach((r) => {
          state.blockData[block.id].cells[r.id] = { humain: "", ia: "" };
        });
        break;
      case "tools":
        state.blockData[block.id] = {
          items: (block.placeholderItems || []).map((i) => ({ ...i })),
        };
        break;
      case "list-columns":
        state.blockData[block.id] = { columns: {} };
        (block.columns || []).forEach((c) => {
          state.blockData[block.id].columns[c.id] = "";
        });
        break;
      default:
        state.blockData[block.id] = {};
    }
  }
  // Étiquette ("badge") éditable par l'utilisateur — vide par défaut
  // (les acronymes du cadre original ne sont plus imposés).
  if (state.blockData[block.id].badge === undefined) {
    state.blockData[block.id].badge = block.badge || "";
  }

  // Complète les champs manquants si la structure évolue
  if (block.type === "table") {
    const bd = state.blockData[block.id];
    if (!bd.rows) bd.rows = (block.rows || []).map((r) => ({ ...r }));
    if (!bd.cells) bd.cells = {};
    bd.rows.forEach((r) => {
      if (!bd.cells[r.id]) bd.cells[r.id] = { humain: "", ia: "" };
    });
  }
  if (block.type === "list-columns") {
    const bd = state.blockData[block.id];
    if (!bd.columns) bd.columns = {};
    (block.columns || []).forEach((c) => {
      if (bd.columns[c.id] == null) bd.columns[c.id] = "";
    });
  }
  return state.blockData[block.id];
}

/* ----------------------------------------------------------------------- */
/* Construction des "étapes" de l'entrevue                                   */
/* ----------------------------------------------------------------------- */
function buildSteps(state, getBlockDef) {
  const steps = [];
  state.blockOrder
    .filter((id) => state.enabledBlocks.includes(id))
    .forEach((id) => {
      const block = getBlockDef(id);
      if (!block) return;
      steps.push({ blockId: id, type: block.type });
    });
  return steps;
}

/* ----------------------------------------------------------------------- */
/* Pattern décoratif par thème de bloc                                       */
/* ----------------------------------------------------------------------- */
function patternForBlock(block) {
  if (block.theme === "dark" || block.theme === "accent-dark") return PATTERNS.wireGlobe;
  if (block.theme === "accent") return PATTERNS.bigStar;
  return "";
}

/* ----------------------------------------------------------------------- */
/* Titre de bloc avec substitution du rôle ("[Praticien·ne]")               */
/* ----------------------------------------------------------------------- */
function resolveBlockTitle(block, state) {
  const role = (state.meta && state.meta.role ? state.meta.role : "").trim();
  return String(block.title || "").replace(/\[Praticien·ne\]/g, role || "Praticien·ne");
}

/* ----------------------------------------------------------------------- */
/* VUE LECTURE (overview / Cadre conceptuel final)                           */
/* ----------------------------------------------------------------------- */
function renderBlockCard(block, state, options = {}) {
  const { clickable = false, removable = false } = options;
  const wrap = document.createElement("div");
  wrap.className = `bento-block theme-${block.theme} ${block.size}${clickable ? " bento-block--clickable" : ""}${removable ? " bento-block--removable" : ""}`;
  wrap.dataset.blockId = block.id;
  if (clickable) {
    wrap.setAttribute("role", "button");
    wrap.setAttribute("tabindex", "0");
    wrap.setAttribute("aria-label", `Modifier le bloc ${block.title}`);
  }

  const pattern = patternForBlock(block);
  if (pattern) {
    const p = document.createElement("div");
    p.className = "bento-block__pattern";
    p.setAttribute("aria-hidden", "true");
    p.innerHTML = pattern;
    wrap.appendChild(p);
  }

  const data = ensureBlockData(state, block);

  const head = document.createElement("div");
  head.className = "bento-block__head";
  head.innerHTML = `
    <div>
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
        <div class="bento-block__icon" aria-hidden="true">${icon(block.icon)}</div>
        <div>
          <div class="bento-block__title">${escapeHtml(resolveBlockTitle(block, state))}</div>
          ${block.subtitle ? `<div class="bento-block__subtitle">${escapeHtml(block.subtitle)}</div>` : ""}
        </div>
      </div>
      ${
        block.acronym
          ? `<div class="bento-block__acronym"><span class="bento-block__acronym-label">${escapeHtml(block.acronym)}</span><span class="bento-block__acronym-desc">${escapeHtml(block.acronymDescription || "")}</span></div>`
          : (data.badge ? `<div class="bento-block__badge">${escapeHtml(data.badge)}</div>` : "")
      }
    </div>
    ${block.tag ? `<span class="bento-block__tag">${escapeHtml(block.tag)}</span>` : ""}
  `;
  wrap.appendChild(head);

  const body = document.createElement("div");
  body.className = "bento-block__body";
  body.appendChild(renderBodyView(block, state));
  wrap.appendChild(body);

  if (removable) {
    const btn = document.createElement("button");
    btn.className = "btn btn--icon btn--ghost bento-block__remove no-print";
    btn.type = "button";
    btn.title = "Retirer ce bloc";
    btn.setAttribute("aria-label", `Retirer le bloc ${block.title}`);
    btn.innerHTML = icon("trash");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      options.onRemove && options.onRemove(block.id);
    });
    wrap.appendChild(btn);
  }

  return wrap;
}

function renderBodyView(block, state) {
  const container = document.createElement("div");
  const data = ensureBlockData(state, block);

  switch (block.type) {
    case "qa": {
      (block.questions || []).forEach((q) => {
        const ans = state.answers[q.id];
        const p = document.createElement("p");
        p.className = "bento-block__answer" + (ans ? "" : " is-empty");
        p.textContent = ans || "Pas encore de réponse.";
        container.appendChild(p);
      });
      break;
    }
    case "tagline": {
      const q = block.questions[0];
      const ans = state.answers[q.id];
      const p = document.createElement("p");
      p.className = "bento-block__answer" + (ans ? "" : " is-empty");
      p.style.fontSize = "clamp(1.1rem, 2.4vw, 1.6rem)";
      p.style.fontWeight = "700";
      p.textContent = ans || block.placeholder || "Pas encore de phrase-clé.";
      container.appendChild(p);
      break;
    }
    case "list": {
      const ul = document.createElement("ul");
      if (!data.items || !data.items.length) {
        container.innerHTML = `<p class="bento-block__answer is-empty">Aucun élément.</p>`;
        break;
      }
      data.items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      container.appendChild(ul);
      break;
    }
    case "list-tags": {
      const div = document.createElement("div");
      div.className = "tags-view";
      if (!data.items || !data.items.length) {
        container.innerHTML = `<p class="bento-block__answer is-empty">Aucun enjeu listé.</p>`;
        break;
      }
      data.items.forEach((item) => {
        const span = document.createElement("span");
        span.className = "tag-pill";
        span.textContent = item;
        div.appendChild(span);
      });
      container.appendChild(div);
      break;
    }
    case "list-columns": {
      if (block.intro) {
        const intro = document.createElement("p");
        intro.style.opacity = "0.8";
        intro.style.marginBottom = "4px";
        intro.style.fontSize = "0.85rem";
        intro.textContent = block.intro;
        container.appendChild(intro);
      }
      const grid = document.createElement("div");
      grid.className = "columns-view";
      (block.columns || []).forEach((col) => {
        const colDiv = document.createElement("div");
        colDiv.className = "columns-view__col";
        const items = nl2list(data.columns[col.id]);
        colDiv.innerHTML = `<h4>${escapeHtml(col.title)}</h4>` +
          (items.length
            ? `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`
            : `<p class="bento-block__answer is-empty">À compléter.</p>`);
        grid.appendChild(colDiv);
      });
      container.appendChild(grid);
      break;
    }
    case "split": {
      const div = document.createElement("div");
      div.className = "split-view";
      // La largeur de chaque colonne suit le % réel choisi par l'utilisateur·trice.
      const leftPct = Number(data.leftPercent) || 0;
      const rightPct = Number(data.rightPercent) || 0;
      div.style.setProperty("--split-left", `${leftPct}fr`);
      div.style.setProperty("--split-right", `${rightPct}fr`);
      const leftItems = nl2list(state.answers["partage-1"]);
      const rightItems = nl2list(state.answers["partage-2"]);
      div.innerHTML = `
        <div class="split-view__col split-view__col--left">
          <div class="split-view__pct">${data.leftPercent}%</div>
          <div class="split-view__title">${escapeHtml(block.left.title)}</div>
          <div class="split-view__label">${escapeHtml(block.left.label)}</div>
          ${leftItems.length ? `<ul>${leftItems.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : `<p class="bento-block__answer is-empty">À compléter.</p>`}
        </div>
        <div class="split-view__col split-view__col--right">
          <div class="split-view__pct">${data.rightPercent}%</div>
          <div class="split-view__title">${escapeHtml(block.right.title)}</div>
          <div class="split-view__label">${escapeHtml(block.right.label)}</div>
          ${rightItems.length ? `<ul>${rightItems.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : `<p class="bento-block__answer is-empty">À compléter.</p>`}
        </div>
      `;
      container.appendChild(div);
      break;
    }
    case "table": {
      const grid = document.createElement("div");
      grid.className = "table-view";
      grid.innerHTML = `
        <div class="table-view__cell table-view__cell--head"></div>
        <div class="table-view__cell table-view__cell--head">${escapeHtml(block.columns[0].title)}</div>
        <div class="table-view__cell table-view__cell--head">${escapeHtml(block.columns[1].title)}</div>
      `;
      data.rows.forEach((row) => {
        const cell = data.cells[row.id] || { humain: "", ia: "" };
        grid.innerHTML += `
          <div class="table-view__cell table-view__cell--row-label">${escapeHtml(row.label)}</div>
          <div class="table-view__cell">${cell.humain ? escapeHtml(cell.humain) : '<span class="bento-block__answer is-empty">—</span>'}</div>
          <div class="table-view__cell">${cell.ia ? escapeHtml(cell.ia) : '<span class="bento-block__answer is-empty">—</span>'}</div>
        `;
      });
      container.appendChild(grid);
      break;
    }
    case "tools": {
      const grid = document.createElement("div");
      grid.className = "tools-grid";
      if (!data.items || !data.items.length) {
        container.innerHTML = `<p class="bento-block__answer is-empty">Aucun outil listé.</p>`;
        break;
      }
      data.items.forEach((item) => {
        if (!item.name) return;
        const card = document.createElement("div");
        card.className = "tool-card";
        card.innerHTML = `
          <div class="tool-card__icon">${getToolIcon(item.name)}</div>
          <div class="tool-card__name">${escapeHtml(item.name)}</div>
          ${item.usage ? `<div class="tool-card__usage">${escapeHtml(item.usage)}</div>` : ""}
        `;
        grid.appendChild(card);
      });
      container.appendChild(grid);
      break;
    }
  }
  return container;
}

/* ----------------------------------------------------------------------- */
/* ÉDITEURS (entrevue + modale)                                              */
/* Chaque éditeur reçoit : (container, block, step, state, ctx)             */
/* ctx = { onChange, getHintHtml }                                           */
/* ----------------------------------------------------------------------- */

function renderEditor(container, block, step, state, ctx) {
  container.innerHTML = "";
  const data = ensureBlockData(state, block);

  if (step.type === "qa") {
    const group = document.createElement("div");
    group.className = "qa-group";

    if (block.acronym) {
      // Acronyme fixe propre au cadre (ex. S.I.F.T., A.C.T.I.F.) : affiché tel
      // quel, non modifiable, avec sa description complète.
      const acronymField = document.createElement("div");
      acronymField.className = "qa-field qa-field--acronym";
      acronymField.innerHTML = `
        <div class="bento-block__acronym">
          <span class="bento-block__acronym-label">${escapeHtml(block.acronym)}</span>
          <span class="bento-block__acronym-desc">${escapeHtml(block.acronymDescription || "")}</span>
        </div>
      `;
      group.appendChild(acronymField);
    } else {
      // Étiquette éditable (ex. I.D.É.E. pour la conception) : chaque
      // programme peut l'adapter à son propre processus, ou laisser vide.
      const badgeField = document.createElement("div");
      badgeField.className = "qa-field qa-field--badge";
      badgeField.innerHTML = `
        <label class="qa-field__label" for="field-badge-${block.id}">Étiquette du bloc (optionnel)</label>
        <p class="qa-field__hint"><span class="qa-field__hint-icon" aria-hidden="true"><span class="icon-spark"></span></span><span>Ex. un acronyme ou un repère propre à votre programme — laissez vide pour ne rien afficher.</span></p>
        <input type="text" id="field-badge-${block.id}" />
      `;
      const badgeInput = badgeField.querySelector("input");
      badgeInput.setAttribute("aria-label", "Étiquette du bloc");
      badgeInput.value = data.badge || "";
      badgeInput.placeholder = "Ex. V.O.T.R.E. (ou laisser vide)";
      badgeInput.addEventListener("input", () => {
        data.badge = badgeInput.value;
        ctx.onChange();
      });
      group.appendChild(badgeField);
    }

    (block.questions || []).forEach((q) => {
      const field = document.createElement("div");
      field.className = "qa-field";

      const label = document.createElement("label");
      label.className = "qa-field__label";
      label.setAttribute("for", `field-${q.id}`);
      label.textContent = q.label;
      field.appendChild(label);

      if (q.hint) {
        const hint = document.createElement("p");
        hint.className = "qa-field__hint";
        hint.innerHTML = `<span class="qa-field__hint-icon" aria-hidden="true"><span class="icon-spark"></span></span><span>${escapeHtml(q.hint)}</span>`;
        field.appendChild(hint);
      }

      const ta = document.createElement("textarea");
      ta.id = `field-${q.id}`;
      ta.setAttribute("aria-label", q.label);
      ta.value = state.answers[q.id] || "";
      ta.placeholder = "Écrivez votre réponse ici...";
      ta.addEventListener("input", () => {
        state.answers[q.id] = ta.value;
        ctx.onChange();
      });
      field.appendChild(ta);

      group.appendChild(field);
    });

    container.appendChild(group);
    return;
  }

  if (step.type === "tagline") {
    const q = block.questions[0];
    const wrap = document.createElement("div");
    wrap.className = "tagline-editor";
    wrap.innerHTML = `<input type="text" id="field-${q.id}" placeholder="${escapeHtml(block.placeholder || "")}" />`;
    container.appendChild(wrap);
    const input = wrap.querySelector("input");
    input.value = state.answers[q.id] || "";
    input.addEventListener("input", () => {
      state.answers[q.id] = input.value;
      ctx.onChange();
    });
    return;
  }

  if (step.type === "list" || step.type === "list-tags") {
    const wrap = document.createElement("div");
    wrap.className = step.type === "list-tags" ? "tags-editor" : "tags-editor";
    container.appendChild(wrap);

    function redraw() {
      wrap.innerHTML = "";
      (data.items || []).forEach((item, idx) => {
        const chip = document.createElement("div");
        chip.className = "tags-editor__chip";
        chip.innerHTML = `<input type="text" value="${escapeHtml(item)}" aria-label="Élément ${idx + 1}" />
          <button type="button" aria-label="Retirer cet élément">${icon("trash")}</button>`;
        const input = chip.querySelector("input");
        input.addEventListener("input", () => {
          data.items[idx] = input.value;
          ctx.onChange();
        });
        chip.querySelector("button").addEventListener("click", () => {
          data.items.splice(idx, 1);
          ctx.onChange();
          redraw();
        });
        wrap.appendChild(chip);
      });
      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "btn btn--ghost btn--sm";
      addBtn.innerHTML = `${icon("plus")} Ajouter`;
      addBtn.addEventListener("click", () => {
        data.items = data.items || [];
        data.items.push("");
        ctx.onChange();
        redraw();
        const inputs = wrap.querySelectorAll("input");
        if (inputs.length) inputs[inputs.length - 1].focus();
      });
      wrap.appendChild(addBtn);
    }
    redraw();
    return;
  }

  if (step.type === "split") {
    const wrap = document.createElement("div");
    wrap.className = "split-editor";
    wrap.innerHTML = `
      <div class="split-editor__col split-editor__col--left">
        <div class="split-editor__pct" id="left-pct">${data.leftPercent}%</div>
        <div class="split-editor__label">${escapeHtml(block.left.title)} — ${escapeHtml(block.left.label)}</div>
        <input type="range" class="split-slider" id="left-slider" min="0" max="100" step="5" value="${data.leftPercent}" aria-label="Pourcentage ${escapeHtml(block.left.title)}" />
        <textarea id="left-items" aria-label="${escapeHtml(block.questions.find(q=>q.column==='left').label)}" placeholder="Une idée par ligne...">${escapeHtml(state.answers["partage-1"] || "")}</textarea>
      </div>
      <div class="split-editor__col split-editor__col--right">
        <div class="split-editor__pct" id="right-pct">${data.rightPercent}%</div>
        <div class="split-editor__label">${escapeHtml(block.right.title)} — ${escapeHtml(block.right.label)}</div>
        <input type="range" class="split-slider" id="right-slider" min="0" max="100" step="5" value="${data.rightPercent}" aria-label="Pourcentage ${escapeHtml(block.right.title)}" />
        <textarea id="right-items" aria-label="${escapeHtml(block.questions.find(q=>q.column==='right').label)}" placeholder="Une idée par ligne...">${escapeHtml(state.answers["partage-2"] || "")}</textarea>
      </div>
    `;
    container.appendChild(wrap);

    const leftSlider = wrap.querySelector("#left-slider");
    const rightSlider = wrap.querySelector("#right-slider");
    const leftPct = wrap.querySelector("#left-pct");
    const rightPct = wrap.querySelector("#right-pct");

    leftSlider.addEventListener("input", () => {
      data.leftPercent = Number(leftSlider.value);
      data.rightPercent = 100 - data.leftPercent;
      leftPct.textContent = data.leftPercent + "%";
      rightPct.textContent = data.rightPercent + "%";
      rightSlider.value = data.rightPercent;
      ctx.onChange();
    });
    rightSlider.addEventListener("input", () => {
      data.rightPercent = Number(rightSlider.value);
      data.leftPercent = 100 - data.rightPercent;
      leftPct.textContent = data.leftPercent + "%";
      rightPct.textContent = data.rightPercent + "%";
      leftSlider.value = data.leftPercent;
      ctx.onChange();
    });
    wrap.querySelector("#left-items").addEventListener("input", (e) => {
      state.answers["partage-1"] = e.target.value;
      ctx.onChange();
    });
    wrap.querySelector("#right-items").addEventListener("input", (e) => {
      state.answers["partage-2"] = e.target.value;
      ctx.onChange();
    });
    return;
  }

  if (step.type === "table") {
    const wrap = document.createElement("div");
    wrap.className = "table-editor";
    if (block.rowHint) {
      const hint = document.createElement("p");
      hint.className = "field-hint";
      hint.textContent = block.rowHint;
      wrap.appendChild(hint);
    }
    const header = document.createElement("div");
    header.className = "table-editor__row";
    header.innerHTML = `<div></div><div class="field-label">${escapeHtml(block.columns[0].title)}</div><div class="field-label">${escapeHtml(block.columns[1].title)}</div>`;
    wrap.appendChild(header);

    data.rows.forEach((row) => {
      const r = document.createElement("div");
      r.className = "table-editor__row";
      const cell = data.cells[row.id];
      r.innerHTML = `
        <div class="table-editor__row-label"><input type="text" value="${escapeHtml(row.label)}" aria-label="Nom de l'étape" /></div>
        <textarea aria-label="${escapeHtml(block.columns[0].title)} — ${escapeHtml(row.label)}" placeholder="${escapeHtml(block.columns[0].hint || "")}">${escapeHtml(cell.humain)}</textarea>
        <textarea aria-label="${escapeHtml(block.columns[1].title)} — ${escapeHtml(row.label)}" placeholder="${escapeHtml(block.columns[1].hint || "")}">${escapeHtml(cell.ia)}</textarea>
      `;
      const [labelWrap, taHumain, taIa] = r.children;
      labelWrap.querySelector("input").addEventListener("input", (e) => {
        row.label = e.target.value;
        ctx.onChange();
      });
      taHumain.addEventListener("input", (e) => {
        cell.humain = e.target.value;
        ctx.onChange();
      });
      taIa.addEventListener("input", (e) => {
        cell.ia = e.target.value;
        ctx.onChange();
      });
      wrap.appendChild(r);
    });
    container.appendChild(wrap);
    return;
  }

  if (step.type === "tools") {
    const wrap = document.createElement("div");
    wrap.className = "tools-editor";
    container.appendChild(wrap);

    function redraw() {
      wrap.innerHTML = "";
      (data.items || []).forEach((item, idx) => {
        const row = document.createElement("div");
        row.className = "tools-editor__row";
        row.innerHTML = `
          <div class="tools-editor__icon">${getToolIcon(item.name)}</div>
          <input type="text" value="${escapeHtml(item.name)}" placeholder="Nom de l'outil (ex. Claude)" aria-label="Nom de l'outil ${idx + 1}" />
          <input type="text" value="${escapeHtml(item.usage)}" placeholder="Usage (ex. Recherche)" aria-label="Usage de l'outil ${idx + 1}" />
          <button type="button" class="btn btn--icon btn--ghost btn--sm" aria-label="Retirer cet outil">${icon("trash")}</button>
        `;
        const [iconDiv, nameInput, usageInput, delBtn] = row.children;
        nameInput.addEventListener("input", () => {
          item.name = nameInput.value;
          iconDiv.innerHTML = getToolIcon(item.name);
          ctx.onChange();
        });
        usageInput.addEventListener("input", () => {
          item.usage = usageInput.value;
          ctx.onChange();
        });
        delBtn.addEventListener("click", () => {
          data.items.splice(idx, 1);
          ctx.onChange();
          redraw();
        });
        wrap.appendChild(row);
      });
      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "btn btn--ghost btn--sm";
      addBtn.innerHTML = `${icon("plus")} Ajouter un outil`;
      addBtn.addEventListener("click", () => {
        data.items = data.items || [];
        data.items.push({ name: "", usage: "" });
        ctx.onChange();
        redraw();
        const inputs = wrap.querySelectorAll(".tools-editor__row:last-child input");
        if (inputs.length) inputs[0].focus();
      });
      wrap.appendChild(addBtn);
    }
    redraw();
    return;
  }

  if (step.type === "list-columns") {
    const wrap = document.createElement("div");
    wrap.className = "columns-editor";
    (block.columns || []).forEach((col) => {
      const colDiv = document.createElement("div");
      colDiv.className = "columns-editor__col";
      colDiv.innerHTML = `
        <h4>${escapeHtml(col.title)}</h4>
        <p>${escapeHtml(col.hint || "")}</p>
        <textarea aria-label="${escapeHtml(col.title)}" placeholder="Un élément par ligne...">${escapeHtml(data.columns[col.id] || "")}</textarea>
      `;
      colDiv.querySelector("textarea").addEventListener("input", (e) => {
        data.columns[col.id] = e.target.value;
        ctx.onChange();
      });
      wrap.appendChild(colDiv);
    });
    container.appendChild(wrap);
    return;
  }
}

/* Retourne le texte de "piste de réflexion" pour une étape donnée */
function hintForStep(block, step) {
  if (step.type === "qa") {
    const q = (block.questions || []).find((x) => x.id === step.questionId);
    return q ? q.hint : "";
  }
  if (step.type === "split") {
    const q1 = block.questions.find((q) => q.column === "left");
    const q2 = block.questions.find((q) => q.column === "right");
    return `${block.left.title} : ${q1.hint}\n\n${block.right.title} : ${q2.hint}`;
  }
  if (step.type === "list-columns") {
    return block.columns.map((c) => `${c.title} : ${c.hint}`).join("\n");
  }
  if (block.questions && block.questions[0]) return block.questions[0].hint;
  return block.description || "";
}

/* Retourne le libellé de question pour une étape donnée */
function labelForStep(block, step) {
  if (step.type === "qa") {
    const q = (block.questions || []).find((x) => x.id === step.questionId);
    return q ? q.label : block.title;
  }
  if (block.questions && block.questions[0]) return block.questions[0].label;
  return block.description || block.title;
}

window.CADRE_BLOCKS = {
  ensureBlockData,
  buildSteps,
  renderBlockCard,
  renderBodyView,
  renderEditor,
  hintForStep,
  labelForStep,
  patternForBlock,
  escapeHtml,
};
})();
