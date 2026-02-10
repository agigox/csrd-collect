# Implementation Plan: Features V4

## Overview

Implementation of 9 feature areas for CSRD-COLLECT application:
1. Select field configuration improvements
2. Number/Unit field merge
3. FieldConfigurator header enhancements
4. StatCard removal
5. Date field bug fix
6. Tooltip for field descriptions
7. Declarations list layout
8. Admin parametrage-declaratif layout
9. Import file field implementation

## Dependencies

Order of implementation based on dependencies:
1. **Phase 1** (Independent): Tasks 4, 5, 7, 8 (UI/layout changes)
2. **Phase 2** (Foundation): Task 6 (Tooltip - needed for other features)
3. **Phase 3** (Core): Tasks 1, 2, 3 (Form field system changes)
4. **Phase 4** (New Feature): Task 9 (Import field - builds on existing patterns)

---

## File Changes

### Phase 1: Independent UI Changes

---

### `src/components/declarations/Dashboard.tsx`
**Task 4: Remove StatCard**

- Action: Delete the entire `StatCard` component definition (lines 6-55)
- Action: Remove all StatCard instances from the Dashboard return JSX
- Action: Remove unused imports (Megaphone icon from lucide-react)
- Action: Keep minimal Dashboard structure or remove component entirely if empty
- Consider: Check if stats data from store is used elsewhere

### `src/components/declarations/index.tsx`
**Task 4 & 7: Remove Dashboard + Center declarations list**

- Action: Remove Dashboard import and usage
- Action: Change layout from 2-column grid to single centered column
- Action: Add `max-w-[602px] mx-auto` to DeclarationsList container
- Action: Remove overlay from FormSelectionDialog (check Dialog component styling)
- Action: Keep modal navigation functional without closing

### `src/components/declarations/FormSelectionDialog.tsx`
**Task 7: Remove overlay**

- Action: Modify Dialog styling to remove dark overlay background
- Action: Use transparent or no overlay (`bg-transparent` or remove backdrop)
- Consider: User should see declarations list while dialog is open

### `src/app/admin/parametrage-declaratif/page.tsx`
**Task 8: Admin layout improvements**

- Action: Add `max-w-[602px] mx-auto` to the "Nouveau formulaire" block when preview is closed
- Action: When preview opens, change layout to position form on left (already done with grid)
- Action: Verify both panels are visible simultaneously with current grid implementation
- Consider: Current grid `grid-cols-[calc(100%-348px)_324px]` may need adjustment for centering

### `src/lib/form-fields/date/index.tsx`
**Task 5: Date field bug fix**

- Action: Modify useEffect to handle "none" case properly
- Action: When `config.defaultDateValue === "none"`, explicitly call `onChange(undefined)` or `onChange(null)`
- Action: Add dependency check: Only reset when `defaultDateValue` changes, not on mount
- Pattern:
  ```
  useEffect(() => {
    if (config.defaultDateValue === "today" && !value) {
      onChange({ date: new Date().toISOString() });
    } else if (config.defaultDateValue === "none") {
      onChange(undefined);
    }
  }, [config.defaultDateValue]);
  ```
- Consider: Track previous defaultDateValue to only reset on actual change

---

### Phase 2: Tooltip Foundation

---

### `src/lib/ui/tooltip.tsx`
**Task 6: Add Tooltip component**

- Action: Install shadcn tooltip: `pnpm dlx shadcn@latest add tooltip`
- Action: Verify component is added to `src/lib/ui/tooltip.tsx`
- Action: Export from index if exists

### `src/lib/form-fields/text/index.tsx`
**Task 6: Add tooltip to text field**

- Action: Import Tooltip components from `@/lib/ui/tooltip`
- Action: Wrap label with Tooltip when `config.description` exists
- Action: Remove inline description paragraph
- Pattern:
  ```
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Label>{config.label}{config.required && <span>*</span>}</Label>
      </TooltipTrigger>
      {config.description && (
        <TooltipContent>{config.description}</TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
  ```

### `src/lib/form-fields/number/index.tsx`
**Task 6: Add tooltip to number field**

- Action: Same pattern as text field - wrap label with Tooltip
- Action: Remove inline description display

### `src/lib/form-fields/select/index.tsx`
**Task 6: Add tooltip to select field**

- Action: Same pattern as text field - wrap label with Tooltip
- Action: Remove inline description display

### `src/lib/form-fields/radio/index.tsx`
**Task 6: Add tooltip to radio field**

- Action: Same pattern as text field - wrap label with Tooltip
- Action: Remove inline description display

### `src/lib/form-fields/checkbox/index.tsx`
**Task 6: Add tooltip to checkbox field**

- Action: Same pattern as text field - wrap label with Tooltip
- Action: Remove inline description display

### `src/lib/form-fields/unit/index.tsx`
**Task 6: Add tooltip to unit field**

- Action: Same pattern as text field - wrap label with Tooltip
- Action: Remove inline description display

### `src/lib/form-fields/date/index.tsx`
**Task 6: Add tooltip to date field**

- Action: Same pattern as text field - wrap label with Tooltip
- Action: Remove inline description display

### `src/lib/form-fields/switch/index.tsx`
**Task 6: Add tooltip to switch field**

- Action: Same pattern as text field - wrap label with Tooltip
- Action: Remove inline description display (if exists)

---

### Phase 3: Form Field System Changes

---

### `src/lib/form-fields/field-configurator/select/index.tsx`
**Task 1.1, 1.2, 1.3, 1.4: Select configuration overhaul**

#### 1.1 Remove CSV Import
- Action: Delete `fileInputRef` usage (line 23)
- Action: Delete `handleCsvImport` function (lines 56-87)
- Action: Remove hidden file input element (lines 136-141)
- Action: Remove "Importer un .csv" button (lines 143-150)
- Action: Remove "ou" text separator (line 135)

#### 1.2 Add Selection Mode
- Action: Add state for selection mode: `selectionMode: "single" | "multiple"`
- Action: Add two radio buttons above options: "Choix unique" and "Choix multiple"
- Action: Store selection mode in config: `onChange({ ...config, selectionMode: value })`
- Pattern: Use existing radio button styling from RadioConfigurator

#### 1.3 Restructure Data Sources
- Action: Replace single `dataTypeOptions` array with dynamic loading from store/API
- Action: Create new state for data source categories
- Action: First select "Type de données": Load keys from db.json options object
- Action: Second select "Source de données": Show sub-categories based on selected type
- Action: When source selected, load items into options
- Action: Remove API URL input field
- Consider: May need new store or API endpoint for data sources

#### 1.4 Simplify Options Display
- Action: Hide options list when loaded from external source
- Action: Add checkbox "Définir une valeur par défaut"
- Action: When checked, show select dropdown with loaded options
- Action: When option selected from dropdown, set `defaultIndex`

### `src/lib/form-fields/types.ts`
**Task 1.2, 2: Type updates**

#### For Select (Task 1.2)
- Action: Add `selectionMode?: "single" | "multiple"` to `SelectFieldConfig`
- Action: Remove `dataSourceType` if no longer needed

#### For Number/Unit Merge (Task 2)
- Action: Add `unit?: string` to `NumberFieldConfig`
- Action: Update `unit` to be optional with "none" option
- Action: Keep `UnitFieldConfig` temporarily for backward compatibility

### `src/lib/form-fields/select/index.tsx`
**Task 1.2: Multi-select rendering**

- Action: Check `config.selectionMode` value
- Action: If "single": Current select behavior
- Action: If "multiple": Render checkbox list instead of select
- Action: Store multiple values as array: `onChange(selectedValues)`
- Pattern: Similar to CheckboxField but with dropdown trigger

### `src/lib/form-fields/field-configurator/number/index.tsx`
**Task 2: Merge with Unit**

- Action: Add unit selector dropdown from unit configurator
- Action: Include "Sans unité" as first option (value: "none" or empty)
- Action: When "Sans unité" selected, hide unit-specific UI
- Action: Keep min/max and placeholder fields
- Action: Use shadcn Select component instead of native HTML select
- Pattern: Follow UnitFieldConfig structure

### `src/lib/form-fields/number/index.tsx`
**Task 2: Render with optional unit**

- Action: Check if `config.unit` exists and is not "none"
- Action: If unit exists: Show number input with unit suffix
- Action: If no unit: Show plain number input
- Pattern: Combine NumberField and UnitField rendering logic

### `src/lib/form-fields/registry.ts`
**Task 2: Update registry**

- Action: Remove `unit` field registration
- Action: Update `number` field defaultConfig to include `unit: "none"`

### `src/lib/form-fields/FormBuilder.tsx`
**Task 2: Update field creation**

- Action: Remove "unit" from field type options in popover
- Action: Update number field default to not include unit

### `src/lib/form-fields/field-configurator/index.tsx`
**Task 2: Remove Unit configurator**

- Action: Remove `UnitConfigurator` import
- Action: Remove "unit" case from switch statement

### `src/lib/form-fields/field-configurator/common/Header.tsx`
**Task 3.1, 3.2, 3.3: Header enhancements**

#### 3.1 Reordering (Drag & Drop)
- Action: Add `onMoveUp`, `onMoveDown` props to Header component
- Action: Add arrow up icon (hidden by default, visible on hover)
- Action: Add arrow down icon (hidden by default, visible on hover)
- Action: Add drag handle icon (visible on hover)
- Action: Wrap all in hover state container
- Pattern: Use lucide-react icons: `ChevronUp`, `ChevronDown`, `GripVertical`
- Consider: Actual drag & drop needs dnd-kit library or similar

#### 3.2 Delete Confirmation
- Action: Add `Dialog` import from shadcn
- Action: Create confirmation modal state
- Action: On trash button click, show modal instead of direct delete
- Action: Modal content: "Supprimer ce champ ?" with Annuler/Confirmer buttons
- Action: On confirm, call `onRemove()`

#### 3.3 Duplication Tag
- Action: Add `isCopy?: boolean` to props
- Action: Display "(copie)" badge next to type label when `isCopy` is true
- Action: Use `Chip` component or Badge for styling
- Consider: Tag removal on edit requires tracking in parent

### `src/lib/form-fields/FieldConfigurator.tsx`
**Task 3.1, 3.3: Pass new props**

- Action: Add `onMoveUp`, `onMoveDown` handlers to Header
- Action: Track which fields are copies (add `isCopy` to FieldConfig or track in parent)
- Action: Pass `isCopy` prop to Header

### `src/lib/form-fields/FormBuilder.tsx`
**Task 3.1, 3.3: Implement reordering and copy tracking**

- Action: Add `handleMoveUp(index)` function to swap field with previous
- Action: Add `handleMoveDown(index)` function to swap field with next
- Action: Modify `handleDuplicate` to mark new field as copy
- Action: Track copy state (either in config or separate state)
- Action: On field change, remove copy status

---

### Phase 4: Import Field Implementation

---

### `src/lib/form-fields/types.ts`
**Task 9: Add ImportFieldConfig**

- Action: Add new interface:
  ```typescript
  export interface ImportFieldConfig extends BaseFieldConfig {
    type: "import";
    acceptedTypes?: string[]; // e.g., [".pdf", ".doc", "image/*"]
    maxFileSize?: number; // in bytes
    multiple?: boolean;
  }
  ```
- Action: Add `ImportFieldConfig` to `FieldConfig` union type

### `src/lib/form-fields/import/index.tsx`
**Task 9: Create Import field renderer**

- Action: Create new file
- Action: Implement file drop zone UI
- Action: Handle file selection via input or drag & drop
- Action: Display selected file name(s)
- Action: Show file size validation
- Action: Export `fieldRegistration` following pattern from other fields
- Pattern: Use native file input with custom styling

### `src/lib/form-fields/field-configurator/import/index.tsx`
**Task 9: Create Import configurator**

- Action: Create new file
- Action: Add accepted file types multi-select or checkboxes
- Action: Add max file size input (number with unit selector: KB, MB)
- Action: Add "Autoriser plusieurs fichiers" toggle
- Action: Export `ImportConfigurator` component
- Pattern: Follow existing configurator structure

### `src/lib/form-fields/field-configurator/index.tsx`
**Task 9: Register Import configurator**

- Action: Import `ImportConfigurator`
- Action: Add "import" case to switch statement

### `src/lib/form-fields/registry.ts`
**Task 9: Register Import field**

- Action: Import `fieldRegistration` from `./import`
- Action: Call `registerField(importFieldRegistration)`

---

### Data Structure Changes

---

### `db.json`
**Task 1.3: Add options structure**

- Action: Add new `options` object at root level:
  ```json
  {
    "options": {
      "addresses": {
        "label": "Adresses",
        "data": [
          {
            "label": "Rues",
            "items": [
              { "value": "street1", "label": "Rue 1" },
              { "value": "street2", "label": "Rue 2" }
            ]
          },
          {
            "label": "Codes postaux",
            "items": [
              { "value": "code1", "label": "78210" },
              { "value": "code2", "label": "78211" }
            ]
          }
        ]
      },
      "users": {
        "label": "Utilisateurs",
        "data": [
          {
            "label": "Ids",
            "items": [
              { "value": "id1", "label": "ID 1" },
              { "value": "id2", "label": "ID 2" }
            ]
          },
          {
            "label": "Noms",
            "items": [
              { "value": "nom1", "label": "Nom 1" },
              { "value": "nom2", "label": "Nom 2" }
            ]
          }
        ]
      }
    }
  }
  ```
- Consider: May need API endpoint or store to fetch this data

---

### Documentation

---

### `docs/DATA_SOURCES.md`
**Task 1.3: Document data sources**

- Action: Create new documentation file
- Action: Document the options structure in db.json
- Action: Explain how to add new data types
- Action: Explain how select field loads data
- Action: Include examples

---

### Files to Delete (After Migration)

---

### `src/lib/form-fields/unit/index.tsx`
**Task 2: Remove after merge**

- Action: Delete entire file after number field handles units
- Action: Ensure no imports reference this file

### `src/lib/form-fields/field-configurator/unit/index.tsx`
**Task 2: Remove after merge**

- Action: Delete entire file after NumberConfigurator handles units
- Action: Remove from index.tsx switch statement first

---

## Testing Strategy

### Manual Verification
1. **Select Field**
   - Create select with single selection mode → verify dropdown
   - Create select with multiple selection mode → verify checkboxes
   - Select data type → verify source options change
   - Select source → verify items load in preview
   - Check "valeur par défaut" → verify select appears

2. **Number Field (merged)**
   - Create number with "Sans unité" → verify no unit suffix
   - Create number with unit → verify unit shows in preview
   - Verify min/max validation still works

3. **Header Actions**
   - Click delete → verify confirmation modal appears
   - Confirm delete → verify field removed
   - Click duplicate → verify "(copie)" tag appears
   - Edit duplicated field → verify tag disappears
   - Click up/down arrows → verify field order changes

4. **Date Field**
   - Set "Date du jour" → verify today shows in preview
   - Change to "Aucune" → verify preview clears

5. **Tooltips**
   - Add description to any field
   - Hover label → verify tooltip with description appears

6. **Layout**
   - View declarations list → verify centered, max-width 602px
   - Open new declaration modal → verify no overlay
   - Admin: open preview → verify both panels visible

7. **Import Field**
   - Create import field → verify drop zone appears
   - Configure accepted types → verify filter works
   - Upload file → verify file name shows

---

## Rollout Considerations

### Breaking Changes
- **Unit field removal**: Existing forms with "unit" type will need migration
- **Select multi-mode**: Existing select configs default to "single"

### Migration Steps
1. Before deploying, migrate existing "unit" fields to "number" with unit property
2. Add `selectionMode: "single"` to existing select configs
3. Update db.json with new options structure

### Feature Flags
- Consider: Gradual rollout of multi-select feature
- Consider: Keep old unit field working during transition

---

## Summary

**Total Files to Create**: 4
- `src/lib/ui/tooltip.tsx` (via shadcn)
- `src/lib/form-fields/import/index.tsx`
- `src/lib/form-fields/field-configurator/import/index.tsx`
- `docs/DATA_SOURCES.md`

**Total Files to Modify**: ~20
- All field renderers (tooltip)
- Select configurator (major changes)
- Number configurator (unit merge)
- Header.tsx (actions)
- FormBuilder.tsx (reordering, copy)
- Types (new configs)
- Registry (import field)
- Layout pages (centering)
- Date field (bug fix)

**Total Files to Delete**: 2
- `src/lib/form-fields/unit/index.tsx`
- `src/lib/form-fields/field-configurator/unit/index.tsx`

**Estimated Complexity**: High (multiple interconnected changes)
