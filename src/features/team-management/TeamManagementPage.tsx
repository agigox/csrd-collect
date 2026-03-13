"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Grid, Searchbar, useBreakpoint } from "@rte-ds/react";
import PageTitle from "@/lib/ui/page-title";
import { EmptyCard } from "@/lib/ui/EmptyCard";
import { OrgHierarchyList } from "./OrgHierarchyList";
import { TeamDetailPanel } from "./TeamDetailPanel";
import {
  fetchOrgHierarchy,
  type OrgDirection,
  type OrgTeam,
} from "@/api/teams";

export default function TeamManagementPage() {
  const [hierarchy, setHierarchy] = useState<OrgDirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<OrgTeam | null>(null);
  const { isBelow } = useBreakpoint();
  const isMobile = isBelow("s");

  useEffect(() => {
    fetchOrgHierarchy()
      .then(setHierarchy)
      .catch((err) => console.error("Failed to load hierarchy:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter hierarchy by search query
  const filteredHierarchy = useMemo(() => {
    if (!searchQuery.trim()) return hierarchy;
    const q = searchQuery.toLowerCase().trim();

    return hierarchy
      .map((dir) => {
        const filteredMCs = dir.maintenanceCenters
          .map((mc) => {
            const filteredGmrs = mc.gmrs
              .map((gmr) => {
                const teams = gmr.teams.filter(
                  (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.code.toLowerCase().includes(q),
                );
                return teams.length > 0 ? { ...gmr, teams } : null;
              })
              .filter(Boolean) as typeof mc.gmrs;

            const directTeams = (mc.teams || []).filter(
              (t) =>
                t.name.toLowerCase().includes(q) ||
                t.code.toLowerCase().includes(q),
            );

            return filteredGmrs.length > 0 || directTeams.length > 0
              ? { ...mc, gmrs: filteredGmrs, teams: directTeams }
              : null;
          })
          .filter(Boolean) as typeof dir.maintenanceCenters;

        return filteredMCs.length > 0 ? { ...dir, maintenanceCenters: filteredMCs } : null;
      })
      .filter(Boolean) as OrgDirection[];
  }, [hierarchy, searchQuery]);

  const handleSelectTeam = useCallback((team: OrgTeam) => {
    setSelectedTeam(team);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedTeam(null);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">Chargement de la hiérarchie...</div>
    );
  }

  return (
    <div className="max-w-480 mx-auto h-full">
      <Grid gridType="fluid">
        {!(isMobile && selectedTeam) && (
          <Grid.Col xxs={2} xs={6} s={3} m={5}>
            <div className="flex flex-col gap-5 py-2.5 pl-4 h-full overflow-y-auto">
              <PageTitle title="Admin. des équipes" />

              <div className="[&_div]:!w-full">
                <Searchbar
                  appearance="secondary"
                  value={searchQuery}
                  onChange={(input) => setSearchQuery(input ?? "")}
                  onClear={() => setSearchQuery("")}
                  label="Rechercher"
                  showResetButton={!!searchQuery}
                />
              </div>

              {filteredHierarchy.length === 0 ? (
                <EmptyCard message={searchQuery ? "Aucun résultat" : "Aucune donnée"} />
              ) : (
                <OrgHierarchyList
                  hierarchy={filteredHierarchy}
                  selectedTeamId={selectedTeam?.id ?? null}
                  onSelectTeam={handleSelectTeam}
                  autoExpandAll={!!searchQuery}
                />
              )}
            </div>
          </Grid.Col>
        )}
        <Grid.Col xxs={2} xs={6} s={3} m={7}>
          <TeamDetailPanel
            team={selectedTeam}
            open={!!selectedTeam}
            onClose={handleClosePanel}
          />
        </Grid.Col>
      </Grid>
    </div>
  );
}
