"use client";

import { useState } from "react";
import { Searchbar, Icon } from "@rte-ds/react";

// --- Types ---

export interface TreeNode {
  id: string;
  name: string;
  level: number;
  children: TreeNode[];
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

function computeAutoExpandedIds(
  nodes: TreeNode[],
  query: string
): Set<string> {
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
  onToggleSelection: (node: TreeNode) => void;
}

function TreeNodeList({
  nodes,
  selectedLeafIds,
  expandedIds,
  onToggleExpanded,
  onToggleSelection,
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
  onToggleSelection: (node: TreeNode) => void;
}

function TreeNodeRow({
  node,
  selectedLeafIds,
  expandedIds,
  onToggleExpanded,
  onToggleSelection,
}: TreeNodeRowProps) {
  const isExpanded = expandedIds.has(node.id);
  const isLeaf = node.level === 3;

  const leaves = getLeafDescendants(node);
  const leafIds = leaves.map((l) => l.id);
  const allSelected =
    leafIds.length > 0 && leafIds.every((id) => selectedLeafIds.has(id));
  const someSelected = leafIds.some((id) => selectedLeafIds.has(id));
  const isIndeterminate = someSelected && !allSelected;

  return (
    <>
      <div style={{ paddingLeft: `${node.level * 20}px` }}>
        <div
          className="flex items-center border border-[#a1a1a0] rounded px-2 py-1 cursor-pointer"
          onClick={() => {
            if (!isLeaf) onToggleExpanded(node.id);
          }}
        >
          {!isLeaf && (
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Icon
                name={
                  isExpanded ? "arrow-chevron-down" : "arrow-chevron-right"
                }
                size={16}
              />
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
  onToggleSelection: (node: TreeNode) => void;
}

export default function OrgUnitTree({
  treeData,
  loading,
  selectedLeafIds,
  onToggleSelection,
}: OrgUnitTreeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

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

  return (
    <div className="flex flex-col gap-4" style={{ maxHeight: "60vh" }}>
      <Searchbar
        appearance="secondary"
        value={searchQuery}
        onChange={(val) => setSearchQuery(val ?? "")}
        onClear={() => setSearchQuery("")}
        fullWidth
        label="Rechercher"
      />

      <div style={{ overflowY: "auto", flex: 1 }}>
        {loading ? (
          <div className="flex items-center justify-center h-40 text-sm text-gray-500">
            Chargement...
          </div>
        ) : visibleTree.length === 0 && searchQuery ? (
          <div className="text-center text-sm text-gray-500">
            Aucun résultat pour cette recherche
          </div>
        ) : visibleTree.length === 0 ? (
          <div className="text-center text-sm text-gray-500">
            Aucune équipe disponible
          </div>
        ) : (
          <TreeNodeList
            nodes={visibleTree}
            selectedLeafIds={selectedLeafIds}
            expandedIds={effectiveExpandedIds}
            onToggleExpanded={toggleExpanded}
            onToggleSelection={onToggleSelection}
          />
        )}
      </div>
    </div>
  );
}
