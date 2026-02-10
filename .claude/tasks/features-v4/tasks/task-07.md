# Task: Ajouter le Tooltip aux champs de formulaire

## Problem

Les descriptions des champs sont actuellement affichées en texte sous le label. Elles doivent être affichées en tooltip au survol du label pour une interface plus propre.

## Proposed Solution

Modifier tous les composants de champs (text, number, select, radio, checkbox, unit, date, switch) pour utiliser le Tooltip autour du label quand une description est configurée.

## Dependencies

- Task 6: Installer le composant Tooltip (le composant doit être disponible)

## Context

- Champs à modifier:
  - `src/lib/form-fields/text/index.tsx`
  - `src/lib/form-fields/number/index.tsx`
  - `src/lib/form-fields/select/index.tsx`
  - `src/lib/form-fields/radio/index.tsx`
  - `src/lib/form-fields/checkbox/index.tsx`
  - `src/lib/form-fields/unit/index.tsx`
  - `src/lib/form-fields/date/index.tsx`
  - `src/lib/form-fields/switch/index.tsx`
- Pattern: Wrapper TooltipProvider > Tooltip > TooltipTrigger (Label) + TooltipContent (description)

## Success Criteria

- Chaque champ avec description affiche un tooltip au survol du label
- Les descriptions ne sont plus affichées inline
- Le tooltip est lisible et bien positionné
- Les champs sans description n'affichent pas de tooltip
- Fonctionne dans la prévisualisation et dans les formulaires de déclaration
