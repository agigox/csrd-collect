# Exploration Report: Features V4

## 1. Select Field Configurator

**Path**: `src/lib/form-fields/field-configurator/select/index.tsx`

### Current Implementation
- **CSV Import** (lines 56-87): FileReader API, splits by newlines, parses CSV
- **API Loading** (lines 27-54): Fetches JSON array from URL
- **Data Type Selector** (line 17): Only "Adresse" option currently
- **Default Option**: Radio-button style with checkmark icon (lines 181-206)
- **Options Display**: Editable inputs for each option

### Key Code Patterns
```typescript
const handleCsvImport = (event) => {
  // Reads file, parses lines, creates options
  const newOptions = lines.map(line => ({value, label}));
  onChange({ ...config, options: newOptions, defaultIndex: 0 });
};
```

---

## 2. Number and Unit Field Configurators

**Number**: `src/lib/form-fields/field-configurator/number/index.tsx`
- Placeholder field + Min/Max inputs
- No unit handling

**Unit**: `src/lib/form-fields/field-configurator/unit/index.tsx`
- Unit dropdown with options: L, kg, m, m², m³, t, kWh
- Min/Max inputs (same pattern as number)
- Uses native HTML `<select>`

**Merge Strategy**: Combine unit selector + min/max + placeholder

---

## 3. FieldConfigurator Header

**Path**: `src/lib/form-fields/field-configurator/common/Header.tsx`

### Structure (lines 13-54)
- Type label (left) using `typeLabels` mapping
- Action buttons (right): Duplicate (2 icons!), Delete
- **Bug**: Lines 33 and 37 both call `onDuplicate`

### Missing Features
- No drag handles for reordering
- No confirmation dialog for delete

---

## 4. StatCard Component

**Path**: `src/components/declarations/Dashboard.tsx` (inline, lines 6-55)

```typescript
interface StatCardProps {
  value: number;
  label: string;
  action?: { label: string; onClick: () => void; };
  className?: string;
  loading?: boolean;
}
```

**Usage**: 3 instances in Dashboard showing declarations stats

---

## 5. Date Field

**Path**: `src/lib/form-fields/date/index.tsx`

### Default Value Logic (lines 43-48)
```typescript
useEffect(() => {
  if (config.defaultDateValue === "today" && !value) {
    onChange({ date: new Date().toISOString() });
  }
}, [config.defaultDateValue]);
```

**Issue**: When switching from "today" to "none", the value isn't cleared because the useEffect only sets value, doesn't reset it.

---

## 6. Tooltip Component

**Status**: NOT FOUND in codebase

**Available Alternative**: `Popover` from shadcn/ui (`src/lib/ui/popover.tsx`)

**Need to Add**: Install tooltip via `pnpm dlx shadcn@latest add tooltip`

---

## 7. Declarations List

**Path**: `src/components/declarations/`

### Layout Structure
- 2-column layout: DeclarationsList (left) + Dashboard (right)
- Modal: Right-slide panel with animation
- FormSelectionDialog: Overlay for form selection

### Key Files
- `index.tsx` - Main component
- `declarationsList/index.tsx` - List grouped by date
- `DeclarationCard.tsx` - Card component
- `Dashboard.tsx` - Stats cards

---

## 8. Admin Parametrage-Declaratif

**Path**: `src/app/admin/parametrage-declaratif/page.tsx`

### Layout (lines 121-281)
- Grid: `grid-cols-[calc(100%-348px)_324px]` when preview visible
- Left: Form metadata + FormBuilder
- Right: Preview panel (w-324, toggle-able)

### Store
- `useFormsStore`: currentForm, saveForm, createForm, deleteForm

---

## 9. Import Field

**Status**: INCOMPLETE

- Type exists in enum (types.ts line 3)
- Listed in FormBuilder options (line 35)
- **NOT registered** in registry.ts
- **No configurator** at `field-configurator/import/`
- **No renderer** at `src/lib/form-fields/import/`

---

## 10. File Organization

```
src/lib/form-fields/
├── [field-type]/index.tsx        (Field renderer)
├── field-configurator/
│   ├── [field-type]/index.tsx    (Configuration UI)
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── LabelField.tsx
│   │   ├── DescriptionField.tsx
│   │   └── RequiredToggle.tsx
│   ├── types.ts
│   └── index.tsx
├── types.ts
├── registry.ts
├── DynamicField.tsx
├── DynamicForm.tsx
└── FormBuilder.tsx
```

---

## 11. Summary

| Feature | Files Involved | Complexity |
|---------|---------------|------------|
| Remove CSV Import | select/index.tsx | Low |
| Selection Mode | select/index.tsx, types.ts, select field | Medium |
| Data Sources | db.json, select/index.tsx | Medium |
| Merge Number/Unit | number/, unit/, types.ts, registry | High |
| Header Reordering | Header.tsx, FormBuilder.tsx | High |
| Delete Confirmation | Header.tsx, FieldConfigurator.tsx | Low |
| Duplication Tag | Header.tsx, types.ts, FieldConfigurator | Medium |
| Remove StatCard | Dashboard.tsx, page.tsx | Low |
| Date Bug Fix | date/index.tsx, date field-configurator | Low |
| Tooltip | All field components, need to add component | Medium |
| Declarations Layout | declarations/index.tsx | Low |
| Admin Layout | parametrage-declaratif/page.tsx | Low |
| Import Field | New files: import/, field-configurator/import/ | High |
