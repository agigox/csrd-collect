"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormCard } from "./FormCard";
import { useFormsStore } from "@/stores";
import { Grid, SegmentedControl } from "@rte-ds/react";

const categories = [
  { id: "all", label: "Tous" },
  { id: "E1-2", label: "E1-2" },
  { id: "E2-4", label: "E2-4" },
  { id: "E3-2", label: "E3-2" },
  { id: "E4-2", label: "E4-2" },
];

export const FormsList = () => {
  const [activeSegment, setActiveSegment] = useState("all");
  const { forms, loading, setCurrentForm, fetchForms } = useFormsStore();
  const router = useRouter();

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  useEffect(() => {
    setCurrentForm(null);
  }, [setCurrentForm]);

  const filteredForms =
    activeSegment === "all"
      ? forms
      : forms.filter((form) => form.categoryCode === activeSegment);

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
    <Grid className="gap-6">
      <Grid.Col xxs={6}>
        <SegmentedControl
          options={categories}
          selectedSegment={activeSegment}
          onChange={(id) => setActiveSegment(id)}
          size="s"
        />
      </Grid.Col>
      <Grid.Col xxs={7}>
        <Grid className="gap-2">
          {filteredForms.map((form) => (
            <FormCard
              key={form.id}
              code={form.code}
              title={form.name}
              description={form.description ?? ""}
              onClick={() => handleFormClick(form.id)}
            />
          ))}
        </Grid>
      </Grid.Col>
    </Grid>
  );
};
