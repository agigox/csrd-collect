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
  const [initialExpandedIds, setInitialExpandedIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const loadTreeData = async () => {
      try {
        setLoading(true);

        const directions = await fetchDirections();

        const tree: TreeNode[] = directions.map((dir) => ({
          id: dir.id,
          name: dir.name,
          level: 0,
          children: [] as TreeNode[],
          childrenLoaded: false,
        }));

        if (cancelled) return;
        setSelectedLeafIds(new Set(initialSelectedIds));

        // If there are pre-selected teams, expand their ancestor branches
        if (initialSelectedIds.length > 0) {
          const selectedSet = new Set(initialSelectedIds);
          const expandedIds = new Set<string>();

          // Returns true if any descendant leaf is in selectedSet
          // All sibling nodes at each level are loaded in parallel
          const expandBranch = async (node: TreeNode): Promise<boolean> => {
            if (cancelled) return false;
            if (node.level >= 3) return selectedSet.has(node.id);

            // Load children for this node
            let children: TreeNode[] = [];
            if (node.level === 0) {
              const centers = await fetchMaintenanceCenters(node.id);
              children = centers.map((c) => ({
                id: c.id, name: c.name, level: 1,
                children: [] as TreeNode[], childrenLoaded: false,
              }));
            } else if (node.level === 1) {
              const gmrs = await fetchGmrs(node.id);
              if (gmrs.length > 0) {
                children = gmrs.map((g) => ({
                  id: g.id, name: g.name, level: 2,
                  children: [] as TreeNode[], childrenLoaded: false,
                }));
              } else {
                const teams = await fetchTeamsByMC(node.id);
                children = teams.map((t) => ({
                  id: t.id, name: t.name, level: 3,
                  children: [] as TreeNode[], childrenLoaded: true,
                }));
              }
            } else if (node.level === 2) {
              const teams = await fetchTeams(node.id);
              children = teams.map((t) => ({
                id: t.id, name: t.name, level: 3,
                children: [] as TreeNode[], childrenLoaded: true,
              }));
            }

            node.children = children;
            node.childrenLoaded = true;

            // Check leaf children directly
            const hasDirectMatch = children.some((c) => selectedSet.has(c.id));

            // Recurse into non-leaf children in parallel
            const nonLeafChildren = children.filter((c) => c.level < 3);
            const results = await Promise.all(
              nonLeafChildren.map((child) => expandBranch(child)),
            );
            const hasDeepMatch = results.some(Boolean);

            if (hasDirectMatch || hasDeepMatch) {
              expandedIds.add(node.id);
              return true;
            }
            return false;
          };

          // Expand all directions in parallel
          await Promise.all(tree.map((dir) => expandBranch(dir)));
          if (!cancelled) {
            setInitialExpandedIds(expandedIds);
          }
        }

        if (cancelled) return;
        setTreeData(tree);
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

  return { treeData, loading, selectedLeafIds, setSelectedLeafIds, loadChildren, treeDataRef, initialExpandedIds };
}
