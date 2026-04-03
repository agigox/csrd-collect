import { API_BASE_URL } from "./config";
import { authHeaders } from "./authHeaders";
import type { FormTemplate } from "@/models/FormTemplate";
import type { FieldConfig } from "@/models/FieldTypes";

export async function fetchFormTemplates(): Promise<FormTemplate[]> {
  const response = await fetch(`${API_BASE_URL}/form-templates`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<FormTemplate[]>;
}

export async function saveFormTemplate(
  form: FormTemplate,
): Promise<FormTemplate> {
  const response = await fetch(`${API_BASE_URL}/form-templates/${form.id}?force=true`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({
      name: form.name,
      description: form.description || undefined,
      categoryCode: form.categoryCode || undefined,
      visibilityLevel: form.visibilityLevel || undefined,
      isActive: form.isActive,
      schema: form.schema,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body?.errors?.join(", ") || body?.message || `Erreur HTTP: ${response.status}`;
    throw new Error(detail);
  }

  return response.json() as Promise<FormTemplate>;
}

export async function createFormTemplate(formData: {
  name: string;
  description: string;
  categoryCode: string;
  visibilityLevel?: string;
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

  const response = await fetch(`${API_BASE_URL}/form-templates`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      code: generatedCode,
      name: formData.name,
      description: formData.description,
      categoryCode: formData.categoryCode,
      visibilityLevel: formData.visibilityLevel || undefined,
      schema: formData.schema,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body?.errors?.join(", ") || body?.message || `Erreur HTTP: ${response.status}`;
    throw new Error(detail);
  }

  return response.json() as Promise<FormTemplate>;
}

export async function publishFormTemplate(id: string): Promise<FormTemplate> {
  const response = await fetch(`${API_BASE_URL}/form-templates/${id}/publish`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<FormTemplate>;
}

export async function unpublishFormTemplate(id: string): Promise<FormTemplate> {
  const response = await fetch(`${API_BASE_URL}/form-templates/${id}/unpublish`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<FormTemplate>;
}

export async function deleteFormTemplate(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/form-templates/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
}

// Form template team assignments

export async function fetchTemplateTeams(
  templateId: string,
): Promise<Array<{ id: string; name: string; code: string }>> {
  const response = await fetch(
    `${API_BASE_URL}/form-template-assignments/by-template/${templateId}`,
    { headers: authHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json();
}

export async function assignTeamsToTemplate(
  templateId: string,
  teamIds: string[],
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/form-template-assignments/by-template/${templateId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ teamIds }),
    },
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
}

export async function removeTeamFromTemplate(
  templateId: string,
  teamId: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/form-template-assignments/by-template/${templateId}/teams/${teamId}`,
    { method: "DELETE", headers: authHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
}

export async function assignTemplatesToTeam(
  teamId: string,
  templateIds: string[],
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/form-template-assignments/by-team/${teamId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ templateIds }),
    },
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
}

export async function removeTemplateFromTeam(
  teamId: string,
  templateId: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/form-template-assignments/by-team/${teamId}/templates/${templateId}`,
    { method: "DELETE", headers: authHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
}
