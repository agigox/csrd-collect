"use client";

import Icon from "@/lib/Icons";
import { typeLabels } from "../types";
import type { FieldType } from "../../types";

interface HeaderProps {
  type: FieldType;
  onDuplicate: () => void;
  onRemove: () => void;
}

export const Header = ({ type, onDuplicate, onRemove }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center h-10">
      <h2 className="font-bold text-base">{typeLabels[type]}</h2>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDuplicate}
          className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
          title="Dupliquer ce champ"
        >
          <Icon
            name="dependency"
            height={21}
            width={20}
            color="var(--primary)"
          />
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
          title="Dupliquer ce champ"
        >
          <Icon
            name="duplicate"
            height={20}
            width={17}
            color="var(--primary)"
          />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
          title="Supprimer ce champ"
        >
          <Icon name="trash" color="#ED1C1C" />
        </button>
      </div>
    </div>
  );
};

export default Header;
