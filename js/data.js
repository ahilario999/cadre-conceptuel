/**
 * data.js
 * Modèle de données du "Cadre conceptuel" + banque de questions / pistes de réflexion.
 *
 * Ce fichier définit :
 *  - DEFAULT_META   : informations générales (titre, logo, couleur d'accent...)
 *  - BLOCK_LIBRARY  : tous les blocs disponibles (actifs ou non) avec leur structure,
 *                      leurs questions d'entrevue et leurs pistes de réflexion.
 *  - createDefaultState() : retourne un état neuf prêt à être utilisé par l'app.
 *
 * Pour ajouter un nouveau bloc : copier un bloc existant du même "type" dans
 * BLOCK_LIBRARY, lui donner un id unique, et l'ajouter à l'ordre par défaut
 * dans createDefaultState().
 */

const APP_VERSION = "1.0";

// Couleurs choisies pour un contraste AA (>= 4.5:1) avec du texte blanc en surimpression.
const ACCENT_PRESETS = [
  { name: "Turquoise", value: "#0E7C75" },
  { name: "Corail", value: "#C73E2D" },
  { name: "Indigo", value: "#5152D6" },
  { name: "Moutarde", value: "#7A6B10" },
  { name: "Magenta", value: "#C0299E" },
  { name: "Vert sapin", value: "#1F8050" },
];

const DEFAULT_META = {
  title: "Le [praticien] dans la boucle",
  tagline: "PENSE • CONÇOIT • JUGE • CRÉE",
  quote: "« La créativité ne se délègue pas. Elle se nourrit. »",
  programName: "Mon programme d'études",
  institutionName: "Mon établissement",
  authorName: "",
  role: "Praticien·ne",
  logoDataUrl: null,
  accentColor: ACCENT_PRESETS[0].value,
  theme: "light", // "light" | "dark"
  createdAt: null,
  updatedAt: null,
};

/**
 * Types de blocs supportés par le moteur de rendu :
 *  - "qa"     : une ou plusieurs questions ouvertes (texte libre)
 *  - "list"   : une liste d'éléments courts (puces)
 *  - "split"  : deux colonnes avec curseur de répartition (%) + listes
 *  - "table"  : tableau rôles × (Humain / Avec l'IA)
 *  - "tools"  : grille d'outils IA nommés (avec icônes automatiques)
 *  - "tagline": bloc d'accroche, texte court éditable (pas d'entrevue)
 */

const BLOCK_LIBRARY = [
  {
    id: "ethique",
    title: "Éthique",
    subtitle: "Le brief moral",
    tag: "AVANT d'agir",
    acronym: "S.I.F.T.",
    acronymDescription: "Specify • Identify • Focus • Trust",
    size: "col-4",
    theme: "light",
    type: "qa",
    icon: "spark",
    description:
      "Les questions à se poser avant même d'ouvrir un outil d'IA générative.",
    questions: [
      {
        id: "ethique-1",
        label:
          "Quelle question vos étudiant·e·s devraient-ils se poser AVANT d'utiliser un outil d'IA générative pour une tâche donnée ?",
        hint:
          "Piste : inspirez-vous du cadre S.I.F.T. (Specify • Identify • Focus • Trust) — précisez la tâche, identifiez ce qui est sensible ou à protéger, ciblez l'usage approprié, et demandez-vous si vous pouvez faire confiance au résultat.",
      },
    ],
  },
  {
    id: "intention",
    title: "Intention",
    subtitle: "La co-idéation dirigée",
    tag: "QUAND vous utilisez l'IA",
    acronym: "A.C.T.I.F.",
    acronymDescription: "Action • Contexte • Ton • Identité • Format",
    size: "col-4",
    theme: "light",
    type: "qa",
    icon: "target",
    description:
      "Comment formuler une demande à l'IA pour qu'elle reste un outil au service de votre intention.",
    questions: [
      {
        id: "intention-1",
        label:
          "Quelle question vos étudiant·e·s devraient-ils se poser PENDANT qu'ils utilisent un outil d'IA, pour bien diriger la co-idéation ?",
        hint:
          "Piste : inspirez-vous du cadre A.C.T.I.F. (Action • Contexte • Ton • Identité • Format) pour structurer une consigne claire et garder le contrôle sur le résultat.",
      },
    ],
  },
  {
    id: "conception",
    title: "Conception",
    subtitle: "Le processus",
    tag: "COMMENT vous concevez",
    badge: "I.D.É.E. — Idéer • Développer • Évaluer • Exécuter",
    size: "col-4",
    theme: "light",
    type: "qa",
    icon: "process",
    description:
      "La place de l'IA dans chaque étape de votre processus de création ou de résolution de problème.",
    questions: [
      {
        id: "conception-1",
        label:
          "Quelle question vos étudiant·e·s devraient-ils se poser pour intégrer un outil d'IA de façon professionnelle dans leur processus de création ?",
        hint:
          "Piste : inspirez-vous du cadre I.D.É.E. (Idéer • Développer • Évaluer • Exécuter) ci-dessus — vous pouvez aussi modifier cette étiquette pour qu'elle reflète les grandes étapes propres à votre domaine.",
      },
    ],
  },
  {
    id: "boite-outils",
    title: "L'évolution de la boîte à outils",
    subtitle:
      "Adopter une posture d'adaptation continue face à des outils qui changent vite",
    tag: "Le contexte change, la posture reste",
    size: "col-12",
    theme: "dark",
    type: "list-columns",
    icon: "globe",
    description:
      "Situez les outils de votre domaine selon leur évolution, du carnet de croquis aux outils génératifs.",
    columns: [
      {
        id: "traditionnel",
        title: "Traditionnel",
        hint: "Outils analogiques ou manuels de base de votre domaine (ex. carnet, crayon, esquisses, instruments).",
      },
      {
        id: "numerique",
        title: "Numérique",
        hint: "Logiciels ou outils numériques standards (ex. suites professionnelles, logiciels spécialisés).",
      },
      {
        id: "collaboratif",
        title: "Collaboratif",
        hint: "Outils de travail d'équipe et de partage (ex. plateformes cloud, tableaux collaboratifs).",
      },
      {
        id: "generatif",
        title: "Génératif",
        hint: "Outils d'IA générative pertinents pour votre domaine (texte, image, code, audio, etc.).",
      },
    ],
  },
  {
    id: "partage-taches",
    title: "Partage des tâches",
    subtitle: "Ce que l'IA peut accélérer vs. ce qui reste humain",
    size: "col-12",
    theme: "split",
    type: "split",
    icon: "scale",
    description:
      "Détermine, en pourcentage, la part de tâches que l'IA peut soutenir et celle qui doit demeurer entièrement humaine.",
    left: {
      id: "exploration",
      title: "Exploration",
      label: "L'IA peut accélérer",
      defaultPercent: 40,
      hint:
        "Piste : tâches répétitives, exploratoires ou techniques (recherche, brouillons, variantes, mise en forme, synthèse de données).",
    },
    right: {
      id: "intentions",
      title: "Intentions conceptuelles",
      label: "VOUS SEUL·E pouvez apporter",
      defaultPercent: 60,
      hint:
        "Piste : jugement critique, vision, relation humaine, cohérence, signature personnelle, sens éthique et narration.",
    },
    questions: [
      {
        id: "partage-1",
        label: "Quelles tâches concrètes de votre domaine l'IA peut-elle accélérer ?",
        hint: "Listez-les une par ligne : ex. recherche documentaire, premiers jets, traductions, mise en page.",
        column: "left",
      },
      {
        id: "partage-2",
        label: "Quelles tâches doivent absolument rester sous la responsabilité humaine ?",
        hint: "Listez-les une par ligne : ex. évaluation finale, relation pédagogique, décisions éthiques, validation de la qualité.",
        column: "right",
      },
    ],
  },
  {
    id: "qui-fait-quoi",
    title: "Qui fait quoi ?",
    subtitle: "Répartition des rôles entre la personne et l'IA",
    size: "col-6",
    theme: "light",
    type: "table",
    icon: "grid",
    description:
      "Pour chaque étape de votre processus, précisez ce qui revient à la personne et ce que l'IA peut soutenir.",
    rowHint:
      "Vous pouvez renommer ces étapes pour qu'elles correspondent à votre processus (section Conception ci-dessus).",
    rows: [
      { id: "concevoir", label: "Concevoir" },
      { id: "developper", label: "Développer" },
      { id: "evaluer", label: "Évaluer" },
      { id: "executer", label: "Exécuter" },
    ],
    columns: [
      {
        id: "humain",
        title: "La personne",
        hint: "Ce que la personne dirige, choisit ou juge à cette étape.",
      },
      {
        id: "ia",
        title: "Avec l'IA",
        hint: "Ce que l'IA peut accélérer ou alimenter à cette étape (ou « — » si elle ne devrait pas intervenir).",
      },
    ],
  },
  {
    id: "ia-excelle",
    title: "L'IA excelle",
    subtitle: "Dans la combinaison, pas la décision",
    size: "col-3",
    theme: "accent",
    type: "list",
    icon: "merge",
    description:
      "Nommez les verbes d'action qui décrivent le mieux ce que l'IA fait bien dans votre domaine.",
    placeholderItems: ["Assembler", "Mixer", "Générer", "Combiner"],
    questions: [
      {
        id: "ia-excelle-1",
        label: "Quels verbes décrivent le mieux ce que l'IA excelle à faire dans votre domaine ?",
        hint: "Piste : pensez à des verbes d'action courts et forts (3 à 5), comme « Assembler • Mixer • Générer ».",
      },
    ],
  },
  {
    id: "signature-transformation",
    title: "[Praticien·ne] — transformation",
    subtitle: "Ce que votre rôle devient",
    size: "col-3",
    theme: "gray",
    type: "list",
    icon: "shift",
    description:
      "Comment votre rôle professionnel se transforme face à l'IA — au-delà de l'exécution technique.",
    placeholderItems: ["Créer du sens", "Porter une vision", "Toucher les humains"],
    questions: [
      {
        id: "transfo-1",
        label: "Au-delà de la technique, quelle valeur ajoutée définit votre rôle professionnel aujourd'hui ?",
        hint: "Piste : 2 à 4 courtes affirmations, ex. « Créer du sens », « Porter une vision », « Accompagner une personne ».",
      },
    ],
  },
  {
    id: "signature",
    title: "Votre signature",
    subtitle: "Ce que l'IA ne peut pas générer",
    size: "col-8",
    theme: "light",
    type: "list",
    icon: "fingerprint",
    description:
      "Les qualités humaines, propres à la personne, qu'aucune IA ne peut reproduire.",
    placeholderItems: ["Votre œil", "Votre jugement", "Votre éthique", "Votre vécu", "Votre sensibilité"],
    questions: [
      {
        id: "signature-1",
        label:
          "Quelles qualités personnelles (regard, jugement, éthique, vécu, sensibilité...) restent la « signature » irremplaçable d'une personne dans votre domaine ?",
        hint: "Piste : listez 4 à 6 mots ou courtes expressions, à la 2e personne du pluriel (« Votre... »).",
      },
    ],
  },
  {
    id: "tagline",
    title: "Phrase-clé",
    subtitle: "Le message qu'on retient",
    size: "col-4",
    theme: "accent",
    type: "tagline",
    icon: "quote",
    description:
      "Une phrase courte et marquante qui résume votre posture face à l'IA dans votre domaine.",
    placeholder: "L'outil ne fait pas l'artisan",
    questions: [
      {
        id: "tagline-1",
        label: "Si vous deviez résumer votre posture en une phrase courte et marquante, laquelle choisiriez-vous ?",
        hint: "Piste : une phrase qui pourrait apparaître seule sur une diapositive — percutante, mémorable, dans votre langage.",
      },
    ],
  },
  {
    id: "outils-ia",
    title: "Outils IA",
    subtitle: "Les outils pertinents dans votre domaine, et leur rôle",
    size: "col-12",
    theme: "light",
    type: "tools",
    icon: "tools",
    description:
      "Nommez les outils d'IA générative utilisés ou pertinents dans votre domaine et précisez leur rôle principal. L'icône de l'outil s'ajoutera automatiquement si elle est reconnue.",
    placeholderItems: [
      { name: "ChatGPT", usage: "Co-gestion" },
      { name: "Claude", usage: "Code" },
      { name: "Google Gemini", usage: "Co-intelligence" },
      { name: "Perplexity", usage: "Recherche" },
      { name: "Adobe Firefly", usage: "Productivité" },
      { name: "Figma AI", usage: "Prototypage" },
    ],
    questions: [
      {
        id: "outils-1",
        label: "Quels outils d'IA générative sont (ou seront) pertinents pour votre domaine, et à quoi servent-ils principalement ?",
        hint: "Piste : pour chaque outil, donnez son nom et un mot-clé d'usage (ex. recherche, code, image, audio, présentation).",
      },
    ],
  },
  {
    id: "enjeux-ethiques",
    title: "Enjeux éthiques",
    subtitle: "Les questions à garder vivantes dans la discussion",
    size: "col-12",
    theme: "accent-dark",
    type: "list-tags",
    icon: "alert",
    description:
      "Les grands enjeux éthiques propres à l'usage de l'IA générative dans votre domaine.",
    placeholderItems: [
      "Droits moraux",
      "Risque client",
      "Droit d'auteur",
      "Transparence",
      "Consentement",
      "Dévaluation",
      "Honnêteté",
      "Biais",
      "Générer ≠ créer",
      "Impact environnemental",
    ],
    questions: [
      {
        id: "enjeux-1",
        label: "Quels enjeux éthiques (un mot ou une courte expression chacun) voulez-vous garder à l'esprit en lien avec l'IA dans votre domaine ?",
        hint: "Piste : visez 6 à 10 mots-clés courts — ils s'afficheront comme des étiquettes dans votre Cadre conceptuel.",
      },
    ],
  },
];

/**
 * Ordre par défaut des blocs (tous activés au départ).
 */
const DEFAULT_BLOCK_ORDER = BLOCK_LIBRARY.map((b) => b.id);

/**
 * Crée un état neuf et complet pour l'application.
 */
function createDefaultState() {
  const now = new Date().toISOString();
  return {
    version: APP_VERSION,
    meta: { ...DEFAULT_META, createdAt: now, updatedAt: now },
    blockOrder: [...DEFAULT_BLOCK_ORDER],
    enabledBlocks: [...DEFAULT_BLOCK_ORDER],
    answers: {}, // { [questionId]: string | string[] }
    blockData: {}, // données spécifiques par bloc (ex: % split, items de table, items d'outils)
    currentStep: 0, // index dans le parcours d'entrevue
    screen: "config", // "config" | "interview" | "overview" | "final"
  };
}

// Export global (chargement via balises <script> classiques, sans bundler)
window.CADRE_DATA = {
  APP_VERSION,
  ACCENT_PRESETS,
  DEFAULT_META,
  BLOCK_LIBRARY,
  DEFAULT_BLOCK_ORDER,
  createDefaultState,
};
