import type { FieldConfig, FieldType, RadioFieldConfig, CheckboxFieldConfig } from "@/models/FieldTypes";

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
 * Calculate the depth of a field (number of parent levels).
 * Returns 0 for root fields, 1 for direct children, 2 for grandchildren, etc.
 */
export function getFieldDepth(
  fieldId: string,
  schema: FieldConfig[],
  visited: Set<string> = new Set(),
): number {
  const field = schema.find((f) => f.id === fieldId);
  if (!field || !field.parentFieldId) return 0;

  // Prevent infinite recursion
  if (visited.has(fieldId)) return 0;
  visited.add(fieldId);

  return 1 + getFieldDepth(field.parentFieldId, schema, visited);
}

/**
 * Calculate the hierarchical identifier for a field (e.g., "1", "1.4", "1.4.3").
 * Root fields are numbered based on their position among other root fields.
 * Child fields append the option index to their parent's identifier.
 */
export function getFieldIdentifier(
  fieldId: string,
  schema: FieldConfig[],
  visited: Set<string> = new Set(),
): string {
  const field = schema.find((f) => f.id === fieldId);
  if (!field) return "";

  // Prevent infinite recursion
  if (visited.has(fieldId)) return "";
  visited.add(fieldId);

  // Root field: calculate position among other root fields
  if (!field.parentFieldId) {
    const rootFields = schema.filter((f) => !f.parentFieldId);
    const position = rootFields.findIndex((f) => f.id === fieldId) + 1;
    return String(position);
  }

  // Child field: get parent identifier and append option index
  const parent = schema.find((f) => f.id === field.parentFieldId);
  if (!parent || (parent.type !== "radio" && parent.type !== "checkbox")) {
    return "";
  }

  const parentIdentifier = getFieldIdentifier(field.parentFieldId, schema, visited);
  if (!parentIdentifier) return "";

  // Find the option index
  const parentConfig = parent as { options?: { value: string }[] };
  const options = parentConfig.options ?? [];
  const optionIndex = options.findIndex((o) => o.value === field.parentOptionValue);

  if (optionIndex === -1) return parentIdentifier;

  return `${parentIdentifier}.${optionIndex + 1}`;
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
 * Detach a child field from its parent, making it (and its own sub-tree) a root field.
 * - Strips parent link props from the field
 * - Cleans the parent's branching map (removes field reference; prunes empty keys)
 * - Repositions the sub-tree right after the parent's last descendant
 */
export function detachChildFromSchema(
  fieldId: string,
  schema: FieldConfig[],
): FieldConfig[] {
  const field = schema.find((f) => f.id === fieldId);
  if (!field || !field.parentFieldId) return schema;

  const parentId = field.parentFieldId;
  const parentOptionValue = field.parentOptionValue;

  // Collect the field + its own descendants (its sub-tree)
  const ownDescendantIds = getAllDescendantIds(fieldId, schema);
  const subTreeIds = new Set([fieldId, ...ownDescendantIds]);

  const newSchema = schema.map((f) => {
    if (f.id === fieldId) {
      // Strip branching child props
      const clone = { ...f };
      delete clone.parentFieldId;
      delete clone.parentOptionValue;
      delete clone.branchingColor;
      return clone;
    }
    return { ...f };
  });

  // Clean the parent's branching map
  const parentIdx = newSchema.findIndex((f) => f.id === parentId);
  if (parentIdx >= 0 && parentOptionValue) {
    const parent = newSchema[parentIdx] as RadioFieldConfig | CheckboxFieldConfig;

    if (parent.branching) {
      const newBranching = { ...parent.branching };
      const optionFields = (newBranching[parentOptionValue] ?? []).filter(
        (id) => id !== fieldId,
      );

      if (optionFields.length === 0) {
        delete newBranching[parentOptionValue];
        const newBranchingColors = { ...(parent.branchingColors ?? {}) };
        delete newBranchingColors[parentOptionValue];

        if (Object.keys(newBranching).length === 0) {
          // No more branching at all — disable it
          const cleanedParent = { ...newSchema[parentIdx] };
          delete (cleanedParent as RadioFieldConfig | CheckboxFieldConfig).branching;
          delete (cleanedParent as RadioFieldConfig | CheckboxFieldConfig).branchingColors;
          delete (cleanedParent as RadioFieldConfig | CheckboxFieldConfig).branchingEnabled;
          newSchema[parentIdx] = cleanedParent;
        } else {
          newSchema[parentIdx] = {
            ...newSchema[parentIdx],
            branching: newBranching,
            branchingColors: newBranchingColors,
          } as FieldConfig;
        }
      } else {
        newBranching[parentOptionValue] = optionFields;
        newSchema[parentIdx] = {
          ...newSchema[parentIdx],
          branching: newBranching,
        } as FieldConfig;
      }
    }
  }

  // Reposition the sub-tree right after the parent's last descendant
  const parentDescendantIds = getAllDescendantIds(parentId, newSchema);
  const parentGroupIds = new Set([parentId, ...parentDescendantIds]);

  // Extract sub-tree fields and remaining fields
  const subTreeFields = newSchema.filter((f) => subTreeIds.has(f.id));
  const withoutSubTree = newSchema.filter((f) => !subTreeIds.has(f.id));

  // Find insertion point: after the last field that belongs to the parent group
  let insertAfterIdx = -1;
  for (let i = 0; i < withoutSubTree.length; i++) {
    if (parentGroupIds.has(withoutSubTree[i].id)) {
      insertAfterIdx = i;
    }
  }

  // Insert sub-tree after the parent group
  const result = [...withoutSubTree];
  result.splice(insertAfterIdx + 1, 0, ...subTreeFields);
  return result;
}

/**
 * Detach a parent field from all its direct children.
 * - Removes branchingEnabled, branching, branchingColors from parent
 * - Strips parentFieldId, parentOptionValue, branchingColor from direct children only
 * - Grandchildren keep their links to their own direct parents (sub-trees stay intact)
 * - Schema order is preserved
 */
export function detachParentFromSchema(
  fieldId: string,
  schema: FieldConfig[],
): FieldConfig[] {
  const field = schema.find((f) => f.id === fieldId);
  if (!field) return schema;

  // Find direct children
  const directChildIds = new Set(getChildFieldIds(fieldId, schema));
  if (directChildIds.size === 0) return schema;

  return schema.map((f) => {
    if (f.id === fieldId) {
      // Remove branching props from parent
      const clone = { ...f } as RadioFieldConfig | CheckboxFieldConfig;
      delete clone.branchingEnabled;
      delete clone.branching;
      delete clone.branchingColors;
      return clone as FieldConfig;
    }
    if (directChildIds.has(f.id)) {
      // Strip parent link from direct children only
      const clone = { ...f };
      delete clone.parentFieldId;
      delete clone.parentOptionValue;
      delete clone.branchingColor;
      return clone;
    }
    return f;
  });
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
