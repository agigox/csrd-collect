# Task: Adapter la Navigation pour supporter admin/membre

## Problem
Le menu de navigation actuel est fixe et ne montre que les items pour les membres. L'admin a besoin d'un menu différent avec : Administration d'équipe, Paramètrage déclaratif, Gestion des données.

## Proposed Solution
Modifier le composant `Navigation` pour accepter un prop `variant` qui détermine quels items de menu afficher. Extraire les configurations de menu dans des constantes séparées.

## Dependencies
- Aucune (peut commencer en parallèle avec Task #2 et #3)

## Context
- Fichier existant : `src/components/sidebar/Navigation.tsx`
- Menu membre actuel : Déclarer (bouton), Déclarations, Paramètrage déclaratif
- Menu admin (Figma) : Administration d'équipe, Paramètrage déclaratif, Gestion des données
- Variables en anglais : `adminMenuItems`, `memberMenuItems`
- L'admin n'a PAS de bouton "Déclarer"

## Success Criteria
- `Navigation` accepte prop `variant?: "admin" | "member"`
- Menu admin affiche les 3 items corrects
- Menu membre reste inchangé (comportement par défaut)
- Configurations de menu extraites dans des constantes
- Icônes appropriées pour chaque item
