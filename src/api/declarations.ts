import { API_BASE_URL } from "./config";
import type { Declaration } from "@/models/Declaration";

// TODO: switch back to REAL_API_URL once backend fixes 401 on /declarations
const BASE = API_BASE_URL;

export async function fetchDeclarations(): Promise<Declaration[]> {
  const response = await fetch(`${BASE}/declarations`);

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<Declaration[]>;
}

export async function updateDeclaration(
  id: string,
  declaration: Declaration,
): Promise<Declaration> {
  const response = await fetch(`${BASE}/declarations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      formData: declaration.formData,
      location: declaration.location,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<Declaration>;
}

export async function createDeclaration(
  declaration: Omit<Declaration, "isNew">,
): Promise<Declaration> {
  console.log(declaration);
  // Only send fields accepted by CreateDeclarationDto
  // TODO: add "name" once backend deploys the schema migration
  const payload: Record<string, unknown> = {
    formTemplateId: declaration.formTemplateId,
    formData: declaration.formData,
    authorId: declaration.authorId,
    location: declaration.location,
    authorName: declaration.authorName,
  };

  // teamId must be a valid UUID or omitted entirely
  if (declaration.teamId) {
    payload.teamId = declaration.teamId;
  }

  const response = await fetch(`${BASE}/declarations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<Declaration>;
}
