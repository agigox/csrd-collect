# Task: Installer les composants shadcn de base (Input, Label, Select)

## Problem

Le système de champs dynamiques nécessite des composants de formulaire de base (Input, Label, Select) qui n'existent pas encore dans le projet. Ces composants doivent être ajoutés avant de pouvoir créer les champs dynamiques.

## Proposed Solution

Installer les composants Input, Label et Select depuis shadcn/ui en utilisant la CLI. Ces composants seront placés dans `src/lib/components/ui/` comme les autres composants shadcn existants (Button, Card, Dialog...).

## Dependencies

- Aucune (peut commencer immédiatement)

## Context

- Composants shadcn existants: `src/lib/components/ui/` (button, card, dialog, separator, avatar, badge, tabs)
- Pattern à suivre: voir `src/lib/components/ui/button.tsx`
- Utilise Radix UI comme base
- Utilise `cn()` depuis `@/lib/utils` pour les classes

## Success Criteria

- Composant Input installé et fonctionnel
- Composant Label installé et fonctionnel
- Composant Select installé et fonctionnel (avec SelectTrigger, SelectValue, SelectContent, SelectItem)
- Imports depuis `@/lib/components/ui/input`, etc. fonctionnent
- Build passe sans erreur
