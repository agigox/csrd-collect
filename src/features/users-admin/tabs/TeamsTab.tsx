"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Icon, Toast } from "@rte-ds/react";
import type { User } from "@/models/User";
import type { MockTeam } from "@/features/form-detail/mockData";
import type { LeafAncestors } from "@/features/form-detail/components/OrgUnitTree";
import AttribuerEquipesModal from "@/features/form-detail/tabs/AttribuerEquipesModal";
import { updateUser, fetchTeams, fetchTeamsByMC } from "@/api/users";

interface TeamsTabProps {
  user: User;
  onUserUpdated: (updatedUser: User) => void;
}

export function TeamsTab({ user, onUserUpdated }: TeamsTabProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  // Resolve team name from org units when the backend only returns flat IDs
  const [resolvedTeamName, setResolvedTeamName] = useState<string | null>(null);

  useEffect(() => {
    if (!user.teamId || user.team?.team) {
      setResolvedTeamName(null);
      return;
    }

    let cancelled = false;
    const resolve = async () => {
      try {
        // Try via GMR first, then fallback to MC
        const teams = user.gmrId
          ? await fetchTeams(user.gmrId)
          : user.maintenanceCenterId
            ? await fetchTeamsByMC(user.maintenanceCenterId)
            : [];
        const match = teams.find((t) => t.id === user.teamId);
        if (!cancelled && match) setResolvedTeamName(match.name);
      } catch {
        // Silently fail — will show teamId as fallback
      }
    };
    resolve();
    return () => { cancelled = true; };
  }, [user.teamId, user.gmrId, user.maintenanceCenterId, user.team?.team]);

  const teamDisplayName = user.team?.team ?? resolvedTeamName ?? user.teamId;

  // Memoize to keep a stable reference -- avoids infinite loop in useOrgUnitTree
  const currentTeams: MockTeam[] = useMemo(
    () =>
      user.teamId
        ? [{ id: user.teamId, name: teamDisplayName ?? user.teamId }]
        : [],
    [user.teamId, teamDisplayName],
  );

  const handleValidate = async (
    teams: MockTeam[],
    ancestors?: LeafAncestors | null,
  ) => {
    const selectedTeam = teams[0];
    if (!selectedTeam || !ancestors) {
      setShowModal(false);
      return;
    }

    setSaving(true);
    try {
      const updated = await updateUser(user.id, {
        teamId: ancestors.teamId,
        directionId: ancestors.directionId,
        maintenanceCenterId: ancestors.maintenanceCenterId,
        gmrId: ancestors.gmrId ?? null,
      });
      // Enrich with team name since the API returns flat IDs only
      onUserUpdated({
        ...updated,
        team: { ...(updated.team ?? {}), team: selectedTeam.name } as User["team"],
      });
      setToast({
        open: true,
        type: "success",
        message: `Équipe "${selectedTeam.name}" attribuée avec succès`,
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Erreur lors de l'attribution de l'équipe",
      });
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };

  const handleNavigateToTeam = (teamId: string) => {
    router.push(`/admin/teams-admin?teamId=${teamId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          variant="primary"
          label="Attribuer"
          onClick={() => setShowModal(true)}
          size="s"
          disabled={saving}
        />
      </div>

      {currentTeams.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune équipe attribuée</p>
      ) : (
        <div className="flex flex-col gap-2">
          {currentTeams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between px-3 py-2 border rounded bg-white"
            >
              <span className="text-sm">{team.name}</span>
              <button
                type="button"
                onClick={() => handleNavigateToTeam(team.id)}
                className="cursor-pointer hover:bg-gray-100 rounded p-1"
                aria-label={`Voir l'équipe ${team.name}`}
              >
                <Icon name="arrow-right" size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      <AttribuerEquipesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        currentTeams={currentTeams}
        onValidate={handleValidate}
        selectionMode="single"
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.open}
        autoDismiss
        duration="medium"
        placement="bottom-right"
        onClose={() => setToast((prev) => (prev.open ? { ...prev, open: false } : prev))}
      />
    </div>
  );
}
