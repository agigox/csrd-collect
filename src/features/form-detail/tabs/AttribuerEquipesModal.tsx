"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Modal, Button, Icon } from "@rte-ds/react";
import type { MockTeam } from "../mockData";
import OrgUnitTree, { type TreeNode } from "../components/OrgUnitTree";
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
    initialExpandedIds,
  } = useOrgUnitTree({ isOpen, initialSelectedIds });

  // Recursively collect all leaf IDs, loading unloaded children on demand.
  // We pass node.level to loadChildren so it works even when the node isn't
  // yet reflected in treeDataRef (avoids stale-ref timing issue).
  const collectAllLeafIds = async (node: TreeNode): Promise<string[]> => {
    if (node.level === 3) return [node.id];
    const children: TreeNode[] = node.childrenLoaded
      ? node.children
      : await loadChildren(node.id, node.level);
    const ids: string[] = [];
    for (const child of children) {
      ids.push(...(await collectAllLeafIds(child)));
    }
    return ids;
  };

  const toggleNodeSelection = async (node: TreeNode) => {
    // Collect all leaf team IDs, loading any unloaded branches along the way
    const leafIds = await collectAllLeafIds(node);
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
    // Collect teams visible in the tree
    const treeTeamsMap = new Map<string, MockTeam>();
    const collectSelectedTeams = (nodes: typeof treeData) => {
      for (const node of nodes) {
        if (node.level === 3 && selectedLeafIds.has(node.id)) {
          treeTeamsMap.set(node.id, { id: node.id, name: node.name });
        }
        collectSelectedTeams(node.children);
      }
    };
    collectSelectedTeams(treeData);

    // Also include currently assigned teams that are still selected but
    // whose tree branch may not have been expanded/loaded
    for (const team of currentTeams) {
      if (selectedLeafIds.has(team.id) && !treeTeamsMap.has(team.id)) {
        treeTeamsMap.set(team.id, { id: team.id, name: team.name });
      }
    }

    setPendingTeams(Array.from(treeTeamsMap.values()));
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
        size="m"
        primaryButton={
          <Button variant="primary" label="Ok" onClick={handleConfirmOk} />
        }
      >
        <div className="flex flex-col gap-6 h-118.75 w-full">
          <div className="flex items-start gap-2">
            <Icon name="check-circle" size={32} color="#2d7738" />
            <span className="text-xl text-[#201f1f]">
              L&apos;attribution des {pendingTeams.length} équipe
              {pendingTeams.length > 1 ? "s" : ""} suivante
              {pendingTeams.length > 1 ? "s" : ""} a bien été prise en compte :
            </span>
          </div>
          <div className="flex items-center gap-6 pl-18">
            <div className="shrink-0 self-start">
              <Image
                src="/Human_resource.png"
                alt="Human Resource"
                width={204}
                height={204}
              />
            </div>
            <ul className="list-disc pl-5 text-sm text-[#3e3e3d] leading-8">
              {pendingTeams.map((team, index) => (
                <li key={team.id} className="h-7">
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
        <Button
          variant="primary"
          label="Valider"
          onClick={handleValidate}
          disabled={loading}
        />
      }
      secondaryButton={
        <Button variant="neutral" label="Annuler" onClick={handleClose} />
      }
    >
      <div
        style={{
          height: "475px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <OrgUnitTree
          treeData={treeData}
          loading={loading}
          selectedLeafIds={selectedLeafIds}
          onToggleSelection={toggleNodeSelection}
          onLoadChildren={loadChildren}
          initialExpandedIds={initialExpandedIds}
        />
      </div>
    </Modal>
  );
}
