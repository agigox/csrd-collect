export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "DIRECTOR"
  | "MC_MANAGER"
  | "GMR_MANAGER"
  | "TEAM_LEADER"
  | "OPERATOR";

export type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";

export interface User {
  id: string;
  email?: string;
  nni?: string;
  lastName?: string;
  firstName?: string;
  role: UserRole;
  status?: UserStatus;
  password?: string;
  team?: Team | null;
  // Backend fields
  teamId?: string | null;
  directionId?: string | null;
  maintenanceCenterId?: string | null;
  gmrId?: string | null;
}

export interface Team {
  directionId: string;
  direction: string;
  maintenanceCenterId: string;
  centre: string;
  gmrId: string;
  gmr: string;
  teamId: string;
  team: string;
}

export interface RegisterData {
  lastName?: string;
  firstName?: string;
  nni: string;
  email: string;
  password: string;
}

export interface OrgUnit {
  id: string;
  name: string;
  code?: string;
}
