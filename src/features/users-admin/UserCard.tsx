"use client";

import { Card } from "@rte-ds/react";
import type { User } from "@/models/User";

interface UserCardProps {
  user: User;
  selected?: boolean;
  onClick?: () => void;
}

export function UserCard({ user, selected, onClick }: UserCardProps) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const isSuspended = user.status === "SUSPENDED";

  return (
    <Card
      onClick={onClick}
      clickable={!isSuspended}
      disabled={isSuspended}
      selected={selected}
      size="full"
      style={{
        height: "32px",
        background: isSuspended ? "#f0f0ef" : "white",
        opacity: isSuspended ? 0.6 : 1,
      }}
    >
      <div className="flex w-full items-center h-full px-3">
        <span
          className="flex-1 min-w-0 truncate text-sm font-normal"
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            color: isSuspended ? "#737272" : undefined,
          }}
        >
          {fullName || "Utilisateur sans nom"}
          {isSuspended && (
            <span className="ml-2 text-xs font-medium">(suspendu)</span>
          )}
        </span>
      </div>
    </Card>
  );
}
