import { useState, useEffect } from "react";
import {
  fetchDirections,
  fetchMaintenanceCenters,
  fetchGmrs,
  fetchTeams,
} from "@/api/users";
import type { TreeNode } from "../components/OrgUnitTree";

interface UseOrgUnitTreeOptions {
  isOpen: boolean;
  initialSelectedIds: string[];
}

export function useOrgUnitTree({ isOpen, initialSelectedIds }: UseOrgUnitTreeOptions) {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
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

        const centersPerDirection = await Promise.all(
          directions.map((dir) => fetchMaintenanceCenters(dir.id))
        );

        const allCenters: Array<{
          id: string;
          name: string;
          directionId: string;
        }> = [];
        directions.forEach((dir, idx) => {
          centersPerDirection[idx].forEach((center) => {
            allCenters.push({ ...center, directionId: dir.id });
          });
        });

        const gmrsPerCenter = await Promise.all(
          allCenters.map((center) => fetchGmrs(center.id))
        );

        const allGmrs: Array<{
          id: string;
          name: string;
          centerId: string;
        }> = [];
        allCenters.forEach((center, idx) => {
          gmrsPerCenter[idx].forEach((gmr) => {
            allGmrs.push({ ...gmr, centerId: center.id });
          });
        });

        const teamsPerGmr = await Promise.all(
          allGmrs.map((gmr) => fetchTeams(gmr.id))
        );

        const tree = directions.map((dir) => {
          const dirCenters = allCenters.filter(
            (c) => c.directionId === dir.id
          );

          const centerNodes = dirCenters.map((center) => {
            const centerGmrs = allGmrs.filter(
              (g) => g.centerId === center.id
            );

            const gmrNodes = centerGmrs.map((gmr) => {
              const gmrIdx = allGmrs.findIndex((g) => g.id === gmr.id);
              const teamNodes = teamsPerGmr[gmrIdx].map((team) => ({
                id: team.id,
                name: team.name,
                level: 3,
                children: [] as TreeNode[],
              }));

              return {
                id: gmr.id,
                name: gmr.name,
                level: 2,
                children: teamNodes,
              };
            });

            return {
              id: center.id,
              name: center.name,
              level: 1,
              children: gmrNodes,
            };
          });

          return {
            id: dir.id,
            name: dir.name,
            level: 0,
            children: centerNodes,
          };
        });

        if (cancelled) return;
        setTreeData(tree);
        setSelectedLeafIds(new Set(initialSelectedIds));
        setLoading(false);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load org units:", error);
          setLoading(false);
        }
      }
    };

    loadTreeData();

    return () => {
      cancelled = true;
    };
  }, [isOpen, initialSelectedIds]);

  return { treeData, loading, selectedLeafIds, setSelectedLeafIds };
}
