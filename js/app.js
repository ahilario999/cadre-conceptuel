/**
 * app.js
 * Contrôleur principal : état, navigation entre écrans, configuration,
 * entrevue, aperçu/édition, Cadre conceptuel final, import/export.
 */

(function () {
  const { BLOCK_LIBRARY, ACCENT_PRESETS, createDefaultState } = window.CADRE_DATA;
  const { UI_ICONS } = window.CADRE_ICONS;
  const { getBlockLibrary, t, ACCENT_NAMES_EN, translateDefaultMeta } = window.CADRE_I18N;
  const {
    ensureBlockData,
    buildSteps,
    renderBlockCard,
    renderEditor,
    hintForStep,
    labelForStep,
    patternForBlock,
  } = window.CADRE_BLOCKS;

  const STORAGE_KEY = "cadreConceptuel_v1";

  let state = null;
  let steps = [];
  let saveTimer = null;
  let modalContext = null; // { blockId, snapshot }

  /* ----------------------------------------------------------------- */
  /* Langue                                                              */
  /* ----------------------------------------------------------------- */
  function lang() {
    return state && state.meta && state.meta.lang === "en" ? "en" : "fr";
  }

  function tr(key, vars) {
    return t(lang(), key, vars);
  }

  /* ----------------------------------------------------------------- */
  /* État                                                                */
  /* ----------------------------------------------------------------- */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return normalizeState(parsed);
      }
    } catch (e) {
      console.warn("Lecture localStorage impossible :", e);
    }
    return normalizeState(createDefaultState());
  }

  function normalizeState(s) {
    s.customBlocks = s.customBlocks || [];
    s.blockData = s.blockData || {};
    s.answers = s.answers || {};
    s.enabledBlocks = s.enabledBlocks || [...s.blockOrder];
    s.blockOrder = s.blockOrder || BLOCK_LIBRARY.map((b) => b.id);
    s.meta = Object.assign({}, window.CADRE_DATA.DEFAULT_META, s.meta || {});
    s.currentStep = s.currentStep || 0;
    s.screen = s.screen || "config";
    // S'assure que tous les blocs de la librairie figurent dans blockOrder
    BLOCK_LIBRARY.forEach((b) => {
      if (!s.blockOrder.includes(b.id)) s.blockOrder.push(b.id);
    });
    (s.customBlocks || []).forEach((b) => {
      if (!s.blockOrder.includes(b.id)) s.blockOrder.push(b.id);
    });
    return s;
  }

  function saveState(immediate) {
    state.meta.updatedAt = new Date().toISOString();
    if (saveTimer) clearTimeout(saveTimer);
    const doSave = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn("Sauvegarde locale impossible :", e);
      }
    };
    if (immediate) doSave();
    else saveTimer = setTimeout(doSave, 300);
  }

  function getBlockDef(id) {
    return (
      getBlockLibrary(lang()).find((b) => b.id === id) ||
      (state.customBlocks || []).find((b) => b.id === id)
    );
  }

  /* ----------------------------------------------------------------- */
  /* Icônes                                                              */
  /* ----------------------------------------------------------------- */
  function kebabToCamel(str) {
    return str.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  }

  function injectIcons(root) {
    root.querySelectorAll('[class*="icon-"]').forEach((el) => {
      const cls = [...el.classList].find((c) => c.startsWith("icon-"));
      if (!cls) return;
      const key = kebabToCamel(cls.replace("icon-", ""));
      if (UI_ICONS[key] && !el.dataset.iconSet) {
        el.innerHTML = UI_ICONS[key];
        el.dataset.iconSet = "1";
      }
    });
  }

  /* ----------------------------------------------------------------- */
  /* Couleurs / contraste                                                */
  /* ----------------------------------------------------------------- */
  function hexToRgb(hex) {
    const m = hex.replace("#", "").match(/.{1,2}/g);
    return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
  }

  function relativeLuminance({ r, g, b }) {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function contrastRatio(hex1, hex2) {
    const l1 = relativeLuminance(hexToRgb(hex1));
    const l2 = relativeLuminance(hexToRgb(hex2));
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function getAccentContrast(hex) {
    const lum = relativeLuminance(hexToRgb(hex));
    return lum > 0.55 ? "#0B0B0C" : "#FFFFFF";
  }

  function applyAccentColor(hex) {
    document.documentElement.style.setProperty("--accent", hex);
    document.documentElement.style.setProperty("--accent-contrast", getAccentContrast(hex));
    updateContrastNote(hex);
  }

  function updateContrastNote(hex) {
    const note = document.getElementById("contrast-note");
    if (!note) return;
    const ratioWhite = contrastRatio(hex, "#FFFFFF");
    const ratioBlack = contrastRatio(hex, "#0B0B0C");
    const best = Math.max(ratioWhite, ratioBlack);
    if (best < 3) {
      note.className = "contrast-note is-warning";
      note.innerHTML = `${UI_ICONS.alert} ${tr("contrastWarning")}`;
    } else {
      note.className = "contrast-note is-ok";
      note.innerHTML = `${UI_ICONS.check} ${tr("contrastOk")}`;
    }
  }

  /* ----------------------------------------------------------------- */
  /* Thème clair / sombre                                                */
  /* ----------------------------------------------------------------- */
  function applyTheme() {
    const theme = state.meta.theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    const label = document.getElementById("theme-toggle-label");
    const btn = document.getElementById("btn-theme-toggle");
    if (label) label.textContent = theme === "dark" ? tr("themeToggleLight") : tr("themeToggleDark");
    if (btn) btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  /* ----------------------------------------------------------------- */
  /* Toast                                                               */
  /* ----------------------------------------------------------------- */
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  /* ----------------------------------------------------------------- */
  /* Navigation entre écrans                                             */
  /* ----------------------------------------------------------------- */
  function showScreen(name) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    const el = document.getElementById(`screen-${name}`);
    if (el) el.classList.add("active");
    state.screen = name;
    saveState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ----------------------------------------------------------------- */
  /* Logo & en-tête                                                      */
  /* ----------------------------------------------------------------- */
  function renderLogo(container, dataUrl) {
    container.innerHTML = dataUrl
      ? `<img src="${dataUrl}" alt="${tr("ariaLogoAlt")}" />`
      : UI_ICONS.logoPlaceholder;
  }

  function applyMetaToUI() {
    document.getElementById("header-title").textContent = state.meta.title || tr("headerTitleDefault");
    const program = state.meta.programName || "";
    const inst = state.meta.institutionName || "";
    document.getElementById("header-subtitle").textContent =
      [program, inst].filter(Boolean).join(" · ") || tr("headerSubtitleDefault");
    renderLogo(document.getElementById("header-logo"), state.meta.logoDataUrl);
    renderLogo(document.getElementById("logo-preview"), state.meta.logoDataUrl);
    applyAccentColor(state.meta.accentColor);
    applyTheme();
  }

  function resizeImageFile(file, maxSize, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL("image/png"));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /* ----------------------------------------------------------------- */
  /* Écran configuration                                                 */
  /* ----------------------------------------------------------------- */
  function populateConfigFields() {
    document.getElementById("input-program-name").value = state.meta.programName || "";
    document.getElementById("input-institution-name").value = state.meta.institutionName || "";
    document.getElementById("input-author-name").value = state.meta.authorName || "";
    document.getElementById("input-role").value = state.meta.role || "";
    document.getElementById("input-cadre-title").value = state.meta.title || "";
    document.getElementById("input-cadre-tagline").value = state.meta.tagline || "";
    document.getElementById("input-cadre-quote").value = state.meta.quote || "";
    document.getElementById("input-accent-custom").value = state.meta.accentColor || "#0E7C75";
  }

  function bindMetaField(inputId, metaKey, onAfter) {
    const input = document.getElementById(inputId);
    input.addEventListener("input", () => {
      state.meta[metaKey] = input.value;
      saveState();
      applyMetaToUI();
      if (onAfter) onAfter();
    });
  }

  function renderColorPresets() {
    const wrap = document.getElementById("color-presets");
    wrap.innerHTML = "";
    ACCENT_PRESETS.forEach((preset) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "color-swatch";
      btn.style.background = preset.value;
      const presetName = lang() === "en" ? ACCENT_NAMES_EN[preset.name] || preset.name : preset.name;
      btn.title = presetName;
      btn.setAttribute("aria-label", tr("ariaColorPreset", { name: presetName }));
      if (state.meta.accentColor.toLowerCase() === preset.value.toLowerCase()) {
        btn.classList.add("is-selected");
      }
      btn.addEventListener("click", () => {
        state.meta.accentColor = preset.value;
        document.getElementById("input-accent-custom").value = preset.value;
        saveState();
        applyMetaToUI();
        renderColorPresets();
      });
      wrap.appendChild(btn);
    });
  }

  function renderBlockToggleList() {
    const wrap = document.getElementById("block-toggle-list");
    wrap.innerHTML = "";
    state.blockOrder.forEach((id, idx) => {
      const block = getBlockDef(id);
      if (!block) return;
      const enabled = state.enabledBlocks.includes(id);
      const row = document.createElement("div");
      row.className = "block-toggle" + (enabled ? "" : " is-disabled");
      row.innerHTML = `
        <div class="block-toggle__icon" aria-hidden="true">${UI_ICONS[block.icon] || UI_ICONS.spark}</div>
        <div>
          <div class="block-toggle__title">${block.title}</div>
          <div class="block-toggle__sub">${block.subtitle || ""}</div>
        </div>
        <button type="button" class="btn btn--icon btn--ghost btn--sm" data-move="up" aria-label="${tr("ariaMoveBlockUp", { title: block.title })}" ${idx === 0 ? "disabled" : ""}>${UI_ICONS.arrowLeft.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" style="transform:rotate(90deg)"')}</button>
        <button type="button" class="btn btn--icon btn--ghost btn--sm" data-move="down" aria-label="${tr("ariaMoveBlockDown", { title: block.title })}" ${idx === state.blockOrder.length - 1 ? "disabled" : ""}>${UI_ICONS.arrowRight.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" style="transform:rotate(90deg)"')}</button>
        <label class="switch">
          <input type="checkbox" ${enabled ? "checked" : ""} aria-label="${tr("ariaEnableBlock", { title: block.title })}" />
          <span class="switch__track"></span>
        </label>
      `;
      row.querySelector('input[type="checkbox"]').addEventListener("change", (e) => {
        if (e.target.checked) {
          if (!state.enabledBlocks.includes(id)) state.enabledBlocks.push(id);
        } else {
          state.enabledBlocks = state.enabledBlocks.filter((x) => x !== id);
        }
        saveState();
        renderBlockToggleList();
      });
      row.querySelector('[data-move="up"]').addEventListener("click", () => {
        if (idx === 0) return;
        [state.blockOrder[idx - 1], state.blockOrder[idx]] = [state.blockOrder[idx], state.blockOrder[idx - 1]];
        saveState();
        renderBlockToggleList();
      });
      row.querySelector('[data-move="down"]').addEventListener("click", () => {
        if (idx === state.blockOrder.length - 1) return;
        [state.blockOrder[idx + 1], state.blockOrder[idx]] = [state.blockOrder[idx], state.blockOrder[idx + 1]];
        saveState();
        renderBlockToggleList();
      });
      wrap.appendChild(row);
    });
  }

  /* ----------------------------------------------------------------- */
  /* Écran entrevue                                                      */
  /* ----------------------------------------------------------------- */
  function startInterview() {
    steps = buildSteps(state, getBlockDef);
    if (!steps.length) {
      showToast(tr("toastNoActiveBlock"));
      return;
    }
    state.currentStep = Math.min(state.currentStep || 0, steps.length - 1);
    showScreen("interview");
    renderStep();
  }

  function renderProgress() {
    const wrap = document.getElementById("interview-progress");
    wrap.innerHTML = "";
    steps.forEach((_, i) => {
      const seg = document.createElement("div");
      seg.className = "progress__seg";
      if (i < state.currentStep) seg.classList.add("is-done");
      if (i === state.currentStep) seg.classList.add("is-current");
      seg.innerHTML = '<div class="progress__seg-fill"></div>';
      wrap.appendChild(seg);
    });
    const current = getBlockDef(steps[state.currentStep].blockId);
    document.getElementById("interview-progress-label").textContent = tr("progressLabel", {
      current: state.currentStep + 1,
      total: steps.length,
      title: current.title,
    });
  }

  function renderStep() {
    const step = steps[state.currentStep];
    const block = getBlockDef(step.blockId);

    renderProgress();

    document.getElementById("interview-block-icon").innerHTML = UI_ICONS[block.icon] || UI_ICONS.spark;
    document.getElementById("interview-block-title").textContent = block.title;
    document.getElementById("interview-block-sub").textContent = block.subtitle || "";
    document.getElementById("interview-description").textContent = block.description || "";

    const pattern = patternForBlock(block);
    const patternEl = document.getElementById("interview-pattern");
    patternEl.innerHTML = pattern || "";
    patternEl.style.color = block.theme === "accent" ? "var(--accent-contrast)" : "var(--black)";

    // Les pistes de réflexion sont désormais affichées directement dans
    // chaque champ, et chaque champ propose son propre bouton « Suggérer un
    // brouillon ». Le bandeau et le bouton globaux ne sont plus utilisés.
    const hintBox = document.getElementById("interview-hint");
    const hintToggle = document.getElementById("btn-toggle-hint");
    hintBox.hidden = true;
    hintToggle.hidden = true;

    const editorContainer = document.getElementById("interview-input");
    renderEditor(editorContainer, block, step, state, {
      onChange: () => {
        saveState();
        updatePreviewBlock(block.id);
      },
    });
    injectIcons(editorContainer);

    document.getElementById("btn-prev-step").disabled = state.currentStep === 0;
    document.getElementById("btn-next-step").innerHTML =
      state.currentStep === steps.length - 1
        ? `${tr("btnSeeOverview")} ${UI_ICONS.arrowRight}`
        : `${tr("btnNext")} ${UI_ICONS.arrowRight}`;

    renderPreview();
    saveState();
  }

  /* ----------------------------------------------------------------- */
  /* Aperçu en direct ("atelier en duo") — mini Cadre conceptuel        */
  /* ----------------------------------------------------------------- */
  const PREVIEW_BASE_WIDTH = 1200; // largeur "réelle" du Cadre conceptuel final, mise à l'échelle visuellement

  function renderPreview() {
    const grid = document.getElementById("preview-grid");
    if (!grid) return;
    grid.innerHTML = "";

    grid.appendChild(buildFinalHeader());

    const activeBlockId = steps[state.currentStep] ? steps[state.currentStep].blockId : null;

    state.blockOrder
      .filter((id) => state.enabledBlocks.includes(id))
      .forEach((id) => {
        const block = getBlockDef(id);
        if (!block) return;
        const card = renderBlockCard(block, state, {});
        card.dataset.previewBlockId = id;
        if (id === activeBlockId) {
          card.classList.add("is-active");
          card.id = "preview-active-block";
        }
        grid.appendChild(card);
      });

    injectIcons(grid);
    updatePreviewScale();
  }

  function updatePreviewBlock(blockId) {
    const grid = document.getElementById("preview-grid");
    if (!grid) return;
    const old = grid.querySelector(`[data-preview-block-id="${blockId}"]`);
    if (!old) {
      renderPreview();
      return;
    }
    const block = getBlockDef(blockId);
    if (!block) return;
    const card = renderBlockCard(block, state, {});
    card.dataset.previewBlockId = blockId;
    if (old.classList.contains("is-active")) {
      card.classList.add("is-active");
      card.id = "preview-active-block";
    }
    grid.replaceChild(card, old);
    injectIcons(grid);
    updatePreviewScale();
  }

  /**
   * Calcule le facteur d'échelle pour que le cadre (largeur fixe
   * PREVIEW_BASE_WIDTH) remplisse la largeur du panneau d'aperçu, puis
   * ajuste la hauteur du canevas pour qu'elle corresponde au contenu
   * mis à l'échelle (pas de zones vides ni de débordement horizontal).
   */
  function updatePreviewScale() {
    const canvas = document.getElementById("preview-canvas");
    const frame = document.getElementById("preview-frame");
    if (!canvas || !frame) return;
    const containerWidth = canvas.clientWidth;
    if (!containerWidth) return;
    const scale = containerWidth / PREVIEW_BASE_WIDTH;
    frame.style.transform = `scale(${scale})`;
    canvas.style.height = `${Math.round(frame.offsetHeight * scale)}px`;
  }

  function bindInterviewNav() {
    document.getElementById("btn-prev-step").addEventListener("click", () => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
        renderStep();
      }
    });
    document.getElementById("btn-next-step").addEventListener("click", () => {
      if (state.currentStep < steps.length - 1) {
        state.currentStep += 1;
        renderStep();
      } else {
        renderOverview();
        showScreen("overview");
      }
    });
    document.getElementById("btn-toggle-hint").addEventListener("click", (e) => {
      const hintBox = document.getElementById("interview-hint");
      hintBox.hidden = !hintBox.hidden;
      e.target.textContent = hintBox.hidden ? tr("btnToggleHintShow") : tr("btnToggleHintHide");
    });
  }

  /* ----------------------------------------------------------------- */
  /* Écran aperçu / édition                                              */
  /* ----------------------------------------------------------------- */
  function renderOverview() {
    const grid = document.getElementById("overview-grid");
    grid.innerHTML = "";

    if (!state.enabledBlocks.length) {
      grid.innerHTML = `<div class="empty-state col-12">${UI_ICONS.grid}<p>${tr("emptyStateOverview")}</p></div>`;
    }

    state.blockOrder
      .filter((id) => state.enabledBlocks.includes(id))
      .forEach((id) => {
        const block = getBlockDef(id);
        if (!block) return;
        const card = renderBlockCard(block, state, {
          clickable: true,
          removable: true,
          onRemove: (blockId) => {
            const ok = confirm(tr("confirmRemoveBlock", { title: block.title }));
            if (!ok) return;
            state.enabledBlocks = state.enabledBlocks.filter((x) => x !== blockId);
            saveState();
            renderOverview();
            showToast(tr("toastBlockRemoved", { title: block.title }));
          },
        });
        card.addEventListener("click", () => openEditModal(id));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openEditModal(id);
          }
        });
        grid.appendChild(card);
      });

    // Carte "ajouter un bloc"
    const addCard = document.createElement("div");
    addCard.className = "add-block-card col-4";
    addCard.setAttribute("role", "button");
    addCard.setAttribute("tabindex", "0");
    addCard.innerHTML = `${UI_ICONS.plus}<span>${tr("btnAddBlock")}</span>`;
    addCard.addEventListener("click", () => openAddBlockModal());
    addCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openAddBlockModal();
      }
    });
    grid.appendChild(addCard);

    injectIcons(grid);
  }

  /* ----------------------------------------------------------------- */
  /* Modale d'édition d'un bloc                                          */
  /* ----------------------------------------------------------------- */
  function openEditModal(blockId) {
    const block = getBlockDef(blockId);
    if (!block) return;

    modalContext = {
      blockId,
      snapshot: JSON.parse(
        JSON.stringify({ answers: state.answers, blockData: state.blockData })
      ),
    };

    document.getElementById("modal-title").textContent = `${block.title} — ${block.subtitle || ""}`;
    const body = document.getElementById("modal-body");
    body.innerHTML = "";

    const localSteps = buildSteps(
      { ...state, blockOrder: [blockId], enabledBlocks: [blockId] },
      getBlockDef
    );

    localSteps.forEach((step) => {
      const section = document.createElement("div");
      section.style.marginBottom = "18px";

      if (step.type === "qa") {
        // Pour les blocs "qa", chaque question a son propre libellé et sa
        // propre piste repliable, gérés directement par renderEditor.
        if (block.description) {
          const desc = document.createElement("p");
          desc.className = "interview-description";
          desc.textContent = block.description;
          section.appendChild(desc);
        }
      } else {
        const label = document.createElement("div");
        label.className = "interview-question";
        label.style.fontSize = "1.05rem";
        label.style.marginBottom = "6px";
        label.textContent = labelForStep(block, step);
        section.appendChild(label);

        const hint = hintForStep(block, step);
        if (hint) {
          const hintBox = document.createElement("div");
          hintBox.className = "hint-box";
          hintBox.innerHTML = `<div class="hint-box__icon">${UI_ICONS.spark}</div>
            <div class="hint-box__text"><span class="hint-box__label">${tr("hintLabel")}</span>${hint}</div>`;
          section.appendChild(hintBox);
        }
      }

      const editorDiv = document.createElement("div");
      editorDiv.style.marginTop = "10px";
      section.appendChild(editorDiv);

      renderEditor(editorDiv, block, step, state, {
        onChange: () => saveState(),
      });

      body.appendChild(section);
    });

    injectIcons(body);
    document.getElementById("modal-overlay").classList.add("is-open");
  }

  function closeEditModal(revert) {
    if (revert && modalContext) {
      state.answers = modalContext.snapshot.answers;
      state.blockData = modalContext.snapshot.blockData;
      saveState();
    } else {
      saveState(true);
    }
    modalContext = null;
    document.getElementById("modal-overlay").classList.remove("is-open");
    renderOverview();
  }

  /* ----------------------------------------------------------------- */
  /* Modale d'ajout de bloc personnalisé                                 */
  /* ----------------------------------------------------------------- */
  function openAddBlockModal() {
    ["new-block-title", "new-block-subtitle", "new-block-question", "new-block-hint"].forEach((id) => {
      document.getElementById(id).value = "";
    });
    document.getElementById("new-block-size").value = "col-4";
    document.getElementById("new-block-theme").value = "light";
    document.getElementById("modal-add-block-overlay").classList.add("is-open");
    document.getElementById("new-block-title").focus();
  }

  function closeAddBlockModal() {
    document.getElementById("modal-add-block-overlay").classList.remove("is-open");
  }

  function saveNewBlock() {
    const title = document.getElementById("new-block-title").value.trim();
    const subtitle = document.getElementById("new-block-subtitle").value.trim();
    const question = document.getElementById("new-block-question").value.trim();
    const hint = document.getElementById("new-block-hint").value.trim();
    const size = document.getElementById("new-block-size").value;
    const theme = document.getElementById("new-block-theme").value;

    if (!title || !question) {
      showToast(tr("toastCustomBlockMissing"));
      return;
    }

    const id = `custom-${Date.now()}`;
    const qId = `${id}-q1`;
    const block = {
      id,
      title,
      subtitle,
      size,
      theme,
      type: "qa",
      icon: "spark",
      description: subtitle,
      questions: [{ id: qId, label: question, hint }],
    };

    state.customBlocks.push(block);
    state.blockOrder.push(id);
    state.enabledBlocks.push(id);
    saveState(true);

    closeAddBlockModal();
    renderBlockToggleList();
    if (state.screen === "overview") renderOverview();
    showToast(tr("toastCustomBlockAdded", { title }));
  }

  /* ----------------------------------------------------------------- */
  /* Écran Cadre conceptuel final                                        */
  /* ----------------------------------------------------------------- */
  function buildFinalHeader() {
    const header = document.createElement("div");
    header.className = "final-header";
    const logoHtml = state.meta.logoDataUrl
      ? `<img src="${state.meta.logoDataUrl}" alt="Logo" />`
      : `<div style="color:var(--gray-400);">${UI_ICONS.logoPlaceholder}</div>`;
    header.innerHTML = `
      <div class="final-header__logo">
        ${logoHtml}
        <div class="final-header__logo-text">${state.meta.programName || ""}${state.meta.institutionName ? " · " + state.meta.institutionName : ""}</div>
      </div>
      <div class="final-header__main">
        <div class="final-header__eyebrow">${tr("finalEyebrow")}</div>
        <div class="final-header__title">${state.meta.title || ""}</div>
        ${state.meta.tagline ? `<div class="final-header__tagline">${state.meta.tagline}</div>` : ""}
        ${state.meta.quote ? `<div class="final-header__quote">${state.meta.quote}</div>` : ""}
        <div class="final-header__meta">${[state.meta.authorName, new Date().toLocaleDateString(tr("localeDateCode"))].filter(Boolean).join(" — ")}</div>
      </div>
    `;
    return header;
  }

  function renderFinal() {
    const grid = document.getElementById("final-grid");
    grid.innerHTML = "";

    grid.appendChild(buildFinalHeader());

    state.blockOrder
      .filter((id) => state.enabledBlocks.includes(id))
      .forEach((id) => {
        const block = getBlockDef(id);
        if (!block) return;
        const card = renderBlockCard(block, state, {});
        grid.appendChild(card);
      });

    injectIcons(grid);
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const name = (state.meta.programName || "cadre-conceptuel").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.href = url;
    a.download = `cadre-conceptuel-${name}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(tr("toastJsonDownloaded"));
  }

  function loadJSONFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        state = normalizeState(parsed);
        saveState(true);
        initUIFromState();
        showToast(tr("toastImportSuccess"));
      } catch (err) {
        showToast(tr("toastImportError"));
      }
    };
    reader.readAsText(file);
  }

  /* ----------------------------------------------------------------- */
  /* Application des traductions au DOM                                 */
  /* ----------------------------------------------------------------- */
  function applyTranslations() {
    const l = lang();
    document.documentElement.lang = l;
    document.title = tr("pageTitle");
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", tr("pageDescription"));

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = tr(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = tr(el.dataset.i18nHtml);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", tr(el.dataset.i18nPlaceholder));
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      el.setAttribute("aria-label", tr(el.dataset.i18nAriaLabel));
    });
    document.querySelectorAll("[data-i18n-content]").forEach((el) => {
      el.setAttribute("content", tr(el.dataset.i18nContent));
    });

    const btnFr = document.getElementById("btn-lang-fr");
    const btnEn = document.getElementById("btn-lang-en");
    if (btnFr && btnEn) {
      btnFr.classList.toggle("is-active", l === "fr");
      btnEn.classList.toggle("is-active", l === "en");
      btnFr.setAttribute("aria-pressed", l === "fr" ? "true" : "false");
      btnEn.setAttribute("aria-pressed", l === "en" ? "true" : "false");
    }

    applyTheme();
  }

  /* ----------------------------------------------------------------- */
  /* Changement de langue                                                */
  /* ----------------------------------------------------------------- */
  function setLang(newLang) {
    const l = newLang === "en" ? "en" : "fr";
    if (state.meta.lang === l) return;
    translateDefaultMeta(state.meta, state.meta.lang, l);
    state.meta.lang = l;
    saveState(true);
    applyTranslations();
    applyMetaToUI();
    populateConfigFields();
    renderColorPresets();
    renderBlockToggleList();

    steps = buildSteps(state, getBlockDef);

    if (state.screen === "interview" && steps.length) {
      state.currentStep = Math.min(state.currentStep, steps.length - 1);
      renderStep();
    } else if (state.screen === "overview") {
      renderOverview();
    } else if (state.screen === "final") {
      renderFinal();
    }
  }

  /* ----------------------------------------------------------------- */
  /* Initialisation UI depuis l'état (utilisé au chargement et après import) */
  /* ----------------------------------------------------------------- */
  function initUIFromState() {
    applyTranslations();
    applyMetaToUI();
    populateConfigFields();
    renderColorPresets();
    renderBlockToggleList();

    steps = buildSteps(state, getBlockDef);

    const target = ["config", "interview", "overview", "final"].includes(state.screen)
      ? state.screen
      : "config";

    if (target === "interview" && steps.length) {
      state.currentStep = Math.min(state.currentStep, steps.length - 1);
      showScreen("interview");
      renderStep();
    } else if (target === "overview") {
      renderOverview();
      showScreen("overview");
    } else if (target === "final") {
      renderFinal();
      showScreen("final");
    } else {
      showScreen("config");
    }
  }

  /* ----------------------------------------------------------------- */
  /* Liaison des événements                                              */
  /* ----------------------------------------------------------------- */
  function bindEvents() {
    // Thème
    document.getElementById("btn-theme-toggle").addEventListener("click", () => {
      state.meta.theme = state.meta.theme === "dark" ? "light" : "dark";
      saveState();
      applyTheme();
    });

    // Champs méta
    bindMetaField("input-program-name", "programName");
    bindMetaField("input-institution-name", "institutionName");
    bindMetaField("input-author-name", "authorName");
    bindMetaField("input-role", "role", () => {
      if (state.screen === "overview") renderOverview();
      renderPreview();
    });
    bindMetaField("input-cadre-title", "title");
    bindMetaField("input-cadre-tagline", "tagline");
    bindMetaField("input-cadre-quote", "quote");

    // Couleur personnalisée
    document.getElementById("input-accent-custom").addEventListener("input", (e) => {
      state.meta.accentColor = e.target.value;
      saveState();
      applyAccentColor(state.meta.accentColor);
      renderColorPresets();
    });

    // Logo
    const dropzone = document.getElementById("logo-dropzone");
    const logoInput = document.getElementById("input-logo");
    logoInput.addEventListener("change", () => {
      if (logoInput.files[0]) {
        resizeImageFile(logoInput.files[0], 280, (dataUrl) => {
          state.meta.logoDataUrl = dataUrl;
          saveState(true);
          applyMetaToUI();
        });
      }
    });
    ["dragover", "dragenter"].forEach((evt) =>
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.classList.add("is-dragover");
      })
    );
    ["dragleave", "drop"].forEach((evt) =>
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.classList.remove("is-dragover");
      })
    );
    dropzone.addEventListener("drop", (e) => {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        resizeImageFile(file, 280, (dataUrl) => {
          state.meta.logoDataUrl = dataUrl;
          saveState(true);
          applyMetaToUI();
        });
      }
    });

    // Ajout de bloc personnalisé (depuis config)
    document.getElementById("btn-add-block-config").addEventListener("click", openAddBlockModal);
    document.getElementById("btn-add-block-overview").addEventListener("click", openAddBlockModal);
    document.getElementById("modal-add-close").addEventListener("click", closeAddBlockModal);
    document.getElementById("modal-add-cancel").addEventListener("click", closeAddBlockModal);
    document.getElementById("modal-add-save").addEventListener("click", saveNewBlock);
    document.getElementById("modal-add-block-overlay").addEventListener("click", (e) => {
      if (e.target.id === "modal-add-block-overlay") closeAddBlockModal();
    });

    // Démarrer l'entrevue
    document.getElementById("btn-start-interview").addEventListener("click", startInterview);

    // Navigation entrevue
    bindInterviewNav();

    // Aperçu -> entrevue / final
    document.getElementById("btn-back-to-interview").addEventListener("click", () => {
      steps = buildSteps(state, getBlockDef);
      if (!steps.length) {
        showToast(tr("toastNoActiveBlockContinue"));
        return;
      }
      state.currentStep = Math.min(state.currentStep, steps.length - 1);
      showScreen("interview");
      renderStep();
    });
    document.getElementById("btn-generate-final").addEventListener("click", () => {
      renderFinal();
      showScreen("final");
    });
    document.getElementById("btn-back-to-overview").addEventListener("click", () => {
      renderOverview();
      showScreen("overview");
    });

    // Modale d'édition
    document.getElementById("modal-close").addEventListener("click", () => closeEditModal(true));
    document.getElementById("modal-cancel").addEventListener("click", () => closeEditModal(true));
    document.getElementById("modal-save").addEventListener("click", () => closeEditModal(false));
    document.getElementById("modal-overlay").addEventListener("click", (e) => {
      if (e.target.id === "modal-overlay") closeEditModal(false);
    });

    // Export / import / restart
    document.getElementById("btn-save-json").addEventListener("click", downloadJSON);
    document.getElementById("btn-export-json-final").addEventListener("click", downloadJSON);
    document.getElementById("input-load-json").addEventListener("change", (e) => {
      if (e.target.files[0]) loadJSONFile(e.target.files[0]);
      e.target.value = "";
    });
    document.getElementById("btn-export-pdf").addEventListener("click", async () => {
      const btn = document.getElementById("btn-export-pdf");
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = tr("toastPdfGenerating");
      try {
        const name = (state.meta.programName || "cadre-conceptuel").toLowerCase().replace(/[^a-z0-9]+/g, "-");
        await exportElementToPdf("final-card", `cadre-conceptuel-${name}.pdf`);
        showToast(tr("toastPdfSuccess"));
      } catch (err) {
        console.error(err);
        const detail = err && err.message ? ` (${err.message})` : "";
        showToast(tr("toastPdfError", { detail }));
      } finally {
        btn.disabled = false;
        btn.innerHTML = original;
        injectIcons(btn);
      }
    });

    document.getElementById("btn-restart").addEventListener("click", () => {
      if (!confirm(tr("confirmRestart"))) return;
      localStorage.removeItem(STORAGE_KEY);
      state = normalizeState(createDefaultState());
      saveState(true);
      initUIFromState();
      showToast(tr("toastNewFramework"));
    });

    // Toggle de langue
    document.getElementById("btn-lang-fr").addEventListener("click", () => setLang("fr"));
    document.getElementById("btn-lang-en").addEventListener("click", () => setLang("en"));

    // Raccourci clavier : Échap ferme les modales
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (document.getElementById("modal-overlay").classList.contains("is-open")) closeEditModal(true);
        if (document.getElementById("modal-add-block-overlay").classList.contains("is-open")) closeAddBlockModal();
      }
    });
  }

  /* ----------------------------------------------------------------- */
  /* Démarrage                                                           */
  /* ----------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    injectIcons(document);
    state = loadState();
    bindEvents();
    initUIFromState();

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updatePreviewScale, 120);
    });
  });
})();
