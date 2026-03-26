"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@rte-ds/react";
import { useAuthStore } from "@/stores";
import {
  fetchDirections,
  fetchMaintenanceCenters,
  fetchGmrs,
  fetchTeams,
  fetchTeamsByMC,
} from "@/api/users";
import type { OrgUnit, Team } from "@/models/User";
import SearchableSelect, {
  toOptions,
} from "@/components/common/SearchableSelect";

interface TeamTabProps {
  onDirtyChange: (dirty: boolean) => void;
  onClose: () => void;
}

export default function TeamTab({ onDirtyChange }: TeamTabProps) {
  const user = useAuthStore((s) => s.user);
  const updateTeam = useAuthStore((s) => s.updateTeam);
  const originalTeam = user?.team;

  // Selections (id + label pairs)
  const [directionId, setDirectionId] = useState("");
  const [directionName, setDirectionName] = useState("");
  const [centreId, setCentreId] = useState("");
  const [centreName, setCentreName] = useState("");
  const [gmrId, setGmrId] = useState("");
  const [gmrName, setGmrName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");

  // Options lists
  const [directions, setDirections] = useState<OrgUnit[]>([]);
  const [centres, setCentres] = useState<OrgUnit[]>([]);
  const [gmrsList, setGmrsList] = useState<OrgUnit[]>([]);
  const [teams, setTeamsList] = useState<OrgUnit[]>([]);
  const [hasGmrs, setHasGmrs] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializedRef = useRef(false);

  // Pre-populate from user.team on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    fetchDirections()
      .then((dirs) => {
        setDirections(dirs);

        if (!originalTeam) return;

        setDirectionId(originalTeam.directionId);
        setDirectionName(originalTeam.direction);

        fetchMaintenanceCenters(originalTeam.directionId)
          .then((mcs) => {
            setCentres(mcs);
            setCentreId(originalTeam.maintenanceCenterId);
            setCentreName(originalTeam.centre);

            fetchGmrs(originalTeam.maintenanceCenterId)
              .then((gmrs) => {
                if (gmrs.length > 0) {
                  setGmrsList(gmrs);
                  setHasGmrs(true);
                  if (originalTeam.gmrId) {
                    setGmrId(originalTeam.gmrId);
                    setGmrName(originalTeam.gmr ?? "");
                    fetchTeams(originalTeam.gmrId)
                      .then(setTeamsList)
                      .catch(console.error);
                  }
                } else {
                  setHasGmrs(false);
                  fetchTeamsByMC(originalTeam.maintenanceCenterId)
                    .then(setTeamsList)
                    .catch(console.error);
                }
                setTeamId(originalTeam.teamId);
                setTeamName(originalTeam.team);
              })
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, [originalTeam]);

  // Fetch centres when direction changes (user-initiated only)
  useEffect(() => {
    if (!initializedRef.current) return;
    if (!directionId) {
      setCentres([]);
      return;
    }
    // Skip if this is the pre-populated value
    if (directionId === originalTeam?.directionId && centres.length > 0) return;
    fetchMaintenanceCenters(directionId).then(setCentres).catch(console.error);
  }, [directionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch GMRs when centre changes
  useEffect(() => {
    if (!initializedRef.current) return;
    if (!centreId) {
      setGmrsList([]);
      setTeamsList([]);
      setHasGmrs(true);
      return;
    }
    if (centreId === originalTeam?.maintenanceCenterId && gmrsList.length > 0)
      return;
    fetchGmrs(centreId)
      .then((gmrs) => {
        if (gmrs.length > 0) {
          setGmrsList(gmrs);
          setHasGmrs(true);
          setTeamsList([]);
        } else {
          setGmrsList([]);
          setHasGmrs(false);
          fetchTeamsByMC(centreId).then(setTeamsList).catch(console.error);
        }
      })
      .catch(console.error);
  }, [centreId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch teams when GMR changes
  useEffect(() => {
    if (!initializedRef.current) return;
    if (!gmrId || !hasGmrs) {
      if (hasGmrs) setTeamsList([]);
      return;
    }
    if (gmrId === originalTeam?.gmrId && teams.length > 0) return;
    fetchTeams(gmrId).then(setTeamsList).catch(console.error);
  }, [gmrId, hasGmrs]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDirty = teamId !== (originalTeam?.teamId ?? "");

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleDirectionChange = (value: string) => {
    const found = directions.find((d) => d.id === value);
    setDirectionId(value);
    setDirectionName(found?.name || "");
    setCentreId("");
    setCentreName("");
    setGmrId("");
    setGmrName("");
    setTeamId("");
    setTeamName("");
    setCentres([]);
    setGmrsList([]);
    setTeamsList([]);
    if (value) {
      fetchMaintenanceCenters(value).then(setCentres).catch(console.error);
    }
  };

  const handleCentreChange = (value: string) => {
    const found = centres.find((c) => c.id === value);
    setCentreId(value);
    setCentreName(found?.name || "");
    setGmrId("");
    setGmrName("");
    setTeamId("");
    setTeamName("");
    setGmrsList([]);
    setTeamsList([]);
    if (value) {
      fetchGmrs(value)
        .then((gmrs) => {
          if (gmrs.length > 0) {
            setGmrsList(gmrs);
            setHasGmrs(true);
          } else {
            setHasGmrs(false);
            fetchTeamsByMC(value).then(setTeamsList).catch(console.error);
          }
        })
        .catch(console.error);
    }
  };

  const handleGmrChange = (value: string) => {
    const found = gmrsList.find((g) => g.id === value);
    setGmrId(value);
    setGmrName(found?.name || "");
    setTeamId("");
    setTeamName("");
    setTeamsList([]);
    if (value) {
      fetchTeams(value).then(setTeamsList).catch(console.error);
    }
  };

  const handleTeamChange = (value: string) => {
    const found = teams.find((e) => e.id === value);
    setTeamId(value);
    setTeamName(found?.name || "");
  };

  const isFormValid =
    directionId && centreId && teamId && (hasGmrs ? gmrId : true);

  const handleSave = useCallback(async () => {
    if (!isFormValid || !isDirty || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const team: Team = {
        directionId,
        direction: directionName,
        maintenanceCenterId: centreId,
        centre: centreName,
        gmrId: gmrId || undefined,
        gmr: gmrName || undefined,
        teamId,
        team: teamName,
      };
      await updateTeam(team);
      onDirtyChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la sauvegarde",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isFormValid,
    isDirty,
    isSubmitting,
    directionId,
    directionName,
    centreId,
    centreName,
    gmrId,
    gmrName,
    teamId,
    teamName,
    updateTeam,
    onDirtyChange,
  ]);

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-sm text-content-secondary">
        {originalTeam
          ? "Modifier votre équipe :"
          : "Votre équipe d\u2019appartenance :"}
      </p>

      <SearchableSelect
        id="direction"
        label="Direction"
        value={directionId}
        onChange={handleDirectionChange}
        options={toOptions(directions)}
        required
        width={320}
      />

      {directionId && (
        <SearchableSelect
          id="centre"
          label="Département/CM"
          value={centreId}
          onChange={handleCentreChange}
          options={toOptions(centres)}
          required
          width={320}
        />
      )}

      {centreId && hasGmrs && (
        <SearchableSelect
          id="gmr"
          label="Service/GMR"
          value={gmrId}
          onChange={handleGmrChange}
          options={toOptions(gmrsList)}
          required
          width={320}
        />
      )}

      {(gmrId || (centreId && !hasGmrs)) && (
        <SearchableSelect
          id="team"
          label="Equipe"
          value={teamId}
          onChange={handleTeamChange}
          options={toOptions(teams)}
          required
          width={320}
        />
      )}

      {error && (
        <p className="text-sm text-[#F14662]" data-testid="team-error">
          {error}
        </p>
      )}

      <div className="flex justify-end pt-4">
        <Button
          label={isSubmitting ? "Sauvegarde..." : "Modifier"}
          onClick={handleSave}
          variant="primary"
          disabled={!isFormValid || !isDirty || isSubmitting}
          data-testid="btn-save-team"
        />
      </div>
    </div>
  );
}
