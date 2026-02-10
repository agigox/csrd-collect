# Task: Supprimer le bloc Statistiques (StatCard)

## Problem

Le bloc Statistiques (StatCard) dans l'interface membre doit être supprimé. Actuellement, il s'affiche dans la partie droite de la page d'accueil et n'est plus nécessaire.

## Proposed Solution

Supprimer le composant StatCard et son utilisation dans le Dashboard, puis ajuster le layout de la page des déclarations pour ne garder que la liste.

## Dependencies

- Aucune (peut démarrer immédiatement)

## Context

- Fichier principal: `src/components/declarations/Dashboard.tsx`
- StatCard est défini inline (lignes 6-55)
- Utilise des données du store `useDeclarationsStore`
- Affiche 3 instances avec des statistiques de déclarations
- Le Dashboard est utilisé dans `src/components/declarations/index.tsx`

## Success Criteria

- Le composant StatCard est supprimé
- Le Dashboard est simplifié ou supprimé
- La page des déclarations s'affiche sans le bloc statistiques
- Aucune erreur de console
