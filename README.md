# ZUI Vanilla - Library Components

Bibliothèque de composants UI framework-agnostic utilisant du HTML, CSS et JavaScript pur.

## 🚀 Installation

Pour utiliser ZUI dans votre projet, consultez la [documentation d'installation](./docs/installation.md).

## 📦 Importation des composants

ZUI propose un outil CLI pour copier les sources JS et CSS des composants directement dans votre projet. Pour plus d'informations, voir la [documentation du CLI](./docs/cli.md).

```bash
npx zuii-install
```

## 🛠️ Utilisation

Une fois les composants installés localement :

```javascript
import './components/zuii/button/button.css';
import './components/zuii/button/index.js';
```

---

## 🏗️ Développement Local

Si vous développez la bibliothèque :

1. **Lien local** : `npm link`
2. **Usage** : `npm link zuii` dans votre projet, puis `npx zuii-install`.
