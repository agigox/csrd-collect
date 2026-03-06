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

// this function allow us to get the list of teams for a given form
// TODO: in this mock implementation we return a default list for any form, but in a real implementation we would fetch the teams from the backend based on the formId
export function getMockTeams(formId: string): MockTeam[] {
  return (
    formTeamsMap.get(formId) ?? [
      { id: "team-1", name: "Équipe par défaut" },
      { id: "team-2", name: "Équipe de test" },
      { id: "team-3", name: "Équipe supplémentaire" },
    ]
  );
}

export function setMockTeams(formId: string, teams: MockTeam[]): void {
  formTeamsMap.set(formId, teams);
}
// this function allow us to get the list of admins for a given form
// TODO: in this mock implementation we return the same list for any form, but in a real implementation we would fetch the admins from the backend based on the formId
export function getMockAdmins(_formId: string): MockAdmin[] {
  return defaultAdmins;
}
