# Task: Fusionner les champs Nombre et Quantité avec unité

## Problem

Le système a deux types de champs séparés: "Nombre" (number) et "Quantité avec unité" (unit). Ces deux champs doivent être fusionnés en un seul champ "Nombre" avec une option pour ajouter ou non une unité.

## Proposed Solution

Ajouter un sélecteur d'unité au configurateur Number avec une option "Sans unité", modifier le rendu pour afficher l'unité si configurée, puis supprimer le type "unit" et ses fichiers associés.

## Dependencies

- Aucune (peut démarrer immédiatement)

## Context

- Number configurator: `src/lib/form-fields/field-configurator/number/index.tsx`
- Unit configurator: `src/lib/form-fields/field-configurator/unit/index.tsx`
- Number field: `src/lib/form-fields/number/index.tsx`
- Unit field: `src/lib/form-fields/unit/index.tsx`
- Types: `src/lib/form-fields/types.ts`
- Registry: `src/lib/form-fields/registry.ts`
- FormBuilder: `src/lib/form-fields/FormBuilder.tsx`
- Unités disponibles dans unit configurator: L, kg, m, m², m³, t, kWh

## Success Criteria

- NumberFieldConfig a une propriété `unit?: string`
- Le configurateur Number a un dropdown d'unité avec "Sans unité" comme option
- Le rendu Number affiche l'unité si configurée
- Le type "unit" est retiré du FormBuilder
- Les fichiers unit/ sont supprimés
- Les formulaires existants avec "unit" continuent de fonctionner (migration)
