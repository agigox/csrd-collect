"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Divider, Icon } from "@rte-ds/react";
import {
  fetchTeamUsers,
  searchUsers,
  assignUserToTeam,
  removeUserFromTeam,
  type TeamUser,
} from "@/api/teams";

const ROLE_LABELS: Record<string, string> = {
  TEAM_LEADER: "Chef d'équipe",
  OPERATOR: "Utilisateur",
  GMR_MANAGER: "Responsable GMR",
  MC_MANAGER: "Responsable CM",
  DIRECTOR: "Directeur",
  ADMIN: "Administrateur",
  SUPER_ADMIN: "Super admin",
};

function getRoleBadge(user: TeamUser) {
  const label = ROLE_LABELS[user.role] || user.role;
  const isSuspended = user.status === "SUSPENDED";
  if (isSuspended) {
    return { label: "Utilisateur suspendu", bg: "var(--decorative-neutral)" };
  }
  return { label, bg: "var(--decorative-vert-indications)" };
}

interface UsersTabProps {
  teamId: string;
  filterRoles?: string[];
  searchPlaceholder?: string;
}

export function UsersTab({ teamId, filterRoles, searchPlaceholder }: UsersTabProps) {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TeamUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadUsers = useCallback(() => {
    setLoading(true);
    fetchTeamUsers(teamId)
      .then((data) => {
        if (filterRoles) {
          setUsers(data.filter((u) => filterRoles.includes(u.role)));
        } else {
          setUsers(data);
        }
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [teamId, filterRoles]);

  useEffect(() => {
    loadUsers();
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  }, [loadUsers]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchUsers(value.trim());
        const teamUserIds = new Set(users.map((u) => u.id));
        const filtered = results.filter((u) => !teamUserIds.has(u.id));
        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleAddUser = async (user: TeamUser) => {
    try {
      await assignUserToTeam(user.id, teamId);
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
      loadUsers();
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    const name = user
      ? `${user.firstName} ${user.lastName}`.trim() || user.email || user.nni || userId
      : userId;
    if (!window.confirm(`Voulez-vous vraiment retirer « ${name} » de l'équipe ?`)) return;

    try {
      await removeUserFromTeam(userId);
      loadUsers();
    } catch (err) {
      console.error("Failed to remove user:", err);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground py-4">Chargement...</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-content-secondary">{users.length} membres</span>

      {/* User list */}
      <div className="flex flex-col">
        {users.map((user, idx) => {
          const badge = getRoleBadge(user);
          const name =
            `${user.firstName} ${user.lastName}`.trim() ||
            user.email ||
            user.nni ||
            user.id;
          return (
            <div key={user.id}>
              <div className="flex items-center py-2">
                <div className="w-54.25 text-sm text-content-secondary">{name}</div>
                <span
                  className="inline-flex items-center gap-1 rounded px-2.5 py-[3px] text-xs font-medium text-content-primary whitespace-nowrap"
                  style={{ background: badge.bg }}
                >
                  <Icon name="user" size={14} />
                  {badge.label}
                </span>
                <div className="ml-auto">
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.id)}
                    className="bg-transparent border-none cursor-pointer p-1 flex items-center text-content-tertiary hover:text-content-primary"
                    title="Retirer de l'équipe"
                  >
                    <Icon name="delete" size={16} />
                  </button>
                </div>
              </div>
              {idx < users.length - 1 && (
                <Divider appearance="default" orientation="horizontal" />
              )}
            </div>
          );
        })}
      </div>

      {/* Search + add bar */}
      <div ref={containerRef} className="relative">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <Icon name="search" size={16} />
          <input
            type="text"
            placeholder={searchPlaceholder || "Rechercher"}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-content-tertiary"
          />
          <Icon name="add-circle" size={18} />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {suggestions.map((user) => {
              const name = `${user.firstName} ${user.lastName}`.trim() || user.email || user.nni;
              return (
                <button
                  key={user.id}
                  type="button"
                  className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-background-hover text-sm"
                  onClick={() => handleAddUser(user)}
                >
                  <span>{name}</span>
                  <span className="text-xs text-muted-foreground">
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {showSuggestions && searchQuery.trim().length >= 2 && suggestions.length === 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-50 px-3 py-2 text-sm text-muted-foreground">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>
    </div>
  );
}
