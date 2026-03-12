import { REAL_API_URL } from "./config";
import type { Declaration } from "@/models/Declaration";

// TODO: replace with token from auth store once login is migrated to real API
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MDc2ZTg5Mi1mZDEyLTQwNTgtODBhYS1jZDVmZjg4YTc0MmYiLCJlbWFpbCI6InN1cGVyYWRtaW5AcnRlLWZyYW5jZS5jb20iLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3NzMzMDc3MDYsImV4cCI6MTc3MzMzNjUwNn0.WeMWmIOMCYKyza0PLvt-aqo2zK0U4XhQo_aIpN-uYeM";

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
