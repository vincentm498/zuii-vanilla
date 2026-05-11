/**
 * Configuration des routes du Playground
 */
export const routes = {
  installation: {
    title: 'Installation',
    isDoc: true,
    mdPath: '../docs/installation.md'
  },
  cli: {
    title: 'CLI Guide',
    isDoc: true,
    mdPath: '../docs/cli.md'
  },
  icon: {
    title: 'Icons',
    package: '@zuii/Utils/icon',
    descriptions: {
      general: 'Zuii utilise par défaut la librairie <a href=\"https://lucide.dev/\" target=\"_blank\">Lucide Icons</a> pour ses composants. Notez que cette dépendance est optionnelle : vous pouvez utiliser n\'importe quelle bibliothèque d\'icônes ou vos propres SVG dans le projet final.',
    }
  },
  color: {
    title: 'Color',
    package: '@zuii/Utils/color',
    showCode: false
  },
  spacing: {
    title: 'Spacing',
    package: '@zuii/Utils/spacing',
    showCode: false
  },
  avatar: {
    title: 'Avatar',
    package: '@zuii/avatar'
  },
  buttons: {
    title: 'Buttons',
    package: '@zuii/button'
  },
  badges: {
    title: 'Badges',
    package: '@zuii/badge'
  },
  cards: {
    title: 'Cards',
    package: '@zuii/card'
  },
  inputs: {
    title: 'Inputs',
    package: '@zuii/input'
  },
  modals: {
    title: 'Modals',
    package: '@zuii/modal'
  },
  dropdowns: {
    title: 'Dropdowns',
    package: '@zuii/dropdown'
  },
  toasts: {
    title: 'Toasts',
    package: '@zuii/toast',
    descriptions: {
      general: 'Le composant toast est un composant UI qui permet d\'afficher des notifications temporaires à l\'utilisateur. Il est généralement utilisé pour afficher des messages d\'information, d\'avertissement ou d\'erreur.',
      html: 'Pour créer un déclencheur en HTML, utilisez l\'ID correspondant au type de notification comme <code>btnToastSuccess</code>. Ces boutons seront automatiquement liés au système de notifications après l\'appel de la fonction <code>init</code>().',
      js: 'Pour déclencher un toast, importez l\'objet toast et appelez la méthode correspondant au type de message (success, error, warning, info). L\'affichage est géré automatiquement par le moteur Bootstrap 5.',
    }
  },
  utils: {
    title: 'Utils',
    package: '@zuii/utils'
  }
};
