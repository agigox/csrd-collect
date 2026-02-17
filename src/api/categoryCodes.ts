import { API_BASE_URL } from "./config";
import type { CategoryCode } from "@/models/CategoryCode";

export async function fetchCategoryCodes(): Promise<CategoryCode[]> {
  const response = await fetch(`${API_BASE_URL}/category-codes`);

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<CategoryCode[]>;
}
