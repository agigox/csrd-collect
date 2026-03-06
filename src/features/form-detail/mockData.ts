import type { UserRole } from "@/models/User";

export interface MockTeam {
  id: string;
  name: string;
}

export interface MockAdmin {
  id: string;
  name: string;
  role: UserRole;
  isCreator?: boolean;
}

const formTeamsMap = new Map<string, MockTeam[]>();

const defaultAdmins: MockAdmin[] = [
  { id: "admin-1", name: "Marie Dupont", role: "superAdmin" },
  { id: "admin-2", name: "Jean Martin", role: "admin", isCreator: true },
  { id: "admin-3", name: "Sophie Bernard", role: "admin" },
];

export function getMockTeams(formId: string): MockTeam[] {
  return formTeamsMap.get(formId) ?? [];
}

export function setMockTeams(formId: string, teams: MockTeam[]): void {
  formTeamsMap.set(formId, teams);
}

export function getMockAdmins(_formId: string): MockAdmin[] {
  return defaultAdmins;
}
