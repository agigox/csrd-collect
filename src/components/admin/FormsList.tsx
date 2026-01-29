"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormCard } from "./FormCard";
import { useFormsStore } from "@/stores";
import { Tab } from "@rte-ds/react";

const categories = [
  { id: "all", label: "Tous", panelId: "panel-all" },
  { id: "E1-Pollution", label: "E1-Pollution", panelId: "panel-e1" },
  { id: "E2-Pollution", label: "E2-Pollution", panelId: "panel-e2" },
  { id: "E3-Pollution", label: "E3-Pollution", panelId: "panel-e3" },
  { id: "E4-Pollution", label: "E4-Pollution", panelId: "panel-e4" },
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
    return (
      <div className="text-center py-8">Chargement des formulaires...</div>
    );
  }

  return (
    <div className="w-full">
      <Tab
        options={categories}
        selectedTabId={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
      />

      <div className="mt-4">
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
      </div>
    </div>
  );
};
