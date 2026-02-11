import type { FieldConfig, FieldType } from "@/models/FieldTypes";

/**
 * Generate a unique branching color (pastel hex) that doesn't conflict with existing ones.
 */
export function generateBranchingColor(existingColors: string[]): string {
  const palette = [
    "#7C3AED", "#2563EB", "#059669", "#D97706", "#DC2626",
    "#DB2777", "#7C2D12", "#0891B2", "#4F46E5", "#65A30D",
  ];
  for (const color of palette) {
    if (!existingColors.includes(color)) return color;
  }
  // Fallback: random hex
  let color: string;
  do {
    color = `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`;
  } while (existingColors.includes(color));
  return color;
}

/**
 * Get direct child field IDs for a given parent field.
 */
export function getChildFieldIds(parentId: string, schema: FieldConfig[]): string[] {
  return schema
    .filter((f) => f.parentFieldId === parentId)
    .map((f) => f.id);
}

/**
 * Get all descendant IDs recursively (children, grandchildren, etc.).
 * Uses a visited set to prevent infinite recursion from circular references.
 */
export function getAllDescendantIds(
  parentId: string,
  schema: FieldConfig[],
  visited: Set<string> = new Set(),
): string[] {
  if (visited.has(parentId)) return [];
  visited.add(parentId);

  const children = getChildFieldIds(parentId, schema);
  const descendants: string[] = [...children];
  for (const childId of children) {
    descendants.push(...getAllDescendantIds(childId, schema, visited));
  }
  return descendants;
}

/**
 * Get the indices in the schema of a field + all its descendants.
 */
export function getFieldGroupIndices(fieldId: string, schema: FieldConfig[]): number[] {
  const descendantIds = getAllDescendantIds(fieldId, schema);
  const allIds = new Set([fieldId, ...descendantIds]);
  return schema
    .map((f, i) => (allIds.has(f.id) ? i : -1))
    .filter((i) => i >= 0);
}

/**
 * Check if a child field should be visible based on the parent's current value.
 */
export function isChildFieldVisible(
  field: FieldConfig,
  values: Record<string, unknown>,
  schema: FieldConfig[],
): boolean {
  if (!field.parentFieldId || !field.parentOptionValue) return true;

  const parent = schema.find((f) => f.id === field.parentFieldId);
  if (!parent) return false;

  const parentValue = values[parent.name];

  if (parent.type === "radio") {
    return parentValue === field.parentOptionValue;
  }

  if (parent.type === "checkbox") {
    return Array.isArray(parentValue) && parentValue.includes(field.parentOptionValue);
  }

  return false;
}

/**
 * After a drag-and-drop reorder, regroup children right after their parent.
 */
export function regroupChildrenAfterReorder(schema: FieldConfig[]): FieldConfig[] {
  // Separate root fields (no parent) from children
  const roots = schema.filter((f) => !f.parentFieldId);
  const childrenByParent = new Map<string, FieldConfig[]>();

  for (const field of schema) {
    if (field.parentFieldId) {
      const siblings = childrenByParent.get(field.parentFieldId) ?? [];
      siblings.push(field);
      childrenByParent.set(field.parentFieldId, siblings);
    }
  }

  // Rebuild: for each root, insert it then its children
  const result: FieldConfig[] = [];
  for (const root of roots) {
    result.push(root);
    const children = childrenByParent.get(root.id) ?? [];
    result.push(...children);
  }

  return result;
}

/**
 * Create a default field config for the given type.
 * Extracted from FormBuilder.handleAddField to be reusable for branching child creation.
 */
export function createDefaultFieldConfig(
  type: FieldType,
  generateName: (type: FieldType) => string,
): FieldConfig {
  const fieldName = generateName(type);

  switch (type) {
    case "select":
      return {
        id: fieldName,
        name: fieldName,
        type: "select",
        label: "Liste déroulante",
        options: [],
        selectionMode: "single",
      };
    case "number":
      return {
        id: fieldName,
        name: fieldName,
        type: "number",
        label: "Nombre",
        placeholder: "",
      };
    case "switch":
      return {
        id: fieldName,
        name: fieldName,
        type: "switch",
        label: "Switch",
      };
    case "radio":
      return {
        id: fieldName,
        name: fieldName,
        type: "radio",
        label: "Choix unique",
        options: [
          { value: "option_1", label: "Choix 1" },
          { value: "option_2", label: "Choix 2" },
          { value: "option_3", label: "Choix 3" },
        ],
      };
    case "checkbox":
      return {
        id: fieldName,
        name: fieldName,
        type: "checkbox",
        label: "Choix multiple",
        options: [
          { value: "option_1", label: "Choix 1" },
          { value: "option_2", label: "Choix 2" },
          { value: "option_3", label: "Choix 3" },
        ],
      };
    case "date":
      return {
        id: fieldName,
        name: fieldName,
        type: "date",
        label: "Heure et Date",
        includeTime: false,
        defaultDateValue: "none",
      };
    case "import":
      return {
        id: fieldName,
        name: fieldName,
        type: "import",
        label: "Import de fichier",
        acceptedFormats: [],
      };
    case "text":
    default:
      return {
        id: fieldName,
        name: fieldName,
        type: "text",
        label: "Champ libre",
        placeholder: "",
      };
  }
}
