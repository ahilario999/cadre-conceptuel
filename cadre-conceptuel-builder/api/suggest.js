/**
 * api/suggest.js
 *
 * Fonction serverless Vercel (Node.js) : reçoit une question du « Cadre
 * conceptuel » et renvoie un court brouillon de réponse généré par l'API
 * Groq, que la personne pourra ensuite modifier et personnaliser.
 *
 * Le champ `lang` ("fr" | "en") indique dans quelle langue Groq doit
 * répondre — il correspond à la langue choisie dans l'interface (toggle
 * FRA/ENG).
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
    res.status(405).json({ error: "Méthode non autorisée. / Method not allowed." });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error:
        "La suggestion IA n'est pas configurée sur ce site (clé GROQ_API_KEY manquante). / AI suggestions are not configured on this site (missing GROQ_API_KEY).",
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
  const allowedLangs = ["fr", "en"];
  const lang = allowedLangs.includes(String(body.lang || "").trim())
    ? String(body.lang).trim()
    : "fr";
  const isEn = lang === "en";
  const rows = Array.isArray(body.rows) ? body.rows.map((r) => String(r || "").trim()).filter(Boolean) : [];
  const columns = Array.isArray(body.columns) ? body.columns.map((c) => String(c || "").trim()).filter(Boolean) : [];

  if (!question) {
    res.status(400).json({ error: isEn ? "The question is missing." : "La question est manquante." });
    return;
  }

  const contextLines = (
    isEn
      ? [
          blockTitle ? `Conceptual framework section: ${blockTitle}` : null,
          blockDescription ? `Section description: ${blockDescription}` : null,
          role ? `Role of the person answering: ${role}` : null,
          programName ? `Program or teaching field: ${programName}` : null,
          hint ? `Reflection prompt provided: ${hint}` : null,
        ]
      : [
          blockTitle ? `Section du cadre conceptuel : ${blockTitle}` : null,
          blockDescription ? `Description de la section : ${blockDescription}` : null,
          role ? `Rôle de la personne qui répond : ${role}` : null,
          programName ? `Programme ou domaine d'enseignement : ${programName}` : null,
          hint ? `Piste de réflexion fournie : ${hint}` : null,
        ]
  )
    .filter(Boolean)
    .join("\n");

  // Règle commune : toujours rester court et précis, et toujours ancrer la
  // réponse dans le rôle / la profession de la personne, peu importe le format.
  const baseIntro = isEn
    ? "You are helping a college instructor or staff member write their personal \"Conceptual Framework\" on integrating generative AI into their teaching. Always be short and precise: no filler, no empty generalities, no repetition, no marketing tone. Always ground your suggestion in the role and teaching field specified above (if provided) instead of staying generic."
    : "Tu aides une personne enseignante ou un membre du personnel d'un collège à rédiger son « Cadre conceptuel » personnel sur l'intégration de l'intelligence artificielle générative dans son enseignement. Sois toujours court et précis : aucun remplissage, aucune généralité creuse, aucune répétition, aucun ton publicitaire. Ancre toujours ta proposition dans le rôle et le domaine d'enseignement précisés ci-dessus (s'ils sont fournis) plutôt que de rester générique.";

  let systemPrompt;
  let userPrompt;
  let maxTokens;

  if (format === "liste") {
    // Champs de type « une idée/tâche par ligne » (ex. Partage des tâches,
    // Boîte à outils) : on attend une courte liste de mots-clés, pas des phrases.
    if (isEn) {
      systemPrompt = [
        baseIntro,
        "You are given a question related to a list of short items or tasks.",
        "Propose a short list of 3 to 6 concrete items, one item per line, each 1 to 3 words maximum (keywords or short expressions, never full sentences).",
        "Respond only with the items, one per line: no bullets, no dashes, no numbering, no trailing punctuation, no preamble.",
      ].join(" ");
      userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question: ${question}\n\nPropose a short list (one item per line, 1 to 3 words each, 3 to 6 items).`;
    } else {
      systemPrompt = [
        baseIntro,
        "On te donne une question liée à une liste d'éléments ou de tâches courtes.",
        "Propose une courte liste de 3 à 6 éléments concrets, un élément par ligne, chacun en 1 à 3 mots maximum (mots-clés ou courtes expressions, jamais de phrases complètes).",
        "Réponds uniquement avec les éléments, un par ligne : aucune puce, aucun tiret, aucun numéro, aucune ponctuation finale, aucun préambule.",
      ].join(" ");
      userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question : ${question}\n\nPropose une courte liste (un élément par ligne, 1 à 3 mots chacun, 3 à 6 éléments).`;
    }
    maxTokens = 80;
  } else if (format === "phrase") {
    // Bloc « Phrase-clé » : une seule phrase courte et percutante.
    if (isEn) {
      systemPrompt = [
        baseIntro,
        "You are given a section that requires a single key phrase, short and punchy, that could appear alone on a slide.",
        "Propose ONE single sentence (maximum 12 words), in the person's own language, that sums up their stance on AI in their teaching.",
        "Respond only with this sentence: no quotation marks, no unnecessary trailing period, no preamble, a single line.",
      ].join(" ");
      userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question: ${question}\n\nPropose a single short, punchy key phrase (maximum 12 words).`;
    } else {
      systemPrompt = [
        baseIntro,
        "On te donne une section qui demande une seule phrase-clé, courte et percutante, qui pourrait apparaître seule sur une diapositive.",
        "Propose UNE seule phrase (maximum 12 mots), en français canadien, dans le langage de la personne, qui résume sa posture par rapport à l'IA dans son enseignement.",
        "Réponds uniquement avec cette phrase : aucun guillemet, aucun point final superflu, aucun préambule, une seule ligne.",
      ].join(" ");
      userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question : ${question}\n\nPropose une seule phrase-clé courte et percutante (maximum 12 mots).`;
    }
    maxTokens = 40;
  } else if (format === "outils") {
    // Bloc « Outils IA » : liste d'outils pertinents avec leur usage.
    if (isEn) {
      systemPrompt = [
        baseIntro,
        "You are given a section that requires a list of digital or AI tools relevant to the person's teaching field, each with its main use.",
        "Propose 3 to 5 concrete tools relevant to this field, each with its main use in 1 to 2 words.",
        "Respond with one line per tool, in the exact format \"Tool name — usage\" (with an em dash — between the name and the usage): no bullets, no numbering, no preamble.",
      ].join(" ");
      userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question: ${question}\n\nPropose 3 to 5 relevant tools with their usage, one per line, in the format "Name — usage".`;
    } else {
      systemPrompt = [
        baseIntro,
        "On te donne une section qui demande une liste d'outils numériques ou d'IA pertinents pour le domaine d'enseignement de la personne, chacun avec son usage principal.",
        "Propose 3 à 5 outils concrets et pertinents pour ce domaine, chacun avec son usage principal en 1 à 2 mots.",
        "Réponds avec une ligne par outil, au format exact « Nom de l'outil — usage » (avec un tiret cadratin — entre le nom et l'usage) : aucune puce, aucun numéro, aucun préambule.",
      ].join(" ");
      userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question : ${question}\n\nPropose 3 à 5 outils pertinents avec leur usage, un par ligne, au format « Nom — usage ».`;
    }
    maxTokens = 120;
  } else if (format === "table") {
    // Bloc « Qui fait quoi ? » : pour chaque étape, une courte description du
    // rôle de la personne et de celui de l'IA.
    const rowsList = rows.length
      ? rows.join(", ")
      : isEn
        ? "Design, Develop, Evaluate, Execute"
        : "Concevoir, Développer, Évaluer, Exécuter";
    const colHuman = columns[0] || (isEn ? "the person" : "la personne");
    const colAi = columns[1] || (isEn ? "AI" : "l'IA");
    if (isEn) {
      systemPrompt = [
        baseIntro,
        `You are given a list of steps in a work process. For EACH step, propose a very short description (2 to 4 words, never a full sentence) of what "${colHuman}" does and what "${colAi}" can do.`,
        "Respond with exactly one line per step, in the same order as the steps provided, in the exact format \"Step: person description | AI description\".",
        "No extra lines, no title, no bullets, no preamble.",
      ].join(" ");
      userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question: ${question}\n\nSteps (in order): ${rowsList}\n\nPropose one line per step, in the format "Step: <${colHuman}> | <${colAi}>".`;
    } else {
      systemPrompt = [
        baseIntro,
        `On te donne une liste d'étapes d'un processus de travail. Pour CHAQUE étape, propose une très courte description (2 à 4 mots, jamais de phrase complète) de ce que fait « ${colHuman} » et de ce que peut faire « ${colAi} ».`,
        "Réponds avec exactement une ligne par étape, dans le même ordre que les étapes fournies, au format exact « Étape : description personne | description IA ».",
        "Aucune ligne supplémentaire, aucun titre, aucune puce, aucun préambule.",
      ].join(" ");
      userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question : ${question}\n\nÉtapes (dans l'ordre) : ${rowsList}\n\nPropose une ligne par étape, au format « Étape : <${colHuman}> | <${colAi}> ».`;
    }
    maxTokens = 200;
  } else {
    // Champs de type question/réponse (Éthique, Intention, Conception, etc.).
    if (isEn) {
      systemPrompt = [
        baseIntro,
        "You are given a reflection question. Propose a short draft answer (2 to 3 sentences maximum), in clear English, written in the first person, as a starting point the person can then edit and personalize.",
        "Reflective, concrete, and nuanced tone.",
        "Respond only with the draft text: no title, no bullet list, no quotation marks, no preamble.",
      ].join(" ");
      userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question: ${question}\n\nPropose a draft answer (2 to 3 sentences maximum).`;
    } else {
      systemPrompt = [
        baseIntro,
        "On te donne une question de réflexion. Propose un court brouillon de réponse (2 à 3 phrases maximum), en français canadien, vouvoiement, écrit à la première personne, comme point de départ que la personne pourra ensuite modifier et personnaliser.",
        "Ton réflexif, concret et nuancé.",
        "Réponds uniquement avec le texte du brouillon : aucun titre, aucune liste à puces, aucun guillemet, aucun préambule.",
      ].join(" ");
      userPrompt = `${contextLines ? contextLines + "\n\n" : ""}Question : ${question}\n\nPropose un brouillon de réponse (2 à 3 phrases maximum).`;
    }
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
        error: isEn
          ? "The AI suggestion service did not respond correctly."
          : "Le service de suggestion IA n'a pas répondu correctement.",
        details: errText.slice(0, 300),
      });
      return;
    }

    const data = await groqRes.json();
    const suggestion = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || "").trim();

    if (!suggestion) {
      res.status(502).json({
        error: isEn
          ? "The AI suggestion service returned an empty response."
          : "Le service de suggestion IA a renvoyé une réponse vide.",
      });
      return;
    }

    res.status(200).json({ suggestion });
  } catch (err) {
    res.status(500).json({
      error: isEn
        ? "Error while calling the AI suggestion service."
        : "Erreur lors de l'appel au service de suggestion IA.",
    });
  }
};
