"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DynamicForm, FormBuilder, FieldConfig } from "@/lib/form-fields";
import { LabelField } from "@/lib/form-fields/field-configurator/common/LabelField";
import { Button } from "@/lib/ui/button";
import { Card, CardContent } from "@/lib/ui/card";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { useFormsStore } from "@/stores";
import { Divider } from "@/lib/Divider";
import { ScrollableContainer } from "@/lib/utils/ScrollableContainer";
import { ButtonBis } from "@/lib/ui/button-bis";
import { Icon, IconButton } from "@design-system-rte/react";

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
  } = useFormsStore();

  const [schema, setSchema] = useState<FieldConfig[]>([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formNorme, setFormNorme] = useState("E2-Pollution");
  const [previewValues, setPreviewValues] = useState<Record<string, unknown>>(
    {},
  );
  const [previewErrors, setPreviewErrors] = useState<Record<string, string>>(
    {},
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Determine if we're in edit mode
  const isEditMode = currentForm !== null;

  useEffect(() => {
    if (currentForm) {
      setSchema(currentForm.schema ?? []);
      setFormTitle(currentForm.title ?? "");
      setFormDescription(currentForm.description ?? "");
      setFormNorme(currentForm.norme ?? "E2-Pollution");
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
        const newForm = await createForm({
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
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Configuration des données */}
        <div
          className={`flex flex-col min-h-0 ${!showPreview ? "w-150.5 mx-auto" : ""}`}
        >
          <div className="flex items-end justify-between gap-2.5 w-full h-8">
            <LabelField
              value={formTitle}
              onChange={setFormTitle}
              placeholder="Titre de la donnée à déclarer"
              label="Titre de la donnée à déclarer"
              showLabel={true}
              displayClassName="heading-m bg-background-hover"
              inputClassName="heading-m"
            />
            <div className="flex gap-2.5 shrink-0 items-center">
              <ButtonBis
                label={isSaving ? "Sauvegarde..." : "Enregistrer"}
                onClick={handleSave}
                variant="primary"
                icon={
                  <Icon
                    appearance="filled"
                    aria-label="save"
                    color="var(--content-primary-inverse)"
                    name="save"
                    size={20}
                  />
                }
                iconPosition="left"
              />

              {isEditMode && (
                <IconButton
                  appearance="outlined"
                  aria-label="Supprimer le formulaire"
                  name="delete"
                  onClick={handleDelete}
                  size="m"
                  variant="danger"
                />
              )}

              <IconButton
                appearance="outlined"
                aria-label="Annuler"
                name="close"
                onClick={handleCancel}
                size="m"
                variant="secondary"
              />
            </div>
          </div>
          <Divider className="mt-2 mb-8 bg-border-divider" />
          <ScrollableContainer className="flex-1">
            {/* Titre, Description et Norme du formulaire */}
            <Card className="bg-background-brand-navigation-default">
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-4.5">
                    <div className="flex flex-col">
                      <Label className="text-white">Description</Label>
                      <Input
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Description du formulaire"
                        className="h-8 text-sm bg-white"
                      />
                    </div>

                    <div className="flex flex-col w-50">
                      <Label className="text-white">Norme</Label>
                      <Select value={formNorme} onValueChange={setFormNorme}>
                        <SelectTrigger className="h-8 w-full bg-white">
                          <SelectValue placeholder="Sélectionner une norme" />
                        </SelectTrigger>
                        <SelectContent>
                          {normeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration des champs */}
            <div className="pt-8">
              {schema.length === 0 ? (
                <div className="text-center py-8 text-content-muted border border-dashed border-border-default rounded-lg px-2">
                  Aucune donnée configurée. Utilisez le bouton ci-dessous pour
                  ajouter une donnée à déclarer.
                </div>
              ) : (
                <FormBuilder schema={schema} onChange={setSchema} hideButton />
              )}
            </div>
          </ScrollableContainer>

          {/* Bouton Ajouter un champ - hors de la zone scrollable */}
          <div className="shrink-0 pt-4 pb-2 flex items-center gap-4">
            <div className="flex-1">
              <FormBuilder schema={schema} onChange={setSchema} buttonOnly />
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {/* <CustomIcon name="save" size={16} /> */}
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>

        {/* Pré visualisation */}
        {showPreview ? (
          <div className="w-81 shrink-0 flex flex-col gap-4 p-6 bg-white shadow-[0px_4px_8px_0px_rgba(0,0,0,0.14),0px_0px_2px_0px_rgba(0,0,0,0.12)] -mr-6 -my-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-content-primary">
                  Pré visualisation
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Fermer la prévisualisation"
                >
                  {/*<CustomIcon name="close" size={20} /> */}
                  <Icon name="close" size={20} color="var(--content-primary)" />
                </button>
              </div>
              <Divider className="bg-border-divider" />
            </div>

            {/* Contenu */}
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
          </div>
        ) : (
          <div className="h-8">
            <ButtonBis
              label="Pré visualisation"
              onClick={() => setShowPreview(true)}
              variant="secondary"
              icon={
                <Icon
                  appearance="filled"
                  aria-label="save"
                  color="var(--content-brand-default)"
                  name={showPreview ? "visibility-show" : "visibility-hide"}
                  size={20}
                />
              }
              iconPosition="left"
            />
          </div>
        )}
      </div>
    </div>
  );
}
