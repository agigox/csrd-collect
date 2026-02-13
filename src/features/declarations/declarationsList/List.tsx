"use client";

import type { Declaration } from "@/models/Declaration";
import DeclarationCard from "../DeclarationCard";

interface ListProps {
  groupedDeclarations: Record<string, Declaration[]>;
  onEditDeclaration?: (declaration: Declaration) => void;
  selectedDeclarationId?: string;
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
}: ListProps) => {
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
