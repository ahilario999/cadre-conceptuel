# Logos des plateformes IA

Ce dossier accueille les **vrais logos** des plateformes affichées dans le bloc
« Outils IA » (`tools`). Les outils les plus courants (ChatGPT, Claude, Google
Gemini, Adobe Firefly, Midjourney, Copilot, Canva) ont déjà un logo SVG inclus.
Pour les autres plateformes, tant qu'un fichier n'est pas présent, l'icône
générique (style géométrique, recolorable) continue de s'afficher
automatiquement — aucun lien n'est cassé.

## Comment ça marche

Quand tu tapes le nom d'un outil dans le champ « Nom de l'outil », le code
(`js/icons.js`, fonction `getToolIcon`) reconnaît le mot-clé et essaie de
charger le fichier correspondant ci-dessous. S'il existe, le vrai logo
s'affiche dans un carré 34×34 (ou 36×36 dans l'éditeur). S'il est absent ou ne
se charge pas, l'icône de repli apparaît à la place — sans erreur visible.

## Fichiers attendus

Dépose des images carrées (PNG ou SVG avec fond transparent de préférence,
~256×256 px) sous ces noms exacts :

| Plateforme       | Nom de fichier            | Mots-clés reconnus                  |
|-------------------|---------------------------|--------------------------------------|
| ChatGPT           | `chatgpt.svg` ✅           | chatgpt, gpt, openai                  |
| Claude            | `claude.svg` ✅            | claude, anthropic                     |
| Google Gemini     | `gemini.svg` ✅            | gemini, google ai, bard               |
| Adobe Firefly     | `adobe-firefly.svg` ✅     | firefly                               |
| Midjourney        | `midjourney.svg` ✅        | midjourney                            |
| Copilot           | `copilot.svg` ✅           | copilot, github                       |
| Canva             | `canva.svg` ✅             | canva                                 |
| Runway ML         | `runway.png`               | runway                                |
| Stable Diffusion  | `stable-diffusion.png`     | stable diffusion, stability, sdxl     |
| Leonardo.ai       | `leonardo.png`             | leonardo                              |
| Recraft.ai        | `recraft.png`              | recraft                               |
| KREA AI           | `krea.png`                 | krea                                  |
| Lovable           | `lovable.png`              | lovable                               |
| Framer            | `framer.png`               | framer                                |
| Envato            | `envato.png`               | envato                                |
| Pacdora           | `pacdora.png`              | pacdora                               |

## Astuce

Tu peux glisser-déposer les fichiers directement dans
`cadre-conceptuel-builder/assets/logos/` avec ces noms exacts (respecte la
casse et les tirets). Aucune modification de code n'est nécessaire — les
icônes apparaîtront automatiquement la prochaine fois que la page sera
rechargée.

Pour ajouter une plateforme qui n'est pas dans la liste, ajoute une entrée
dans `AI_TOOL_ICONS` (`js/icons.js`) avec ses mots-clés, son nom et son champ
`logo`.
