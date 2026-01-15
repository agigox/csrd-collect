# Task: Créer le composant FormCard

## Problem
La page admin doit afficher une liste de formulaires sous forme de cartes. Chaque carte montre le code, le titre et la description du formulaire selon le design Figma.

## Proposed Solution
Créer un composant `FormCard` utilisant les composants `Card` de shadcn. Adapter le style pour correspondre au design Figma (ombre légère, layout horizontal).

## Dependencies
- Task #1 : Composants shadcn installés (Card)

## Context
- Design Figma : Card avec code gris, titre bold, description
- Layout : code + titre à gauche, séparateur vertical, description à droite
- Utiliser `Card` de shadcn et adapter les styles
- Props en anglais : `code`, `title`, `description`, `category`

## Success Criteria
- `src/components/admin/FormCard.tsx` créé
- Affiche code (gris/muted), titre (bold), description
- Style correspond au design Figma
- Props typées avec interface `FormCardProps`
- Composant réutilisable et indépendant
