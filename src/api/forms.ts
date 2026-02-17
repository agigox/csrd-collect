import { API_BASE_URL, REAL_API_URL } from "./config";
import type { FormTemplate } from "@/models/FormTemplate";
import type { FieldConfig } from "@/models/FieldTypes";

export async function fetchFormTemplates(): Promise<FormTemplate[]> {
  const response = await fetch(`${REAL_API_URL}/form-templates`);

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<FormTemplate[]>;
}

export async function saveFormTemplate(
  form: FormTemplate,
): Promise<FormTemplate> {
  const response = await fetch(`${API_BASE_URL}/form-templates/${form.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: form.name,
      description: form.description,
      categoryCode: form.categoryCode,
      schema: form.schema,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<FormTemplate>;
}

export async function createFormTemplate(formData: {
  name: string;
  description: string;
  categoryCode: string;
  schema: { fields: FieldConfig[] };
}): Promise<FormTemplate> {
  const nameSlug = formData.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const generatedCode = `${formData.categoryCode}_${nameSlug}_${uniqueSuffix}`;

  const response = await fetch(`${REAL_API_URL}/form-templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: generatedCode,
      name: formData.name,
      categoryCode: formData.categoryCode,
      schema: formData.schema,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<FormTemplate>;
}

export async function deleteFormTemplate(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/form-templates/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
}
