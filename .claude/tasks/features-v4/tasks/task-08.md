# Task: Supprimer l'import CSV du Select

## Problem

La fonctionnalité d'import d'options via fichier CSV dans le configurateur de champ Select doit être supprimée. Cette fonctionnalité n'est plus nécessaire car les options seront chargées depuis des sources de données prédéfinies.

## Proposed Solution

Retirer tout le code lié à l'import CSV: la référence au file input, la fonction de parsing CSV, le bouton d'import et le texte "ou".

## Dependencies

- Aucune (peut démarrer immédiatement)

## Context

- Fichier principal: `src/lib/form-fields/field-configurator/select/index.tsx`
- `fileInputRef` (ligne 23): référence au input file
- `handleCsvImport` (lignes 56-87): fonction de parsing CSV
- Hidden input file (lignes 136-141)
- Bouton "Importer un .csv" (lignes 143-150)
- Texte "ou" séparateur (ligne 135)

## Success Criteria

- Le bouton "Importer un .csv" est supprimé
- Le texte "ou" est supprimé
- La fonction handleCsvImport est supprimée
- Le fileInputRef est supprimé
- Le champ API URL reste fonctionnel
- Pas d'erreurs de compilation
