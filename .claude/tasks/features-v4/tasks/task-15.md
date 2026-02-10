# Task: Ajouter les contrôles de réorganisation (flèches haut/bas)

## Problem

Les champs de formulaire ne peuvent pas être réorganisés facilement. L'utilisateur devrait pouvoir déplacer un champ vers le haut ou le bas dans la liste via des icônes dans le Header.

## Proposed Solution

Ajouter des icônes flèche haut et flèche bas dans le Header, visibles au survol. Implémenter les handlers pour échanger la position du champ avec son voisin.

## Dependencies

- Aucune (peut démarrer immédiatement)

## Context

- Header: `src/lib/form-fields/field-configurator/common/Header.tsx`
- FormBuilder: `src/lib/form-fields/FormBuilder.tsx` (gère le schema)
- FieldConfigurator: `src/lib/form-fields/FieldConfigurator.tsx`
- Icônes lucide-react: ChevronUp, ChevronDown
- La liste des champs est dans `schema` state du FormBuilder

## Success Criteria

- Icônes flèche haut/bas apparaissent au survol du Header
- Flèche haut désactivée pour le premier champ
- Flèche bas désactivée pour le dernier champ
- Clic sur flèche haut échange le champ avec le précédent
- Clic sur flèche bas échange le champ avec le suivant
- L'ordre se reflète dans la prévisualisation
