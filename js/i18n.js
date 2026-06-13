/**
 * i18n.js
 * Dictionnaire bilingue (français / anglais) pour l'interface et le contenu
 * du Cadre conceptuel.
 *
 *  - UI_STRINGS        : toutes les chaînes d'interface statiques et dynamiques.
 *  - BLOCK_LIBRARY_EN  : traduction anglaise des champs textuels de BLOCK_LIBRARY
 *                        (data.js), fusionnée par getBlockLibrary("en").
 *  - ACCENT_NAMES_EN   : traduction des noms de couleurs d'accent.
 *  - t(lang, key, vars): retourne la chaîne traduite, avec substitution {var}.
 *  - getBlockLibrary(lang) : retourne BLOCK_LIBRARY (fr) ou une version fusionnée
 *                        avec BLOCK_LIBRARY_EN (en).
 */

const UI_STRINGS = {
  fr: {
    // Squelette / en-tête
    skipLink: "Aller au contenu principal",
    pageTitle: "Le praticien dans la boucle — Cadre conceptuel IA",
    pageDescription:
      "Construisez votre propre Cadre conceptuel sur l'usage de l'IA générative dans votre programme d'études.",
    headerTitleDefault: "Le praticien dans la boucle",
    headerSubtitleDefault: "Cadre conceptuel — IA & mon domaine",
    ariaLogoAlt: "Logo du programme ou de l'établissement",
    themeToggleDark: "Mode sombre",
    themeToggleLight: "Mode clair",
    btnSave: "Sauvegarder",
    btnImport: "Importer",
    btnRestart: "Recommencer",
    langToggleAriaLabel: "Langue de l'interface",
    langToggleFr: "FRA",
    langToggleEn: "ENG",

    // Écran 1 — Configuration
    configTitle: "Construisez votre Cadre conceptuel",
    configLead:
      "Inspiré du cadre « Le graphiste dans la boucle », cet outil vous coache pour bâtir le vôtre : répondez à une courte entrevue par bloc, avec des pistes de réflexion pour chaque thème — la décision finale vous appartient toujours.",
    section1Identity: "1 — Identité",
    labelProgramName: "Nom du programme",
    placeholderProgramName: "Ex. Design graphique",
    labelInstitution: "Établissement",
    placeholderInstitution: "Ex. La Cité",
    labelAuthorName: "Votre nom (optionnel)",
    placeholderAuthorName: "Ex. Antonio Hilario",
    labelRole: "Votre rôle ou titre professionnel",
    placeholderRole: "Ex. Designer graphique, Enseignant·e",
    hintRole:
      "Ce mot remplacera « Praticien·ne » dans le bloc « transformation » de votre Cadre conceptuel.",
    labelCadreTitle: "Titre du cadre",
    placeholderCadreTitle: "Ex. Le [praticien] dans la boucle",
    hintCadreTitle: "Astuce : reprenez la structure « Le/La [rôle] dans la boucle ».",
    labelTagline: "Accroche (PENSE • CONÇOIT • JUGE • CRÉE)",
    placeholderTagline: "Ex. PENSE • CONÇOIT • JUGE • CRÉE",
    labelQuote: "Citation",
    placeholderQuote: "Ex. « La créativité ne se délègue pas. Elle se nourrit. »",
    fieldLabelLogo: "Logo (programme ou établissement)",
    logoDropzoneHtml:
      "<strong>Cliquez pour téléverser</strong> ou glissez une image ici (PNG/SVG, fond transparent recommandé).",
    section2Appearance: "2 — Apparence",
    fieldLabelAccent: "Couleur d'accent",
    ariaAccentPresets: "Couleurs d'accent prédéfinies",
    ariaAccentCustom: "Couleur d'accent personnalisée",
    labelCustomColor: "Personnalisée",
    section3Blocks: "3 — Blocs du cadre",
    hintBlocksConfig:
      "Activez, désactivez ou réordonnez les blocs selon votre champ d'expertise. Vous pourrez aussi en ajouter plus tard.",
    btnAddCustomBlock: "Ajouter un bloc personnalisé",
    hintImportConfig: "Vous pouvez importer une sauvegarde existante avec le bouton « Importer » en haut.",
    btnStartInterview: "Commencer l'entrevue →",

    // Écran 2 — Entrevue
    interviewTitle: "L'atelier",
    interviewLead:
      "Remplissez un bloc à la fois, à votre rythme. À droite, regardez votre Cadre conceptuel se construire en direct.",
    ariaInterviewProgress: "Progression de l'entrevue",
    hintLabel: "Piste de réflexion",
    btnPrev: "Précédent",
    btnNext: "Suivant",
    btnSeeOverview: "Voir l'aperçu",
    btnToggleHintShow: "Voir la piste",
    btnToggleHintHide: "Masquer la piste",
    previewLabel: "Votre Cadre conceptuel — en direct",
    progressLabel: "Bloc {current} sur {total} — {title}",

    // Écran 3 — Aperçu
    overviewTitle: "Aperçu de votre cadre",
    overviewLead:
      "Cliquez sur un bloc pour le modifier. Ajoutez ou retirez des blocs au besoin, puis générez votre Cadre conceptuel final.",
    btnBackToInterview: "Reprendre l'entrevue",
    btnAddBlock: "Ajouter un bloc",
    btnGenerateFinal: "Générer mon Cadre conceptuel →",
    emptyStateOverview: "Aucun bloc actif. Ajoutez un bloc ou retournez à la configuration.",

    // Écran 4 — Final
    finalTitle: "Votre Cadre conceptuel",
    finalLead:
      "Téléchargez votre Cadre conceptuel en PDF, sauvegardez votre fichier de travail pour le reprendre plus tard, ou retournez à l'édition.",
    btnExportPdf: "Télécharger en PDF",
    btnExportJson: "Télécharger le fichier de sauvegarde (.json)",
    btnBackToOverview: "Retour à l'édition",
    finalEyebrow: "Cadre conceptuel",

    // Modale d'édition de bloc
    modalEditTitleDefault: "Modifier un bloc",
    modalClose: "Fermer",
    modalCancel: "Annuler",
    modalSave: "Enregistrer",

    // Modale d'ajout de bloc personnalisé
    modalAddTitle: "Ajouter un bloc personnalisé",
    labelNewBlockTitle: "Titre du bloc",
    placeholderNewBlockTitle: "Ex. Accessibilité",
    labelNewBlockSubtitle: "Sous-titre",
    placeholderNewBlockSubtitle: "Ex. Une réflexion propre à mon domaine",
    labelNewBlockQuestion: "Question d'entrevue",
    placeholderNewBlockQuestion: "Ex. Quelles considérations d'accessibilité sont prioritaires dans votre domaine ?",
    labelNewBlockHint: "Piste de réflexion (optionnel)",
    placeholderNewBlockHint: "Une suggestion ou un exemple pour amorcer la réflexion.",
    labelNewBlockSize: "Taille du bloc",
    sizeSmall: "Petit (1/3 de la largeur)",
    sizeMedium: "Moyen (1/2 de la largeur)",
    sizeLarge: "Grand (2/3 de la largeur)",
    sizeFull: "Pleine largeur",
    labelNewBlockTheme: "Style",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeGray: "Gris",
    themeAccent: "Accent",
    btnAddBlockSave: "Ajouter le bloc",

    // Pied de page
    footerText:
      "Outil basé sur le cadre « Le graphiste dans la boucle » — Antonio Hilario, La Cité. Conçu pour être adapté à tout programme d'études. Aucune donnée n'est envoyée à un serveur sans votre consentement : sauvegardez vos fichiers régulièrement.",

    // app.js — chaînes dynamiques
    toastNoActiveBlock: "Active au moins un bloc avant de commencer l'entrevue.",
    toastNoActiveBlockContinue: "Active au moins un bloc avant de continuer.",
    ariaColorPreset: "Couleur {name}",
    ariaMoveBlockUp: "Monter le bloc {title}",
    ariaMoveBlockDown: "Descendre le bloc {title}",
    ariaEnableBlock: "Activer le bloc {title}",
    contrastWarning: "Cette couleur peut être difficile à lire en texte. Elle reste utilisable comme fond de bloc.",
    contrastOk: "Bon contraste : cette couleur est lisible en texte sur fond clair ou sombre.",
    confirmRemoveBlock:
      "Retirer le bloc « {title} » du cadre ?\n\nVos réponses pour ce bloc restent en mémoire : vous pourrez le réactiver dans la configuration sans perdre votre travail.",
    toastBlockRemoved: "Bloc « {title} » retiré. Vous pouvez le réactiver dans la configuration.",
    toastCustomBlockMissing: "Donne un titre et une question pour ce bloc.",
    toastCustomBlockAdded: "Bloc « {title} » ajouté.",
    toastJsonDownloaded: "Fichier de sauvegarde téléchargé.",
    toastImportSuccess: "Sauvegarde importée avec succès.",
    toastImportError: "Ce fichier ne semble pas être une sauvegarde valide.",
    toastPdfGenerating: "Génération du PDF…",
    toastPdfSuccess: "PDF généré !",
    toastPdfError: "Erreur lors de la génération du PDF.{detail}",
    confirmRestart: "Recommencer effacera votre travail en cours (sauvegardez-le avant si besoin). Continuer ?",
    toastNewFramework: "Nouveau cadre conceptuel.",
    localeDateCode: "fr-CA",

    // blocks.js — chaînes dynamiques
    ariaEditBlock: "Modifier le bloc {title}",
    titleRemoveBlock: "Retirer ce bloc",
    ariaRemoveBlock: "Retirer le bloc {title}",
    noAnswerYet: "Pas encore de réponse.",
    noTaglineYet: "Pas encore de phrase-clé.",
    noItems: "Aucun élément.",
    noIssuesListed: "Aucun enjeu listé.",
    toComplete: "À compléter.",
    noToolsListed: "Aucun outil listé.",
    labelBlockBadge: "Étiquette du bloc (optionnel)",
    hintBlockBadge: "Ex. un acronyme ou un repère propre à votre programme — laissez vide pour ne rien afficher.",
    ariaBlockBadge: "Étiquette du bloc",
    placeholderBlockBadge: "Ex. V.O.T.R.E. (ou laisser vide)",
    placeholderAnswer: "Écrivez votre réponse ici...",
    suggestDraft: "Suggérer un brouillon",
    suggestGenerating: "Génération en cours…",
    confirmReplaceText: "Remplacer le texte actuel par une suggestion de l'IA ?",
    confirmReplaceContent: "Remplacer le contenu actuel par une suggestion de l'IA ?",
    suggestError: "Suggestion indisponible pour le moment. Vous pouvez réessayer plus tard.",
    ariaItem: "Élément {n}",
    ariaRemoveItem: "Retirer cet élément",
    btnAdd: "Ajouter",
    ariaStepName: "Nom de l'étape",
    placeholderToolName: "Nom de l'outil (ex. Claude)",
    placeholderToolUsage: "Usage (ex. Recherche)",
    ariaToolName: "Nom de l'outil {n}",
    ariaToolUsage: "Usage de l'outil {n}",
    ariaRemoveTool: "Retirer cet outil",
    btnAddTool: "Ajouter un outil",
    placeholderOneItemPerLine: "Un élément par ligne...",
    placeholderOneIdeaPerLine: "Une idée par ligne...",
    ariaPercent: "Pourcentage {title}",
  },

  en: {
    // Skeleton / header
    skipLink: "Skip to main content",
    pageTitle: "The practitioner in the loop — AI Conceptual Framework",
    pageDescription:
      "Build your own Conceptual Framework on the use of generative AI in your program of study.",
    headerTitleDefault: "The practitioner in the loop",
    headerSubtitleDefault: "Conceptual framework — AI & my field",
    ariaLogoAlt: "Program or institution logo",
    themeToggleDark: "Dark mode",
    themeToggleLight: "Light mode",
    btnSave: "Save",
    btnImport: "Import",
    btnRestart: "Restart",
    langToggleAriaLabel: "Interface language",
    langToggleFr: "FRA",
    langToggleEn: "ENG",

    // Screen 1 — Configuration
    configTitle: "Build your Conceptual Framework",
    configLead:
      "Inspired by the “The Graphic Designer in the Loop” framework, this tool coaches you to build your own: answer a short interview block by block, with reflection prompts for each theme — the final decision is always yours.",
    section1Identity: "1 — Identity",
    labelProgramName: "Program name",
    placeholderProgramName: "E.g. Graphic Design",
    labelInstitution: "Institution",
    placeholderInstitution: "E.g. La Cité",
    labelAuthorName: "Your name (optional)",
    placeholderAuthorName: "E.g. Antonio Hilario",
    labelRole: "Your role or professional title",
    placeholderRole: "E.g. Graphic Designer, Teacher",
    hintRole:
      "This word will replace “Practitioner” in the “transformation” block of your Conceptual Framework.",
    labelCadreTitle: "Framework title",
    placeholderCadreTitle: "E.g. The [practitioner] in the loop",
    hintCadreTitle: "Tip: reuse the structure “The [role] in the loop.”",
    labelTagline: "Tagline (THINK • DESIGN • JUDGE • CREATE)",
    placeholderTagline: "E.g. THINK • DESIGN • JUDGE • CREATE",
    labelQuote: "Quote",
    placeholderQuote: "E.g. “Creativity can't be delegated. It must be nurtured.”",
    fieldLabelLogo: "Logo (program or institution)",
    logoDropzoneHtml:
      "<strong>Click to upload</strong> or drag an image here (PNG/SVG, transparent background recommended).",
    section2Appearance: "2 — Appearance",
    fieldLabelAccent: "Accent color",
    ariaAccentPresets: "Preset accent colors",
    ariaAccentCustom: "Custom accent color",
    labelCustomColor: "Custom",
    section3Blocks: "3 — Framework blocks",
    hintBlocksConfig:
      "Enable, disable or reorder the blocks according to your field of expertise. You can also add more later.",
    btnAddCustomBlock: "Add a custom block",
    hintImportConfig: "You can import an existing save file using the “Import” button above.",
    btnStartInterview: "Start the interview →",

    // Screen 2 — Interview
    interviewTitle: "The workshop",
    interviewLead:
      "Fill in one block at a time, at your own pace. On the right, watch your Conceptual Framework build live.",
    ariaInterviewProgress: "Interview progress",
    hintLabel: "Reflection prompt",
    btnPrev: "Previous",
    btnNext: "Next",
    btnSeeOverview: "See overview",
    btnToggleHintShow: "Show prompt",
    btnToggleHintHide: "Hide prompt",
    previewLabel: "Your Conceptual Framework — live",
    progressLabel: "Block {current} of {total} — {title}",

    // Screen 3 — Overview
    overviewTitle: "Overview of your framework",
    overviewLead:
      "Click a block to edit it. Add or remove blocks as needed, then generate your final Conceptual Framework.",
    btnBackToInterview: "Resume the interview",
    btnAddBlock: "Add a block",
    btnGenerateFinal: "Generate my Conceptual Framework →",
    emptyStateOverview: "No active blocks. Add a block or go back to configuration.",

    // Screen 4 — Final
    finalTitle: "Your Conceptual Framework",
    finalLead:
      "Download your Conceptual Framework as a PDF, save your working file to resume later, or go back to editing.",
    btnExportPdf: "Download as PDF",
    btnExportJson: "Download the save file (.json)",
    btnBackToOverview: "Back to editing",
    finalEyebrow: "Conceptual Framework",

    // Edit block modal
    modalEditTitleDefault: "Edit a block",
    modalClose: "Close",
    modalCancel: "Cancel",
    modalSave: "Save",

    // Add custom block modal
    modalAddTitle: "Add a custom block",
    labelNewBlockTitle: "Block title",
    placeholderNewBlockTitle: "E.g. Accessibility",
    labelNewBlockSubtitle: "Subtitle",
    placeholderNewBlockSubtitle: "E.g. A reflection specific to my field",
    labelNewBlockQuestion: "Interview question",
    placeholderNewBlockQuestion: "E.g. What accessibility considerations are priorities in your field?",
    labelNewBlockHint: "Reflection prompt (optional)",
    placeholderNewBlockHint: "A suggestion or example to spark reflection.",
    labelNewBlockSize: "Block size",
    sizeSmall: "Small (1/3 width)",
    sizeMedium: "Medium (1/2 width)",
    sizeLarge: "Large (2/3 width)",
    sizeFull: "Full width",
    labelNewBlockTheme: "Style",
    themeLight: "Light",
    themeDark: "Dark",
    themeGray: "Gray",
    themeAccent: "Accent",
    btnAddBlockSave: "Add the block",

    // Footer
    footerText:
      "Tool based on the “The Graphic Designer in the Loop” framework — Antonio Hilario, La Cité. Designed to be adapted to any program of study. No data is sent to a server without your consent: save your files regularly.",

    // app.js — dynamic strings
    toastNoActiveBlock: "Enable at least one block before starting the interview.",
    toastNoActiveBlockContinue: "Enable at least one block before continuing.",
    ariaColorPreset: "Color {name}",
    ariaMoveBlockUp: "Move block {title} up",
    ariaMoveBlockDown: "Move block {title} down",
    ariaEnableBlock: "Enable block {title}",
    contrastWarning: "This color may be hard to read as text. It remains usable as a block background.",
    contrastOk: "Good contrast: this color is readable as text on light or dark backgrounds.",
    confirmRemoveBlock:
      "Remove the block “{title}” from the framework?\n\nYour answers for this block stay saved: you can re-enable it from the configuration without losing your work.",
    toastBlockRemoved: "Block “{title}” removed. You can re-enable it from the configuration.",
    toastCustomBlockMissing: "Give this block a title and a question.",
    toastCustomBlockAdded: "Block “{title}” added.",
    toastJsonDownloaded: "Save file downloaded.",
    toastImportSuccess: "Save file imported successfully.",
    toastImportError: "This file doesn't seem to be a valid save file.",
    toastPdfGenerating: "Generating PDF…",
    toastPdfSuccess: "PDF generated!",
    toastPdfError: "Error generating the PDF.{detail}",
    confirmRestart: "Restarting will erase your current work (save it first if needed). Continue?",
    toastNewFramework: "New conceptual framework.",
    localeDateCode: "en-CA",

    // blocks.js — dynamic strings
    ariaEditBlock: "Edit block {title}",
    titleRemoveBlock: "Remove this block",
    ariaRemoveBlock: "Remove block {title}",
    noAnswerYet: "No answer yet.",
    noTaglineYet: "No key phrase yet.",
    noItems: "No items.",
    noIssuesListed: "No issues listed.",
    toComplete: "To be completed.",
    noToolsListed: "No tools listed.",
    labelBlockBadge: "Block label (optional)",
    hintBlockBadge: "E.g. an acronym or marker specific to your program — leave empty to display nothing.",
    ariaBlockBadge: "Block label",
    placeholderBlockBadge: "E.g. Y.O.U.R.S. (or leave empty)",
    placeholderAnswer: "Write your answer here...",
    suggestDraft: "Suggest a draft",
    suggestGenerating: "Generating…",
    confirmReplaceText: "Replace the current text with an AI suggestion?",
    confirmReplaceContent: "Replace the current content with an AI suggestion?",
    suggestError: "Suggestion unavailable right now. You can try again later.",
    ariaItem: "Item {n}",
    ariaRemoveItem: "Remove this item",
    btnAdd: "Add",
    ariaStepName: "Step name",
    placeholderToolName: "Tool name (e.g. Claude)",
    placeholderToolUsage: "Usage (e.g. Research)",
    ariaToolName: "Tool name {n}",
    ariaToolUsage: "Tool usage {n}",
    ariaRemoveTool: "Remove this tool",
    btnAddTool: "Add a tool",
    placeholderOneItemPerLine: "One item per line...",
    placeholderOneIdeaPerLine: "One idea per line...",
    ariaPercent: "Percentage {title}",
  },
};

// Traduction des noms de couleurs d'accent (data.js ACCENT_PRESETS)
const ACCENT_NAMES_EN = {
  Turquoise: "Turquoise",
  Corail: "Coral",
  Indigo: "Indigo",
  Moutarde: "Mustard",
  Magenta: "Magenta",
  "Vert sapin": "Pine Green",
};

/**
 * Traduction anglaise du contenu de BLOCK_LIBRARY (data.js).
 * Seuls les champs textuels à traduire sont fournis ; la fusion conserve
 * tous les champs structurels (id, size, theme, type, icon, acronym, etc.).
 */
const BLOCK_LIBRARY_EN = {
  ethique: {
    title: "Ethics",
    subtitle: "The moral brief",
    tag: "BEFORE acting",
    description: "The questions to ask yourself before even opening a generative AI tool.",
    questions: [
      {
        id: "ethique-1",
        label:
          "What question should your students ask themselves BEFORE using a generative AI tool for a given task?",
        hint:
          "Tip: draw on the S.I.F.T. framework (Specify • Identify • Focus • Trust) — specify the task, identify what is sensitive or needs protecting, target the appropriate use, and ask yourself whether you can trust the result.",
      },
    ],
  },
  intention: {
    title: "Intention",
    subtitle: "Directed co-ideation",
    tag: "WHILE you use AI",
    acronymDescription: "Action • Context • Tone • Identity • Format",
    description: "How to phrase a request to AI so it remains a tool serving your intention.",
    questions: [
      {
        id: "intention-1",
        label:
          "What question should your students ask themselves WHILE using an AI tool, to properly steer the co-ideation?",
        hint:
          "Tip: draw on the A.C.T.I.F. framework (Action • Context • Tone • Identity • Format) to structure a clear prompt and keep control over the result.",
      },
    ],
  },
  conception: {
    title: "Practice",
    subtitle: "How to act",
    tag: "HOW you design",
    badge: "I.D.E.E. — Ideate • Develop • Evaluate • Execute",
    description: "Where AI fits into each step of your creative or problem-solving process.",
    questions: [
      {
        id: "conception-1",
        label:
          "What question should your students ask themselves to integrate an AI tool professionally into their creative process?",
        hint:
          "Tip: draw on the I.D.E.E. framework (Ideate • Develop • Evaluate • Execute) above — you can also edit this label to reflect the major steps specific to your field.",
      },
    ],
  },
  "boite-outils": {
    title: "The evolving toolbox",
    subtitle: "Adopting a stance of continuous adaptation to fast-changing tools",
    tag: "The context changes, the stance stays",
    description:
      "Place the tools of your field along their evolution, from sketchbook to generative tools.",
    columns: [
      {
        id: "traditionnel",
        title: "Traditional",
        hint: "Basic analog or manual tools of your field (e.g. notebook, pencil, sketches, instruments).",
      },
      {
        id: "numerique",
        title: "Digital",
        hint: "Standard software or digital tools (e.g. professional suites, specialized software).",
      },
      {
        id: "collaboratif",
        title: "Collaborative",
        hint: "Team and sharing tools (e.g. cloud platforms, collaborative boards).",
      },
      {
        id: "generatif",
        title: "Generative",
        hint: "Generative AI tools relevant to your field (text, image, code, audio, etc.).",
      },
    ],
  },
  "partage-taches": {
    title: "Sharing the work",
    subtitle: "What AI can speed up vs. what stays human",
    description:
      "Determine, as a percentage, the share of tasks AI can support and the share that must remain entirely human.",
    left: {
      title: "Exploration",
      label: "AI can speed up",
      hint:
        "Tip: repetitive, exploratory or technical tasks (research, drafts, variations, formatting, data summaries).",
    },
    right: {
      title: "Human intentions",
      label: "ONLY YOU can bring",
      hint:
        "Tip: critical judgment, vision, human connection, coherence, personal signature, ethical sense and storytelling.",
    },
    questions: [
      {
        id: "partage-1",
        label: "What concrete tasks in your field can AI speed up?",
        hint: "List them one per line: e.g. research, first drafts, translations, layout.",
      },
      {
        id: "partage-2",
        label: "What tasks must absolutely remain a human responsibility?",
        hint:
          "List them one per line: e.g. final evaluation, pedagogical relationship, ethical decisions, quality validation.",
      },
    ],
  },
  "qui-fait-quoi": {
    title: "Who does what?",
    subtitle: "Division of roles between the person and AI",
    description:
      "For each step of your process, specify what belongs to the person and what AI can support.",
    rowHint: "You can rename these steps to match your process (Practice section above).",
    rows: [
      { id: "concevoir", label: "Design" },
      { id: "developper", label: "Develop" },
      { id: "evaluer", label: "Evaluate" },
      { id: "executer", label: "Execute" },
    ],
    columns: [
      {
        id: "humain",
        title: "The person",
        hint: "What the person directs, chooses, or judges at this step.",
      },
      {
        id: "ia",
        title: "With AI",
        hint: "What AI can speed up or fuel at this step (or “—” if it shouldn't be involved).",
      },
    ],
  },
  "ia-excelle": {
    title: "AI excels",
    subtitle: "In combination, not decision-making",
    description: "Name the action verbs that best describe what AI does well in your field.",
    placeholderItems: ["Assemble", "Mix", "Generate", "Combine"],
    questions: [
      {
        id: "ia-excelle-1",
        label: "What verbs best describe what AI excels at in your field?",
        hint: "Tip: think of short, strong action verbs (3 to 5), like “Assemble • Mix • Generate”.",
      },
    ],
  },
  "signature-transformation": {
    title: "[Practitioner] — transformation",
    subtitle: "What your role becomes",
    description: "How your professional role transforms in the face of AI — beyond technical execution.",
    placeholderItems: ["Create meaning", "Carry a vision", "Connect with people"],
    questions: [
      {
        id: "transfo-1",
        label: "Beyond technique, what added value defines your professional role today?",
        hint:
          "Tip: 2 to 4 short statements, e.g. “Create meaning”, “Carry a vision”, “Support a person”.",
      },
    ],
  },
  signature: {
    title: "Your signature",
    subtitle: "What AI cannot generate",
    description: "The human qualities, unique to the person, that no AI can replicate.",
    placeholderItems: ["Your eye", "Your judgment", "Your ethics", "Your experience", "Your sensitivity"],
    questions: [
      {
        id: "signature-1",
        label:
          "What personal qualities (eye, judgment, ethics, experience, sensitivity...) remain the irreplaceable “signature” of a person in your field?",
        hint: "Tip: list 4 to 6 words or short phrases, in the second person (“Your...”).",
      },
    ],
  },
  tagline: {
    title: "Key phrase",
    subtitle: "The message people remember",
    description: "A short, striking sentence that sums up your stance on AI in your field.",
    placeholder: "The tool doesn't make the artisan",
    questions: [
      {
        id: "tagline-1",
        label: "If you had to sum up your stance in one short, striking sentence, which would you choose?",
        hint: "Tip: a sentence that could stand alone on a slide — punchy, memorable, in your own words.",
      },
    ],
  },
  "outils-ia": {
    title: "AI tools",
    subtitle: "The tools relevant to your field, and their role",
    description:
      "Name the generative AI tools used or relevant in your field and specify their main role. The tool's icon will be added automatically if recognized.",
    placeholderItems: [
      { name: "ChatGPT", usage: "Co-management" },
      { name: "Claude", usage: "Code" },
      { name: "Google Gemini", usage: "Co-intelligence" },
      { name: "Perplexity", usage: "Research" },
      { name: "Adobe Firefly", usage: "Productivity" },
      { name: "Figma AI", usage: "Prototyping" },
    ],
    questions: [
      {
        id: "outils-1",
        label:
          "Which generative AI tools are (or will be) relevant to your field, and what are they mainly used for?",
        hint:
          "Tip: for each tool, give its name and a usage keyword (e.g. research, code, image, audio, presentation).",
      },
    ],
  },
  "enjeux-ethiques": {
    title: "Ethical issues",
    subtitle: "The questions to keep alive in the discussion",
    description: "The major ethical issues specific to using generative AI in your field.",
    placeholderItems: [
      "Moral rights",
      "Client risk",
      "Copyright",
      "Transparency",
      "Consent",
      "Devaluation",
      "Honesty",
      "Bias",
      "Generate ≠ create",
      "Environmental impact",
    ],
    questions: [
      {
        id: "enjeux-1",
        label:
          "What ethical issues (one word or short phrase each) do you want to keep in mind regarding AI in your field?",
        hint: "Tip: aim for 6 to 10 short keywords — they'll display as tags in your Conceptual Framework.",
      },
    ],
  },
};

/**
 * Fusionne un tableau de base avec un tableau de traduction.
 *  - tableau de chaînes -> remplacé entièrement par la traduction
 *  - tableau d'objets avec `id` -> fusion par id
 *  - tableau d'objets sans `id` -> fusion par index
 */
function mergeArray(base, val) {
  if (!Array.isArray(val)) return val;
  if (!base || !base.length) return val;
  if (typeof base[0] === "string") return val;
  if (base[0] && base[0].id) {
    return base.map((item) => {
      const tr = val.find((v) => v.id === item.id);
      return tr ? { ...item, ...tr } : item;
    });
  }
  return base.map((item, i) => (val[i] ? { ...item, ...val[i] } : item));
}

/**
 * Fusionne un bloc de BLOCK_LIBRARY avec sa traduction.
 */
function mergeTranslation(base, trans) {
  if (!trans) return base;
  const merged = { ...base };
  Object.keys(trans).forEach((key) => {
    const val = trans[key];
    if (Array.isArray(val)) {
      merged[key] = mergeArray(base[key] || [], val);
    } else if (val !== null && typeof val === "object" && typeof base[key] === "object" && base[key] !== null) {
      merged[key] = { ...base[key], ...val };
    } else {
      merged[key] = val;
    }
  });
  return merged;
}

/**
 * Retourne BLOCK_LIBRARY (fr) ou une version fusionnée avec les traductions
 * anglaises (en) — les champs structurels (id, size, theme, type, icon...)
 * restent inchangés.
 */
function getBlockLibrary(lang) {
  const BLOCK_LIBRARY = (window.CADRE_DATA && window.CADRE_DATA.BLOCK_LIBRARY) || [];
  if (lang !== "en") return BLOCK_LIBRARY;
  return BLOCK_LIBRARY.map((b) => mergeTranslation(b, BLOCK_LIBRARY_EN[b.id]));
}

/**
 * Retourne une chaîne traduite, avec substitution de {variables}.
 *  t("fr", "ariaColorPreset", { name: "Turquoise" }) -> "Couleur Turquoise"
 */
function t(lang, key, vars) {
  const dict = UI_STRINGS[lang === "en" ? "en" : "fr"];
  let str = dict[key] != null ? dict[key] : UI_STRINGS.fr[key] != null ? UI_STRINGS.fr[key] : key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      str = str.split(`{${k}}`).join(vars[k]);
    });
  }
  return str;
}

/**
 * Valeurs par défaut de DEFAULT_META (data.js) dans chaque langue. Servent à
 * « retraduire » les champs de meta encore inchangés (titre, accroche,
 * citation, programme, établissement, rôle) quand la personne bascule la
 * langue de l'interface — sans toucher aux valeurs qu'elle a personnalisées.
 */
const DEFAULT_META_I18N = {
  fr: {
    title: "Le [praticien] dans la boucle",
    tagline: "PENSE • CONÇOIT • JUGE • CRÉE",
    quote: "« La créativité ne se délègue pas. Elle se nourrit. »",
    programName: "Mon programme d'études",
    institutionName: "Mon établissement",
    role: "Praticien·ne",
  },
  en: {
    title: "The [practitioner] in the loop",
    tagline: "THINK • DESIGN • JUDGE • CREATE",
    quote: "“Creativity can't be delegated. It must be nurtured.”",
    programName: "My program",
    institutionName: "My institution",
    role: "Practitioner",
  },
};

/**
 * Si une valeur de `meta` correspond encore au texte par défaut de l'ancienne
 * langue (c.-à-d. que la personne ne l'a pas personnalisée), la remplace par
 * l'équivalent dans la nouvelle langue. Les valeurs personnalisées restent
 * intactes.
 */
function translateDefaultMeta(meta, fromLang, toLang) {
  const from = DEFAULT_META_I18N[fromLang === "en" ? "en" : "fr"];
  const to = DEFAULT_META_I18N[toLang === "en" ? "en" : "fr"];
  Object.keys(from).forEach((key) => {
    if (meta[key] === from[key]) {
      meta[key] = to[key];
    }
  });
}

window.CADRE_I18N = {
  UI_STRINGS,
  BLOCK_LIBRARY_EN,
  ACCENT_NAMES_EN,
  DEFAULT_META_I18N,
  translateDefaultMeta,
  getBlockLibrary,
  t,
};
