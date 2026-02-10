# Task: Centrer la liste des déclarations (membre)

## Problem

La liste des déclarations dans l'interface membre doit être centrée avec une largeur maximale de 602px. Actuellement, elle occupe tout l'espace disponible dans un layout à deux colonnes.

## Proposed Solution

Modifier le layout de la page des déclarations pour centrer la liste et retirer la colonne du Dashboard (après task-01). Appliquer max-width: 602px avec centrage automatique.

## Dependencies

- Task 1: Supprimer le bloc Statistiques (le Dashboard doit être retiré en premier)

## Context

- Fichier principal: `src/components/declarations/index.tsx`
- Layout actuel: grid 2 colonnes (DeclarationsList + Dashboard)
- Composant liste: `src/components/declarations/declarationsList/index.tsx`

## Success Criteria

- La liste des déclarations est centrée horizontalement
- Largeur maximale de 602px respectée
- Le layout est responsive
- L'affichage reste fonctionnel sur mobile
