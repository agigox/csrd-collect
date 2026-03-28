"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Grid, useBreakpoint } from "@rte-ds/react";
import type { User } from "@/models/User";
import { fetchAllUsers } from "@/api/users";
import { UsersList } from "./UsersList";
import { UserDetailPanel } from "./UserDetailPanel";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isBelow } = useBreakpoint();
  const isMobile = isBelow("s");

  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch((err) => console.error("Erreur chargement utilisateurs:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const q = searchQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return users.filter((u) => {
      const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return fullName.includes(q);
    });
  }, [users, searchQuery]);

  const handleUserUpdated = useCallback((updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
    setSelectedUser((prev) =>
      prev?.id === updatedUser.id ? updatedUser : prev,
    );
  }, []);

  const handleUserDeleted = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: "SUSPENDED" as const } : u,
      ),
    );
    setSelectedUser(null);
  }, []);

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedUser(null);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">Chargement des utilisateurs...</div>
    );
  }

  return (
    <div className="max-w-480 mx-auto h-full">
      <Grid gridType="fluid">
        {!(isMobile && selectedUser) && (
          <Grid.Col xxs={2} xs={6} s={3} m={5}>
            <UsersList
              users={filteredUsers}
              selectedUserId={selectedUser?.id ?? null}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectUser={handleSelectUser}
            />
          </Grid.Col>
        )}
        <Grid.Col xxs={2} xs={6} s={3} m={7}>
          <UserDetailPanel
            user={selectedUser}
            open={!!selectedUser}
            onClose={handleClosePanel}
            onUserUpdated={handleUserUpdated}
            onUserDeleted={handleUserDeleted}
          />
        </Grid.Col>
      </Grid>
    </div>
  );
}
