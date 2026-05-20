# Ajouter un menu personnalisé avec OdraziaBundle

## Contexte

OdraziaBundle utilise un système d'événements pour gérer les menus. Pour ajouter un menu personnalisé (ex: `creermonlivre`, `blog`, `formation`), il faut créer un **EventSubscriber** dans le projet qui écoute l'événement `OdraziaMenuEvent`.

## Étapes

### 1. Créer le fichier MenuSubscriber

**Chemin :** `src/EventSubscriber/Menu/MenuSubscriber.php`

```php
<?php

namespace App\EventSubscriber\Menu;

use InnovData\OdraziaBundle\Event\Odrazia\OdraziaMenuEvent as MenuEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class MenuSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            MenuEvent::class => ['onMenuEvent', 1],
        ];
    }

    public function onMenuEvent(MenuEvent $event)
    {
        $event->addMenu('creermonlivre');
    }
}
```
{.pg-code}


### 2. Configuration services.yaml

Aucune modification nécessaire si `autoconfigure: true` est activé (par défaut dans Symfony).

Vérifier dans `config/services.yaml` :
```yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true
```
{.pg-code}

### 3. Utiliser le menu dans les templates

Le menu est mis en cache automatiquement par le bundle. Clé de cache :
```plaintext
menu_{locale}_{nom_du_menu}
```
{.pg-code}

Exemple pour `creermonlivre` en français :
```plaintext
menu_fr_creermonlivre
```
{.pg-code}

## Notes importantes

- **Ne pas modifier le bundle** : Le subscriber doit être dans le projet, pas dans `odrazia-bundle`
- **Pas de `$container`** : Ne pas ajouter de constructeur avec `$container` si non utilisé (erreur d'autowiring)
- **Priorité 1** : La priorité `1` dans `getSubscribedEvents` assure l'exécution après le subscriber par défaut du bundle
- **Cache** : Penser à vider le cache après ajout d'un nouveau menu : `php bin/console cache:clear`

## Structure des fichiers du projet

```
projet/
├── src/
│   └── EventSubscriber/
│       └── Menu/
│           └── MenuSubscriber.php    ← Fichier à créer
└── config/
    └── services.yaml                 ← Vérifier autoconfigure: true
```
{.pg-code}
