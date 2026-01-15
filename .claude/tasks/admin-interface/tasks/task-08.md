# Task: Créer le layout et la page admin

## Problem
L'interface admin n'a pas encore de route. Il faut créer le layout admin (avec sidebar admin) et la page principale qui affiche l'administration des formulaires.

## Proposed Solution
Créer `src/app/admin/layout.tsx` avec la Sidebar en variant admin, et `src/app/admin/page.tsx` avec le header "Administration des formulaires de déclaration", le bouton "Ajouter un formulaire" et la liste des formulaires.

## Dependencies
- Task #5 : Sidebar adaptée pour admin
- Task #7 : FormsList créé

## Context
- Structure similaire au layout membre existant (`src/app/layout.tsx`)
- Design Figma : Header avec titre + bouton, puis FormsList
- Le bouton "Ajouter un formulaire" n'a pas d'action pour le moment (future feature)
- Variables en anglais : `pageTitle`, `handleAddForm`

## Success Criteria
- `src/app/admin/layout.tsx` créé avec Sidebar variant="admin"
- `src/app/admin/page.tsx` créé avec :
  - Header "Administration des formulaires de déclaration"
  - Bouton "Ajouter un formulaire"
  - Composant FormsList
- Route `/admin` accessible et fonctionnelle
- Style cohérent avec le design Figma
- Interface membre (`/`) reste inchangée
