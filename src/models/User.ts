export type UserRole = "member" | "admin";
export type UserStatus = "pending" | "approved";

export interface User {
  id: string;
  email?: string;
  nni?: string;
  nom?: string;
  prenom?: string;
  role: UserRole;
  status?: UserStatus;
  password?: string;
  teamInfo?: TeamInfo | null;
}

export interface TeamInfo {
  directionId: string;
  direction: string;
  maintenanceCenterId: string;
  centre: string;
  gmrId: string;
  gmr: string;
  equipeId: string;
  equipe: string;
}

export interface RegisterData {
  nom?: string;
  prenom?: string;
  nniOrEmail: string;
  password: string;
  role: UserRole;
}

export interface OrgUnit {
  id: string;
  name: string;
}
