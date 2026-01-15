# Task: Créer le UserContext pour gérer les rôles

## Problem
L'application doit distinguer deux types d'utilisateurs (admin et membre) pour afficher des interfaces différentes. Actuellement, il n'y a pas de mécanisme pour identifier le type d'utilisateur.

## Proposed Solution
Créer un contexte React `UserContext` qui détermine le rôle de l'utilisateur selon la route courante (`/admin/*` → admin, sinon membre). Fournir un hook `useUser()` pour accéder facilement aux informations utilisateur.

## Dependencies
- Aucune (peut commencer immédiatement)

## Context
- Pattern existant à suivre : `src/context/SidebarContext.tsx`
- Détection de route avec `usePathname()` de Next.js
- Données mock : admin = "Julien Neuville", membre = infos équipe actuelles
- Variables en anglais : `userRole`, `userName`, `isAdmin`

## Success Criteria
- `src/context/UserContext.tsx` créé avec :
  - Interface `UserContextType`
  - `UserProvider` component
  - Hook `useUser()`
- Sur `/admin` → `role: "admin"`, `name: "Julien Neuville"`
- Sur `/` → `role: "member"`, données équipe
- `UserProvider` ajouté dans `src/components/Providers.tsx`
