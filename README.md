# Le praticien dans la boucle — bâtisseur de cadre conceptuel

Outil web (statique, sans serveur) qui permet à n'importe quel programme d'études de
construire son propre cadre conceptuel sur l'usage de l'IA générative, en partant de la
structure originale **« Le graphiste dans la boucle »**.

L'enseignant·e remplit un **atelier en duo** : à gauche, on répond aux questions d'un bloc
à la fois (avec une *piste de réflexion* facultative et repliable pour chaque question) ;
à droite, un aperçu miniature du cadre conceptuel se construit en direct — le bloc en
cours s'illumine et se remplit du texte tapé, comme un traitement de texte. On peut
ajouter ou retirer des blocs selon son domaine, puis générer une carte conceptuelle
finale exportable en PDF.

Aucune donnée n'est envoyée à un serveur : tout reste dans le navigateur (`localStorage`)
et peut être sauvegardé/repris via un fichier `.json`.

---

## 1. Structure du projet

```
cadre-conceptuel-builder/
├── index.html          ← structure des 4 écrans (config, entrevue, aperçu, carte finale)
├── vercel.json          ← config de déploiement Vercel (en-têtes de cache, URLs propres)
├── css/
│   └── styles.css       ← thème, grille bento, composants, responsive, mode sombre
└── js/
    ├── data.js           ← modèle de données : blocs, questions, pistes, couleurs par défaut
    ├── icons.js           ← icônes SVG (interface + outils IA) et détection automatique
    ├── blocks.js          ← moteur de rendu (vue lecture + éditeurs) par type de bloc
    ├── pdf-export.js      ← export de la carte finale en PDF (html2canvas + jsPDF)
    └── app.js             ← contrôleur principal : état, navigation, écrans, import/export
```

Aucune étape de compilation (« build ») n'est requise — c'est du HTML/CSS/JS pur.

> **Nettoyage avant déploiement** : ce dossier peut contenir des fichiers de test
> (`smoke-test.js`, `smoke-test-http.js`, `node_modules/`, `package.json`,
> `package-lock.json`) utilisés pendant le développement. Tu peux les supprimer sans
> problème — ils ne sont pas nécessaires au fonctionnement de l'outil et ne seront pas
> déployés s'ils sont absents.

---

## 2. Tester en local

Comme il s'agit d'un site statique, n'importe quel petit serveur HTTP fonctionne. Par
exemple, à partir du dossier `cadre-conceptuel-builder` :

```bash
npx serve .
# ou
python3 -m http.server 8080
```

Puis ouvre `http://localhost:8080` (ou le port indiqué) dans ton navigateur.

⚠️ Ouvrir `index.html` directement avec `file://` peut empêcher la sauvegarde locale
(`localStorage`) de fonctionner dans certains navigateurs — passe toujours par un petit
serveur, même en local.

---

## 3. Déployer sur Vercel

### Option A — Interface web (la plus simple)

1. Crée un nouveau dépôt Git (GitHub, GitLab ou Bitbucket) et pousse-y le contenu du
   dossier `cadre-conceptuel-builder/`.
2. Sur [vercel.com](https://vercel.com), clique **Add New → Project** et importe ce
   dépôt.
3. Comme c'est un projet statique, Vercel n'a besoin d'aucune commande de build —
   laisse les champs « Build Command » et « Output Directory » vides (ou choisis
   « Other »).
4. Clique **Deploy**. Ton outil est en ligne quelques secondes plus tard, avec une URL
   du type `ton-projet.vercel.app`.

### Option B — CLI Vercel

```bash
npm install -g vercel
cd cadre-conceptuel-builder
vercel        # premier déploiement (suit les instructions)
vercel --prod # mise en production
```

Aucune variable d'environnement, base de données ou clé API n'est nécessaire.

---

## 4. Personnaliser l'outil

### a) Couleurs d'accent prédéfinies

Dans `js/data.js`, modifie le tableau `ACCENT_PRESETS` :

```js
const ACCENT_PRESETS = [
  { name: "Turquoise", value: "#2EE6C5" },
  { name: "Corail", value: "#FF6B5B" },
  // ajoute ou remplace des couleurs ici
];
```

La couleur d'accent est aussi personnalisable directement par l'utilisateur via le
sélecteur de couleur (écran de configuration).

### b) Titre, accroche et citation par défaut

Toujours dans `js/data.js`, l'objet `DEFAULT_META` :

```js
const DEFAULT_META = {
  title: "Le [praticien] dans la boucle",
  tagline: "PENSE • CONÇOIT • JUGE • CRÉE",
  quote: "« La créativité ne se délègue pas. Elle se nourrit. »",
  programName: "Mon programme d'études",
  institutionName: "Mon établissement",
  // ...
};
```

### c) Blocs du cadre (questions et pistes de réflexion)

Chaque bloc est un objet dans `BLOCK_LIBRARY` (`js/data.js`). Structure générale :

```js
{
  id: "ethique",            // identifiant unique, ne pas changer une fois utilisé
  title: "Éthique",
  subtitle: "Le brief moral",
  tag: "AVANT d'agir",       // étiquette affichée dans le coin du bloc (optionnel)
  badge: "S.I.F.T.",          // acronyme/insigne (optionnel)
  size: "col-4",              // largeur dans la grille : col-3, col-4, col-5, col-6, col-7, col-8, col-12
  theme: "light",              // light | dark | gray | accent | accent-dark | split
  type: "qa",                  // qa | list | list-tags | list-columns | split | table | tools | tagline
  icon: "spark",                // voir js/icons.js → UI_ICONS pour la liste des icônes disponibles
  description: "…",
  questions: [
    {
      id: "ethique-1",
      label: "Question posée pendant l'entrevue",
      hint: "Piste de réflexion suggérée — l'utilisateur peut l'ignorer.",
    },
    // ...
  ],
}
```

**Pour modifier une question ou une piste existante** : édite directement le texte de
`label` / `hint`.

**Pour ajouter un bloc « en dur » au gabarit de départ** (visible par défaut pour tous) :
copie un bloc existant du même `type`, donne-lui un `id` unique, puis ajoute cet `id` à
la fin de `DEFAULT_BLOCK_ORDER` (calculé automatiquement à partir de `BLOCK_LIBRARY`, donc
il suffit de l'ajouter au tableau `BLOCK_LIBRARY`).

**Pour retirer un bloc du gabarit de départ** : retire-le de `BLOCK_LIBRARY` (ou laisse-le
et décoche-le par défaut — vois `createDefaultState()`).

> Chaque enseignant·e peut aussi ajouter ses propres blocs personnalisés directement
> dans l'outil (bouton « Ajouter un bloc »), sans toucher au code — utile pour une
> question propre à un seul programme.

### d) Icônes d'outils IA détectées automatiquement

Dans `js/icons.js`, le tableau `AI_TOOL_ICONS` associe des mots-clés à une icône :

```js
{ match: ["chatgpt", "gpt-4", "gpt4", "openai"], label: "ChatGPT", icon: "..." }
```

Pour qu'un nouvel outil affiche automatiquement son icône dans le bloc « Outils IA »,
ajoute une entrée avec les mots-clés correspondants (en minuscules). Si aucun mot-clé ne
correspond, une icône générique (« étincelle ») est utilisée.

### e) Logo, polices et couleurs de base

- **Logo** : ajouté par l'utilisateur via l'écran de configuration (glisser-déposer ou
  téléversement), stocké en `data URL` dans la sauvegarde.
- **Police** : Space Grotesk (Google Fonts), chargée dans `index.html`.
- **Couleurs de base** (noir / blanc / gris) : variables CSS `--black`, `--white`,
  `--gray-100` à `--gray-800` dans `css/styles.css`, avec une variante sombre via
  `html[data-theme="dark"]`.

---

## 5. Sauvegarde, reprise et export

- **Sauvegarde automatique** : chaque réponse est enregistrée dans le `localStorage` du
  navigateur — l'utilisateur peut fermer l'onglet et reprendre plus tard sur le même
  appareil/navigateur.
- **Fichier de sauvegarde (.json)** : bouton « Sauvegarder » (en-tête) ou « Télécharger
  le fichier de sauvegarde » (carte finale). Ce fichier contient tout l'état (réponses,
  blocs activés, couleurs, logo) et peut être réimporté via le bouton « Importer » pour
  reprendre le travail sur un autre appareil ou après une perte d'accès.
- **Export PDF** : bouton « Télécharger en PDF » sur l'écran de la carte finale — génère
  une seule page au format de la carte, via `html2canvas` + `jsPDF` (chargés depuis un
  CDN, déjà inclus dans `index.html`).

---

## 6. Accessibilité et responsive

- Navigation au clavier (lien d'évitement, focus visible, rôles ARIA sur les blocs
  cliquables et les boutons d'action).
- Respect de `prefers-reduced-motion` pour réduire les animations.
- Vérification automatique du contraste de la couleur d'accent (message d'avertissement
  si le contraste est insuffisant pour du texte).
- Mise en page bento responsive avec points de rupture à 1080px, 768px et 480px (la
  grille passe progressivement à une colonne unique sur mobile).

---

## 7. Aide à la rédaction par IA (« Suggérer un brouillon »)

Chaque question de l'atelier propose un bouton **« Suggérer un brouillon »**. Il
génère, via l'API [Groq](https://console.groq.com), un court texte de départ (3 à 5
phrases) adapté à la question et au contexte du bloc — la personne le modifie ensuite
à sa façon. Si le champ contient déjà du texte, une confirmation est demandée avant de
le remplacer.

Cette fonctionnalité repose sur une fonction serverless (`api/suggest.js`) qui agit
comme intermédiaire : la clé API Groq reste **côté serveur** et n'est jamais exposée au
navigateur.

### Configuration (une seule fois)

1. Crée un compte gratuit sur [console.groq.com](https://console.groq.com) et génère une
   clé API (section « API Keys »).
2. Dans le tableau de bord Vercel du projet → **Settings → Environment Variables**,
   ajoute une variable :
   - Nom : `GROQ_API_KEY`
   - Valeur : ta clé Groq
   - Environnements : Production (et Preview/Development si désiré)
3. Redéploie le projet (un nouveau déploiement reprend automatiquement la variable).

Sans cette variable, le bouton affiche un message indiquant que la suggestion IA n'est
pas configurée — le reste de l'outil continue de fonctionner normalement.

---

## Crédits

Outil conçu à partir du cadre conceptuel **« Le graphiste dans la boucle »**
(Antonio Hilario, La Cité), généralisé pour être adapté à n'importe quel programme
d'études.
