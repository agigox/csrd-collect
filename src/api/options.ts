import { API_BASE_URL } from "./config";

export async function fetchOptions<T>(): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/options`);

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
