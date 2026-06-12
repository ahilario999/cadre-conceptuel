/**
 * pdf-export.js
 * Exporte un élément DOM (le Cadre conceptuel final) en PDF "poster"
 * (une page, format adapté aux proportions du bento), via html2canvas + jsPDF
 * (chargés en CDN dans index.html).
 */

async function exportElementToPdf(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Vérifie que les librairies CDN (html2canvas, jsPDF) ont bien chargé —
  // sinon on échoue tout de suite avec un message clair plutôt qu'avec une
  // ReferenceError opaque.
  if (typeof html2canvas !== "function") {
    throw new Error(
      "La librairie html2canvas n'a pas pu être chargée (connexion internet requise pour le CDN)."
    );
  }
  if (!window.jspdf || typeof window.jspdf.jsPDF !== "function") {
    throw new Error(
      "La librairie jsPDF n'a pas pu être chargée (connexion internet requise pour le CDN)."
    );
  }

  // Petite pause pour laisser le DOM se stabiliser (polices, images).
  await new Promise((r) => setTimeout(r, 50));

  const bgColor =
    getComputedStyle(document.body).backgroundColor || "#ffffff";

  const baseOptions = {
    scale: Math.min(2, window.devicePixelRatio || 1.5),
    backgroundColor: bgColor,
    useCORS: true,
    logging: false,
  };

  let canvas = await html2canvas(element, baseOptions);

  // Sur certains navigateurs (ex. fichier ouvert directement en local, sans
  // serveur web), les images de logos peuvent "polluer" le canevas et faire
  // échouer toDataURL() avec une erreur de sécurité. Si c'est le cas, on
  // recommence en ignorant simplement ces images — le PDF reste généré,
  // avec les icônes génériques à la place des logos.
  try {
    var imgData = canvas.toDataURL("image/png");
  } catch (err) {
    canvas = await html2canvas(element, {
      ...baseOptions,
      allowTaint: true,
      ignoreElements: (el) =>
        el.tagName === "IMG" && el.classList && el.classList.contains("tool-icon__logo"),
    });
    try {
      imgData = canvas.toDataURL("image/png");
    } catch (err2) {
      throw new Error(
        "Le PDF n'a pas pu être généré : une image du Cadre conceptuel bloque l'export (canvas non exportable)."
      );
    }
  }

  const { jsPDF } = window.jspdf;

  const ratio = canvas.height / canvas.width;
  const pageWidth = 1500; // pt
  const pageHeight = Math.round(pageWidth * ratio);

  const pdf = new jsPDF({
    orientation: ratio > 1 ? "portrait" : "landscape",
    unit: "pt",
    format: [pageWidth, pageHeight],
  });

  pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
  pdf.save(filename || "cadre-conceptuel.pdf");
}

window.exportElementToPdf = exportElementToPdf;
