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
  const allowedFormats = ["qa", "liste", "phrase", "outils", "table"];
  const format = allowedFormats.includes(String(body.format || "").trim())
    ? String(body.format).trim()
    : "qa";
  const rows = Array.isArray(body.rows) ? body.rows.map((r) => String(r || "").trim()).filter(Boolean) : [];
  const columns = Array.isArray(body.columns) ? body.columns.map((c) => String(c || "").trim()).filter(Boolean) : [];

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

  // Règle commune : toujours rester court et précis, et toujours ancrer la
  // réponse dans le rôle / la profession de la personne, peu importe le format.
  const baseIntro =
    "Tu aides une personne enseignante ou un membre du personnel d'un collège à rédiger son « Cadre conceptuel » personnel sur l'intégration de l'intelligence artificielle générative dans son enseignement. Sois toujours court et précis : aucun remplissage, aucune généralité creuse, aucune répétition, aucun ton publicitaire. Ancre toujours ta proposition dans le rôle et le domaine d'enseignement précisés ci-dessus (s'ils sont fournis) plutôt que de rester générique.";

  let systemPrompt;
  let userPrompt;
  let maxTokens;

  if (format === "liste") {
    // Champs de type « une idée/tâche par ligne » (ex. Partage des tâches,
    // Boîte à outils) : on attend une courte liste de mots-clés, pas des phrases.
    systemPrompt = [
      baseIntro,
      "On te donne une question liée à une liste d'éléments ou de tâches courtes.",
      "Propose une courte liste de 3 à 6 éléments concrets, un élément par ligne, chacun en 1 à 3 mots maximum (mots-clés ou courtes expressions, jamais de phrases complètes).",
      "Réponds uniquement avec les éléments, un par ligne : aucune puce, aucun tiret, aucun numéro, aucune ponctuation finale, aucun préambule.",
    ].join(" ");
    userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question : ${question}\n\nPropose une courte liste (un élément par ligne, 1 à 3 mots chacun, 3 à 6 éléments).`;
    maxTokens = 80;
  } else if (format === "phrase") {
    // Bloc « Phrase-clé » : une seule phrase courte et percutante.
    systemPrompt = [
      baseIntro,
      "On te donne une section qui demande une seule phrase-clé, courte et percutante, qui pourrait apparaître seule sur une diapositive.",
      "Propose UNE seule phrase (maximum 12 mots), en français canadien, dans le langage de la personne, qui résume sa posture par rapport à l'IA dans son enseignement.",
      "Réponds uniquement avec cette phrase : aucun guillemet, aucun point final superflu, aucun préambule, une seule ligne.",
    ].join(" ");
    userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question : ${question}\n\nPropose une seule phrase-clé courte et percutante (maximum 12 mots).`;
    maxTokens = 40;
  } else if (format === "outils") {
    // Bloc « Outils IA » : liste d'outils pertinents avec leur usage.
    systemPrompt = [
      baseIntro,
      "On te donne une section qui demande une liste d'outils numériques ou d'IA pertinents pour le domaine d'enseignement de la personne, chacun avec son usage principal.",
      "Propose 3 à 5 outils concrets et pertinents pour ce domaine, chacun avec son usage principal en 1 à 2 mots.",
      "Réponds avec une ligne par outil, au format exact « Nom de l'outil — usage » (avec un tiret cadratin — entre le nom et l'usage) : aucune puce, aucun numéro, aucun préambule.",
    ].join(" ");
    userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question : ${question}\n\nPropose 3 à 5 outils pertinents avec leur usage, un par ligne, au format « Nom — usage ».`;
    maxTokens = 120;
  } else if (format === "table") {
    // Bloc « Qui fait quoi ? » : pour chaque étape, une courte description du
    // rôle de la personne et de celui de l'IA.
    const rowsList = rows.length ? rows.join(", ") : "Concevoir, Développer, Évaluer, Exécuter";
    const colHuman = columns[0] || "la personne";
    const colAi = columns[1] || "l'IA";
    systemPrompt = [
      baseIntro,
      `On te donne une liste d'étapes d'un processus de travail. Pour CHAQUE étape, propose une très courte description (2 à 4 mots, jamais de phrase complète) de ce que fait « ${colHuman} » et de ce que peut faire « ${colAi} ».`,
      "Réponds avec exactement une ligne par étape, dans le même ordre que les étapes fournies, au format exact « Étape : description personne | description IA ».",
      "Aucune ligne supplémentaire, aucun titre, aucune puce, aucun préambule.",
    ].join(" ");
    userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question : ${question}\n\nÉtapes (dans l'ordre) : ${rowsList}\n\nPropose une ligne par étape, au format « Étape : <${colHuman}> | <${colAi}> ».`;
    maxTokens = 200;
  } else {
    // Champs de type question/réponse (Éthique, Intention, Conception, etc.).
    systemPrompt = [
      baseIntro,
      "On te donne une question de réflexion. Propose un court brouillon de réponse (2 à 3 phrases maximum), en français canadien, vouvoiement, écrit à la première personne, comme point de départ que la personne pourra ensuite modifier et personnaliser.",
      "Ton réflexif, concret et nuancé.",
      "Réponds uniquement avec le texte du brouillon : aucun titre, aucune liste à puces, aucun guillemet, aucun préambule.",
    ].join(" ");
    userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question : ${question}\n\nPropose un brouillon de réponse (2 à 3 phrases maximum).`;
    maxTokens = 160;
  }

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
        max_tokens: maxTokens,
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
