# Tasks: Dynamic Form Fields

## Vue d'ensemble

Créer un système de champs de formulaire dynamiques "plug-and-play" dans `src/lib/form-fields/`. Chaque type de champ est dans son propre sous-dossier et s'enregistre automatiquement dans un registry central. Les formulaires sont configurés via JSON.

## Liste des tâches

- [x] **Task 1**: Installer composants shadcn (Input, Label, Select) - `task-01.md`
- [x] **Task 2**: Créer les types communs - `task-02.md`
- [x] **Task 3**: Créer TextField - `task-03.md` (dépend de 1, 2)
- [x] **Task 4**: Créer NumberField - `task-04.md` (dépend de 1, 2)
- [x] **Task 5**: Créer SelectField - `task-05.md` (dépend de 1, 2)
- [x] **Task 6**: Créer le registry - `task-06.md` (dépend de 3, 4, 5)
- [x] **Task 7**: Créer DynamicField et DynamicForm - `task-07.md` (dépend de 6)
- [x] **Task 8**: Export centralisé et tests - `task-08.md` (dépend de 7)

## Ordre d'exécution

```
Task 1 ─────┬───► Task 3 ─┐
            │             │
            ├───► Task 4 ─┼───► Task 6 ───► Task 7 ───► Task 8
            │             │
Task 2 ─────┴───► Task 5 ─┘
```

### Parallélisation possible
- **Tasks 1 et 2** peuvent être faites en parallèle
- **Tasks 3, 4 et 5** peuvent être faites en parallèle (après 1 et 2)

### Ordre séquentiel obligatoire
- Task 6 requiert Tasks 3, 4, 5
- Task 7 requiert Task 6
- Task 8 requiert Task 7

## Statut : TERMINÉ

Toutes les tâches ont été complétées avec succès.

### Résultats
- Build : OK
- Lint : OK (2 warnings préexistants non liés)
- Page de test : `/admin/test-form`
- Documentation : CLAUDE.md mise à jour
