# Installation

Il existe plusieurs façons d'intégrer ZUI Vanilla à votre projet.

## 1. Installation via NPM (Recommandé)

Le package `zuii` peut être installé via votre gestionnaire de paquets préféré :

```bash
npm install zuii
# ou
pnpm add zuii
# ou
yarn add zuii
```

## 2. Utilisation via CDN

Si vous ne souhaitez pas installer le package localement, vous pouvez utiliser un CDN comme Unpkg ou JSDelivr :

```html
<link rel="stylesheet" href="https://unpkg.com/zuii/dist/all.css">
<script src="https://unpkg.com/zuii/dist/index.js"></script>
```

## 3. Copie locale des composants (CLI)

C'est la méthode recommandée pour garder un contrôle total sur les styles et les scripts. Elle utilise notre outil CLI pour copier les sources directement dans votre dossier `components/`.

### Pré-requis
- Node.js installé
- Un projet avec un `package.json`

### Exécution
Lancez simplement la commande suivante :

```bash
npx zuii-install
```

Pour plus de détails sur le fonctionnement du CLI, consultez la page [CLI Documentation](./cli.md).
