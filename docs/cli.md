# CLI Documentation (`zuii-install`)

L'outil CLI `zuii-install` est conçu pour simplifier l'adoption des composants ZUI en permettant une approche "Copy-Paste".

## Commandes disponibles

### `npx zuii-install`
Copie tous les composants disponibles. Si un fichier existe déjà localement, il sera **ignoré** pour protéger vos modifications.

### `npx zuii-install --out <dossier>` (ou `-o`)
Permet de spécifier un dossier de destination personnalisé au lieu du dossier `./components/zuii` par défaut.

### `npx zuii-install --force` (ou `-f`)
Écrase les fichiers locaux existants par les versions de la bibliothèque. Utile pour mettre à jour vers une version plus récente.

## Fonctionnement technique

Lorsque vous lancez `npx zuii-install`, l'outil effectue les actions suivantes :

1.  **Détection du projet** : Il s'exécute à partir de la racine de votre projet.
2.  **Filtrage intelligent** : Il ne copie que les fichiers avec les extensions `.js` et `.css`.
3.  **Organisation modulaire** : Chaque composant est placé dans son propre sous-dossier.

## Avantages

*   **Zéro dépendance runtime**.
*   **Personnalisation totale**.
*   **Performance optimale**.
