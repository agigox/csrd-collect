"use client";

import { useMemo } from "react";
import { Button, Divider } from "@rte-ds/react";
import type { FormTemplate } from "@/models/FormTemplate";
import { getMockTeams } from "../mockData";

interface EquipesTabProps {
  form: FormTemplate;
}

export function EquipesTab({ form }: EquipesTabProps) {
  const teams = useMemo(() => getMockTeams(form.id), [form.id]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="heading-s">{teams.length} équipe(s)</span>
        <Button variant="secondary" size="m" label="Attribuer" />
      </div>

      {/* Team list */}
      {teams.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune équipe attribuée</p>
      ) : (
        <div className="flex flex-col">
          {teams.map((team, index) => (
            <div key={team.id}>
              <div className="py-3 px-2 text-sm">{team.name}</div>
              {index < teams.length - 1 && (
                <Divider appearance="default" orientation="horizontal" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
