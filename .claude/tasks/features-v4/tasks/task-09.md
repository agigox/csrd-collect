# Task: Ajouter le mode de sélection (unique/multiple) au Select

## Problem

Le champ Select ne permet actuellement que la sélection unique (dropdown). Il doit supporter deux modes: "Choix unique" (comportement actuel) et "Choix multiple" (checkboxes).

## Proposed Solution

Ajouter des boutons radio dans le configurateur pour choisir le mode de sélection, mettre à jour les types TypeScript, et modifier le rendu du champ Select pour afficher des checkboxes en mode multiple.

## Dependencies

- Task 8: Supprimer l'import CSV (pour nettoyer le configurateur avant d'ajouter)

## Context

- Configurateur: `src/lib/form-fields/field-configurator/select/index.tsx`
- Rendu: `src/lib/form-fields/select/index.tsx`
- Types: `src/lib/form-fields/types.ts` (SelectFieldConfig)
- Pattern radio existant dans `src/lib/form-fields/field-configurator/radio/index.tsx`
- En mode multiple, stocker les valeurs sélectionnées comme array

## Success Criteria

- Deux boutons radio "Choix unique" et "Choix multiple" dans le configurateur
- Mode "single": comportement dropdown actuel
- Mode "multiple": affichage checkboxes, valeurs stockées en array
- La prévisualisation reflète le mode choisi
- Type `selectionMode?: "single" | "multiple"` ajouté à SelectFieldConfig
