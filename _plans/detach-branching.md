# Plan: Detach Branching

## Context

The branching system (radio/checkbox) links child fields conditionally to a parent field's options. The `Footer.tsx` already has a commented-out `onDetach` button (`{/* TODO: Detach button */}`) with `onClick={onDetach}` but neither the prop nor the logic exists. This feature makes the button functional: it lets an admin "break" a parent-child link in two modes — detach a child (it becomes a root field), or detach a parent (it loses its branching, children become root fields).

## Critical Files

- `src/lib/utils/branching.ts` — Add pure schema mutation functions
- `src/features/field-configurator/common/Footer.tsx` — Wire button + confirmation dialog
- `src/features/field-configurator/index.tsx` — Compute show/hide + pass context to Footer
- `src/features/field-configurator/SortableFieldCard.tsx` — Thread `onDetach` prop
- `src/features/form-builder/FormBuilder.tsx` — Add `handleDetachField()` handler

## Implementation Steps

### 1. Add pure detach utilities to `branching.ts`

Add two new exported functions after the existing utilities:

**`detachChildFromSchema(fieldId, schema)`**
- Collect the field's own sub-tree: the field + all its descendants via `getAllDescendantIds()`
- Strip branching child props from the field: delete `parentFieldId`, `parentOptionValue`, `branchingColor`
- Clean the parent's `branching[parentOptionValue]` map: remove the fieldId; if empty, delete the key; if the entire `branching` object becomes empty, also delete `branchingEnabled`, `branching`, `branchingColors` from parent
- Reposition the sub-tree (field + its own descendants) to immediately after the **last descendant of the parent** in the schema
- Return the new schema

**`detachParentFromSchema(fieldId, schema)`**
- Find all **direct children** (fields with `parentFieldId === fieldId`)
- Remove `branchingEnabled`, `branching`, `branchingColors` from parent
- For each direct child: delete `parentFieldId`, `parentOptionValue`, `branchingColor`
- Grandchildren and deeper keep their links to their own direct parents (sub-trees stay intact)
- Schema order is preserved (no repositioning)
- Return the new schema

Reuse existing utilities: `getAllDescendantIds()`, `getChildFieldIds()`.

### 2. Update `Footer.tsx`

**Props to add to `FooterProps`:**
```
onDetach?: () => void
showDetachButton?: boolean
isDetachingParent?: boolean  // true = detach parent dialog, false = detach child dialog
detachParentLabel?: string   // label of the parent (for child dialog)
detachChildCount?: number    // number of direct children (for parent dialog)
```

**Changes:**
- Add `showDetachConfirm` local state (like `showDeleteConfirm`)
- Uncomment the detach `IconButton`; wrap it with `showDetachButton &&`
- Change `onClick` to `() => setShowDetachConfirm(true)` (not call `onDetach` directly)
- Add a `<Dialog>` for detach confirmation:
  - Title: "Détacher ce champ ?" (child) or "Détacher ce champ de ses enfants ?" (parent)
  - Description:
    - Child: `"Ce champ deviendra indépendant et ne sera plus conditionné par «${detachParentLabel}»."`
    - Parent: `"Ce champ sera détaché de ses ${detachChildCount} sous-champ(s). Les sous-champs deviendront indépendants."`
  - Buttons: "Annuler" and "Confirmer" (calls `onDetach()` then closes dialog)

### 3. Update `FieldConfigurator/index.tsx`

**Compute detach visibility and context** inside the component:

```
hasChildren = schema exists && schema.some(f => f.parentFieldId === config.id)
isChildField = !!config.parentFieldId
showDetachButton = isChildField || (branchingEnabled && hasChildren)
isDetachingParent = !isChildField (i.e. it's a parent being detached)
detachParentLabel = isChildField ? schema.find(f => f.id === config.parentFieldId)?.label : undefined
detachChildCount = isDetachingParent ? schema.filter(f => f.parentFieldId === config.id).length : undefined
```

**Add `onDetach` to `FieldConfiguratorProps`** (pass-through from FormBuilder).

**Pass new props to Footer:**
```
showDetachButton={showDetachButton}
onDetach={onDetach}
isDetachingParent={isDetachingParent}
detachParentLabel={detachParentLabel}
detachChildCount={detachChildCount}
```

### 4. Update `SortableFieldCard.tsx`

- Add `onDetach?: () => void` to `SortableFieldCardProps`
- Pass it through to `<FieldConfigurator onDetach={onDetach} />`

### 5. Update `FormBuilder.tsx`

**Add `handleDetachField(fieldId: string)`:**

```
const handleDetachField = (fieldId: string) => {
  const field = schema.find(f => f.id === fieldId)
  const isChild = !!field?.parentFieldId

  let newSchema
  if (isChild) {
    newSchema = detachChildFromSchema(fieldId, schema)
    // Open the detached field; since it's now root, setActiveFieldName opens it alone
    setActiveFieldName(field.name, newSchema)
  } else {
    newSchema = detachParentFromSchema(fieldId, schema)
    // Open the parent alone (children are now roots, no longer grouped)
    setActiveFieldName(field.name, newSchema)
  }
  onChange(newSchema)
}
```

**Wire through to each SortableFieldCard:**
```
onDetach={() => handleDetachField(fieldConfig.id)}
```

## Active Field State After Detach

- **Detach child**: `setActiveFieldName(detachedField.name, newSchema)` — opens the detached field alone (no parent link, opens its own sub-tree if it has one).
- **Detach parent**: `setActiveFieldName(parentField.name, newSchema)` — opens the parent alone. Children are now roots, so they are no longer included in the group automatically.

`fieldIdentifier` and `depth` are recomputed automatically per render from schema via `getFieldIdentifier()` / `getFieldDepth()` — no manual update needed.

## Reused Existing Utilities

- `getAllDescendantIds(parentId, schema)` — `branching.ts:35` — collect sub-trees
- `getChildFieldIds(parentId, schema)` — `branching.ts:25` — find direct children
- `getFieldGroupIndices(fieldId, schema)` — `branching.ts:54` — find group positions for repositioning

## Prop Threading Chain

```
FormBuilder
  handleDetachField(fieldId) → onDetach={() => handleDetachField(id)}
    ↓
  SortableFieldCard [onDetach]
    ↓
  FieldConfigurator [onDetach, showDetachButton, isDetachingParent, detachParentLabel, detachChildCount]
    ↓
  Footer [onDetach, showDetachButton, isDetachingParent, detachParentLabel, detachChildCount]
    → confirmation dialog → onDetach()
```

## Verification

1. Start both servers: `npx json-server db.json --port 4000` and `pnpm run dev`
2. Navigate to `/admin/new`, create a radio field with 2+ options
3. Enable branching → add child fields (e.g. text, number)
4. **Test detach child**: Click Detach on a child → confirm dialog → child becomes root, tag disappears, parent branching map cleaned
5. **Test detach parent**: Click Detach on parent → confirm dialog → parent loses branching UI, children become roots
6. **Test sub-tree detach**: Add branching to a child (nested) → detach that child → its own children move with it
7. **Test detach last child**: Single child per option → detach → parent's `branchingEnabled` becomes false
8. **Verify button absence**: Text, number, select, switch, date, import fields with no branching → no Detach button
9. **Verify button absence**: Radio/checkbox with `branchingEnabled: true` but no actual children → no Detach button
10. Run E2E: `pnpm test:e2e --project=chromium e2e-tests/admin/branching.spec.ts`
