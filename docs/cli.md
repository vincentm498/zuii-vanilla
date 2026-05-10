# CLI Documentation (`zuii-install`)

L'outil CLI `zuii-install` est conçu pour simplifier l'adoption des composants ZUI en permettant une approche "Copy-Paste" (similaire à shadcn/ui).

## Fonctionnement

Lorsque vous lancez `npx zuii-install`, l'outil effectue les actions suivantes :

1.  **Détection du projet** : Il s'exécute à partir de la racine de votre projet (là où se trouve votre `package.json`).
2.  **Création du dossier cible** : Il crée un dossier `./components/zuii` s'il n'existe pas déjà.
3.  **Filtrage intelligent** :
    *   Il parcourt tous les composants de la bibliothèque.
    *   Il ne copie que les fichiers avec les extensions `.js` et `.css`.
    *   Il ignore les fichiers de documentation interne (`.html`, `.md`), les tests et les dossiers `node_modules`.
4.  **Organisation modulaire** : Chaque composant est placé dans son propre sous-dossier pour éviter les collisions de noms (ex: `index.js`).

## Commandes disponibles

### `npx zuii-install`
Copie tous les composants disponibles. Si un fichier existe déjà localement, il sera **ignoré** pour protéger vos modifications.

### `npx zuii-install --force` (ou `-f`)
Écrase les fichiers locaux existants par les versions de la bibliothèque. Utile pour mettre à jour vers une version plus récente.

## Avantages de cette méthode

*   **Zéro dépendance runtime** : Une fois les fichiers copiés, votre projet ne dépend plus du package `zuii` pour fonctionner.
*   **Personnalisation totale** : Vous pouvez modifier directement le CSS ou le JS copié pour l'adapter à vos besoins spécifiques.
*   **Performance** : Vous n'importez que ce dont vous avez besoin.
*   **Framework-agnostic** : Fonctionne aussi bien avec React, Vue, Svelte que du HTML pur.

## Résolution de problèmes

### La commande n'est pas trouvée
Assurez-vous que vous avez bien une connexion internet pour que `npx` puisse télécharger temporairement le package, ou installez le package globalement (non recommandé) ou localement via `npm install zuii`.

### Dossier de destination différent
Actuellement, le script cible par défaut `./components/zuii`. Si vous souhaitez un dossier différent, vous pouvez déplacer le dossier manuellement après la copie.
