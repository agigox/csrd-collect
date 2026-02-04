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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateFormTemplateInput = Omit<
  FormTemplate,
  "id" | "version" | "isPublished" | "publishedAt" | "parentTemplateId" | "isActive" | "createdAt" | "updatedAt"
>;
