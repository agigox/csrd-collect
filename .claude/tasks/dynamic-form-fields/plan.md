# Implementation Plan: Dynamic Form Fields

## Overview

Créer un système de champs de formulaire dynamiques avec une architecture "plug-and-play". Les champs seront stockés dans un dossier dédié `src/lib/form-fields/` séparé des composants UI classiques (`src/lib/components/ui/`). Chaque sous-dossier représente un type de champ qui devient automatiquement disponible pour le form builder.

### Architecture proposée

```
src/lib/
├── components/
│   └── ui/                    # Composants Shadcn existants (Button, Card...)
├── form-fields/               # NOUVEAU: Champs dynamiques
│   ├── registry.ts            # Auto-découverte des champs
│   ├── types.ts               # Types communs pour tous les champs
│   ├── text/                  # Champ texte
│   │   └── index.tsx
│   ├── number/                # Champ numérique
│   │   └── index.tsx
│   └── select/                # Champ sélection
│       └── index.tsx
└── utils.ts                   # Utilitaires existants
```

### Principe de fonctionnement

1. Chaque dossier dans `form-fields/` = un type de champ
2. Chaque champ exporte un composant + sa configuration (label, validation, etc.)
3. Le `registry.ts` centralise l'enregistrement des champs
4. Un composant `DynamicField` rend le bon champ selon le type
5. Le formulaire est configuré via JSON

## Dependencies

Ordre d'implémentation requis:
1. Types communs (`types.ts`)
2. Composants de base shadcn (Input, Label, Select)
3. Champs dynamiques individuels
4. Registry
5. DynamicField renderer
6. DynamicForm builder

## File Changes

### 1. `src/lib/components/ui/input.tsx` (CRÉER)

- Installer le composant Input de shadcn
- Pattern: Similaire à Button existant
- Props: value, onChange, placeholder, disabled, className
- Utiliser Radix primitives si disponible ou HTML input natif

### 2. `src/lib/components/ui/label.tsx` (CRÉER)

- Installer le composant Label de shadcn
- Pattern: Label accessible avec htmlFor
- Utiliser @radix-ui/react-label

### 3. `src/lib/components/ui/select.tsx` (CRÉER)

- Installer le composant Select de shadcn
- Pattern: Select composé (Select, SelectTrigger, SelectValue, SelectContent, SelectItem)
- Utiliser @radix-ui/react-select

### 4. `src/lib/form-fields/types.ts` (CRÉER)

- Définir `FieldType` enum: 'text' | 'number' | 'select'
- Définir `BaseFieldConfig` interface:
  - `name`: string (identifiant unique)
  - `type`: FieldType
  - `label`: string
  - `placeholder?`: string
  - `required?`: boolean
  - `defaultValue?`: unknown
  - `validation?`: ValidationRule[]
- Définir `ValidationRule` interface:
  - `type`: 'required' | 'min' | 'max' | 'pattern'
  - `value?`: number | string | RegExp
  - `message`: string
- Définir `SelectFieldConfig` extends BaseFieldConfig:
  - `options`: { value: string, label: string }[]
- Définir `FieldProps` interface:
  - `config`: FieldConfig
  - `value`: unknown
  - `onChange`: (value: unknown) => void
  - `error?`: string
- Définir `FieldRegistration` interface:
  - `type`: FieldType
  - `component`: React.ComponentType<FieldProps>
  - `defaultConfig`: Partial<BaseFieldConfig>

### 5. `src/lib/form-fields/text/index.tsx` (CRÉER)

- Import Input et Label depuis ui/
- Créer composant TextField avec FieldProps
- Afficher label, input avec placeholder
- Gérer état error avec styling rouge
- Exporter fieldRegistration avec type: 'text'

### 6. `src/lib/form-fields/number/index.tsx` (CRÉER)

- Import Input et Label depuis ui/
- Créer composant NumberField avec FieldProps
- Input type="number" avec min/max depuis config
- Gérer conversion string -> number sur onChange
- Exporter fieldRegistration avec type: 'number'

### 7. `src/lib/form-fields/select/index.tsx` (CRÉER)

- Import Select components et Label depuis ui/
- Créer composant SelectField avec FieldProps
- Utiliser options depuis SelectFieldConfig
- Afficher placeholder si pas de valeur
- Exporter fieldRegistration avec type: 'select'

### 8. `src/lib/form-fields/registry.ts` (CRÉER)

- Créer Map `fieldRegistry` pour stocker les champs
- Fonction `registerField(registration: FieldRegistration)`:
  - Ajouter au registry
- Fonction `getField(type: FieldType)`:
  - Retourner le composant depuis le registry
- Importer et enregistrer automatiquement tous les champs:
  - import { fieldRegistration as textField } from './text'
  - import { fieldRegistration as numberField } from './number'
  - import { fieldRegistration as selectField } from './select'
  - registerField(textField), etc.
- Exporter `getAllFieldTypes()` pour lister les types disponibles

### 9. `src/lib/form-fields/DynamicField.tsx` (CRÉER)

- Import getField depuis registry
- Props: config, value, onChange, error
- Récupérer le composant depuis registry selon config.type
- Si type inconnu, afficher message d'erreur ou fallback
- Rendre le composant avec les props appropriées

### 10. `src/lib/form-fields/DynamicForm.tsx` (CRÉER)

- Props:
  - `schema`: FieldConfig[] (définition JSON des champs)
  - `values`: Record<string, unknown>
  - `onChange`: (values: Record<string, unknown>) => void
  - `errors?`: Record<string, string>
- Mapper sur schema pour rendre chaque DynamicField
- Gérer onChange par champ pour mettre à jour values
- Passer les erreurs individuelles à chaque champ

### 11. `src/lib/form-fields/index.ts` (CRÉER)

- Export centralisé:
  - export * from './types'
  - export { DynamicField } from './DynamicField'
  - export { DynamicForm } from './DynamicForm'
  - export { getAllFieldTypes, getField } from './registry'

## Testing Strategy

### Tests manuels
1. Créer une page de test `/admin/test-form` temporaire
2. Définir un schema JSON avec les 3 types de champs
3. Vérifier le rendu de chaque type
4. Tester les interactions (saisie, sélection)
5. Vérifier la récupération des valeurs

### Exemple de schema de test
```json
[
  {
    "name": "titre",
    "type": "text",
    "label": "Titre du formulaire",
    "placeholder": "Entrez un titre",
    "required": true
  },
  {
    "name": "annee",
    "type": "number",
    "label": "Année de référence",
    "defaultValue": 2024
  },
  {
    "name": "categorie",
    "type": "select",
    "label": "Catégorie",
    "options": [
      { "value": "e1", "label": "E1 - Changement climatique" },
      { "value": "e2", "label": "E2 - Pollution" }
    ]
  }
]
```

## Documentation

### Ajouter au README ou CLAUDE.md
- Section "Form Fields dynamiques"
- Comment ajouter un nouveau type de champ:
  1. Créer dossier `src/lib/form-fields/<type>/`
  2. Créer `index.tsx` avec composant et fieldRegistration
  3. Importer et enregistrer dans registry.ts
- Exemple de schema JSON

## Rollout Considerations

### Extensibilité future
- Pour ajouter un champ (ex: date, file, checkbox):
  1. Créer le dossier correspondant
  2. Implémenter le composant suivant le pattern
  3. L'enregistrer dans registry.ts
  4. Il devient automatiquement disponible

### Pas de breaking changes
- Nouvelle fonctionnalité, n'affecte pas le code existant
- Les composants UI shadcn ajoutés sont réutilisables ailleurs

### Validation
- Phase 1 (ce plan): Validation côté composant (visuel)
- Phase 2 (futur): Intégrer react-hook-form ou zod pour validation avancée
