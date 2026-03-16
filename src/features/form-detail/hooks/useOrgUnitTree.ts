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

  const loadChildren = useCallback(async (nodeId: string) => {
    setTreeData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev)) as TreeNode[];
      const node = findNodeInTree(updated, nodeId);
      if (!node || node.childrenLoaded) return prev;

      node.loading = true;
      return updated;
    });

    try {
      const node = findNodeInTree(treeDataRef.current, nodeId);
      if (!node) return;

      let children: TreeNode[] = [];

      if (node.level === 0) {
        const centers = await fetchMaintenanceCenters(nodeId);
        children = centers.map((center) => ({
          id: center.id,
          name: center.name,
          level: 1,
          children: [] as TreeNode[],
          childrenLoaded: false,
        }));
      } else if (node.level === 1) {
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
      } else if (node.level === 2) {
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
    }
  }, []);

  return { treeData, loading, selectedLeafIds, setSelectedLeafIds, loadChildren };
}
