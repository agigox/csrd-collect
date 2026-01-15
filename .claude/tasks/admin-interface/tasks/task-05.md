# Task: Adapter la Sidebar pour supporter le variant admin/membre

## Problem
La Sidebar actuelle affiche toujours les informations membre (UserInfo avec Direction, Centre, etc.). Elle doit pouvoir afficher soit les infos membre, soit les infos admin selon le contexte.

## Proposed Solution
Modifier la Sidebar pour accepter un prop `variant` et afficher conditionnellement `UserInfo` (membre) ou `AdminUserInfo` (admin). Utiliser le `UserContext` pour déterminer automatiquement le variant si non fourni.

## Dependencies
- Task #2 : UserContext créé
- Task #3 : AdminUserInfo créé
- Task #4 : Navigation adaptée

## Context
- Fichier existant : `src/components/sidebar/index.tsx`
- Remplacer `Divider` par `Separator` de shadcn
- La sidebar collapse/expand doit fonctionner pour les deux variants
- Le footer (Paramètres, Réduire le menu) reste identique

## Success Criteria
- `Sidebar` accepte prop optionnelle `variant?: "admin" | "member"`
- Si pas de variant fourni, utilise `useUser()` pour déterminer
- Variant admin → affiche `AdminUserInfo` + navigation admin
- Variant membre → affiche `UserInfo` + navigation membre (actuel)
- `Divider` remplacé par `Separator`
- Collapse/expand fonctionne sur les deux variants
