# Task: Créer DynamicField et DynamicForm

## Problem

Le système a besoin de composants pour rendre dynamiquement les champs selon leur configuration JSON et gérer un formulaire complet.

## Proposed Solution

Créer deux composants :

1. `src/lib/form-fields/DynamicField.tsx`:
   - Récupère le bon composant depuis le registry
   - Passe les props (config, value, onChange, error)
   - Gère le cas d'un type inconnu

2. `src/lib/form-fields/DynamicForm.tsx`:
   - Prend un schema (tableau de FieldConfig)
   - Mappe sur le schema pour rendre chaque DynamicField
   - Gère l'état des valeurs
   - Passe les erreurs individuelles

## Dependencies

- Task 6: Registry (getField)
- Task 2: Types (FieldConfig, FieldProps)

## Context

- Fichiers: `src/lib/form-fields/DynamicField.tsx` et `DynamicForm.tsx`
- DynamicField = wrapper de routing vers le bon composant
- DynamicForm = container qui gère l'état global du formulaire

## Success Criteria

- DynamicField rend le bon composant selon config.type
- DynamicField affiche erreur/fallback si type inconnu
- DynamicForm rend tous les champs d'un schema
- onChange remonte correctement les valeurs
- Erreurs passées aux bons champs
