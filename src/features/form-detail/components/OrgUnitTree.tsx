"use client";

import { useState, useEffect } from "react";
import { Searchbar, Icon, Loader } from "@rte-ds/react";
import LoadingState from "@/lib/ui/loading-state";
import { EmptyCard } from "@/lib/ui/EmptyCard";

// --- Types ---

export interface TreeNode {
  id: string;
  name: string;
  level: number;
  children: TreeNode[];
  childrenLoaded?: boolean;
  loading?: boolean;
}

// --- Pure utility functions ---

export function getLeafDescendants(node: TreeNode): TreeNode[] {
  if (node.level === 3) return [node];
  const leaves: TreeNode[] = [];
  for (const child of node.children) {
    leaves.push(...getLeafDescendants(child));
  }
  return leaves;
}

function nodeMatches(node: TreeNode, query: string): boolean {
  if (node.name.toLowerCase().includes(query.toLowerCase())) return true;
  return node.children.some((child) => nodeMatches(child, query));
}

function filterVisibleTree(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query) return nodes;
  return nodes
    .filter((node) => nodeMatches(node, query))
    .map((node) => ({
      ...node,
      children: filterVisibleTree(node.children, query),
    }));
}

function computeAutoExpandedIds(nodes: TreeNode[], query: string): Set<string> {
  const result = new Set<string>();
  const q = query.toLowerCase();

  const traverse = (node: TreeNode): boolean => {
    const selfMatches = node.name.toLowerCase().includes(q);
    let childMatches = false;
    for (const child of node.children) {
      if (traverse(child)) childMatches = true;
    }
    if (childMatches && node.level < 3) {
      result.add(node.id);
    }
    return selfMatches || childMatches;
  };

  for (const node of nodes) {
    traverse(node);
  }
  return result;
}

// --- Components ---

function TreeCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className="w-4 h-4 shrink-0 rounded-sm border border-[#737272] flex items-center justify-center"
      style={{
        backgroundColor: checked || indeterminate ? "#2964a0" : "white",
        borderColor: checked || indeterminate ? "#2964a0" : "#737272",
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {indeterminate && !checked && (
        <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
          <path
            d="M1 1H7"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}

interface TreeNodeListProps {
  nodes: TreeNode[];
  selectedLeafIds: Set<string>;
  expandedIds: Set<string>;
  onToggleExpanded: (nodeId: string) => void;
  onToggleSelection: (node: TreeNode) => void | Promise<void>;
  onLoadChildren?: (nodeId: string) => Promise<void>;
}

function TreeNodeList({
  nodes,
  selectedLeafIds,
  expandedIds,
  onToggleExpanded,
  onToggleSelection,
  onLoadChildren,
}: TreeNodeListProps) {
  return (
    <div className="flex flex-col gap-1">
      {nodes.map((node) => (
        <TreeNodeRow
          key={node.id}
          node={node}
          selectedLeafIds={selectedLeafIds}
          expandedIds={expandedIds}
          onToggleExpanded={onToggleExpanded}
          onToggleSelection={onToggleSelection}
          onLoadChildren={onLoadChildren}
        />
      ))}
    </div>
  );
}

interface TreeNodeRowProps {
  node: TreeNode;
  selectedLeafIds: Set<string>;
  expandedIds: Set<string>;
  onToggleExpanded: (nodeId: string) => void;
  onToggleSelection: (node: TreeNode) => void | Promise<void>;
  onLoadChildren?: (nodeId: string) => Promise<void>;
}

function TreeNodeRow({
  node,
  selectedLeafIds,
  expandedIds,
  onToggleExpanded,
  onToggleSelection,
  onLoadChildren,
}: TreeNodeRowProps) {
  const isExpanded = expandedIds.has(node.id);
  const isLeaf = node.level === 3;

  const leaves = getLeafDescendants(node);
  const leafIds = leaves.map((l) => l.id);
  const allSelected =
    leafIds.length > 0 && leafIds.every((id) => selectedLeafIds.has(id));
  const someSelected = leafIds.some((id) => selectedLeafIds.has(id));
  const isIndeterminate = someSelected && !allSelected;

  const handleToggle = async () => {
    if (isLeaf) return;

    const willExpand = !isExpanded;
    if (willExpand && !node.childrenLoaded && onLoadChildren) {
      await onLoadChildren(node.id);
    }
    onToggleExpanded(node.id);
  };

  return (
    <>
      <div style={{ paddingLeft: `${node.level * 20}px` }}>
        <div
          className="flex items-center border border-[#a1a1a0] rounded px-2 py-1 cursor-pointer"
          onClick={handleToggle}
        >
          {!isLeaf && (
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              {node.loading ? (
                <div className="w-4 h-4 border-2 border-[#2964a0] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon
                  name={
                    isExpanded ? "arrow-chevron-down" : "arrow-chevron-right"
                  }
                  size={16}
                />
              )}
            </div>
          )}

          <span
            className="flex-1 text-sm text-[#201f1f] truncate"
            style={{ paddingLeft: "8px" }}
          >
            {node.name}
          </span>

          <TreeCheckbox
            checked={allSelected}
            indeterminate={isIndeterminate}
            onChange={() => onToggleSelection(node)}
          />
        </div>
      </div>

      {!isLeaf && isExpanded && node.children.length > 0 && (
        <TreeNodeList
          nodes={node.children}
          selectedLeafIds={selectedLeafIds}
          expandedIds={expandedIds}
          onToggleExpanded={onToggleExpanded}
          onToggleSelection={onToggleSelection}
          onLoadChildren={onLoadChildren}
        />
      )}
    </>
  );
}

// --- Main exported component ---

interface OrgUnitTreeProps {
  treeData: TreeNode[];
  loading: boolean;
  selectedLeafIds: Set<string>;
  onToggleSelection: (node: TreeNode) => void | Promise<void>;
  onLoadChildren?: (nodeId: string) => Promise<void>;
  initialExpandedIds?: Set<string>;
}

export default function OrgUnitTree({
  treeData,
  loading,
  selectedLeafIds,
  onToggleSelection,
  onLoadChildren,
  initialExpandedIds,
}: OrgUnitTreeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Apply initial expanded IDs when they change (e.g. after loading pre-selected teams)
  useEffect(() => {
    if (initialExpandedIds && initialExpandedIds.size > 0) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        initialExpandedIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }, [initialExpandedIds]);

  // When search is active, load all unloaded nodes so they become searchable
  useEffect(() => {
    if (!searchQuery || !onLoadChildren) return;

    const loadAllUnloaded = async (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.level < 3 && !node.childrenLoaded) {
          await onLoadChildren(node.id);
        }
        if (node.children.length > 0) {
          await loadAllUnloaded(node.children);
        }
      }
    };

    loadAllUnloaded(treeData);
  }, [searchQuery, treeData, onLoadChildren]);

  const toggleExpanded = (nodeId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const effectiveExpandedIds =
    searchQuery.length > 0
      ? computeAutoExpandedIds(treeData, searchQuery)
      : expandedIds;

  const visibleTree = filterVisibleTree(treeData, searchQuery);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col gap-4 w-[65%]" style={{ flex: 1 }}>
      <Searchbar
        appearance="secondary"
        value={searchQuery}
        onChange={(val) => setSearchQuery(val ?? "")}
        onClear={() => setSearchQuery("")}
        fullWidth
        label="Rechercher"
      />

      <div style={{ overflowY: "auto", flex: 1 }}>
        {visibleTree.length === 0 && searchQuery ? (
          <EmptyCard message="Aucun résultat pour cette recherche" />
        ) : visibleTree.length === 0 ? (
          <EmptyCard message="Aucune équipe disponible" />
        ) : (
          <TreeNodeList
            nodes={visibleTree}
            selectedLeafIds={selectedLeafIds}
            expandedIds={effectiveExpandedIds}
            onToggleExpanded={toggleExpanded}
            onToggleSelection={onToggleSelection}
            onLoadChildren={onLoadChildren}
          />
        )}
      </div>
    </div>
  );
}
