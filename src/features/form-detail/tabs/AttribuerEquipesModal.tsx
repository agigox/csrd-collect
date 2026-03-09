"use client";

import { useState, useRef, useMemo } from "react";
import { Modal, Button, Icon } from "@rte-ds/react";
import type { MockTeam } from "../mockData";
import OrgUnitTree, { getLeafDescendants, type TreeNode } from "../components/OrgUnitTree";
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
  const pendingTeamsRef = useRef<MockTeam[]>([]);

  const initialSelectedIds = useMemo(
    () => currentTeams.map((t) => t.id),
    [currentTeams]
  );

  const { treeData, loading, selectedLeafIds, setSelectedLeafIds, loadChildren } =
    useOrgUnitTree({ isOpen, initialSelectedIds });

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
    pendingTeamsRef.current = selectedTeams;
    setShowConfirmation(true);
  };

  const handleConfirmOk = () => {
    onValidate(pendingTeamsRef.current);
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
        size="m"
        primaryButton={
          <Button variant="primary" label="Ok" onClick={handleConfirmOk} />
        }
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex items-center gap-2">
            <Icon name="check-circle" size={32} color="#2d7738" />
            <span className="text-xl text-[#201f1f]">
              L&apos;attribution a bien été prise en compte.
            </span>
          </div>
          {/* Illustration: see Figma node 565:20268 */}
          <div className="w-[250px] h-[250px] flex items-center justify-center">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="95" fill="#F5F0E8" />
              <circle cx="70" cy="75" r="30" fill="#D4C5A0" stroke="#C8B88A" strokeWidth="2" />
              <circle cx="130" cy="65" r="28" fill="#6B7B4F" stroke="#5A6A3E" strokeWidth="2" />
              <circle cx="100" cy="130" r="28" fill="#D4A245" stroke="#C89535" strokeWidth="2" />
              <circle cx="100" cy="100" r="12" fill="white" />
            </svg>
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
