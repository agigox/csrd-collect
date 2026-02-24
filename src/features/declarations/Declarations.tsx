"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DeclarationsList from "./declarationsList";
import FormSelectionDialog from "./FormSelectionDialog";
import { useAuthStore, useFormsStore } from "@/stores";
import type { FormTemplate } from "@/models/FormTemplate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lib/ui/dialog";
import { Button } from "@/lib/ui/button";
import { DynamicForm } from "@/features/form-builder/DynamicForm";
import Icon from "@/lib/Icons";
import { LabelField } from "@/features/field-configurator/common/LabelField";
import { ScrollableContainer } from "@/lib/utils/ScrollableContainer";
import ModificationHistory from "./ModificationHistory";
import { useDeclarationsStore } from "@/stores";
import type { Declaration } from "@/models/Declaration";
import type {
  FieldConfig,
  RadioFieldConfig,
  CheckboxFieldConfig,
} from "@/models/FieldTypes";

const Declarations = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const team = useAuthStore((state) => state.team);
  const {
    declarations,
    updateDeclaration,
    addTempDeclaration,
    updateTempDeclaration,
    removeTempDeclaration,
    confirmTempDeclaration,
  } = useDeclarationsStore();
  const { forms, fetchForms } = useFormsStore();
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [tempDeclarations, setTempDeclarations] = useState<
    Map<string, Declaration>
  >(new Map());

  // Load forms when component mounts
  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Derive modal state from URL
  const formId = searchParams.get("formId");
  const isOnNewPage = pathname === "/declarations/new";
  const declarationId =
    pathname.startsWith("/declarations/") && pathname !== "/declarations/new"
      ? pathname.replace("/declarations/", "")
      : null;

  // Determine which modals should be open based on URL
  const selectionDialogOpen = isOnNewPage && !formId;
  const declarationDialogOpen = (isOnNewPage && !!formId) || !!declarationId;

  // Get the selected declaration based on URL
  const selectedDeclaration = declarationId
    ? declarations.find((d) => d.id === declarationId) ||
      tempDeclarations.get(declarationId) ||
      null
    : null;

  // Get the selected form based on URL or declaration
  const selectedForm = formId
    ? forms.find((f) => f.id === formId) || null
    : selectedDeclaration
      ? forms.find((f) => f.id === selectedDeclaration.formTemplateId) || null
      : null;

  // Track current temp declaration ID for the selected form
  const [currentTempId, setCurrentTempId] = useState<string | null>(null);

  // For new declarations, get temp declaration by current ID
  const tempDeclaration = currentTempId
    ? tempDeclarations.get(currentTempId) || null
    : null;

  // Final selected declaration (either existing or temp)
  const finalSelectedDeclaration = selectedDeclaration || tempDeclaration;

  // Create temp declaration when needed
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (selectedForm && !selectedDeclaration && !currentTempId) {
      // Use timestamp for unique ID
      const tempId = `temp_${Date.now()}_${selectedForm.id}`;
      const now = new Date().toISOString();

      // Initialize formData with default values from schema
      const initialFormData: Record<string, unknown> = {};

      // Add default values for all fields that have them
      selectedForm.schema.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialFormData[field.name] = field.defaultValue;
        }
      });

      const tempDeclaration: Declaration = {
        id: tempId,
        name: "",
        formTemplateId: selectedForm.id,
        reference: `DECL-TEMP-${Date.now()}`,
        location: "",
        authorId: user?.nni || user?.id || "",
        authorName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
        teamId: team?.teamId || "",
        description: selectedForm.description || "",
        status: "draft",
        formData: initialFormData,
        submitedBy: "",
        reviewedBy: "",
        reviewComment: "",
        createdAt: now,
        updatedAt: now,
        submittedAt: "",
        reviewedAt: "",
        isActive: true,
        isNew: true,
      };

      setTempDeclarations((prev) => new Map(prev).set(tempId, tempDeclaration));
      addTempDeclaration(tempDeclaration);
      setCurrentTempId(tempId);
    }
  }, [selectedForm, selectedDeclaration, currentTempId, addTempDeclaration]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // Clean up temp ID when URL changes away from new declaration
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isOnNewPage || !formId) {
      setCurrentTempId(null);
    }
  }, [isOnNewPage, formId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Check if a field has a configured default value
  const fieldHasDefault = useCallback((field: FieldConfig) => {
    if (field.defaultValue !== undefined && field.defaultValue !== "")
      return true;
    if (field.type === "radio")
      return (field as RadioFieldConfig).defaultIndex !== undefined;
    if (field.type === "checkbox") {
      const indices = (field as CheckboxFieldConfig).defaultIndices;
      return indices !== undefined && indices.length > 0;
    }
    return false;
  }, []);

  // Validation function for required fields
  const validateForm = useCallback(
    (values: Record<string, unknown>) => {
      if (!selectedForm) return {};

      const errors: Record<string, string> = {};

      for (const field of selectedForm.schema.fields) {
        if (field.required) {
          const value = values[field.name];
          const isEmpty = value === undefined || value === null || value === "";
          // Skip error if field has a configured default (preview component uses it as fallback)
          if (isEmpty && !fieldHasDefault(field)) {
            errors[field.name] = "Ce champ est requis";
          }
        }
      }

      return errors;
    },
    [selectedForm, fieldHasDefault],
  );

  // Load form values when declaration changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (finalSelectedDeclaration) {
      const values = finalSelectedDeclaration.formData || {};
      setFormValues(values);

      // Validate on load to detect errors immediately
      const validationErrors = validateForm(values);
      setFormErrors(validationErrors);
    } else {
      setFormValues({});
      setFormErrors({});
    }
  }, [finalSelectedDeclaration, validateForm]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Handler for form value changes - sync with temp declaration
  const handleFormValuesChange = useCallback(
    (newValues: Record<string, unknown>) => {
      setFormValues(newValues);

      // Validate form and update errors
      const validationErrors = validateForm(newValues);
      setFormErrors(validationErrors);

      // Sync with temp declaration in real-time
      if (finalSelectedDeclaration?.isNew) {
        updateTempDeclaration(finalSelectedDeclaration.id, {
          formData: newValues,
          updatedAt: new Date().toISOString(),
        });

        // Update local temp declarations map
        setTempDeclarations((prev) => {
          const next = new Map(prev);
          const existing = next.get(finalSelectedDeclaration.id);
          if (existing) {
            next.set(finalSelectedDeclaration.id, {
              ...existing,
              formData: newValues,
              updatedAt: new Date().toISOString(),
            });
          }
          return next;
        });
      }
    },
    [finalSelectedDeclaration, updateTempDeclaration, validateForm],
  );

  // Check if form is valid (no errors)
  const isFormValid = useMemo(() => {
    return Object.keys(formErrors).length === 0;
  }, [formErrors]);

  // Don't render declarations if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleOpenSelection = () => {
    router.push("/declarations/new");
  };

  const handleFormSelect = (form: FormTemplate) => {
    // Navigate to new declaration with form ID
    // Modal state is derived from URL
    router.push(`/declarations/new?formId=${form.id}`);
  };

  const handleCloseDeclaration = (open: boolean) => {
    if (!open) {
      // Navigate back to declarations list
      router.push("/declarations");

      // Clean up temp declarations
      if (finalSelectedDeclaration?.isNew) {
        removeTempDeclaration(finalSelectedDeclaration.id);
        setTempDeclarations((prev) => {
          const next = new Map(prev);
          next.delete(finalSelectedDeclaration.id);
          return next;
        });
      }

      setCurrentTempId(null);
      setFormValues({});
      setFormErrors({});
    }
  };

  // Handler for editing an existing declaration
  const handleEditDeclaration = (declaration: Declaration) => {
    // Navigate to the declaration URL
    // The useEffect will handle opening the modal
    router.push(`/declarations/${declaration.id}`);
  };

  // Handler for submitting the form
  const handleSubmit = async () => {
    if (finalSelectedDeclaration) {
      if (finalSelectedDeclaration.isNew) {
        // Confirm temp declaration (create new)
        await confirmTempDeclaration(finalSelectedDeclaration.id);
        setTempDeclarations((prev) => {
          const next = new Map(prev);
          next.delete(finalSelectedDeclaration.id);
          return next;
        });
      } else {
        // Update existing declaration
        await updateDeclaration(finalSelectedDeclaration.id, formValues);
      }
    }

    // Navigate back to declarations list
    router.push("/declarations");
    setCurrentTempId(null);
    setFormValues({});
    setFormErrors({});
  };

  return (
    <div className="flex justify-start min-h-screen p-8">
      <DeclarationsList
        onDeclarer={handleOpenSelection}
        onEditDeclaration={handleEditDeclaration}
        selectedDeclarationId={finalSelectedDeclaration?.id}
      />

      {/* Modal de sélection du type de formulaire */}
      <FormSelectionDialog
        open={selectionDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            router.push("/declarations");
          }
        }}
        onFormSelect={handleFormSelect}
      />

      {/* Modal de déclaration avec le formulaire sélectionné */}
      <Dialog
        open={declarationDialogOpen}
        onOpenChange={handleCloseDeclaration}
        modal={false}
      >
        <DialogContent
          hideOverlay
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="fixed! top-0! right-0! left-auto! h-screen! w-198! max-w-none! translate-x-0! translate-y-0! rounded-none! border-l! border-y-0! border-r-0! flex! flex-col! min-h-0!"
        >
          <DialogHeader>
            <div className="flex items-center gap-2 justify-between">
              <DialogTitle>
                <div className="flex flex-col">
                  <div>
                    {finalSelectedDeclaration?.isNew
                      ? "Nouvelle déclaration"
                      : "Modifier la déclaration"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID {finalSelectedDeclaration?.id || selectedForm?.id || ""}
                  </div>
                </div>
              </DialogTitle>
              {finalSelectedDeclaration &&
                !showHistory &&
                finalSelectedDeclaration.history &&
                finalSelectedDeclaration.history.length > 0 && (
                  <Icon
                    name="listAlt"
                    size={24}
                    className="cursor-pointer hover:opacity-70"
                    onClick={() => setShowHistory(true)}
                  />
                )}
            </div>
          </DialogHeader>

          {finalSelectedDeclaration && (
            <LabelField
              value={finalSelectedDeclaration.name}
              onChange={(newName) => {
                updateTempDeclaration(finalSelectedDeclaration.id, {
                  name: newName,
                });
                setTempDeclarations((prev) => {
                  const next = new Map(prev);
                  const existing = next.get(finalSelectedDeclaration.id);
                  if (existing) {
                    next.set(finalSelectedDeclaration.id, {
                      ...existing,
                      name: newName,
                    });
                  }
                  return next;
                });
              }}
              placeholder="Titre de la déclaration"
              label="Titre de la déclaration"
              displayClassName="heading-m bg-background-hover"
              className="w-full"
            />
          )}

          <div className="h-px w-full bg-border" />

          {(selectedForm || finalSelectedDeclaration) && (
            <div className="flex flex-1 min-h-0">
              {selectedForm && (
                <ScrollableContainer className="flex-1 pt-4 pr-4" height="100%">
                  <DynamicForm
                    schema={selectedForm.schema.fields}
                    values={formValues}
                    onChange={handleFormValuesChange}
                    errors={formErrors}
                  />
                </ScrollableContainer>
              )}
              {!selectedForm && finalSelectedDeclaration && (
                <div className="flex-1 p-4 text-center text-muted-foreground">
                  <p className="mb-2 font-semibold">
                    {finalSelectedDeclaration.name}
                  </p>
                  <p>{finalSelectedDeclaration.description}</p>
                </div>
              )}
              {finalSelectedDeclaration && showHistory && (
                <ModificationHistory
                  entries={finalSelectedDeclaration.history || []}
                  onClose={() => setShowHistory(false)}
                />
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleCloseDeclaration(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              Soumettre
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Declarations;
