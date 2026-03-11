"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Modal, Button, Icon } from "@rte-ds/react";
import type { MockTeam } from "../mockData";
import OrgUnitTree, {
  getLeafDescendants,
  type TreeNode,
} from "../components/OrgUnitTree";
import { useOrgUnitTree } from "../hooks/useOrgUnitTree";

interface AttribuerEquipesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTeams: MockTeam[];
  onValidate: (teams: MockTeam[]) => void;
}

export default function AttribuerEquipesModal({
  isOpen,
  onClose,
  currentTeams,
  onValidate,
}: AttribuerEquipesModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTeams, setPendingTeams] = useState<MockTeam[]>([]);

  const initialSelectedIds = useMemo(
    () => currentTeams.map((t) => t.id),
    [currentTeams],
  );

  const {
    treeData,
    loading,
    selectedLeafIds,
    setSelectedLeafIds,
    loadChildren,
  } = useOrgUnitTree({ isOpen, initialSelectedIds });

  const toggleNodeSelection = (node: TreeNode) => {
    const leaves = getLeafDescendants(node);
    const leafIds = leaves.map((l) => l.id);

    setSelectedLeafIds((prev) => {
      const allSelected =
        leafIds.length > 0 && leafIds.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        leafIds.forEach((id) => next.delete(id));
      } else {
        leafIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleValidate = () => {
    const selectedTeams: MockTeam[] = [];

    const collectSelectedTeams = (nodes: typeof treeData) => {
      for (const node of nodes) {
        if (node.level === 3 && selectedLeafIds.has(node.id)) {
          selectedTeams.push({ id: node.id, name: node.name });
        }
        collectSelectedTeams(node.children);
      }
    };

    collectSelectedTeams(treeData);
    setPendingTeams(selectedTeams);
    setShowConfirmation(true);
  };

  const handleConfirmOk = () => {
    onValidate(pendingTeams);
    setShowConfirmation(false);
  };

  const handleClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  if (showConfirmation) {
    return (
      <Modal
        id="attribuer-equipes-confirmation"
        isOpen={isOpen}
        onClose={handleClose}
        title="Attribuer des équipes"
        size="s"
        primaryButton={
          <Button variant="primary" label="Ok" onClick={handleConfirmOk} />
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-2">
            <Icon name="check-circle" size={32} color="#2d7738" />
            <span className="text-xl text-[#201f1f]">
              L&apos;attribution des équipes suivantes a bien été prise en
              compte :
            </span>
          </div>
          <div className="flex items-center gap-6 pl-18">
            <div className="shrink-0">
              <Image
                src="/Human_resource.png"
                alt="Human Resource"
                width={204}
                height={204}
              />
            </div>
            <ul className="list-disc pl-5 text-sm text-[#3e3e3d] leading-8">
              {pendingTeams.map((team, index) => (
                <li key={team.id}>
                  {team.name}
                  {index < pendingTeams.length - 1 ? "," : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      id="attribuer-equipes"
      isOpen={isOpen}
      onClose={handleClose}
      title="Attribuer des équipes"
      size="m"
      primaryButton={
        <Button variant="primary" label="Valider" onClick={handleValidate} />
      }
      secondaryButton={
        <Button variant="neutral" label="Annuler" onClick={handleClose} />
      }
    >
      <OrgUnitTree
        treeData={treeData}
        loading={loading}
        selectedLeafIds={selectedLeafIds}
        onToggleSelection={toggleNodeSelection}
        onLoadChildren={loadChildren}
      />
    </Modal>
  );
}
