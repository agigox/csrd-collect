"use client";

import { Button } from "@/lib/ui/button";
import Icon from "@/lib/Icons";

interface HeaderProps {
  onSearch?: () => void;
  onFilter?: () => void;
  onDeclarer?: () => void;
}

const Header = ({ onSearch, onFilter, onDeclarer }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-2 py-2.5">
      {/* Header row */}
      <div className="flex items-center gap-2">
        {/* Title */}
        <h1 className="flex-1 text-2xl font-semibold text-content-text tracking-tight">
          Déclarations
        </h1>

        {/* Search button */}
        <Button className="w-8" onClick={onSearch} variant="outline">
          <Icon name="search" />
        </Button>

        {/* Filter button */}
        <Button
          className="w-8"
          onClick={onFilter}
          variant="outline"
          size="default"
        >
          <Icon name="filter" />
        </Button>

        {/* Déclarer button */}
        <Button onClick={onDeclarer}>
          <span>Déclarer</span>
          <Icon name="campaign" />
        </Button>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border-default" />
    </div>
  );
};

export default Header;
