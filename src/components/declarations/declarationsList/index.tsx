"use client";

import { useMemo, useEffect } from "react";
import { useDeclarationsStore, type Declaration } from "@/stores";
import DeclarationCard from "../DeclarationCard";
import Header from "./Header";

interface DeclarationsListProps {
  onDeclarer?: () => void;
  onEditDeclaration?: (declaration: Declaration) => void;
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

const DeclarationsList = ({ onDeclarer, onEditDeclaration }: DeclarationsListProps) => {
  const { declarations, loading, error, fetchDeclarations } = useDeclarationsStore();

  useEffect(() => {
    fetchDeclarations();
  }, [fetchDeclarations]);

  const groupedDeclarations = useMemo(() => {
    const groups: Record<string, typeof declarations> = {};

    declarations.forEach((declaration) => {
      const date = declaration.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(declaration);
    });

    return groups;
  }, [declarations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Chargement des déclarations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <Header onDeclarer={onDeclarer} />

      <div className="flex flex-col gap-4">
        {Object.entries(groupedDeclarations).map(([date, dateDeclarations]) => (
          <div key={date}>
            <DateSeparator date={date} />
            <div className="flex flex-col gap-4">
              {dateDeclarations.map((declaration) => (
                <DeclarationCard
                  key={declaration.id}
                  date={declaration.date}
                  author={declaration.author}
                  title={declaration.title}
                  description={declaration.description}
                  onClick={() => onEditDeclaration?.(declaration)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeclarationsList;
