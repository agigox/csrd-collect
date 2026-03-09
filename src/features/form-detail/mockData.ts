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

const formAdminsMap = new Map<string, MockAdmin[]>();

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
export function getMockAdmins(formId: string): MockAdmin[] {
  return formAdminsMap.get(formId) ?? [...defaultAdmins];
}

export function addMockAdmin(formId: string, admin: MockAdmin): MockAdmin[] {
  const current = getMockAdmins(formId);
  if (current.some((a) => a.id === admin.id)) return current;
  const updated = [...current, admin];
  formAdminsMap.set(formId, updated);
  return updated;
}

export function removeMockAdmin(formId: string, adminId: string): MockAdmin[] {
  const current = getMockAdmins(formId);
  const updated = current.filter((a) => a.id !== adminId);
  formAdminsMap.set(formId, updated);
  return updated;
}
