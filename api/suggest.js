/**
 * api/suggest.js
 *
 * Fonction serverless Vercel (Node.js) : reçoit une question du « Cadre
 * conceptuel » et renvoie un court brouillon de réponse généré par l'API
 * Groq, que la personne pourra ensuite modifier et personnaliser.
 *
 * Configuration requise :
 *  - Variable d'environnement GROQ_API_KEY (Vercel → Project Settings →
 *    Environment Variables). Clé gratuite disponible sur console.groq.com.
 *    Cette clé n'est JAMAIS exposée au navigateur : elle reste côté serveur.
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée." });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error:
        "La suggestion IA n'est pas configurée sur ce site (clé GROQ_API_KEY manquante).",
    });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  body = body || {};

  const question = String(body.question || "").trim();
  const hint = String(body.hint || "").trim();
  const blockTitle = String(body.blockTitle || "").trim();
  const blockDescription = String(body.blockDescription || "").trim();
  const programName = String(body.programName || "").trim();
  const role = String(body.role || "").trim();

  if (!question) {
    res.status(400).json({ error: "La question est manquante." });
    return;
  }

  const contextLines = [
    blockTitle ? `Section du cadre conceptuel : ${blockTitle}` : null,
    blockDescription ? `Description de la section : ${blockDescription}` : null,
    role ? `Rôle de la personne qui répond : ${role}` : null,
    programName ? `Programme ou domaine d'enseignement : ${programName}` : null,
    hint ? `Piste de réflexion fournie : ${hint}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const systemPrompt = [
    "Tu aides une personne enseignante ou un membre du personnel d'un collège à rédiger son « Cadre conceptuel » personnel sur l'intégration de l'intelligence artificielle générative dans son enseignement.",
    "On te donne une question de réflexion. Propose un court brouillon de réponse (3 à 5 phrases), en français canadien, vouvoiement, écrit à la première personne, comme point de départ que la personne pourra ensuite modifier et personnaliser.",
    "Ton réflexif, concret et nuancé — éviter le ton publicitaire ou les généralités creuses.",
    "Réponds uniquement avec le texte du brouillon : aucun titre, aucune liste à puces, aucun guillemet, aucun préambule.",
  ].join(" ");

  const userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question : ${question}\n\nPropose un brouillon de réponse (3 à 5 phrases).`;

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 240,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => "");
      res.status(502).json({
        error: "Le service de suggestion IA n'a pas répondu correctement.",
        details: errText.slice(0, 300),
      });
      return;
    }

    const data = await groqRes.json();
    const suggestion = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || "").trim();

    if (!suggestion) {
      res.status(502).json({ error: "Le service de suggestion IA a renvoyé une réponse vide." });
      return;
    }

    res.status(200).json({ suggestion });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'appel au service de suggestion IA." });
  }
};
