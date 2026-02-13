"use client";

import { Button, Divider, IconButton, IconButtonToggle, Searchbar } from "@rte-ds/react";

interface HeaderProps {
  onSearch?: () => void;
  onFilter?: () => void;
  onDeclarer?: () => void;
  isFilterOpen?: boolean;
  isSearchActive?: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  onSearchClose?: () => void;
}

const Header = ({
  onSearch,
  onFilter,
  onDeclarer,
  isFilterOpen = false,
  isSearchActive = false,
  searchQuery = "",
  onSearchQueryChange,
  onSearchClose,
}: HeaderProps) => {
  return (
    <div className="flex flex-col gap-2 pb-2.5 pt-2.75">
      {/* Header row */}
      <div className="flex items-center gap-2">
        {/* Title */}
        <h1 className="flex-1 text-2xl font-semibold text-content-text tracking-tight">
          Déclarations
        </h1>

        {/* Search button - highlighted when active */}
        <IconButton
          appearance={isSearchActive ? "filled" : "outlined"}
          aria-label="Rechercher"
          name="search"
          onClick={onSearch}
          size="m"
          variant={isSearchActive ? "primary" : "secondary"}
        />

        {/* Filter button */}
        <IconButtonToggle
          aria-label="Afficher/masquer les filtres"
          name="filter-alt"
          onClick={onFilter}
          size="m"
          variant="secondary"
          selected={isFilterOpen}
        />

        {/* Déclarer button */}
        <Button
          icon="campaign"
          iconPosition="right"
          iconAppearance="filled"
          label="Déclarer"
          onClick={onDeclarer}
          variant="primary"
        />
      </div>

      {/* Search bar row - conditionally rendered */}
      {isSearchActive && (
        <div className="flex items-center gap-2 py-2">
          <div className="flex-1">
            <Searchbar
              appearance="secondary"
              value={searchQuery}
              onChange={(input) => onSearchQueryChange?.(input ?? "")}
              onClear={() => onSearchQueryChange?.("")}
              label="Rechercher par nom..."
              showResetButton={true}
            />
          </div>
          <IconButton
            appearance="outlined"
            aria-label="Fermer la recherche"
            name="close"
            onClick={onSearchClose}
            size="m"
            variant="secondary"
          />
        </div>
      )}

      {/* Divider */}
      <Divider
        appearance="default"
        orientation="horizontal"
        thickness="light"
      />
    </div>
  );
};

export default Header;
