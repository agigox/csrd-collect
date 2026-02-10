# Task: Implémenter le champ Import de fichier (types et configurateur)

## Problem

Le type "import" existe dans les types mais n'a pas d'implémentation. Les utilisateurs doivent pouvoir créer des champs permettant l'upload de fichiers avec configuration des types acceptés et taille maximale.

## Proposed Solution

Créer le type ImportFieldConfig, implémenter le configurateur avec les options de configuration (types de fichiers, taille max, fichiers multiples), et l'enregistrer dans le système.

## Dependencies

- Aucune (peut démarrer immédiatement)

## Context

- Types: `src/lib/form-fields/types.ts` (ImportFieldConfig à créer)
- Configurateur à créer: `src/lib/form-fields/field-configurator/import/index.tsx`
- Index configurateur: `src/lib/form-fields/field-configurator/index.tsx`
- Le type "import" est déjà dans FieldType mais pas implémenté
- Pattern à suivre: autres configurateurs (text, number, select...)

## Success Criteria

- ImportFieldConfig défini avec: acceptedTypes, maxFileSize, multiple
- ImportConfigurator créé avec:
  - Sélection des types de fichiers acceptés (.pdf, .doc, images...)
  - Input pour taille max (avec sélecteur KB/MB)
  - Toggle pour autoriser fichiers multiples
- Le configurateur est enregistré et accessible depuis le FormBuilder
- Pas d'erreur "Type de champ inconnu: import"
