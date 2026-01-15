# Task: Créer le registry des champs

## Problem

Le système a besoin d'un mécanisme central pour enregistrer et récupérer les composants de champs selon leur type. C'est le coeur du système "plug-and-play".

## Proposed Solution

Créer `src/lib/form-fields/registry.ts` avec :
- Un Map pour stocker les enregistrements de champs
- Fonction registerField pour ajouter un champ
- Fonction getField pour récupérer un composant par type
- Fonction getAllFieldTypes pour lister les types disponibles
- Import et enregistrement automatique des 3 champs

## Dependencies

- Task 2: Types communs (FieldRegistration)
- Task 3: TextField
- Task 4: NumberField
- Task 5: SelectField

## Context

- Fichier: `src/lib/form-fields/registry.ts`
- Importe les fieldRegistration de chaque champ
- Pattern: Map<FieldType, FieldRegistration>

## Success Criteria

- Registry fonctionnel avec les 3 types enregistrés
- getField('text') retourne le composant TextField
- getField('number') retourne le composant NumberField
- getField('select') retourne le composant SelectField
- getAllFieldTypes() retourne ['text', 'number', 'select']
