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
  },
  'shopping-cart': {
    title: 'Shopping Cart',
    package: '@zuii/odrazia/shopping-cart',
    descriptions: {
      general: 'Le composant shopping cart standard avec une structure tabulaire classique. Idéal pour les intégrations simples.',
      html: 'Utilisez la classe de base <code>.cart</code>. Les éléments interactifs sont identifiés par les attributs <code>data-js-item-delete</code> et <code>data-js-promo-form</code>.',
      js: 'L\'initialisation est automatique via <code>ShoppingCart.init()</code>. Le système gère seul les calculs de totaux et les interactions de suppression.'
    }
  },
  'shopping-cart-empty': {
    title: 'Shopping Cart Empty',
    package: '@zuii/odrazia/shopping-cart',
    page: '../packages/odrazia/shopping-cart/shopping-cart-empty.html',
    descriptions: {
      general: 'Variante montrant l\'état vide du panier d\'achat avec un message d\'incitation à l\'action.',
      html: 'La structure utilise <code>.cart__empty</code> avec des éléments de titre et d\'image pour un rendu épuré.'
    }
  },
  'shopping-cart-v2': {
    title: 'Shopping Cart Premium V2',
    package: '@zuii/odrazia/shopping-cart',
    page: '../packages/odrazia/shopping-cart/shopping-cart-v2.html',
    descriptions: {
      general: 'Design "Split Layout" moderne avec barre latérale sticky pour le résumé de commande. Optimisé pour la conversion.',
      html: 'Utilisez le modificateur <code>.cart--v2</code> sur le conteneur principal. La structure se divise en <code>.cart__main</code> pour les articles et <code>.cart__sidebar</code> pour le résumé.',
      js: 'Même logique d\'initialisation que la V1. Le composant détecte la structure V2 et adapte le comportement de la sidebar collante.'
    }
  },
  'auth-login': {
    title: 'Auth - Login',
    package: '@zuii/odrazia/auth',
    page: '../packages/odrazia/auth/auth-login.html',
    descriptions: {
      general: 'Composant de connexion standard avec gestion des erreurs et lien de récupération.',
      html: 'Utilisez la structure <code>.auth</code> avec un conteneur <code>.auth__container</code>. Le formulaire doit porter l\'attribut <code>data-js-auth-form="login"</code>.'
    }
  },
  'auth-register': {
    title: 'Auth - Register',
    package: '@zuii/odrazia/auth',
    page: '../packages/odrazia/auth/auth-register.html',
    descriptions: {
      general: 'Formulaire d\'inscription complet incluant la confirmation de mot de passe et l\'acceptation des CGU.',
      html: 'Le formulaire utilise l\'attribut <code>data-js-auth-form="register"</code>.'
    }
  },
  'auth-forgot': {
    title: 'Auth - Forgot Password',
    package: '@zuii/odrazia/auth',
    page: '../packages/odrazia/auth/auth-forgot.html',
    descriptions: {
      general: 'Interface simple pour la demande de réinitialisation de mot de passe par email.',
      html: 'Le formulaire utilise l\'attribut <code>data-js-auth-form="forgot"</code>.'
    }
  },
  'account': {
    title: 'Account',
    package: '@zuii/odrazia/account',
    page: '../packages/odrazia/account/account.html',
    descriptions: {
      general: 'Composant complet de gestion du compte client : informations personnelles, adresses, commandes, favoris, cartes cadeaux et fidélité. Toutes les sections sont intégrées dans un seul fichier HTML avec navigation latérale.',
      html: 'Utilisez la structure <code>.account</code> avec la navigation latérale <code>.account__nav</code>. Les sections sont identifiées par l\'attribut <code>data-js-account-section</code> et la navigation par <code>data-js-nav-link</code>.',
      js: 'L\'initialisation est automatique via <code>Account.init()</code>. Passez les données client en configuration pour le pré-remplissage.'
    }
  }
};
