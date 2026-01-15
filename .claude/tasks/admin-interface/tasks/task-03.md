# Task: Créer le composant AdminUserInfo

## Problem
La sidebar admin doit afficher le nom de l'utilisateur avec un avatar, contrairement à la sidebar membre qui affiche les informations d'équipe (Direction, Centre, GMR, Équipe).

## Proposed Solution
Créer un nouveau composant `AdminUserInfo` qui affiche un avatar (avec initiales) et le nom de l'utilisateur admin. Utiliser le composant `Avatar` de shadcn.

## Dependencies
- Task #1 : Composants shadcn installés (Avatar)
- Task #2 : UserContext créé (pour récupérer le nom)

## Context
- Design Figma : Avatar circulaire + "Julien Neuville"
- Composant existant à comparer : `src/components/sidebar/UserInfo.tsx`
- Utiliser `Avatar`, `AvatarFallback` de shadcn
- Props en anglais : `userName`, `avatarUrl`

## Success Criteria
- `src/components/sidebar/AdminUserInfo.tsx` créé
- Affiche avatar avec initiales (fallback)
- Affiche le nom de l'utilisateur
- Style cohérent avec la sidebar existante
- Supporte le mode collapsed de la sidebar
