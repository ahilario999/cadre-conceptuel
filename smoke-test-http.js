const { JSDOM } = require("jsdom");
const http = require("http");
const fs = require("fs");
const path = require("path");

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript" };

const server = http.createServer((req, res) => {
  let p = req.url === "/" ? "/index.html" : req.url;
  const full = path.join(__dirname, p);
  if (!full.startsWith(__dirname) || !fs.existsSync(full)) {
    res.writeHead(404);
    return res.end("not found");
  }
  const ext = path.extname(full);
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(full).pipe(res);
});

server.listen(0, async () => {
  const port = server.address().port;
  const url = `http://127.0.0.1:${port}/index.html`;

  const dom = await JSDOM.fromURL(url, {
    runScripts: "dangerously",
    resources: "usable",
  });

  const win = dom.window;
  const errors = [];
  win.addEventListener("error", (e) => errors.push(e.error ? e.error.stack || e.error.message : e.message));

  setTimeout(() => {
    const doc = win.document;
    console.log("=== Erreurs JS ===", errors.length ? errors.join("\n") : "Aucune");

    // Remplir un champ + naviguer + sauvegarder
    doc.getElementById("input-program-name").value = "Techniques de design graphique";
    doc.getElementById("input-program-name").dispatchEvent(new win.Event("input", { bubbles: true }));
    doc.getElementById("input-cadre-title").value = "Le designer dans la boucle";
    doc.getElementById("input-cadre-title").dispatchEvent(new win.Event("input", { bubbles: true }));

    console.log("\n=== localStorage après modif ===");
    const saved = win.localStorage.getItem("cadreConceptuel_v1");
    console.log("clé présente:", !!saved);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log("programName:", parsed.meta.programName);
      console.log("title:", parsed.meta.title);
    }

    // Test import : recharger une 2e fenêtre avec le même localStorage simulé ?
    // (jsdom isole le localStorage par instance — on vérifie juste la persistance immédiate)

    // Test du téléchargement JSON (vérifie que la fonction ne lève pas d'erreur)
    try {
      doc.getElementById("btn-save-json").click();
      console.log("\nbtn-save-json click: OK (pas d'erreur)");
    } catch (e) {
      console.log("\nbtn-save-json click ERROR:", e.message);
    }

    // Test ajout d'un bloc personnalisé
    doc.getElementById("btn-add-block-config").click();
    const modalOpen = doc.getElementById("modal-add-block-overlay").classList.contains("is-open");
    console.log("\nmodale ajout bloc ouverte:", modalOpen);
    doc.getElementById("new-block-title").value = "Accessibilité";
    doc.getElementById("new-block-question").value = "Quelles considérations d'accessibilité sont prioritaires ?";
    doc.getElementById("modal-add-save").click();
    console.log("blocs dans le toggle après ajout:", doc.querySelectorAll("#block-toggle-list .block-toggle").length);

    // Test contraste
    const note = doc.getElementById("contrast-note");
    console.log("\ncontrast-note class:", note.className, "| text:", note.textContent.trim().slice(0, 60));

    // Test dark mode toggle
    doc.getElementById("btn-theme-toggle").click();
    console.log("\ndata-theme après toggle:", doc.documentElement.getAttribute("data-theme"));

    server.close();
    process.exit(errors.length ? 1 : 0);
  }, 800);
});
