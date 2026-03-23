"use client";

import { useState } from "react";
import { IconButton, Tab } from "@rte-ds/react";
import type { OrgTeam } from "@/api/teams";
import { UsersTab } from "./tabs/UsersTab";
import { DeclarationsTab } from "./tabs/DeclarationsTab";
import { AdminsTab } from "./tabs/AdminsTab";

const TAB_OPTIONS = [
  { id: "users", panelId: "panel-users", label: "Rôles et Utilisateur(s)" },
  { id: "declarations", panelId: "panel-declarations", label: "Déclaration(s) attribuée(s)" },
  { id: "admins", panelId: "panel-admins", label: "Administrateurs" },
];

interface TeamDetailPanelProps {
  team: OrgTeam | null;
  open: boolean;
  onClose: () => void;
}

export function TeamDetailPanel({ team, open, onClose }: TeamDetailPanelProps) {
  const [activeTabId, setActiveTabId] = useState("users");
  const [prevTeamId, setPrevTeamId] = useState<string | null>(null);

  // Reset to first tab when team changes
  if (team && prevTeamId !== team.id) {
    setPrevTeamId(team.id);
    setActiveTabId("users");
  }

  if (!team || !open) return null;

  return (
    <div
      className="flex flex-col h-screen w-full sticky top-0 border-l bg-background pl-4 gap-4"
      style={{
        boxShadow: "0 2px 4px var(--elevation-shadow-ambient), 0 2px 4px var(--elevation-shadow-key)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-1 px-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-xl font-bold truncate"
              style={{ fontFamily: "Nunito, sans-serif", fontSize: "20px" }}
            >
              Equipe {team.name}
            </h2>
          </div>
          <IconButton
            appearance="outlined"
            aria-label="close"
            name="close"
            onClick={onClose}
            size="m"
            variant="neutral"
            iconColor="var(--content-tertiary)"
          />
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="flex flex-col gap-4">
          <Tab
            options={TAB_OPTIONS}
            selectedTabId={activeTabId}
            onChange={setActiveTabId}
            compactSpacing
          />

          {activeTabId === "users" && (
            <div role="tabpanel" id="panel-users" aria-labelledby="users">
              <UsersTab teamId={team.id} />
            </div>
          )}
          {activeTabId === "declarations" && (
            <div role="tabpanel" id="panel-declarations" aria-labelledby="declarations">
              <DeclarationsTab teamId={team.id} />
            </div>
          )}
          {activeTabId === "admins" && (
            <div role="tabpanel" id="panel-admins" aria-labelledby="admins">
              <AdminsTab teamId={team.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
