import { API_BASE_URL } from "./config";

export async function fetchOptions<T>(): Promise<T> {
  const response = await fetch(`http://localhost:4000/options`);

  if (!response.ok) {
    throw new Error(`Erreur serveur lors du chargement des sources de données`);
  }

  return response.json() as Promise<T>;
}
