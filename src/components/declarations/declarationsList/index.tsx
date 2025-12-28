"use client";

import { useDeclarations } from "@/context/DeclarationsContext";
import DeclarationCard from "../DeclarationCard";
import Header from "./Header";

interface DeclarationsListProps {
  onDeclarer?: () => void;
}

const DeclarationsList = ({ onDeclarer }: DeclarationsListProps) => {
  const { declarations, loading, error } = useDeclarations();

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
        {declarations.map((declaration) => (
          <DeclarationCard
            key={declaration.id}
            date={declaration.date}
            author={declaration.author}
            title={declaration.title}
            description={declaration.description}
            onClick={() => console.log("Clicked:", declaration.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default DeclarationsList;
