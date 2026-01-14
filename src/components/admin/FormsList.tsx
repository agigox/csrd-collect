"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/lib/components/ui/tabs";
import { FormCard } from "./FormCard";
import { useFormsStore } from "@/stores";

const categories = [
  { value: "all", label: "Tous" },
  { value: "E1-Pollution", label: "E1-Pollution" },
  { value: "E2-Pollution", label: "E2-Pollution" },
  { value: "E3-Pollution", label: "E3-Pollution" },
  { value: "E4-Pollution", label: "E4-Pollution" },
];

export const FormsList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { forms, loading, setCurrentForm, fetchForms } = useFormsStore();
  const router = useRouter();

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Clear currentForm when returning to the list
  useEffect(() => {
    setCurrentForm(null);
  }, [setCurrentForm]);

  const filteredForms =
    activeTab === "all"
      ? forms
      : forms.filter((form) => form.norme === activeTab);

  const handleFormClick = (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (form) {
      setCurrentForm(form);
      router.push("/admin/parametrage-declaratif");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des formulaires...</div>;
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="bg-primary h-8 p-0.5 rounded-full">
        {categories.map((category) => (
          <TabsTrigger
            key={category.value}
            value={category.value}
            className="rounded-full px-3 py-1.5 h-7 text-sm text-primary-foreground data-[state=active]:bg-white data-[state=active]:text-primary"
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
              onClick={() => handleFormClick(form.id)}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
