import type { FieldConfig } from "@/models/FieldTypes";

export interface FormTemplateSchema {
  fields: FieldConfig[];
}

export interface FormTemplate {
  id: string;
  code: string;
  name: string;
  description: string | null;
  categoryCode: string;
  schema: FormTemplateSchema;
  version: number;
  isPublished: boolean;
  publishedAt: string | null;
  parentTemplateId: string | null;
  visibilityLevel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
