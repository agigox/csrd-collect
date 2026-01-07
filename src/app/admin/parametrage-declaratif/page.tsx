"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DynamicForm, FormBuilder, FieldConfig } from "@/lib/form-fields";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { useForms } from "@/context/FormsContext";
import Icon from "@/lib/Icons";
import { Divider } from "@/lib/Divider";
import { ScrollableContainer } from "@/lib/utils/ScrollableContainer";

const normeOptions = [
  { value: "E1-Pollution", label: "E1 - Pollution" },
  { value: "E2-Pollution", label: "E2 - Pollution" },
  { value: "E3-Pollution", label: "E3 - Pollution" },
  { value: "E4-Pollution", label: "E4 - Pollution" },
];

export default function AdminParametrageDeclaratifPage() {
  const router = useRouter();
  const {
    loading,
    currentForm,
    setCurrentForm,
    saveForm,
    createForm,
    deleteForm,
  } = useForms();

  const [schema, setSchema] = useState<FieldConfig[]>([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formNorme, setFormNorme] = useState("E2-Pollution");
  const [previewValues, setPreviewValues] = useState<Record<string, unknown>>(
    {}
  );
  const [previewErrors, setPreviewErrors] = useState<Record<string, string>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);

  // Determine if we're in edit mode
  const isEditMode = currentForm !== null;

  useEffect(() => {
    if (currentForm) {
      setSchema(currentForm.schema);
      setFormTitle(currentForm.title);
      setFormDescription(currentForm.description);
      setFormNorme(currentForm.norme);
    } else {
      setSchema([]);
      setFormTitle("");
      setFormDescription("");
      setFormNorme("E2-Pollution");
    }
    setPreviewValues({});
    setPreviewErrors({});
  }, [currentForm]);

  const handleSave = async () => {
    if (!formTitle.trim()) {
      alert("Veuillez entrer un titre pour la donnée déclarée");
      return;
    }

    setIsSaving(true);

    try {
      if (currentForm) {
        // Edit existing form
        saveForm({
          ...currentForm,
          title: formTitle,
          description: formDescription,
          norme: formNorme,
          schema,
        });
      } else {
        // Create new form
        const newForm = createForm({
          title: formTitle,
          description: formDescription,
          norme: formNorme,
          schema,
        });
        setCurrentForm(newForm);
      }
      alert("Formulaire sauvegardé avec succès !");
      router.push("/admin");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (currentForm && confirm("Supprimer ce formulaire ?")) {
      deleteForm(currentForm.id);
      router.push("/admin");
    }
  };

  const handleCancel = () => {
    setCurrentForm(null);
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-[calc(100vh-0px)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-semibold">
            {isEditMode ? "Modifier le formulaire" : "Nouveau formulaire"}
          </h1>
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <Icon name="trash" size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[calc(100%-300px-24px)_300px] gap-6 flex-1 min-h-0">
        {/* Configuration des données */}
        <div className="flex flex-col min-h-0">
          <ScrollableContainer className="flex-1">
            {/* Titre, Description et Norme du formulaire */}
            <div className="flex flex-col gap-4 mb-7">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <Label>Titre de la donnée déclarée</Label>
                  <Input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ex: Fuite d'huile"
                    className="h-8 text-sm font-semibold uppercase"
                  />
                </div>
                {isEditMode && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleDelete}
                    className="size-8 shrink-0 mt-6"
                  >
                    <Icon name="trash" size={16} />
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Input
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Description du formulaire"
                  className="h-8 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1 w-[200px]">
                <Label>Norme</Label>
                <select
                  value={formNorme}
                  onChange={(e) => setFormNorme(e.target.value)}
                  className="h-8 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  {normeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Divider className="bg-black" />

            {/* Configuration des champs */}
            <div className="pt-7">
              {schema.length === 0 ? (
                <div className="text-center py-8 text-content-muted border border-dashed border-border-default rounded-lg">
                  Aucune donnée configurée. Utilisez le bouton ci-dessous pour
                  ajouter une donnée à déclarer.
                </div>
              ) : (
                <FormBuilder schema={schema} onChange={setSchema} hideButton />
              )}
            </div>
          </ScrollableContainer>

          {/* Bouton Ajouter un champ - hors de la zone scrollable */}
          <div className="shrink-0 pt-4 pb-2">
            <FormBuilder schema={schema} onChange={setSchema} buttonOnly />
          </div>
        </div>

        {/* Aperçu du formulaire */}
        <div className="flex flex-col h-75 w-75 border border-border-divider rounded-lg p-4">
          <ScrollableContainer className="flex-1 space-y-6">
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
          </ScrollableContainer>

          {/* Bouton Sauvegarder */}
          <div className="shrink-0 py-2">
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              <Icon name="save" size={16} />
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
