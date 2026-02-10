# Task: Corriger le bug de valeur par défaut du champ Date

## Problem

Après avoir choisi "Date du jour" puis "Aucune" dans la configuration d'un champ Date, la prévisualisation affiche toujours la date du jour. Le changement vers "Aucune" devrait vider la prévisualisation.

## Proposed Solution

Modifier le useEffect dans le composant DateField pour gérer correctement le cas "none" en réinitialisant la valeur à undefined lorsque l'utilisateur passe de "today" à "none".

## Dependencies

- Aucune (peut démarrer immédiatement)

## Context

- Fichier principal: `src/lib/form-fields/date/index.tsx`
- Le useEffect actuel (lignes 43-48) ne gère que le cas "today"
- Le type `DateDefaultValue = "none" | "today"` est défini dans types.ts
- Le configurateur permet de choisir entre "Aucune" et "Date du jour"

## Success Criteria

- Sélectionner "Date du jour" → la date du jour s'affiche dans la prévisualisation
- Changer vers "Aucune" → la prévisualisation se vide complètement
- Le comportement au premier chargement reste cohérent
- Pas de boucles infinies dans le useEffect
