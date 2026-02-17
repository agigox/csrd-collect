import { API_BASE_URL } from "./config";
import type { Declaration } from "@/models/Declaration";

export async function fetchDeclarations(): Promise<Declaration[]> {
  const response = await fetch(`${API_BASE_URL}/declarations`);

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
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(declaration),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<Declaration>;
}

export async function createDeclaration(
  declaration: Omit<Declaration, "isNew">,
): Promise<Declaration> {
  const response = await fetch(`${API_BASE_URL}/declarations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(declaration),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<Declaration>;
}
