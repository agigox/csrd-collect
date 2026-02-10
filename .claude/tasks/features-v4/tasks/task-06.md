# Task: Installer et configurer le composant Tooltip

## Problem

Le projet n'a pas de composant Tooltip pour afficher les descriptions des champs au survol. Un Tooltip est nécessaire pour remplacer l'affichage inline des descriptions.

## Proposed Solution

Installer le composant Tooltip via shadcn/ui et le configurer pour être utilisable dans tous les champs de formulaire.

## Dependencies

- Aucune (peut démarrer immédiatement)

## Context

- shadcn/ui est déjà utilisé dans le projet
- Commande d'installation: `pnpm dlx shadcn@latest add tooltip`
- Le fichier sera créé dans `src/lib/ui/tooltip.tsx`
- Composants disponibles: Popover existe déjà comme alternative

## Success Criteria

- Composant Tooltip installé dans `src/lib/ui/tooltip.tsx`
- Export fonctionnel de TooltipProvider, Tooltip, TooltipTrigger, TooltipContent
- Composant testable manuellement
- Pas de conflits avec les autres composants UI
