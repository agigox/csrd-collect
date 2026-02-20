"use client";

import type { Declaration } from "@/models/Declaration";
import DeclarationCard from "../DeclarationCard";
import { Divider } from "@rte-ds/react";
import { EmptyCard } from "@/lib/ui/EmptyCard";

interface ListProps {
  groupedDeclarations: Record<string, Declaration[]>;
  onEditDeclaration?: (declaration: Declaration) => void;
  selectedDeclarationId?: string;
  isSearchActive?: boolean;
  searchQuery?: string;
  hasActiveFilters?: boolean;
}

const List = ({
  groupedDeclarations,
  onEditDeclaration,
  selectedDeclarationId,
  isSearchActive = false,
  searchQuery = "",
  hasActiveFilters = false,
}: ListProps) => {
  const hasDeclarations = Object.keys(groupedDeclarations).length > 0;

  if (!hasDeclarations) {
    let message = "Aucune déclaration pour le moment";

    if (isSearchActive && searchQuery) {
      message = `Aucune déclaration trouvée pour "${searchQuery}"`;
    } else if (hasActiveFilters) {
      message = "Aucune déclaration ne correspond aux filtres sélectionnés";
    }

    return <EmptyCard message={message} />;
  }
  console.log(groupedDeclarations);

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(groupedDeclarations).map(([date, dateDeclarations]) => (
        <div key={date}>
          <Divider text={date} />

          <div className="flex flex-col gap-4">
            {dateDeclarations.map((declaration) => (
              <DeclarationCard
                key={declaration.id}
                createdAt={declaration.createdAt}
                authorName={declaration.authorName}
                name={declaration.name}
                description={declaration.description}
                onClick={() => onEditDeclaration?.(declaration)}
                isSelected={declaration.id === selectedDeclarationId}
                isNew={declaration.isNew}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
