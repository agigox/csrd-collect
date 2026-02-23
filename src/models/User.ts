export type UserRole = "member" | "admin";
export type UserStatus = "pending" | "approved";

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
  nniOrEmail: string;
  password: string;
  role: UserRole;
}

export interface OrgUnit {
  id: string;
  name: string;
}
