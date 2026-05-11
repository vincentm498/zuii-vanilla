# Color

Le système de couleurs de **zuii** est basé sur des design tokens générés dynamiquement. Il fournit des classes utilitaires pour appliquer des couleurs de fond et de texte de manière cohérente.

## Usage

### Couleurs de fond (Backgrounds)

Utilisez les classes `.bg-[couleur]` pour appliquer une couleur de fond. Le texte s'adapte automatiquement pour garantir la lisibilité.

```html
<!-- Couleur standard (500) -->
<div class="bg-primary">Primary</div>

<!-- Variantes -->
<div class="bg-primary-light">Primary Light (100)</div>
<div class="bg-primary-dark">Primary Dark (900)</div>
```

### Couleurs de texte (Typography)

Utilisez les classes `.text-[couleur]` pour appliquer une couleur au texte.

```html
<p class="text-primary">Ce texte est indigo.</p>
<p class="text-success">Ce texte est vert.</p>
<p class="text-danger-dark">Ce texte est rouge foncé.</p>
```

## Palettes disponibles

Les teintes suivantes sont disponibles dans le système

| Teinte | Usage |
| :--- | :--- |
| `primary` | Couleur principale de la marque |
| `secondary` | Couleur secondaire |
| `accent` | Touches d'accentuation |
| `success` | États positifs et confirmations |
| `warning` | Alertes et avertissements |
| `danger` / `error` | Erreurs et actions critiques |
| `neutral` | Gris neutres (Slate) |
| `grey` | Gris froids (Blue Gray) |

{.table .table-sm .table-bordered}

## Personnalisation

Les couleurs sont définies dans le fichier `tokens/colors.json`. Pour modifier une couleur :

1. Modifiez la valeur Hexa dans `tokens/colors.json`.
2. Lancez la génération : `npm run tokens`.
3. Les styles seront mis à jour partout dans le projet.
