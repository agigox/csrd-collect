"use client";

import { UsersTab } from "./UsersTab";

interface AdminsTabProps {
  teamId: string;
}

export function AdminsTab({ teamId }: AdminsTabProps) {
  return (
    <UsersTab
      teamId={teamId}
      filterRoles={["ADMIN", "SUPER_ADMIN", "TEAM_LEADER"]}
      searchPlaceholder="Rechercher un administrateur"
    />
  );
}
