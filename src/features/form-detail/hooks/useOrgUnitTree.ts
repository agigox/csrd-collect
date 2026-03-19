import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchDirections,
  fetchMaintenanceCenters,
  fetchGmrs,
  fetchTeams,
  fetchTeamsByMC,
} from "@/api/users";
import type { TreeNode } from "../components/OrgUnitTree";

interface UseOrgUnitTreeOptions {
  isOpen: boolean;
  initialSelectedIds: string[];
}

function findNodeInTree(nodes: TreeNode[], targetId: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === targetId) return node;
    const found = findNodeInTree(node.children, targetId);
    if (found) return found;
  }
  return null;
}

export function useOrgUnitTree({ isOpen, initialSelectedIds }: UseOrgUnitTreeOptions) {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const treeDataRef = useRef(treeData);
  treeDataRef.current = treeData;
  const [loading, setLoading] = useState(false);
  const [selectedLeafIds, setSelectedLeafIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const loadTreeData = async () => {
      try {
        setLoading(true);

        const directions = await fetchDirections();

        const tree = directions.map((dir) => ({
          id: dir.id,
          name: dir.name,
          level: 0,
          children: [] as TreeNode[],
          childrenLoaded: false,
        }));

        if (cancelled) return;
        setTreeData(tree);
        setSelectedLeafIds(new Set(initialSelectedIds));
        setLoading(false);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load directions:", error);
          setLoading(false);
        }
      }
    };

    loadTreeData();

    return () => {
      cancelled = true;
    };
  }, [isOpen, initialSelectedIds]);

  // nodeLevel: if provided, skip the treeDataRef lookup (used when node not yet in tree state)
  const loadChildren = useCallback(async (nodeId: string, nodeLevel?: number): Promise<TreeNode[]> => {
    setTreeData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev)) as TreeNode[];
      const node = findNodeInTree(updated, nodeId);
      if (!node || node.childrenLoaded) return prev;

      node.loading = true;
      return updated;
    });

    try {
      const nodeFromRef = findNodeInTree(treeDataRef.current, nodeId);
      // Use provided level, or fall back to ref lookup
      const level = nodeLevel !== undefined ? nodeLevel : nodeFromRef?.level;
      if (level === undefined) return [];
      // Already loaded — return existing children from ref
      if (nodeFromRef?.childrenLoaded) return nodeFromRef.children;

      let children: TreeNode[] = [];

      if (level === 0) {
        const centers = await fetchMaintenanceCenters(nodeId);
        children = centers.map((center) => ({
          id: center.id,
          name: center.name,
          level: 1,
          children: [] as TreeNode[],
          childrenLoaded: false,
        }));
      } else if (level === 1) {
        const gmrs = await fetchGmrs(nodeId);
        if (gmrs.length > 0) {
          children = gmrs.map((gmr) => ({
            id: gmr.id,
            name: gmr.name,
            level: 2,
            children: [] as TreeNode[],
            childrenLoaded: false,
          }));
        } else {
          // No GMRs — load teams directly under MC
          const teams = await fetchTeamsByMC(nodeId);
          children = teams.map((team) => ({
            id: team.id,
            name: team.name,
            level: 3,
            children: [] as TreeNode[],
            childrenLoaded: true,
          }));
        }
      } else if (level === 2) {
        const teams = await fetchTeams(nodeId);
        children = teams.map((team) => ({
          id: team.id,
          name: team.name,
          level: 3,
          children: [] as TreeNode[],
          childrenLoaded: true,
        }));
      }

      setTreeData((prev) => {
        const updated = JSON.parse(JSON.stringify(prev)) as TreeNode[];
        const targetNode = findNodeInTree(updated, nodeId);
        if (targetNode) {
          targetNode.children = children;
          targetNode.childrenLoaded = true;
          targetNode.loading = false;
        }
        return updated;
      });
      return children;
    } catch (error) {
      console.error(`Failed to load children for node ${nodeId}:`, error);
      setTreeData((prev) => {
        const updated = JSON.parse(JSON.stringify(prev)) as TreeNode[];
        const node = findNodeInTree(updated, nodeId);
        if (node) {
          node.loading = false;
        }
        return updated;
      });
      return [];
    }
  }, []);

  return { treeData, loading, selectedLeafIds, setSelectedLeafIds, loadChildren, treeDataRef };
}
