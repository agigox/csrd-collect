"use client";

import { useMemo, useEffect, useState } from "react";
import { useDeclarationsStore } from "@/stores";
import type { Declaration } from "@/models/Declaration";
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
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FiltersState>({
    status: [],
    authorName: [],
    teamId: [],
  });

  const handleSearchToggle = () => {
    if (isSearchActive) {
      // Closing search
      setIsSearchActive(false);
      setSearchQuery("");
    } else {
      // Opening search - close filters and clear them
      setIsSearchActive(true);
      setIsFilterOpen(false);
      setFilters({ status: [], authorName: [], teamId: [] });
    }
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
    setSearchQuery("");
  };

  const handleFilterToggle = () => {
    if (isFilterOpen) {
      // Closing filters
      setIsFilterOpen(false);
    } else {
      // Opening filters - close search and clear it
      setIsFilterOpen(true);
      setIsSearchActive(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    fetchDeclarations();
  }, [fetchDeclarations]);

  const filteredDeclarations = useMemo(() => {
    let result = declarations;

    // Apply search if active (mutually exclusive with filters)
    if (isSearchActive && searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((declaration) =>
        declaration.formData.name.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply filters if any are selected (only when search not active)
    const hasActiveFilters =
      filters.status.length > 0 ||
      filters.authorName.length > 0 ||
      filters.teamId.length > 0;

    if (hasActiveFilters && !isSearchActive) {
      result = result.filter((declaration) => {
        const matchesStatus =
          filters.status.length === 0 || filters.status.includes(declaration.status);
        const matchesAuthor =
          filters.authorName.length === 0 ||
          filters.authorName.includes(declaration.authorName);
        const matchesTeam =
          filters.teamId.length === 0 || filters.teamId.includes(declaration.teamId);

        return matchesStatus && matchesAuthor && matchesTeam;
      });
    }

    return result;
  }, [declarations, isSearchActive, searchQuery, filters]);

  const groupedDeclarations = useMemo(() => {
    const groups: Record<string, typeof filteredDeclarations> = {};

    filteredDeclarations.forEach((declaration) => {
      // Format createdAt to display date
      const date = new Date(declaration.createdAt);
      const dateKey = date.toLocaleDateString('fr-FR');
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
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-101.5">
      <Header
        onDeclarer={onDeclarer}
        onSearch={handleSearchToggle}
        onFilter={handleFilterToggle}
        isFilterOpen={isFilterOpen}
        isSearchActive={isSearchActive}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        onSearchClose={handleSearchClose}
      />

      <Filters
        isOpen={isFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        declarations={declarations}
        onClose={handleFilterToggle}
      />

      <List
        groupedDeclarations={groupedDeclarations}
        onEditDeclaration={onEditDeclaration}
        selectedDeclarationId={selectedDeclarationId}
        isSearchActive={isSearchActive}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default DeclarationsList;
