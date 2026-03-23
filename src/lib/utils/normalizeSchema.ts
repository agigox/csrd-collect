import type { FieldConfig, SelectOption } from "@/models/FieldTypes";

interface RawField {
  id?: string;
  name: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[] | SelectOption[];
  defaultValue?: unknown;
  placeholder?: string;
  description?: string;
  unit?: string;
  includeTime?: boolean;
  defaultDateValue?: string;
  noFutureDates?: boolean;
  selectionMode?: string;
  branchingInfo?: unknown;
  branchingEnabled?: boolean;
  branching?: unknown;
  branchingColors?: unknown;
  defaultIndex?: number;
  defaultIndices?: number[];
  [key: string]: unknown;
}

interface RawSchema {
  fields?: RawField[];
  sections?: Array<{ title?: string; fields: RawField[] }>;
}

function normalizeOptions(
  options?: string[] | SelectOption[],
): SelectOption[] | undefined {
  if (!options || options.length === 0) return undefined;
  if (typeof options[0] === "string") {
    return (options as string[]).map((opt) => ({ value: opt, label: opt }));
  }
  return options as SelectOption[];
}

function normalizeField(raw: RawField): FieldConfig {
  const base = {
    id: raw.id || raw.name,
    name: raw.name,
    type: raw.type as FieldConfig["type"],
    label: raw.label,
    required: raw.required,
    placeholder: raw.placeholder,
    description: raw.description,
    defaultValue: raw.defaultValue as FieldConfig["defaultValue"],
    branchingInfo: raw.branchingInfo as FieldConfig["branchingInfo"],
  };

  if (raw.type === "select" || raw.type === "dropdown") {
    return {
      ...base,
      type: raw.type as "select" | "dropdown",
      options: normalizeOptions(raw.options) ?? [],
      selectionMode: raw.selectionMode as "single" | "multiple" | undefined,
      defaultIndex: raw.defaultIndex,
      defaultIndices: raw.defaultIndices,
    } as FieldConfig;
  }

  if (raw.type === "radio") {
    return {
      ...base,
      type: "radio",
      options: normalizeOptions(raw.options) ?? [],
      defaultIndex: raw.defaultIndex,
      branchingEnabled: raw.branchingEnabled,
      branching: raw.branching as Record<string, string[]> | undefined,
      branchingColors: raw.branchingColors as
        | Record<string, string>
        | undefined,
    } as FieldConfig;
  }

  if (raw.type === "checkbox") {
    // Handle legacy boolean checkbox (convert to switch)
    if (!raw.options) {
      return {
        ...base,
        type: "switch",
      } as FieldConfig;
    }
    return {
      ...base,
      type: "checkbox",
      options: normalizeOptions(raw.options) ?? [],
      defaultIndices: raw.defaultIndices,
      branchingEnabled: raw.branchingEnabled,
      branching: raw.branching as Record<string, string[]> | undefined,
      branchingColors: raw.branchingColors as
        | Record<string, string>
        | undefined,
    } as FieldConfig;
  }

  if (raw.type === "number") {
    return {
      ...base,
      type: "number",
      unit: raw.unit,
    } as FieldConfig;
  }

  if (raw.type === "date") {
    return {
      ...base,
      type: "date",
      includeTime: raw.includeTime,
      defaultDateValue: raw.defaultDateValue as "none" | "today" | undefined,
      noFutureDates: raw.noFutureDates,
    } as FieldConfig;
  }

  // text, textarea, import, switch - pass through with base
  return base as FieldConfig;
}

/**
 * Normalizes a form template schema from either format:
 * - { fields: [...] } (frontend-created)
 * - { sections: [{ title, fields: [...] }] } (backend-seeded)
 * Into the flat { fields: FieldConfig[] } format expected by DynamicForm.
 */
export function normalizeSchema(schema: RawSchema): { fields: FieldConfig[] } {
  let rawFields: RawField[];

  if (schema.fields && Array.isArray(schema.fields)) {
    rawFields = schema.fields;
  } else if (schema.sections && Array.isArray(schema.sections)) {
    rawFields = schema.sections.flatMap((section) => section.fields || []);
  } else {
    rawFields = [];
  }

  return { fields: rawFields.map(normalizeField) };
}
