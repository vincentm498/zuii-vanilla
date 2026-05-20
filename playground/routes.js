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
  'menu-personnalise': {
    title: 'Menu Personnalisé',
    isDoc: true,
    mdPath: '../docs/menu-personnalise.md'
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
  group: {
    title: 'Group',
    package: '@zuii/Utils/group'
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
  breadcrumbs: {
    title: 'Breadcrumbs',
    package: '@zuii/breadcrumbs',

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
  },
  'checkout': {
    title: 'Checkout',
    package: '@zuii/odrazia/checkout',
    page: '../packages/odrazia/checkout/checkout.html',
    descriptions: {
      general: 'Composant de checkout complet en 3 étapes : adresse, livraison, paiement. Avec récapitulatif de commande et validation.',
      html: 'Utilisez la structure <code>.checkout</code>. Les étapes sont identifiées par <code>data-js-checkout-panel</code> et la progression par <code>data-js-step-link</code>.',
      js: 'L\'initialisation est automatique via <code>Checkout.init()</code>. Les transitions entre étapes sont gérées par l\'orchestrateur.'
    }
  },
  sidebar: {
    title: 'Sidebar',
    package: '@zuii/sidebar',
    page: '../packages/sidebar/sidebar.html',
    descriptions: {
      general: 'Navigation latérale responsive avec support de collapse, sous-menus et intégration Lucide Icons.',
      html: 'Utilisez la structure <code>.sidebar</code> avec <code>.sidebar__nav</code> pour la navigation. Les éléments utilisent <code>data-section</code> pour l\'identification.',
      js: 'L\'initialisation est automatique via <code>Sidebar.init()</code>. Le toggle de collapse utilise <code>sidebarToggle</code> comme ID.'
    }
  },
  'coming-soon': {
    title: 'Coming Soon',
    package: '@zuii/odrazia/coming-soon',
    page: '../packages/odrazia/coming-soon/coming-soon.html',
    descriptions: {
      general: 'Page d\'attente avec formulaire d\'inscription email et countdown timer.',
      html: 'Utilisez la structure <code>.coming-soon</code> avec <code>data-js-coming-soon</code> comme conteneur racine.',
      js: 'L\'initialisation via <code>init(container, config)</code>. Config optionnelle: <code>targetDate</code> et <code>onSubscribe</code>.'
    }
  },
  'error-404': {
    title: 'Error 404',
    package: '@zuii/odrazia/errors',
    page: '../packages/odrazia/errors/error-404.html',
    descriptions: {
      general: 'Page d\'erreur 404 pour les pages non trouvées.',
      html: 'Utilisez la structure <code>.error-page</code> avec <code>data-js-error-page</code>.'
    }
  },
  'error-403': {
    title: 'Error 403',
    package: '@zuii/odrazia/errors',
    page: '../packages/odrazia/errors/error-403.html',
    descriptions: {
      general: 'Page d\'erreur 403 pour les accès refusés.',
      html: 'Utilisez la structure <code>.error-page</code>.'
    }
  },
  'error-500': {
    title: 'Error 500',
    package: '@zuii/odrazia/errors',
    page: '../packages/odrazia/errors/error-500.html',
    descriptions: {
      general: 'Page d\'erreur 500 pour les erreurs serveur.',
      html: 'Utilisez la structure <code>.error-page</code>.'
    }
  },
  maintenance: {
    title: 'Maintenance',
    package: '@zuii/odrazia/errors',
    page: '../packages/odrazia/errors/maintenance.html',
    descriptions: {
      general: 'Page de maintenance avec countdown timer pour indiquer le retour du site.',
      html: 'Utilisez <code>.error-page--maintenance</code> comme modificateur. Le timer utilise <code>data-js-maintenance-countdown</code>.',
      js: 'L\'initialisation via <code>init(container, config)</code> avec <code>targetDate</code> optionnel.'
    }
  },
  'products-list': {
    title: 'Products List',
    package: '@zuii/odrazia/products',
    page: '../packages/odrazia/products/products-list.html',
    descriptions: {
      general: 'Liste de produits avec filtres et pagination. Design base sur les templates products du bundle Symfony.',
      html: 'Utilisez <code>.products-list</code> avec <code>data-js-products-list</code>. Les filtres utilisent <code>data-js-filter-form</code>.',
      js: 'L\'initialisation via <code>init(container)</code>. Les produits sont rendus via le template <code>data-js-template-product</code>.'
    }
  }
};
