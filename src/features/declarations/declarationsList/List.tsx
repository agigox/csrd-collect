"use client";

import type { Declaration } from "@/models/Declaration";
import DeclarationCard from "../DeclarationCard";

interface ListProps {
  groupedDeclarations: Record<string, Declaration[]>;
  onEditDeclaration?: (declaration: Declaration) => void;
  selectedDeclarationId?: string;
  isSearchActive?: boolean;
  searchQuery?: string;
}

interface DateSeparatorProps {
  date: string;
}

const DateSeparator = ({ date }: DateSeparatorProps) => (
  <div className="flex items-center gap-4 py-2">
    <span className="text-sm text-gray-500 whitespace-nowrap">{date}</span>
    <div className="flex-1 h-px bg-gray-300" />
  </div>
);

const List = ({
  groupedDeclarations,
  onEditDeclaration,
  selectedDeclarationId,
  isSearchActive = false,
  searchQuery = "",
}: ListProps) => {
  const hasDeclarations = Object.keys(groupedDeclarations).length > 0;

  if (!hasDeclarations) {
    const message = isSearchActive && searchQuery
      ? `Aucune déclaration trouvée pour "${searchQuery}"`
      : "Aucune déclaration ne correspond aux filtres sélectionnés";

    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">{message}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(groupedDeclarations).map(([date, dateDeclarations]) => (
        <div key={date}>
          <DateSeparator date={date} />
          <div className="flex flex-col gap-4">
            {dateDeclarations.map((declaration) => (
              <DeclarationCard
                key={declaration.id}
                createdAt={declaration.createdAt}
                authorName={declaration.authorName}
                name={declaration.formData.name}
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
