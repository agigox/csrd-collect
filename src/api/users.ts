import { API_BASE_URL, REAL_API_URL } from "./config";
import type { User, RegisterData, OrgUnit } from "@/models/User";

export async function loginUser(
  nniOrEmail: string,
  password: string,
): Promise<User> {
  // Determine if it's NNI (5 alphanumeric uppercase) or email
  const isNni = /^[A-Z0-9]{5}$/.test(nniOrEmail);
  const queryParam = isNni
    ? `nni=${encodeURIComponent(nniOrEmail)}`
    : `email=${encodeURIComponent(nniOrEmail)}`;

  const response = await fetch(`${API_BASE_URL}/users?${queryParam}`);

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const rawUsers = (await response.json()) as User[];

  // json-server v1 beta returns records where the filtered property is missing,
  // so we filter client-side to ensure an exact match.
  const users = rawUsers.filter((u) =>
    isNni ? u.nni === nniOrEmail : u.email === nniOrEmail,
  );

  if (users.length === 0) {
    throw new Error("Identifiant incorrect");
  }

  const user = users[0];

  // json-server stores passwords in plain text (dev only)
  if (user.password !== password) {
    throw new Error("Mot de passe incorrect");
  }

  // Don't return password to the client store
  const { password: _pw, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function registerUser(data: RegisterData): Promise<User> {
  const body: Record<string, unknown> = {
    nni: data.nni,
    email: data.email,
    lastName: data.lastName || "",
    firstName: data.firstName || "",
    role: "member",
    status: "pending",
    team: null,
    password: data.password,
  };

  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const user = (await response.json()) as User;
  const { password: _pw, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function patchUserTeam(
  id: string,
  team: User["team"],
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ team }),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<User>;
}

export async function fetchUserById(id: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const user = (await response.json()) as User;
  const { password: _pw, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Organizational unit endpoints (real API)

export async function fetchDirections(): Promise<OrgUnit[]> {
  const response = await fetch(
    `${REAL_API_URL}/organizational-units/directions`,
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
    `${REAL_API_URL}/organizational-units/maintenance-centers?directionId=${encodeURIComponent(directionId)}`,
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
    `${REAL_API_URL}/organizational-units/gmrs?maintenanceCenterId=${encodeURIComponent(maintenanceCenterId)}`,
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<OrgUnit[]>;
}

export async function fetchTeams(gmrId: string): Promise<OrgUnit[]> {
  const response = await fetch(
    `${REAL_API_URL}/organizational-units/teams?gmrId=${encodeURIComponent(gmrId)}`,
  );

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json() as Promise<OrgUnit[]>;
}
