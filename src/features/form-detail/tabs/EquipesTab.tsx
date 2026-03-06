"use client";

import { useState } from "react";
import { Button, Divider } from "@rte-ds/react";
import type { FormTemplate } from "@/models/FormTemplate";
import { getMockTeams, setMockTeams, type MockTeam } from "../mockData";
import AttribuerEquipesModal from "./AttribuerEquipesModal";

interface EquipesTabProps {
  form: FormTemplate;
}

export function EquipesTab({ form }: EquipesTabProps) {
  const [teams, setTeams] = useState(() => getMockTeams(form.id));
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleValidate(newTeams: MockTeam[]) {
    setMockTeams(form.id, newTeams);
    setTeams(newTeams);
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="heading-s">{teams.length} équipe(s)</span>
        <Button variant="secondary" size="m" label="Attribuer" onClick={() => setIsModalOpen(true)} />
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

      <AttribuerEquipesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentTeams={teams}
        onValidate={handleValidate}
      />
    </div>
  );
}
