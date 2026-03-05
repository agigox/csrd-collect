import { REAL_API_URL } from "./config";
import type { Declaration } from "@/models/Declaration";

// TODO: replace with token from auth store once login is migrated to real API
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYWI0ZWU5YS1hMDllLTQ0OTAtYWI1ZC1hODFkMjM2Mzk5NmUiLCJlbWFpbCI6ImFtaW4udGFib3VAcnRlLWZyYW5jZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI3ODc3NTgsImV4cCI6MTc3MjgxNjU1OH0.b546Gsk5JEd7uIH4zB0B-L0j8Ma2mncL-K7qgu-RrRw";

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };
}

export async function fetchDeclarations(): Promise<Declaration[]> {
  const response = await fetch(`${REAL_API_URL}/declarations`, {
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
  const response = await fetch(`${REAL_API_URL}/declarations/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
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

  const response = await fetch(`${REAL_API_URL}/declarations`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<Declaration>;
}
