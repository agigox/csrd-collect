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

const defaultTeams: MockTeam[] = [
  { id: "team-1", name: "Equipe Maintenance Nord" },
  { id: "team-2", name: "Equipe Exploitation Sud" },
  { id: "team-3", name: "Equipe Support Technique" },
];

const defaultAdmins: MockAdmin[] = [
  { id: "admin-1", name: "Marie Dupont", role: "superAdmin" },
  { id: "admin-2", name: "Jean Martin", role: "admin", isCreator: true },
  { id: "admin-3", name: "Sophie Bernard", role: "admin" },
];

export function getMockTeams(_formId: string): MockTeam[] {
  return defaultTeams;
}

export function getMockAdmins(_formId: string): MockAdmin[] {
  return defaultAdmins;
}
