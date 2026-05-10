# ZUI Vanilla - Library Components

Bibliothèque de composants UI framework-agnostic utilisant du HTML, CSS et JavaScript pur.

## 🚀 Installation

Pour utiliser ZUI dans votre projet, consultez la [documentation d'installation](./docs/installation.md).

## 📦 Importation des composants

ZUI propose un outil CLI pour copier les sources JS et CSS des composants directement dans votre projet. Cela vous permet d'avoir un contrôle total sur le code, d'éviter les dépendances lourdes et de faciliter la personnalisation. Pour plus d'informations, voir la [doc détaillée du CLI](./docs/cli.md).

### Utiliser l'outil d'installation

Lancez la commande suivante à la racine de votre projet :

```bash
npx zuii-install
```

Cette commande va :
1. Créer un dossier `components/zuii/` à la racine de votre projet.
2. Copier les fichiers `.js` et `.css` de tous les composants disponibles (sans écraser vos modifications locales par défaut).
3. Préserver la structure modulaire (un dossier par composant).

### Mise à jour des composants

Si vous souhaitez mettre à jour vos fichiers locaux avec la dernière version de la bibliothèque (et écraser vos modifications éventuelles) :

```bash
npx zuii-install --force
```

```text
votre-projet/
├── components/
│   └── zuii/
│       ├── button/
│       │   ├── button.css
│       │   └── index.js
│       ├── avatar/
│       │   └── avatar.css
│       └── ...
└── ...
```

## 🛠️ Utilisation dans votre code

Une fois les composants installés localement, vous pouvez les importer dans vos fichiers :

```javascript
// Import du style d'un composant
import './components/zuii/button/button.css';

// Import de la logique JS (si le composant en possède une)
import './components/zuii/button/index.js';
```

---

## 🏗️ Développement Local (Contributeurs)

Si vous développez la bibliothèque et souhaitez tester vos modifications en local dans un autre projet :

1. **Dans le dossier `zuii-vanilla`** :
   ```bash
   npm link
   ```

2. **Dans votre projet de test** :
   ```bash
   npm link zuii
   npx zuii-install
   ```

3. **Mise à jour** : Relancez `npx zuii-install` chaque fois que vous modifiez les sources de la bibliothèque pour synchroniser les fichiers dans votre projet de test.
