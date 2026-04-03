"use client";

import { useState, useMemo, useEffect } from "react";
import { Icon, RadioButton } from "@rte-ds/react";
import type { OrgDirection, OrgTeam } from "@/api/teams";

interface OrgHierarchyListProps {
  hierarchy: OrgDirection[];
  selectedTeamId: string | null;
  onSelectTeam: (team: OrgTeam) => void;
  autoExpandAll?: boolean;
  initialExpandedIds?: string[];
}

/** Bordered card row for a collapsible section (direction, MC, GMR) */
function SectionCard({
  label,
  isExpanded,
  onToggle,
}: {
  label: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 w-full border border-[#c4c4c4] rounded px-3 py-2 cursor-pointer hover:bg-gray-50 text-left bg-white"
      onClick={onToggle}
    >
      <Icon
        name={isExpanded ? "arrow-chevron-down" : "arrow-chevron-right"}
        size={16}
      />
      <span className="text-base font-normal truncate" style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}>{label}</span>
    </button>
  );
}

/** Bordered card row for a team with radio button */
function TeamCard({
  team,
  isSelected,
  onSelect,
}: {
  team: OrgTeam;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between border border-[#c4c4c4] rounded px-3 py-2 cursor-pointer hover:bg-gray-50 bg-white"
      onClick={onSelect}
    >
      <span className="text-base font-normal truncate" style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}>{team.name}</span>
      <RadioButton
        groupName="team-select"
        checked={isSelected}
        onChange={onSelect}
        label="select"
        showLabel={false}
      />
    </div>
  );
}

export function OrgHierarchyList({
  hierarchy,
  selectedTeamId,
  onSelectTeam,
  autoExpandAll,
  initialExpandedIds = [],
}: OrgHierarchyListProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(initialExpandedIds),
  );

  useEffect(() => {
    if (initialExpandedIds.length > 0) {
      setExpanded((prev) => {
        const next = new Set(prev);
        initialExpandedIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }, [initialExpandedIds]);

  const effectiveExpanded = useMemo(() => {
    if (autoExpandAll) {
      const all = new Set<string>();
      hierarchy.forEach((d) => {
        all.add(d.id);
        d.maintenanceCenters.forEach((mc) => {
          all.add(mc.id);
          mc.gmrs.forEach((g) => all.add(g.id));
        });
      });
      return all;
    }
    return expanded;
  }, [autoExpandAll, hierarchy, expanded]);

  const toggle = (id: string) => {
    if (autoExpandAll) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-1">
      {hierarchy.map((dir) => {
        const dirExp = effectiveExpanded.has(dir.id);
        // If direction has exactly 1 MC with same name, render MC's contents directly
        const singleSameMC = dir.maintenanceCenters.length === 1 && dir.maintenanceCenters[0].name === dir.name ? dir.maintenanceCenters[0] : null;
        return (
          <div key={dir.id}>
            <SectionCard
              label={dir.name}
              isExpanded={dirExp}
              onToggle={() => toggle(dir.id)}
            />
            {dirExp && (
              <div className="flex flex-col gap-1 pl-4 pt-1">
                {singleSameMC ? (
                  // Render MC's children directly without showing the MC SectionCard
                  <>
                    {singleSameMC.gmrs.map((gmr) => {
                      // If this MC has exactly 1 GMR with same name, skip the GMR level
                      const singleSameGMR = singleSameMC.gmrs.length === 1 && singleSameMC.gmrs[0].name === singleSameMC.name ? singleSameMC.gmrs[0] : null;
                      if (singleSameGMR) {
                        // Render GMR's teams directly
                        return singleSameGMR.teams.map((team) => (
                          <TeamCard
                            key={team.id}
                            team={team}
                            isSelected={selectedTeamId === team.id}
                            onSelect={() => onSelectTeam(team)}
                          />
                        ));
                      }
                      // If GMR has exactly 1 team with same name, skip the GMR level
                      const singleSameTeam = gmr.teams.length === 1 && gmr.teams[0].name === gmr.name ? gmr.teams[0] : null;
                      if (singleSameTeam) {
                        return (
                          <TeamCard
                            key={gmr.id}
                            team={singleSameTeam}
                            isSelected={selectedTeamId === singleSameTeam.id}
                            onSelect={() => onSelectTeam(singleSameTeam)}
                          />
                        );
                      }
                      const gmrExp = effectiveExpanded.has(gmr.id);
                      return (
                        <div key={gmr.id}>
                          <SectionCard
                            label={gmr.name}
                            isExpanded={gmrExp}
                            onToggle={() => toggle(gmr.id)}
                          />
                          {gmrExp && (
                            <div className="flex flex-col gap-1 pl-4 pt-1">
                              {gmr.teams.map((team) => (
                                <TeamCard
                                  key={team.id}
                                  team={team}
                                  isSelected={selectedTeamId === team.id}
                                  onSelect={() => onSelectTeam(team)}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {(singleSameMC.teams || []).map((team) => (
                      <TeamCard
                        key={team.id}
                        team={team}
                        isSelected={selectedTeamId === team.id}
                        onSelect={() => onSelectTeam(team)}
                      />
                    ))}
                  </>
                ) : (
                  dir.maintenanceCenters.map((mc) => {
                    const mcExp = effectiveExpanded.has(mc.id);
                    // If this MC has exactly 1 GMR with same name, skip the GMR level
                    const singleSameGMR = mc.gmrs.length === 1 && mc.gmrs[0].name === mc.name ? mc.gmrs[0] : null;
                    return (
                      <div key={mc.id}>
                        <SectionCard
                          label={mc.name}
                          isExpanded={mcExp}
                          onToggle={() => toggle(mc.id)}
                        />
                        {mcExp && (
                          <div className="flex flex-col gap-1 pl-4 pt-1">
                            {singleSameGMR ? (
                              // Render GMR's teams directly without showing the GMR SectionCard
                              singleSameGMR.teams.map((team) => (
                                <TeamCard
                                  key={team.id}
                                  team={team}
                                  isSelected={selectedTeamId === team.id}
                                  onSelect={() => onSelectTeam(team)}
                                />
                              ))
                            ) : (
                              mc.gmrs.map((gmr) => {
                                // If GMR has exactly 1 team with same name, skip the GMR level
                                const singleSameTeam = gmr.teams.length === 1 && gmr.teams[0].name === gmr.name ? gmr.teams[0] : null;
                                if (singleSameTeam) {
                                  return (
                                    <TeamCard
                                      key={gmr.id}
                                      team={singleSameTeam}
                                      isSelected={selectedTeamId === singleSameTeam.id}
                                      onSelect={() => onSelectTeam(singleSameTeam)}
                                    />
                                  );
                                }
                                const gmrExp = effectiveExpanded.has(gmr.id);
                                return (
                                  <div key={gmr.id}>
                                    <SectionCard
                                      label={gmr.name}
                                      isExpanded={gmrExp}
                                      onToggle={() => toggle(gmr.id)}
                                    />
                                    {gmrExp && (
                                      <div className="flex flex-col gap-1 pl-4 pt-1">
                                        {gmr.teams.map((team) => (
                                          <TeamCard
                                            key={team.id}
                                            team={team}
                                            isSelected={selectedTeamId === team.id}
                                            onSelect={() => onSelectTeam(team)}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                            {(mc.teams || []).map((team) => (
                              <TeamCard
                                key={team.id}
                                team={team}
                                isSelected={selectedTeamId === team.id}
                                onSelect={() => onSelectTeam(team)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
