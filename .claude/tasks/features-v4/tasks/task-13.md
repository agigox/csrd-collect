# Task: Ajouter la confirmation de suppression dans le Header

## Problem

Quand l'utilisateur clique sur le bouton de suppression d'un champ, celui-ci est supprimé immédiatement sans confirmation. Une suppression accidentelle peut entraîner une perte de configuration.

## Proposed Solution

Afficher un modal de confirmation avant la suppression effective d'un champ. Le modal doit avoir les boutons "Annuler" et "Confirmer".

## Dependencies

- Aucune (peut démarrer immédiatement)

## Context

- Fichier principal: `src/lib/form-fields/field-configurator/common/Header.tsx`
- Le bouton trash appelle directement `onRemove()` (ligne ~40)
- Dialog component disponible dans `src/lib/ui/dialog.tsx`
- Pattern de confirmation utilisable: état local pour le modal

## Success Criteria

- Clic sur le bouton trash ouvre un modal de confirmation
- Modal affiche "Supprimer ce champ ?" avec boutons Annuler/Confirmer
- "Annuler" ferme le modal sans action
- "Confirmer" appelle onRemove() et ferme le modal
- Le modal utilise le composant Dialog existant
