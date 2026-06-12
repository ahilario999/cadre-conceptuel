const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: `file://${__dirname}/index.html`,
});

const errors = [];
dom.window.addEventListener("error", (e) => {
  errors.push(e.error ? e.error.stack || e.error.message : e.message);
});

// Stub localStorage (jsdom supports it) and CDN libs that fail to load
dom.window.html2canvas = () => Promise.resolve({ toDataURL: () => "data:image/png;base64,", height: 100, width: 100 });
dom.window.jspdf = { jsPDF: function () { this.addImage = () => {}; this.save = () => {}; } };

setTimeout(() => {
  const win = dom.window;
  const doc = win.document;

  console.log("=== Erreurs JS ===");
  console.log(errors.length ? errors.join("\n---\n") : "Aucune");

  console.log("\n=== Écran actif ===");
  console.log(doc.querySelector(".screen.active") ? doc.querySelector(".screen.active").id : "AUCUN");

  console.log("\n=== Header ===");
  console.log("title:", doc.getElementById("header-title").textContent);
  console.log("subtitle:", doc.getElementById("header-subtitle").textContent);
  console.log("logo innerHTML length:", doc.getElementById("header-logo").innerHTML.length);

  console.log("\n=== Color presets ===");
  console.log("count:", doc.querySelectorAll("#color-presets .color-swatch").length);

  console.log("\n=== Block toggle list ===");
  console.log("count:", doc.querySelectorAll("#block-toggle-list .block-toggle").length);

  console.log("\n=== Icons injected ===");
  const iconEls = doc.querySelectorAll('[class*="icon-"]');
  let emptyIcons = 0;
  iconEls.forEach((el) => {
    if (!el.innerHTML.trim()) emptyIcons++;
  });
  console.log("total icon elements:", iconEls.length, " empty:", emptyIcons);

  console.log("\n=== Simulate clicking 'Commencer entrevue' (atelier) ===");
  doc.getElementById("btn-start-interview").click();
  console.log("active screen:", doc.querySelector(".screen.active").id);
  console.log("interview description:", doc.getElementById("interview-description").textContent.slice(0, 60));
  console.log("interview input children:", doc.getElementById("interview-input").children.length);
  console.log("progress segments:", doc.querySelectorAll("#interview-progress .progress__seg").length);

  console.log("\n=== Aperçu en direct (mini Cadre conceptuel) ===");
  console.log("en-tête (final-header) présent:", !!doc.querySelector("#preview-grid .final-header"));
  console.log("preview cards:", doc.querySelectorAll("#preview-grid .bento-block").length);
  console.log("active preview card present:", !!doc.querySelector("#preview-grid .bento-block.is-active"));
  console.log("preview-frame présent:", !!doc.getElementById("preview-frame"));

  console.log("\n=== Saisie en direct dans le 1er champ ===");
  const firstField = doc.querySelector("#interview-input .qa-field textarea, #interview-input textarea, #interview-input input");
  if (firstField) {
    firstField.value = "Réponse de test en direct";
    firstField.dispatchEvent(new win.Event("input", { bubbles: true }));
    const activeCard = doc.querySelector("#preview-grid .bento-block.is-active");
    console.log("texte reflété dans l'aperçu:", activeCard ? activeCard.textContent.includes("Réponse de test en direct") : "AUCUNE CARTE ACTIVE");
  } else {
    console.log("aucun champ trouvé pour la 1ère étape");
  }

  console.log("\n=== Piste de réflexion toujours visible (bloc qa) ===");
  const qaHint = doc.querySelector(".qa-field__hint");
  console.log("piste visible sans clic:", !!qaHint);

  console.log("\n=== Navigate to last step then overview ===");
  let next = doc.getElementById("btn-next-step");
  let guard = 0;
  while (guard < 60) {
    next.click();
    guard++;
    if (doc.querySelector(".screen.active").id === "screen-overview") break;
  }
  console.log("steps navigated:", guard);
  console.log("active screen:", doc.querySelector(".screen.active").id);
  console.log("overview blocks:", doc.querySelectorAll("#overview-grid .bento-block").length);
  console.log("add-block card present:", !!doc.querySelector("#overview-grid .add-block-card"));

  console.log("\n=== Generate final ===");
  doc.getElementById("btn-generate-final").click();
  console.log("active screen:", doc.querySelector(".screen.active").id);
  console.log("final blocks:", doc.querySelectorAll("#final-grid .bento-block").length);
  console.log("final header present:", !!doc.querySelector(".final-header"));

  console.log("\n=== LocalStorage ===");
  try {
    console.log("saved key present:", !!win.localStorage.getItem("cadreConceptuel_v1"));
  } catch (e) {
    console.log("localStorage indisponible en file:// (normal en jsdom) :", e.message || e);
  }
}, 800);
