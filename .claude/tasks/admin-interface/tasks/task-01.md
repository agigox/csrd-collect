# Task: Installer les composants shadcn manquants

## Problem
L'interface admin nécessite des composants UI (Card, Avatar, Tabs, Separator, Badge) qui ne sont pas encore installés dans le projet. Ces composants sont essentiels pour construire l'interface selon le design Figma.

## Proposed Solution
Installer les composants shadcn/ui nécessaires via la CLI shadcn. Vérifier que chaque composant est bien ajouté dans `src/lib/components/ui/`.

## Dependencies
- Aucune (peut commencer immédiatement)

## Context
- Le projet utilise déjà shadcn (Button et Dialog existent)
- Composants installés dans `src/lib/components/ui/`
- Commande : `pnpm dlx shadcn@latest add card avatar tabs separator badge`

## Success Criteria
- Les fichiers suivants existent :
  - `src/lib/components/ui/card.tsx`
  - `src/lib/components/ui/avatar.tsx`
  - `src/lib/components/ui/tabs.tsx`
  - `src/lib/components/ui/separator.tsx`
  - `src/lib/components/ui/badge.tsx`
- Pas d'erreurs de compilation
