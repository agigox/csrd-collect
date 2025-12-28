"use client";

import { useState, useEffect } from "react";
import { DynamicForm, FormBuilder, FieldConfig } from "@/lib/form-fields";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { Button } from "@/lib/components/ui/button";
import { useForms } from "@/context/FormsContext";
import Icon from "@/lib/Icons";

export default function AdminParametrageDeclaratifPage() {
  const { forms, loading, currentForm, setCurrentForm, saveForm, createForm } =
    useForms();
  const [schema, setSchema] = useState<FieldConfig[]>([]);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [previewValues, setPreviewValues] = useState<Record<string, unknown>>(
    {}
  );
  const [previewErrors, setPreviewErrors] = useState<Record<string, string>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentForm) {
      setSchema(currentForm.schema);
      setFormName(currentForm.name);
      setFormDescription(currentForm.description);
    } else {
      setSchema([]);
      setFormName("");
      setFormDescription("");
    }
    setPreviewValues({});
    setPreviewErrors({});
  }, [currentForm]);

  const handleSave = async () => {
    if (!formName.trim()) {
      alert("Veuillez entrer un nom pour le formulaire");
      return;
    }

    setIsSaving(true);

    try {
      if (currentForm) {
        saveForm({
          ...currentForm,
          name: formName,
          description: formDescription,
          schema,
        });
      } else {
        const newForm = createForm({
          name: formName,
          description: formDescription,
          schema,
        });
        setCurrentForm(newForm);
      }
      alert("Formulaire sauvegardé avec succès !");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewForm = () => {
    setCurrentForm(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p>Chargement des formulaires...</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-[calc(100vh-0px)] flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold">Paramétrage déclaratif</h1>
        <div className="flex gap-2">
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={currentForm?.id || ""}
            onChange={(e) => {
              const form = forms.find((f) => f.id === e.target.value);
              setCurrentForm(form || null);
            }}
          >
            <option value="">Nouveau formulaire</option>
            {forms.map((form) => (
              <option key={form.id} value={form.id}>
                {form.name}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={handleNewForm}>
            <Icon name="plus" size={16} />
            Nouveau
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[calc(100%-300px-24px)_300px] gap-6 flex-1 min-h-0">
        {/* Configuration des champs */}
        <Card className="flex flex-col min-h-0 relative">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Configuration des champs</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4 pb-20">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nom du formulaire
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Ex: Fuite d'huile"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Description du formulaire"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
            <div className="border-t pt-4">
              <FormBuilder
                schema={schema}
                onChange={setSchema}
                floatingButton
              />
            </div>
          </CardContent>
        </Card>

        {/* Aperçu du formulaire */}
        <Card className="flex flex-col h-[300px] w-[300px] relative">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Aperçu du formulaire</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-6 pb-20">
            {schema.length === 0 ? (
              <div className="text-center py-8 text-content-muted">
                Ajoutez des champs pour voir l&apos;aperçu
              </div>
            ) : (
              <DynamicForm
                schema={schema}
                values={previewValues}
                onChange={setPreviewValues}
                errors={previewErrors}
              />
            )}
          </CardContent>
          {/* Bouton Sauvegarder flottant */}
          <div className="absolute bottom-[10px] left-0 right-0 px-6">
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              <Icon name="save" size={16} />
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
