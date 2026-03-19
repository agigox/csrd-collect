"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Modal, Button, Icon } from "@rte-ds/react";
import { useAuthStore } from "@/stores";
import { useDeclarationsStore } from "@/stores";
import {
  fetchDirections,
  fetchMaintenanceCenters,
  fetchGmrs,
  fetchTeams,
  fetchTeamsByMC,
} from "@/api/users";
import type { OrgUnit, Team } from "@/models/User";

interface SearchableSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  width?: number;
}

function SearchableSelect({ id, label, value, onChange, options, required, width }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const q = normalize(search);
    return options.filter((o) => normalize(o.label).includes(q));
  }, [options, search]);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    updatePosition();
    setOpen(!open);
    setSearch("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div style={{ width: width ?? 280 }}>
      <label className="text-xs font-medium text-content-secondary mb-1 block">
        {label}{required && " *"}
      </label>
      <div
        ref={triggerRef}
        className="flex items-center gap-2 border border-border-secondary rounded-lg px-3 py-2 cursor-pointer bg-white"
        onClick={handleOpen}
      >
        <span className="flex-1 text-sm truncate">{selectedLabel || "Sélectionner..."}</span>
        {value && (
          <button
            type="button"
            className="bg-transparent border-none p-0 cursor-pointer flex items-center text-content-tertiary"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
          >
            <Icon name="close" size={14} />
          </button>
        )}
        <Icon name={open ? "arrow-up" : "arrow-down"} size={14} />
      </div>
      {open && createPortal(
        <div
          ref={dropdownRef}
          className="bg-white border border-border-secondary rounded-lg shadow-lg flex flex-col"
          style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 10000, maxHeight: 240 }}
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border-divider shrink-0">
            <Icon name="search" size={14} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none border-none"
            />
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 200 }}>
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-content-tertiary">Aucun résultat</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-background-hover cursor-pointer border-none ${opt.value === value ? "bg-background-brand-default/10 font-medium" : "bg-transparent"}`}
                  onClick={() => { onChange(opt.value); setOpen(false); setSearch(""); }}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

const toOptions = (items: OrgUnit[]) =>
  items.map((item) => ({ value: item.id, label: item.name }));

export default function TeamOnboardingModal() {
  const updateTeam = useAuthStore((s) => s.updateTeam);

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
  const [teams, setTeams] = useState<OrgUnit[]>([]);
  const [hasGmrs, setHasGmrs] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch directions on mount
  useEffect(() => {
    fetchDirections().then(setDirections).catch(console.error);
  }, []);

  // Fetch centres when direction changes
  useEffect(() => {
    if (!directionId) {
      setCentres([]);
      return;
    }
    fetchMaintenanceCenters(directionId).then(setCentres).catch(console.error);
  }, [directionId]);

  // Fetch GMRs when centre changes; if none, fetch teams directly under MC
  useEffect(() => {
    if (!centreId) {
      setGmrsList([]);
      setTeams([]);
      setHasGmrs(true);
      return;
    }
    fetchGmrs(centreId)
      .then((gmrs) => {
        if (gmrs.length > 0) {
          setGmrsList(gmrs);
          setHasGmrs(true);
          setTeams([]);
        } else {
          setGmrsList([]);
          setHasGmrs(false);
          // No GMRs — fetch teams directly under this MC
          fetchTeamsByMC(centreId).then(setTeams).catch(console.error);
        }
      })
      .catch(console.error);
  }, [centreId]);

  // Fetch teams when GMR changes (only when GMR level exists)
  useEffect(() => {
    if (!gmrId || !hasGmrs) {
      if (hasGmrs) setTeams([]);
      return;
    }
    fetchTeams(gmrId).then(setTeams).catch(console.error);
  }, [gmrId, hasGmrs]);

  const handleDirectionChange = (value: string) => {
    const found = directions.find((d) => d.id === value);
    setDirectionId(value);
    setDirectionName(found?.name || "");
    // Reset downstream
    setCentreId("");
    setCentreName("");
    setGmrId("");
    setGmrName("");
    setTeamId("");
    setTeamName("");
  };

  const handleCentreChange = (value: string) => {
    const found = centres.find((c) => c.id === value);
    setCentreId(value);
    setCentreName(found?.name || "");
    // Reset downstream
    setGmrId("");
    setGmrName("");
    setTeamId("");
    setTeamName("");
  };

  const handleGmrChange = (value: string) => {
    const found = gmrsList.find((g) => g.id === value);
    setGmrId(value);
    setGmrName(found?.name || "");
    // Reset downstream
    setTeamId("");
    setTeamName("");
  };

  const handleTeamChange = (value: string) => {
    const found = teams.find((e) => e.id === value);
    setTeamId(value);
    setTeamName(found?.name || "");
  };

  const isFormValid = directionId && centreId && teamId && (hasGmrs ? gmrId : true);

  const handleValidate = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
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
      // Reset declarations so they reload with the new team's forms
      useDeclarationsStore.getState().reset();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`#team-onboarding [data-testid="modal-close-button"] { display: none; }`}</style>
      <Modal
        id="team-onboarding"
        isOpen={true}
        onClose={() => {}}
        title="Bienvenue sur le collecteur"
        description="Avant de commencer, veuillez renseigner votre équipe d'appartenance."
        size="s"
        primaryButton={
          <Button
            variant="primary"
            label={isSubmitting ? "Validation..." : "Valider"}
            onClick={handleValidate}
            disabled={!isFormValid || isSubmitting}
            data-testid="btn-valider"
          />
        }
        showCloseIcon={false}
      >
        <div className="flex flex-col gap-4">
          <SearchableSelect
            id="direction"
            label="Direction"
            value={directionId}
            onChange={handleDirectionChange}
            options={toOptions(directions)}
            required
            width={280}
          />

          {directionId && (
            <SearchableSelect
              id="centre"
              label="Département/CM"
              value={centreId}
              onChange={handleCentreChange}
              options={toOptions(centres)}
              required
              width={280}
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
              width={280}
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
              width={280}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
