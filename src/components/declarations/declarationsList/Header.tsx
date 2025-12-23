"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import AddDeclaration from "@/components/declarations/addDeclaration";

interface HeaderProps {
  onSearch?: () => void;
  onFilter?: () => void;
}

const Header = ({ onSearch, onFilter }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-2 py-2.5">
      {/* Header row */}
      <div className="flex items-center gap-2">
        {/* Title */}
        <h1 className="flex-1 text-2xl font-semibold text-content-text tracking-tight">
          Déclarations
        </h1>

        {/* Search button */}
        <button
          onClick={onSearch}
          className="flex items-center justify-center w-8 h-8 bg-bg-default border border-border-brand rounded hover:bg-gray-50 transition-colors"
          title="Rechercher"
        >
          <Search className="w-5 h-5 text-brand" />
        </button>

        {/* Filter button */}
        <button
          onClick={onFilter}
          className="flex items-center justify-center w-8 h-8 bg-bg-default border border-border-brand rounded hover:bg-gray-50 transition-colors"
          title="Filtrer"
        >
          <SlidersHorizontal className="w-5 h-5 text-brand" />
        </button>

        {/* Déclarer button with Dialog */}
        <AddDeclaration />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border-default" />
    </div>
  );
};

export default Header;
