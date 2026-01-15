# Task: Créer le champ TextField

## Problem

Le système a besoin d'un champ texte comme premier type de champ dynamique. Ce champ servira de référence pour les autres types de champs.

## Proposed Solution

Créer `src/lib/form-fields/text/index.tsx` avec :
- Un composant TextField qui utilise Input et Label de shadcn
- Gestion du label, placeholder, état d'erreur
- Export du fieldRegistration pour l'enregistrement dans le registry

## Dependencies

- Task 1: Composants shadcn (Input, Label)
- Task 2: Types communs (FieldProps, FieldRegistration)

## Context

- Dossier: `src/lib/form-fields/text/`
- Utilise Input depuis `@/lib/components/ui/input`
- Utilise Label depuis `@/lib/components/ui/label`
- Pattern: composant + export fieldRegistration

## Success Criteria

- Composant TextField fonctionnel
- Affiche label et input
- Gère le placeholder
- Affiche l'erreur si présente (styling rouge)
- Export fieldRegistration avec type: 'text'
