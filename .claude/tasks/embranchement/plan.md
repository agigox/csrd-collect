# Plan : Embranchement Conditionnel

## Context

Le FormBuilder admin permet de créer des formulaires dynamiques avec 8 types de champs. Les champs radio et checkbox ont des options (Choix 1, Choix 2...) mais il n'existe aucun mécanisme pour conditionner l'apparition d'autres champs selon l'option sélectionnée. Le bouton "branch" existe déjà dans le Footer (`Footer.tsx:108-116`) mais il est un TODO non fonctionnel (appelle incorrectement `onMoveDown`).

L'objectif est de permettre à l'admin de lier **plusieurs sous-champs conditionnels** à chaque option d'un champ radio/checkbox via un multi-select, et d'afficher/masquer ces sous-champs dynamiquement côté preview et membre.

---

## Étape 1 : Modèle de données (`src/models/FieldTypes.ts`)

Étendre `BaseFieldConfig` avec les propriétés de liaison parent-enfant :
- `parentFieldId?: string` — ID du champ parent
- `parentOptionValue?: string` — Valeur de l'option qui déclenche l'affichage
- `branchingColor?: string` — Couleur hex aléatoire pour l'indication visuelle

Étendre `RadioFieldConfig` et `CheckboxFieldConfig` avec :
- `branchingEnabled?: boolean` — Toggle de l'embranchement
- `branching?: Record<string, string[]>` — Mapping `optionValue → fieldId[]` (tableau car multi-select)
- `branchingColors?: Record<string, string>` — Mapping `optionValue → couleur hex`

---

## Étape 2 : Utilitaires branching (nouveau fichier `src/lib/utils/branching.ts`)

Fonctions centralisées :
- `generateBranchingColor(existingColors: string[]): string` — Génère une couleur hex aléatoire unique
- `getChildFieldIds(parentId: string, schema: FieldConfig[]): string[]` — Retourne les IDs de tous les enfants directs
- `getAllDescendantIds(parentId: string, schema: FieldConfig[]): string[]` — Récursif (pour imbrication)
- `getFieldGroupIndices(fieldId: string, schema: FieldConfig[]): number[]` — Indices du parent + tous ses descendants dans le schema
- `isChildFieldVisible(field: FieldConfig, values: Record<string, unknown>, schema: FieldConfig[]): boolean` — Vérifie si un champ enfant doit être affiché selon la valeur du parent (radio: `value === parentOptionValue`, checkbox: `values.includes(parentOptionValue)`)
- `regroupChildrenAfterReorder(schema: FieldConfig[]): FieldConfig[]` — Après un drag-and-drop, replace les enfants juste après leur parent
- `createDefaultFieldConfig(type: FieldType, generateName: fn): FieldConfig` — Extraire la logique de `FormBuilder.handleAddField` dans un utilitaire réutilisable

---

## Étape 3 : Store multi-ouverture (`src/stores/formsStore.ts`)

**Problème** : `activeFieldName: string | null` ne supporte qu'UNE carte ouverte. Il faut que parent + enfants soient tous ouverts simultanément.

**Changement** :
- Remplacer `activeFieldName: string | null` par `activeFieldNames: string[]`
- Ajouter `primaryActiveFieldName: string | null` — le champ sur lequel l'utilisateur a cliqué (utilisé pour les boutons d'insertion)
- `setActiveFieldName(name: string | null, schema?: FieldConfig[])` — Calcule la liste : le champ cliqué + tous ses enfants (via `getChildFieldIds`) + son parent si c'est un enfant. Fermer le parent ferme tous les enfants.

**Impact sur FormBuilder** :
- `const isActive = activeFieldNames.includes(fieldConfig.name)` au lieu de `=== activeFieldName`
- `const isPrimary = primaryActiveFieldName === fieldConfig.name` (pour les boutons d'insertion)

---

## Étape 4 : Footer conditionnel (`src/lib/field-configurator/common/Footer.tsx`)

Ajouter à `FooterProps` :
- `showBranchingButton?: boolean` — Afficher ou non le bouton branch
- `onBranching?: () => void` — Handler du clic sur branch
- `branchingEnabled?: boolean` — État actif (pour style visuel du bouton)

**Changements** :
- Conditionner le rendu du bouton branch (lignes 108-116) : ne le rendre que si `showBranchingButton` est true
- Remplacer `onClick={onMoveDown}` par `onClick={onBranching}`
- Ajouter un style visuel quand `branchingEnabled` est true (ex: variant "primary" au lieu de "transparent")

---

## Étape 5 : FieldConfigurator wiring (`src/lib/field-configurator/index.tsx`)

**Changements** :
- Ajouter `FieldConfiguratorProps.onBranching?: () => void` ou le dériver du type de champ
- Déterminer si le champ supporte l'embranchement : `const supportsBranching = config.type === 'radio' || config.type === 'checkbox'`
- Passer au Footer : `showBranchingButton={supportsBranching}`, `onBranching={handleToggleBranching}`, `branchingEnabled`
- `handleToggleBranching` : toggle `config.branchingEnabled` via `handleChange`
- Quand `handleFieldTypeChange` est appelé et que l'ancien type avait du branching, les enfants doivent être nettoyés → communiquer via `onBranchingCleanup` prop depuis FormBuilder

Ajouter à `FieldConfiguratorProps` :
- `onBranchingCleanup?: () => void` — Appelé quand le type change et qu'il faut nettoyer les enfants

---

## Étape 6 : Composant BranchingSelect (nouveau fichier `src/lib/field-configurator/common/BranchingSelect.tsx`)

Composant réutilisable pour le sélecteur d'embranchement par option :

**Props** :
- `optionValue: string`
- `linkedFieldIds: string[]` — IDs des champs enfants liés à cette option
- `schema: FieldConfig[]` — Pour résoudre les types des champs liés
- `branchingColor?: string`
- `onChange: (optionValue: string, newFieldTypes: string[]) => void`

**Rendu** :
- Select de `@rte-ds/react` avec `multiple={true}`
- Options : les 8 types de champs (`typeLabels`) + "Aucun"
- `multipleValue` : dérivé des types des `linkedFieldIds` dans le schema
- `onMultipleChange` : quand "Aucun" est sélectionné → vider la sélection. Sinon, diff pour déterminer ajouts/suppressions
- Style de bordure : `branchingColor` quand des sélections existent (via style inline ou className)
- Label : "Embranchement"

---

## Étape 7 : RadioConfigurator (`src/lib/field-configurator/radio/index.tsx`)

**Changements au `SpecificConfiguratorProps`** : Ajouter `schema?: FieldConfig[]` pour que le configurateur puisse accéder au schema complet (nécessaire pour BranchingSelect).

**Dans le rendu des options** : Quand `config.branchingEnabled`, ajouter un `<BranchingSelect>` entre le TextInput et le bouton add/close dans chaque option row.

**Layout Figma** : `RadioButton | TextInput (réduit) | BranchingSelect | IconButton(add/close)`

**Handlers** :
- `handleBranchingChange(optionValue, fieldTypes)` : met à jour `config.branching[optionValue]` et appelle `onChange`
- `handleRemoveOption` : nettoyer `config.branching[removedOption.value]` et `config.branchingColors[removedOption.value]`

---

## Étape 8 : CheckboxConfigurator (`src/lib/field-configurator/checkbox/index.tsx`)

Mêmes changements que RadioConfigurator (étape 7) avec Checkbox au lieu de RadioButton.

---

## Étape 9 : FormBuilder orchestration (`src/lib/form-creation/FormBuilder.tsx`)

C'est le changement le plus complexe.

### 9a. `handleUpdateField` avec synchronisation des enfants
Quand un champ radio/checkbox est mis à jour et que son `branching` a changé :
- Diff ancien vs nouveau `branching` pour trouver les enfants ajoutés/supprimés
- Pour chaque nouveau fieldId : créer un `FieldConfig` avec la config par défaut du type, `parentFieldId` et `parentOptionValue` renseignés, et l'insérer juste après le parent dans le schema
- Pour chaque fieldId supprimé : retirer le champ du schema (+ ses descendants récursivement)

### 9b. `handleRemoveField` amélioré
- Si le champ supprimé a des enfants (`getAllDescendantIds`), les supprimer aussi
- Si le champ supprimé est un enfant, nettoyer le `branching` du parent

### 9c. `handleDuplicateField` amélioré
- Dupliquer le parent + tous ses descendants
- Générer de nouveaux IDs et remapper les références (`parentFieldId`, `branching`)

### 9d. `handleMoveUp/Down` amélioré
- Déplacer le groupe entier (parent + descendants) comme un bloc

### 9e. `onReorder` amélioré
- Après reorder, appeler `regroupChildrenAfterReorder` pour maintenir l'invariant enfants-après-parent

### 9f. Passer `schema` aux configurateurs
- `SortableFieldCard` et `FieldConfigurator` doivent recevoir le `schema` complet pour le passer aux Radio/CheckboxConfigurator (pour BranchingSelect)

---

## Étape 10 : BranchingTag (nouveau fichier `src/lib/field-configurator/common/BranchingTag.tsx`)

Composant pour le tag coloré au-dessus des cartes enfants.

**Rendu** : Petit badge arrondi avec `backgroundColor: branchingColor`, icône "branch" + numéro (index parmi les frères/sœurs).

**Utilisé dans** : `SortableFieldCard.tsx` — rendu conditionnel quand `fieldConfig.parentFieldId` existe.

---

## Étape 11 : SortableFieldCard (`src/lib/field-configurator/SortableFieldCard.tsx`)

**Changements** :
- Ajouter props : `branchingColor?: string`, `branchingNumber?: number`, `isChildField?: boolean`
- Rendre `<BranchingTag>` au-dessus de la `<Card>` quand `isChildField`
- Optionnel : désactiver le drag pour les cartes enfants (elles bougent avec le parent)

---

## Étape 12 : DynamicForm conditionnel (`src/lib/form-creation/DynamicForm.tsx`)

**Changements** :
- Importer `isChildFieldVisible` depuis `branching.ts`
- Entourer la liste de `<AnimatePresence>` pour animer l'apparition/disparition
- Pour chaque champ avec `parentFieldId` : vérifier `isChildFieldVisible(fieldConfig, values, schema)` avant de rendre
- Quand la valeur d'un parent change et qu'un enfant est masqué, nettoyer sa valeur dans `handleFieldChange`

---

## Étape 13 : FormPreview interactif (`src/components/admin/parametrage-declaratif/FormPreview.tsx`)

**Problème** : La preview passe `readOnly={true}`, ce qui empêche de tester l'embranchement.

**Changements** :
- Ajouter un state local `previewInteractiveValues` pour les valeurs modifiées par l'utilisateur en preview
- Merger avec `previewValues` (defaults du schema)
- Passer `readOnly={false}` et `onChange={setPreviewInteractiveValues}` au DynamicForm
- Reset `previewInteractiveValues` quand le schema change

---

## Étape 14 : Tests E2E (`e2e-tests/admin/branching.spec.ts`)

Tests à créer :
- Bouton embranchement visible uniquement pour radio/checkbox
- Clic embranchement affiche les multi-selects
- Sélectionner un type crée un sous-champ dans le FormBuilder
- Désélectionner supprime le sous-champ
- "Aucun" supprime tous les sous-champs de l'option
- Preview : sélectionner l'option affiche les sous-champs conditionnels
- Supprimer une option nettoie ses enfants

---

## Fichiers à modifier

| Fichier | Nature |
|---------|--------|
| `src/models/FieldTypes.ts` | Étendre types avec branching |
| `src/stores/formsStore.ts` | `activeFieldNames: string[]` + `primaryActiveFieldName` |
| `src/lib/field-configurator/common/Footer.tsx` | Bouton branch conditionnel |
| `src/lib/field-configurator/index.tsx` | Wiring branch props |
| `src/lib/field-configurator/radio/index.tsx` | BranchingSelect par option |
| `src/lib/field-configurator/checkbox/index.tsx` | Idem radio |
| `src/lib/field-configurator/SortableFieldCard.tsx` | BranchingTag + props |
| `src/lib/form-creation/FormBuilder.tsx` | Orchestration enfants, multi-active |
| `src/lib/form-creation/DynamicForm.tsx` | Rendu conditionnel |
| `src/components/admin/parametrage-declaratif/FormPreview.tsx` | Preview interactif |

## Fichiers à créer

| Fichier | Rôle |
|---------|------|
| `src/lib/utils/branching.ts` | Utilitaires branching |
| `src/lib/field-configurator/common/BranchingSelect.tsx` | Multi-select embranchement |
| `src/lib/field-configurator/common/BranchingTag.tsx` | Tag coloré carte enfant |
| `e2e-tests/admin/branching.spec.ts` | Tests E2E |

## Réutiliser l'existant

- `typeLabels` et `typeIcons` de `src/models/FieldTypes.ts` pour les options du sélecteur
- `Select` de `@rte-ds/react` avec `multiple={true}`, `multipleValue`, `onMultipleChange` (pattern déjà utilisé dans `src/lib/dynamic-field/select/index.tsx` et `DefaultValueSelector.tsx`)
- `handleAddField` logique de `FormBuilder.tsx` pour les configs par défaut des types
- `AnimatePresence` et `motion.div` de `motion/react` (déjà utilisés dans FieldConfigurator)

## Vérification

1. `pnpm run dev` — Lancer le serveur
2. Aller sur `/admin/parametrage-declaratif`
3. Ajouter un champ radio → vérifier que le bouton branch est dans le footer
4. Ajouter un champ text → vérifier que le bouton branch est **absent**
5. Cliquer sur le bouton branch du radio → vérifier l'apparition des multi-selects "Embranchement" à côté de chaque option
6. Sélectionner "Date" dans le multi-select de Choix 2 → vérifier qu'une carte Date apparaît en dessous avec un tag coloré
7. Sélectionner aussi "Nombre" → vérifier qu'une 2e carte apparaît
8. Ouvrir la preview → sélectionner "Choix 2" → vérifier que les champs Date et Nombre apparaissent
9. Sélectionner "Choix 1" → vérifier que Date et Nombre disparaissent
10. `pnpm run lint` — Vérifier pas d'erreurs
11. `pnpm test:e2e --project=chromium e2e-tests/admin/branching.spec.ts`
