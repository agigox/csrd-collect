"use client";

import { Button, IconButton, IconButtonToggle } from "@rte-ds//react";

interface HeaderProps {
  onSearch?: () => void;
  onFilter?: () => void;
  onDeclarer?: () => void;
  isFilterOpen?: boolean;
}

const Header = ({
  onSearch,
  onFilter,
  onDeclarer,
  isFilterOpen = false,
}: HeaderProps) => {
  return (
    <div className="flex flex-col gap-2 py-2.5">
      {/* Header row */}
      <div className="flex items-center gap-2">
        {/* Title */}
        <h1 className="flex-1 text-2xl font-semibold text-content-text tracking-tight">
          Déclarations
        </h1>

        {/* Search button */}

        <IconButton
          appearance="outlined"
          aria-label="icon button aria label"
          badgeContent="empty"
          name="search"
          onClick={onSearch}
          size="m"
          variant="secondary"
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

      {/* Divider */}
      <div className="w-full h-px bg-border-default" />
    </div>
  );
};

export default Header;
