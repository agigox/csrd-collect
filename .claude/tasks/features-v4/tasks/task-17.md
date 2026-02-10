# Task: Implémenter le rendu du champ Import de fichier

## Problem

Le champ Import a son configurateur mais pas de composant de rendu. L'utilisateur doit voir une zone de drop/sélection de fichiers dans la prévisualisation et les formulaires.

## Proposed Solution

Créer le composant ImportField avec une zone de drag & drop, un input file caché, l'affichage des fichiers sélectionnés, et la validation de taille/type.

## Dependencies

- Task 16: Configurateur Import (les types et config doivent exister)

## Context

- Fichier à créer: `src/lib/form-fields/import/index.tsx`
- Registry: `src/lib/form-fields/registry.ts`
- Pattern à suivre: autres champs (text, number...)
- ImportFieldConfig: acceptedTypes, maxFileSize, multiple

## Success Criteria

- ImportField créé avec zone de drop stylée
- Clic ou drag & drop pour sélectionner des fichiers
- Validation des types de fichiers acceptés
- Validation de la taille maximale
- Affichage du nom des fichiers sélectionnés
- Support fichier unique ou multiples selon config
- Enregistré dans le registry
- Visible dans la prévisualisation
