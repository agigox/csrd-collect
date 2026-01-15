# Task: Créer le champ SelectField

## Problem

Le système a besoin d'un champ de sélection pour les listes déroulantes (catégories, choix prédéfinis, etc.).

## Proposed Solution

Créer `src/lib/form-fields/select/index.tsx` avec :
- Un composant SelectField utilisant les composants Select de shadcn
- Mapping des options depuis SelectFieldConfig
- Gestion du placeholder quand aucune valeur
- Export du fieldRegistration

## Dependencies

- Task 1: Composants shadcn (Select, Label)
- Task 2: Types communs (SelectFieldConfig)

## Context

- Dossier: `src/lib/form-fields/select/`
- Composants Select shadcn: Select, SelectTrigger, SelectValue, SelectContent, SelectItem
- Options définies dans config.options: { value, label }[]

## Success Criteria

- Composant SelectField fonctionnel
- Affiche les options depuis config
- Placeholder visible si pas de valeur
- Valeur sélectionnée correctement remontée via onChange
- Export fieldRegistration avec type: 'select'
