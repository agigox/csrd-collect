"use client";

import { Searchbar } from "@rte-ds/react";
import PageTitle from "@/lib/ui/page-title";
import { EmptyCard } from "@/lib/ui/empty-card";
import type { User } from "@/models/User";
import { UserCard } from "./UserCard";

interface UsersListProps {
  users: User[];
  selectedUserId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectUser: (user: User) => void;
}

export function UsersList({
  users,
  selectedUserId,
  searchQuery,
  onSearchChange,
  onSelectUser,
}: UsersListProps) {
  const showResults = searchQuery.length >= 2;

  return (
    <div className="flex flex-col gap-5 py-2.5 pl-4 h-full overflow-y-auto pr-1">
      <PageTitle title="Administration d'utilisateurs" />

      <div className="[&_div]:!w-full">
        <Searchbar
          appearance="secondary"
          value={searchQuery}
          onChange={(input) => onSearchChange(input ?? "")}
          onClear={() => onSearchChange("")}
          label="Rechercher un utilisateur"
          showResetButton={!!searchQuery}
        />
      </div>

      {!showResults ? null : users.length === 0 ? (
        <EmptyCard message="Aucun résultat" />
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              selected={user.id === selectedUserId}
              onClick={() => onSelectUser(user)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
