"use client";

import { Card, Chip } from "@rte-ds/react";
import type { User } from "@/models/User";

interface UserCardProps {
  user: User;
  selected?: boolean;
  onClick?: () => void;
}

export function UserCard({ user, selected, onClick }: UserCardProps) {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const fullName =
    `${user.firstName ? capitalize(user.firstName) : ""} ${user.lastName ? capitalize(user.lastName) : ""}`.trim();
  const isPending = user.status === "PENDING";

  return (
    <Card
      onClick={onClick}
      clickable
      selected={selected}
      size="full"
      style={{
        height: "32px",
      }}
    >
      <div className="flex w-full items-center h-full px-3">
        <div
          className="flex-1 min-w-0 truncate text-sm font-normal"
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
          }}
        >
          {fullName || "Utilisateur sans nom"}
        </div>
        {isPending && (
          <Chip
            clickable
            id="pending-chip"
            label="Approbation"
            backgroundColor="#F5DE93"
            icon="help"
            size="s"
            textColor="#201F1F"
          />
        )}
      </div>
    </Card>
  );
}
