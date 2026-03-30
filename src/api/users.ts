import { API_BASE_URL } from "./config";
import { authHeaders } from "./authHeaders";
import type { User, RegisterData, OrgUnit, Team } from "@/models/User";

let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export async function loginUser(
  identifier: string,
  password: string,
): Promise<{ user: User; access_token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Identifiant ou mot de passe incorrect");
  }

  const data = await response.json();
  _accessToken = data.access_token;
  return data;
}

export async function registerUser(data: RegisterData): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nni: data.nni,
      email: data.email,
      password: data.password,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Erreur lors de l'inscription");
  }

  return response.json() as Promise<User>;
}

export async function patchCurrentUser(data: {
  firstName?: string;
  lastName?: string;
}): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<User>;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/me/password`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
}

export async function deleteCurrentUser(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }
}

export async function patchCurrentUserTeam(team: User["team"]): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me/team`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({
      directionId: team?.directionId,
      maintenanceCenterId: team?.maintenanceCenterId,
      gmrId: team?.gmrId,
      teamId: team?.teamId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<User>;
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<User>;
}

// Organizational unit endpoints

export async function fetchDirections(): Promise<OrgUnit[]> {
  const response = await fetch(
    `${API_BASE_URL}/organizational-units/directions`,
    { headers: authHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<OrgUnit[]>;
}

export async function fetchMaintenanceCenters(
  directionId: string,
): Promise<OrgUnit[]> {
  const response = await fetch(
    `${API_BASE_URL}/organizational-units/maintenance-centers?directionId=${encodeURIComponent(directionId)}`,
    { headers: authHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<OrgUnit[]>;
}

export async function fetchGmrs(
  maintenanceCenterId: string,
): Promise<OrgUnit[]> {
  const response = await fetch(
    `${API_BASE_URL}/organizational-units/gmrs?maintenanceCenterId=${encodeURIComponent(maintenanceCenterId)}`,
    { headers: authHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<OrgUnit[]>;
}

export async function fetchTeams(gmrId: string): Promise<OrgUnit[]> {
  const response = await fetch(
    `${API_BASE_URL}/organizational-units/teams?gmrId=${encodeURIComponent(gmrId)}`,
    { headers: authHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<OrgUnit[]>;
}

export async function fetchTeamsByMC(
  maintenanceCenterId: string,
): Promise<OrgUnit[]> {
  const response = await fetch(
    `${API_BASE_URL}/organizational-units/teams?maintenanceCenterId=${encodeURIComponent(maintenanceCenterId)}`,
    { headers: authHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<OrgUnit[]>;
}

export async function resendVerificationEmail(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Erreur lors de l'envoi");
  }
}

export async function resolveUserTeam(user: User): Promise<Team | null> {
  if (!user.directionId || !user.maintenanceCenterId || !user.teamId) return null;

  try {
    const [directions, centres] = await Promise.all([
      fetchDirections(),
      fetchMaintenanceCenters(user.directionId),
    ]);

    const direction = directions.find((d) => d.id === user.directionId);
    const centre = centres.find((c) => c.id === user.maintenanceCenterId);

    let gmrName: string | undefined;
    if (user.gmrId) {
      const gmrs = await fetchGmrs(user.maintenanceCenterId);
      gmrName = gmrs.find((g) => g.id === user.gmrId)?.name;
    }

    const teams = user.gmrId
      ? await fetchTeams(user.gmrId)
      : await fetchTeamsByMC(user.maintenanceCenterId);
    const team = teams.find((t) => t.id === user.teamId);

    if (!direction || !centre || !team) return null;

    return {
      directionId: user.directionId,
      direction: direction.name,
      maintenanceCenterId: user.maintenanceCenterId,
      centre: centre.name,
      gmrId: user.gmrId ?? undefined,
      gmr: gmrName,
      teamId: user.teamId,
      team: team.name,
    };
  } catch {
    return null;
  }
}

export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Erreur lors de l'envoi");
  }
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Erreur lors de la réinitialisation");
  }
}

export async function fetchAdminUsers(): Promise<User[]> {
  const response = await fetch(
    `${API_BASE_URL}/users?role=ADMIN&role=SUPER_ADMIN`,
    { headers: authHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<User[]>;
}
