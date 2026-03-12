"use client";

import { useMemo, useEffect, useState } from "react";
import { useDeclarationsStore } from "@/stores";
import type { Declaration } from "@/models/Declaration";
import PageTitle from "@/lib/ui/page-title";
import Filters, { type FiltersState } from "./FiltersList";
import DeclarationCard from "./DeclarationCard";
import { Button, Divider, IconButtonToggle } from "@rte-ds/react";
import { EmptyCard } from "@/lib/ui/EmptyCard";

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
    status: [],
    authorName: [],
    teamId: [],
  });

  const handleFilterToggle = () => {
    setIsFilterOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchDeclarations();
  }, [fetchDeclarations]);

  // Check if filters are active
  const hasActiveFilters = useMemo(
    () =>
      filters.status.length > 0 ||
      filters.authorName.length > 0 ||
      filters.teamId.length > 0,
    [filters],
  );

  const filteredDeclarations = useMemo(() => {
    if (!hasActiveFilters) return declarations;

    return declarations.filter((declaration) => {
      const matchesStatus =
        filters.status.length === 0 ||
        filters.status.includes(declaration.status);
      const matchesAuthor =
        filters.authorName.length === 0 ||
        filters.authorName.includes(declaration.authorName);
      const matchesTeam =
        filters.teamId.length === 0 ||
        filters.teamId.includes(declaration.teamId);

      return matchesStatus && matchesAuthor && matchesTeam;
    });
  }, [declarations, filters, hasActiveFilters]);

  const groupedDeclarations = useMemo(() => {
    const groups: Record<string, typeof filteredDeclarations> = {};

    filteredDeclarations.forEach((declaration) => {
      const date = new Date(declaration.createdAt);
      const dateKey = date.toLocaleDateString("fr-FR");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(declaration);
    });

    return groups;
  }, [filteredDeclarations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Chargement des déclarations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start justify-center p-8">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    );
  }

  const hasDeclarations = Object.keys(groupedDeclarations).length > 0;

  return (
    <div className="flex flex-col pl-4">
      <div className="flex flex-col gap-2 pb-2.5 pt-2.75">
        <div className="flex items-center gap-2">
          <PageTitle title="Déclarations" />

          <IconButtonToggle
            aria-label="Afficher/masquer les filtres"
            name="filter-alt"
            onClick={handleFilterToggle}
            size="m"
            variant="secondary"
            selected={isFilterOpen}
            disabled={declarations.length === 0}
          />

          <Button
            icon="campaign"
            iconPosition="right"
            iconAppearance="filled"
            label="Déclarer"
            onClick={onDeclarer}
            variant="primary"
          />
        </div>
      </div>

      <Filters
        isOpen={isFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        declarations={declarations}
        onClose={handleFilterToggle}
      />

      {!hasDeclarations ? (
        <EmptyCard
          message={
            hasActiveFilters
              ? "Aucune déclaration ne correspond aux filtres sélectionnés"
              : "Aucune déclaration pour le moment"
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(groupedDeclarations).map(
            ([date, dateDeclarations]) => (
              <div key={date}>
                <Divider text={date} />

                <div className="flex flex-col gap-4">
                  {dateDeclarations.map((declaration) => (
                    <DeclarationCard
                      key={declaration.id}
                      createdAt={declaration.createdAt}
                      authorName={declaration.authorName}
                      formName={declaration.formTemplate?.name || ""}
                      location={declaration.location}
                      onClick={() => onEditDeclaration?.(declaration)}
                      isSelected={declaration.id === selectedDeclarationId}
                      isNew={declaration.isNew}
                    />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default DeclarationsList;
