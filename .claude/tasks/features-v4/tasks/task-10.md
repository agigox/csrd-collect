# Task: Restructurer les sources de données du Select

## Problem

Le Select utilise actuellement un champ texte pour l'URL API. Il doit utiliser une structure hiérarchique de données: d'abord sélectionner un "Type de données" (ex: Adresses, Utilisateurs), puis une "Source de données" (ex: Rues, Codes postaux).

## Proposed Solution

Créer une nouvelle structure de données dans db.json, modifier le configurateur Select pour avoir deux dropdowns en cascade, et charger automatiquement les options correspondantes.

## Dependencies

- Task 8: Supprimer l'import CSV (le champ API URL sera remplacé)
- Task 9: Mode de sélection (les modifications du configurateur seront complémentaires)

## Context

- Structure cible dans db.json:
  ```json
  {
    "options": {
      "addresses": { "label": "Adresses", "data": [...] },
      "users": { "label": "Utilisateurs", "data": [...] }
    }
  }
  ```
- Premier select: clés de l'objet options (addresses, users)
- Deuxième select: items dans `data` du type sélectionné
- Prévisualisation: affiche les `items` de la source sélectionnée

## Success Criteria

- db.json contient la nouvelle structure `options`
- Premier select "Type de données" affiche les types disponibles
- Deuxième select "Source de données" affiche les sous-catégories
- Les options se chargent automatiquement dans la prévisualisation
- Documentation créée dans `docs/DATA_SOURCES.md`
