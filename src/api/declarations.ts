import { API_BASE_URL } from "./config";
import { authHeaders } from "./authHeaders";
import type { Declaration } from "@/models/Declaration";

export async function fetchDeclarations(): Promise<Declaration[]> {
  const response = await fetch(`${API_BASE_URL}/declarations`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<Declaration[]>;
}

export async function updateDeclaration(
  id: string,
  declaration: Declaration,
): Promise<Declaration> {
  const response = await fetch(`${API_BASE_URL}/declarations/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({
      formData: declaration.formData,
      location: declaration.location,
      // TODO: send completionStatus once backend supports it
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<Declaration>;
}

export async function submitDeclaration(
  id: string,
  submitterId: string,
): Promise<Declaration> {
  const response = await fetch(`${API_BASE_URL}/declarations/${id}/submit`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ submitterId }),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<Declaration>;
}

export async function createDeclaration(
  declaration: Omit<Declaration, "isNew">,
): Promise<Declaration> {
  const payload: Record<string, unknown> = {
    formTemplateId: declaration.formTemplateId,
    formData: declaration.formData,
    location: declaration.location,
    // TODO: send completionStatus once backend supports it
  };

  if (declaration.teamId) {
    payload.teamId = declaration.teamId;
  }

  const response = await fetch(`${API_BASE_URL}/declarations`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<Declaration>;
}
