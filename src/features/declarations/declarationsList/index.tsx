"use client";

import { useMemo, useEffect, useState } from "react";
import { useDeclarationsStore, type Declaration } from "@/stores";
import Header from "./Header";
import Filters, { type FiltersState } from "./Filters";
import List from "./List";

interface DeclarationsListProps {
  onDeclarer?: () => void;
  onEditDeclaration?: (declaration: Declaration) => void;
  selectedDeclarationId?: string;
}

const DeclarationsList = ({
  onDeclarer,
  onEditDeclaration,
  selectedDeclarationId,
}: DeclarationsListProps) => {
  const { declarations, loading, error, fetchDeclarations } =
    useDeclarationsStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    declarationType: [],
    users: [],
  });

  const handleFilterToggle = () => {
    setIsFilterOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchDeclarations();
  }, [fetchDeclarations]);

  const groupedDeclarations = useMemo(() => {
    const groups: Record<string, typeof declarations> = {};

    declarations.forEach((declaration) => {
      // Format createdAt to display date
      const date = new Date(declaration.createdAt);
      const dateKey = date.toLocaleDateString('fr-FR');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(declaration);
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
    <div className="w-full max-w-101.5">
      <Header
        onDeclarer={onDeclarer}
        onFilter={handleFilterToggle}
        isFilterOpen={isFilterOpen}
      />

      <Filters
        isOpen={isFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <List
        groupedDeclarations={groupedDeclarations}
        onEditDeclaration={onEditDeclaration}
        selectedDeclarationId={selectedDeclarationId}
      />
    </div>
  );
};

export default DeclarationsList;
