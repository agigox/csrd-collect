# Task: Créer le champ NumberField

## Problem

Le système a besoin d'un champ numérique pour permettre la saisie de nombres (années, quantités, etc.).

## Proposed Solution

Créer `src/lib/form-fields/number/index.tsx` avec :
- Un composant NumberField similaire à TextField mais avec type="number"
- Gestion de la conversion string -> number sur onChange
- Support des attributs min/max depuis la config
- Export du fieldRegistration

## Dependencies

- Task 1: Composants shadcn (Input, Label)
- Task 2: Types communs
- Task 3: TextField comme référence de pattern

## Context

- Dossier: `src/lib/form-fields/number/`
- Pattern identique à TextField
- Attention à la conversion de type (input HTML retourne string)

## Success Criteria

- Composant NumberField fonctionnel
- Input de type number
- Conversion string -> number correcte
- Gère min/max si spécifiés
- Export fieldRegistration avec type: 'number'
