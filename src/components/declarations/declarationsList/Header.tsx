"use client";

import { Search, SlidersHorizontal, Megaphone } from "lucide-react";

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

        {/* Déclarer button */}
        <button
          onClick={onDeclarer}
          className="flex items-center gap-1.5 h-8 px-3 bg-bg-brand hover:bg-brand-hover text-white font-semibold text-base rounded transition-colors"
        >
          Déclarer
          <Megaphone className="w-5 h-5" />
        </button>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border-default" />
    </div>
  );
};

export default Header;
