import { API_BASE_URL } from "./config";
import { authHeaders } from "./authHeaders";

export interface OrgDirection {
  id: string;
  code: string;
  name: string;
  maintenanceCenters: OrgMC[];
}

export interface OrgMC {
  id: string;
  code: string;
  name: string;
  gmrs: OrgGmr[];
  teams: OrgTeam[];
}

export interface OrgGmr {
  id: string;
  code: string;
  name: string;
  teams: OrgTeam[];
}

export interface OrgTeam {
  id: string;
  code: string;
  name: string;
}

export interface TeamUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  nni: string | null;
  role: string;
  status: string;
}

export async function fetchOrgHierarchy(): Promise<OrgDirection[]> {
  const response = await fetch(
    `${API_BASE_URL}/organizational-units/directions/hierarchy`,
    { headers: authHeaders() },
  );
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.json();
}

export async function fetchTeamUsers(teamId: string): Promise<TeamUser[]> {
  const response = await fetch(
    `${API_BASE_URL}/users?teamId=${teamId}`,
    { headers: authHeaders() },
  );
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.json();
}

export async function searchUsers(query: string, roles?: string[]): Promise<TeamUser[]> {
  const params = new URLSearchParams();
  params.set("search", query);
  params.set("status", "ACTIVE");
  if (roles) {
    roles.forEach((r) => params.append("role", r));
  }
  const response = await fetch(
    `${API_BASE_URL}/users?${params.toString()}`,
    { headers: authHeaders() },
  );
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.json();
}

export async function assignUserToTeam(userId: string, teamId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ teamId }),
    },
  );
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
}

export async function removeUserFromTeam(userId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ teamId: null }),
    },
  );
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
}

export async function fetchTeamTemplates(
  teamId: string,
): Promise<Array<{ id: string; name: string; code: string; description?: string }>> {
  const response = await fetch(
    `${API_BASE_URL}/form-template-assignments/by-team/${teamId}`,
    { headers: authHeaders() },
  );
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.json();
}
