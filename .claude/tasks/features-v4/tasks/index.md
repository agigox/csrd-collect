# Tasks: Features V4

## Overview

17 tâches pour implémenter les fonctionnalités V4 de CSRD-COLLECT:
- Améliorations du champ Select (CSV, mode sélection, sources de données)
- Fusion Number/Unit
- Améliorations du Header (suppression, duplication, réorganisation)
- Suppression StatCard
- Bug fix Date
- Tooltips pour descriptions
- Layouts (déclarations, admin)
- Nouveau champ Import

## Task List

### Phase 1: Changements UI indépendants
- [ ] **Task 1**: Supprimer le bloc Statistiques - `task-01.md`
- [ ] **Task 2**: Corriger le bug Date valeur par défaut - `task-02.md`
- [ ] **Task 3**: Centrer la liste des déclarations - `task-03.md` *(dépend de Task 1)*
- [ ] **Task 4**: Supprimer l'overlay du modal - `task-04.md` *(dépend de Task 3)*
- [ ] **Task 5**: Améliorer le layout admin - `task-05.md`

### Phase 2: Tooltips
- [ ] **Task 6**: Installer le composant Tooltip - `task-06.md`
- [ ] **Task 7**: Ajouter Tooltip aux champs de formulaire - `task-07.md` *(dépend de Task 6)*

### Phase 3: Configuration Select
- [ ] **Task 8**: Supprimer l'import CSV - `task-08.md`
- [ ] **Task 9**: Ajouter mode de sélection unique/multiple - `task-09.md` *(dépend de Task 8)*
- [ ] **Task 10**: Restructurer les sources de données - `task-10.md` *(dépend de Task 8, 9)*
- [ ] **Task 11**: Simplifier l'affichage des options - `task-11.md` *(dépend de Task 10)*

### Phase 4: Fusion Number/Unit
- [ ] **Task 12**: Fusionner Nombre et Quantité avec unité - `task-12.md`

### Phase 5: Header du FieldConfigurator
- [ ] **Task 13**: Ajouter confirmation de suppression - `task-13.md`
- [ ] **Task 14**: Ajouter indication de duplication (copie) - `task-14.md`
- [ ] **Task 15**: Ajouter contrôles de réorganisation - `task-15.md`

### Phase 6: Champ Import
- [ ] **Task 16**: Implémenter le configurateur Import - `task-16.md`
- [ ] **Task 17**: Implémenter le rendu du champ Import - `task-17.md` *(dépend de Task 16)*

## Execution Order

### Tâches parallélisables (aucune dépendance)
Ces tâches peuvent être exécutées en parallèle:
- Task 1, 2, 5, 6, 8, 12, 13, 14, 15, 16

### Chaînes de dépendances
1. **Layout déclarations**: Task 1 → Task 3 → Task 4
2. **Tooltips**: Task 6 → Task 7
3. **Select**: Task 8 → Task 9 → Task 10 → Task 11
4. **Import**: Task 16 → Task 17

## Ordre recommandé d'exécution

```
Batch 1 (parallèle):
├── Task 1: Supprimer StatCard
├── Task 2: Bug fix Date
├── Task 5: Layout admin
├── Task 6: Installer Tooltip
├── Task 8: Supprimer CSV import
├── Task 12: Fusionner Number/Unit
├── Task 13: Confirmation suppression
├── Task 14: Tag duplication
├── Task 15: Flèches réorganisation
└── Task 16: Configurateur Import

Batch 2 (après Batch 1):
├── Task 3: Centrer déclarations (après Task 1)
├── Task 7: Tooltips aux champs (après Task 6)
├── Task 9: Mode sélection (après Task 8)
└── Task 17: Rendu Import (après Task 16)

Batch 3 (après Batch 2):
├── Task 4: Supprimer overlay (après Task 3)
└── Task 10: Sources de données (après Task 9)

Batch 4 (après Batch 3):
└── Task 11: Simplifier options (après Task 10)
```

## Estimation

| Complexité | Tâches |
|------------|--------|
| Faible | 1, 2, 5, 6, 8, 13 |
| Moyenne | 3, 4, 7, 9, 11, 14, 15 |
| Élevée | 10, 12, 16, 17 |

## Notes

- Toute l'UI doit rester en français
- Tester chaque fonctionnalité dans la prévisualisation
- Les formulaires existants doivent continuer de fonctionner après migration
