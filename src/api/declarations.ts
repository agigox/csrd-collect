import { REAL_API_URL } from "./config";
import type { Declaration } from "@/models/Declaration";

export async function fetchDeclarations(): Promise<Declaration[]> {
  const response = await fetch(`${REAL_API_URL}/declarations`);

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
  const response = await fetch(`${REAL_API_URL}/declarations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(declaration),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<Declaration>;
}
