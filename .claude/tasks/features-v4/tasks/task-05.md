# Task: Améliorer le layout admin "Paramétrage déclaratif"

## Problem

Dans la page admin de paramétrage déclaratif, le bloc "Nouveau formulaire" doit être centré avec max-width: 602px quand la prévisualisation est fermée. Quand elle s'ouvre, le formulaire doit se déplacer à gauche pour que les deux panneaux soient visibles.

## Proposed Solution

Ajuster le système de grid pour centrer le formulaire quand showPreview est false, et maintenir le layout actuel côte-à-côte quand showPreview est true.

## Dependencies

- Aucune (peut démarrer immédiatement)

## Context

- Fichier principal: `src/app/admin/parametrage-declaratif/page.tsx`
- Layout actuel avec grid: `grid-cols-[calc(100%-348px)_324px]` quand preview visible
- État `showPreview` contrôle l'affichage du panneau de prévisualisation
- Le panneau de prévisualisation a une largeur fixe de 324px

## Success Criteria

- Sans prévisualisation: formulaire centré, max-width 602px
- Avec prévisualisation: formulaire à gauche, preview à droite, les deux visibles
- Transition fluide entre les deux états
- Pas de débordement ou de scroll horizontal
