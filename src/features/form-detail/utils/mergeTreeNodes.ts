import type { TreeNode } from "../components/OrgUnitTree";

export interface MergedTreeNode {
  /** All original nodes in the chain, from topmost to deepest */
  chain: TreeNode[];
  /** Name of the deepest node (what gets displayed) */
  displayName: string;
  /** Level of the topmost node (used for indentation) */
  displayLevel: number;
  /** The deepest node in the chain (used for children, expand, selection) */
  effectiveNode: TreeNode;
  /** Recursively merged children of the effective node */
  children: MergedTreeNode[];
}

function namesMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Build a presentation-layer merged tree from raw TreeNode[].
 * Consecutive single-child nodes with the same name (case-insensitive)
 * are collapsed into a single MergedTreeNode.
 */
export function buildMergedTree(nodes: TreeNode[]): MergedTreeNode[] {
  return nodes.map((node) => {
    const chain: TreeNode[] = [node];
    let current = node;

    while (
      current.children.length === 1 &&
      current.childrenLoaded !== false &&
      namesMatch(current.name, current.children[0].name)
    ) {
      current = current.children[0];
      chain.push(current);
    }

    return {
      chain,
      displayName: current.name,
      displayLevel: node.level,
      effectiveNode: current,
      children: buildMergedTree(current.children),
    };
  });
}

export function getMergedChainIds(merged: MergedTreeNode): string[] {
  return merged.chain.map((n) => n.id);
}

/**
 * Returns a tooltip label showing the collapsed hierarchy path,
 * or null if no merge occurred (chain length === 1).
 */
export function getMergedTooltipLabel(merged: MergedTreeNode): string | null {
  if (merged.chain.length <= 1) return null;
  return merged.chain.map((n) => n.name).join(" > ");
}
