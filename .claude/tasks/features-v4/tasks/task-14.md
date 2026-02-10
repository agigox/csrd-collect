# Task: Ajouter l'indication de duplication (tag "copie")

## Problem

Quand un champ est dupliqué, il n'y a pas d'indication visuelle qu'il s'agit d'une copie. L'utilisateur devrait voir un tag "(copie)" à côté du titre jusqu'à ce qu'il modifie le champ.

## Proposed Solution

Ajouter un système de tracking des copies: marquer le champ comme copie lors de la duplication, afficher un badge dans le Header, et retirer le marqueur dès que le champ est modifié.

## Dependencies

- Aucune (peut démarrer immédiatement)

## Context

- Header: `src/lib/form-fields/field-configurator/common/Header.tsx`
- FormBuilder: `src/lib/form-fields/FormBuilder.tsx` (gère la duplication)
- La duplication se fait via `handleDuplicate` (lignes ~146-155)
- Chip/Badge composant disponible pour le style

## Success Criteria

- Clic sur "Dupliquer" crée un nouveau champ avec tag "(copie)"
- Le tag est visible à côté du type de champ dans le Header
- Toute modification du champ dupliqué retire le tag
- Le tag utilise un style cohérent (Chip ou Badge)
- Le tracking ne persiste pas après sauvegarde/rechargement
