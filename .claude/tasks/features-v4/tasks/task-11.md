# Task: Simplifier l'affichage des options du Select

## Problem

Les options du Select sont affichées dans le configurateur même quand elles sont chargées depuis une source externe. Cela crée de la redondance avec la prévisualisation. De plus, le choix de la valeur par défaut doit être simplifié.

## Proposed Solution

Masquer la liste des options dans le configurateur quand elles proviennent d'une source externe. Ajouter une checkbox "Définir une valeur par défaut" qui, au clic, affiche un select pour choisir parmi les options chargées.

## Dependencies

- Task 10: Restructurer les sources de données (les options seront chargées différemment)

## Context

- Configurateur: `src/lib/form-fields/field-configurator/select/index.tsx`
- Actuellement les options sont éditables individuellement (lignes 172-218)
- `defaultIndex` est utilisé pour la valeur par défaut
- La prévisualisation affiche déjà les options

## Success Criteria

- Options masquées dans le configurateur quand chargées depuis une source
- Checkbox "Définir une valeur par défaut" visible
- Au clic sur la checkbox, un select apparaît avec les options disponibles
- La sélection dans ce dropdown met à jour `defaultIndex`
- La prévisualisation reflète la valeur par défaut choisie
