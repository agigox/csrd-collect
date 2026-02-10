# Task: Supprimer l'overlay du modal "Nouvelle déclaration"

## Problem

Le modal "Nouvelle déclaration" affiche actuellement un overlay sombre qui masque la liste des déclarations. L'utilisateur devrait pouvoir voir les déclarations tout en ayant le modal ouvert.

## Proposed Solution

Modifier le composant FormSelectionDialog pour retirer ou rendre transparent l'overlay/backdrop du Dialog, permettant à l'utilisateur de voir la liste en arrière-plan.

## Dependencies

- Task 3: Centrer la liste des déclarations (pour un contexte visuel cohérent)

## Context

- Fichier principal: `src/components/declarations/FormSelectionDialog.tsx`
- Utilise le composant Dialog de shadcn/ui
- L'overlay est géré par DialogOverlay ou le backdrop du Dialog
- Le Dialog est dans `src/lib/ui/dialog.tsx`

## Success Criteria

- Le modal "Nouvelle déclaration" s'affiche sans overlay sombre
- La liste des déclarations reste visible en arrière-plan
- Le modal reste fonctionnel (sélection de formulaire, fermeture)
- Navigation entre déclarations possible sans fermer le modal
