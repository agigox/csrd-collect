"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/lib/components/ui/tabs";
import { FormCard } from "./FormCard";

interface Form {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
}

const mockForms: Form[] = [
  {
    id: "1",
    code: "E2-4_vol_01",
    title: "Fuite d'huile (SF6)",
    description: "Déclaration permettant la collecte liée aux données de type fuite d'huile",
    category: "E2-Pollution",
  },
  {
    id: "2",
    code: "E2-4_vol_02",
    title: "Fuite de gaz",
    description: "Déclaration permettant la collecte liée aux données de type fuite de gaz",
    category: "E2-Pollution",
  },
  {
    id: "3",
    code: "E1-3_air_01",
    title: "Émissions atmosphériques",
    description: "Déclaration des émissions de polluants dans l'atmosphère",
    category: "E1-Pollution",
  },
  {
    id: "4",
    code: "E3-2_eau_01",
    title: "Pollution des eaux",
    description: "Déclaration des rejets dans les eaux de surface et souterraines",
    category: "E3-Pollution",
  },
  {
    id: "5",
    code: "E4-1_sol_01",
    title: "Contamination des sols",
    description: "Déclaration des incidents de contamination des sols",
    category: "E4-Pollution",
  },
];

const categories = [
  { value: "all", label: "Tous" },
  { value: "E1-Pollution", label: "E1-Pollution" },
  { value: "E2-Pollution", label: "E2-Pollution" },
  { value: "E3-Pollution", label: "E3-Pollution" },
  { value: "E4-Pollution", label: "E4-Pollution" },
];

export const FormsList = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredForms =
    activeTab === "all"
      ? mockForms
      : mockForms.filter((form) => form.category === activeTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="bg-primary h-auto p-0.5 rounded-full">
        {categories.map((category) => (
          <TabsTrigger
            key={category.value}
            value={category.value}
            className="rounded-full px-3 py-1.5 text-sm text-primary-foreground data-[state=active]:bg-white data-[state=active]:text-primary"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={activeTab} className="mt-4">
        <div className="flex flex-col gap-2">
          {filteredForms.map((form) => (
            <FormCard
              key={form.id}
              code={form.code}
              title={form.title}
              description={form.description}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
