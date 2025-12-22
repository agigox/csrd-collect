import DeclarationCard from "./DeclarationCard";

const declarations = [
  {
    date: "12/02/2025",
    author: "Jérome Menard",
    title: "Fuite d'huile",
    description: "Châteauneuf-du-Rhône départ Boudeyre",
  },
  {
    date: "10/02/2025",
    author: "Marie Dupont",
    title: "Incident électrique",
    description: "Centrale de Tricastin - Secteur B",
  },
  {
    date: "08/02/2025",
    author: "Pierre Martin",
    title: "Anomalie température",
    description: "Station de pompage Donzère",
  },
];
const DeclarationsList = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-normal text-center mb-8">
        Déclarations récentes
      </h1>

      <div className="flex flex-col gap-4 max-w-[480px] mx-auto">
        {declarations.map((declaration, index) => (
          <DeclarationCard
            key={index}
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
