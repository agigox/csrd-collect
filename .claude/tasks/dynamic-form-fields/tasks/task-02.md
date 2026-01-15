# Task: Créer les types communs pour les champs dynamiques

## Problem

Le système de champs dynamiques a besoin d'une fondation de types TypeScript pour définir la structure des configurations de champs, les props des composants, et le contrat d'enregistrement des champs.

## Proposed Solution

Créer un fichier `src/lib/form-fields/types.ts` avec toutes les interfaces et types nécessaires :
- Types de champs supportés
- Configuration de base des champs
- Configuration spécifique par type (ex: options pour select)
- Props communes des composants de champ
- Contrat d'enregistrement pour le registry

## Dependencies

- Aucune (peut commencer en parallèle avec Task 1)

## Context

- Nouveau dossier: `src/lib/form-fields/`
- Types de champs initiaux: text, number, select
- Doit supporter l'extensibilité pour futurs types
- Pattern TypeScript du projet: interfaces avec suffix "Props"

## Success Criteria

- Fichier `src/lib/form-fields/types.ts` créé
- Types FieldType, BaseFieldConfig, SelectFieldConfig définis
- Types FieldProps et FieldRegistration définis
- Types exportables et utilisables par les autres fichiers
- Pas d'erreur TypeScript
