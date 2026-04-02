"use client";

import { useState } from "react";
import { Tab } from "@rte-ds/react";
import type { FormTemplate } from "@/models/FormTemplate";
import { EquipesTab } from "./tabs/EquipesTab";
import { AdministrateursTab } from "./tabs/AdministrateursTab";
import { ParametresTab } from "./tabs/ParametresTab";
import { PreviewTab } from "./tabs/PreviewTab";

const TAB_OPTIONS = [
  { id: "equipes", panelId: "panel-equipes", label: "Équipe(s) d'attribution" },
  {
    id: "administrateurs",
    panelId: "panel-administrateurs",
    label: "Administrateurs",
  },
  { id: "parametres", panelId: "panel-parametres", label: "Paramètres" },
  {
    id: "previsualisation",
    panelId: "panel-previsualisation",
    label: "Prévisualisation",
  },
];

interface FormDetailTabsProps {
  form: FormTemplate;
}

export function FormDetailTabs({ form }: FormDetailTabsProps) {
  const [activeTabId, setActiveTabId] = useState("equipes");
  const [prevFormId, setPrevFormId] = useState(form.id);

  // Reset to first tab when the selected form changes (during render, no effect needed)
  if (prevFormId !== form.id) {
    setPrevFormId(form.id);
    setActiveTabId("equipes");
  }

  return (
    <div className="flex flex-col gap-4">
      <Tab
        options={TAB_OPTIONS}
        selectedTabId={activeTabId}
        onChange={setActiveTabId}
        compactSpacing
      />

      {activeTabId === "equipes" && (
        <div role="tabpanel" id="panel-equipes" aria-labelledby="equipes">
          <EquipesTab form={form} />
        </div>
      )}
      {activeTabId === "administrateurs" && (
        <div
          role="tabpanel"
          id="panel-administrateurs"
          aria-labelledby="administrateurs"
        >
          <AdministrateursTab form={form} />
        </div>
      )}
      {activeTabId === "parametres" && (
        <div role="tabpanel" id="panel-parametres" aria-labelledby="parametres">
          <ParametresTab form={form} />
        </div>
      )}
      {activeTabId === "previsualisation" && (
        <div
          role="tabpanel"
          id="panel-previsualisation"
          aria-labelledby="previsualisation"
        >
          <PreviewTab form={form} />
        </div>
      )}
    </div>
  );
}
