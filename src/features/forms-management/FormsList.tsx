"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormCard } from "./FormCard";
import { useFormsStore } from "@/stores";
import { SegmentedTabs } from "@rte-ds/react";
import { EmptyCard } from "@/lib/ui/EmptyCard";

const categories = [
  { id: "all", label: "Tous", content: null },
  { id: "E1-2", label: "E1-2", content: null },
  { id: "E2-4", label: "E2-4", content: null },
  { id: "E3-2", label: "E3-2", content: null },
  { id: "E4-2", label: "E4-2", content: null },
];

export const FormsList = () => {
  const [activeSegment, setActiveSegment] = useState("all");
  const [currentSelectedForm, setCurrentSelectedForm] = useState("");
  const { forms, loading, fetchForms, publishForm } = useFormsStore();
  const router = useRouter();

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleFormClick = (formId: string) => {
    setCurrentSelectedForm(formId);
    router.push(`/admin/${formId}`);
  };

  const handlePublish = async (formId: string) => {
    try {
      await publishForm(formId);
    } catch (err) {
      console.error("Erreur lors de la publication:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Chargement des formulaires...</div>
    );
  }

  const tabsWithContent = categories.map((cat) => {
    const filteredForms =
      cat.id === "all"
        ? forms
        : forms.filter((form) => form.categoryCode === cat.id);

    return {
      ...cat,
      content: (
        <div className="pt-6 flex flex-col gap-2 w-full m:w-143.5">
          {filteredForms.length === 0 ? (
            <EmptyCard message="Aucun formulaire disponible dans cette catégorie" />
          ) : (
            filteredForms.map((form) => (
              <FormCard
                key={form.id}
                code={form.code}
                title={form.name}
                description={form.description ?? ""}
                status={form.isPublished ? "published" : "draft"}
                onClick={() => handleFormClick(form.id)}
                onPublish={() => handlePublish(form.id)}
                pressed={currentSelectedForm === form.id}
              />
            ))
          )}
        </div>
      ),
    };
  });

  return (
    <SegmentedTabs
      tabs={tabsWithContent}
      selectedTab={activeSegment}
      onChange={(id) => setActiveSegment(id)}
      size="s"
      width="440px"
    />
  );
};
