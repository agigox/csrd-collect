# Task: Créer le composant FormsList avec filtres

## Problem
La page admin doit afficher une liste de formulaires filtrables par catégorie CSRD (Tous, E1-Pollution, E2-Pollution, etc.). Le design Figma montre des onglets style "pill" connectés.

## Proposed Solution
Créer un composant `FormsList` qui utilise `Tabs` de shadcn pour les filtres et affiche les `FormCard` correspondants. Adapter le style des Tabs pour correspondre au design Figma.

## Dependencies
- Task #1 : Composants shadcn installés (Tabs)
- Task #6 : FormCard créé

## Context
- Design Figma : Tabs style pill avec background brand
- Catégories : Tous, E1-Pollution, E2-Pollution, E3-Pollution, E4-Pollution
- Données mock pour les formulaires (code, titre, description, catégorie)
- Variables en anglais : `forms`, `activeTab`, `filteredForms`

## Success Criteria
- `src/components/admin/FormsList.tsx` créé
- Tabs de filtrage fonctionnels
- Style des tabs adapté (pill, brand colors)
- Filtre les formulaires par catégorie
- Affiche les FormCard pour chaque formulaire filtré
- Données mock incluses pour le développement
