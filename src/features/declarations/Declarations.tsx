"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Grid, useBreakpoint } from "@rte-ds/react";
import { DeclarationDetailPanel } from "./DeclarationDetailPanel";
import { useAuthStore, useFormsStore } from "@/stores";
import type { FormTemplate } from "@/models/FormTemplate";
import { useDeclarationsStore } from "@/stores";
import type { Declaration } from "@/models/Declaration";
import type {
  FieldConfig,
  RadioFieldConfig,
  CheckboxFieldConfig,
} from "@/models/FieldTypes";
import DeclarationsList from "./DeclarationsList";
import FormSelectionModal from "./FormSelectionModal";

const Declarations = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isBelow } = useBreakpoint();
  const isMobile = isBelow("s");

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
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
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
  const declarationId = searchParams.get("id");

  // Determine which modals should be open based on URL
  const selectionDialogOpen = isOnNewPage && !formId;
  const declarationDialogOpen = (isOnNewPage && !!formId) || !!declarationId;

  // Get the selected declaration based on URL
  const selectedDeclaration = declarationId
    ? declarations.find((d) => d.id === declarationId) ||
      tempDeclarations.get(declarationId) ||
      null
    : null;

  // Get the selected form based on URL or declaration's embedded formTemplate
  const selectedForm = formId
    ? forms.find((f) => f.id === formId) || null
    : selectedDeclaration?.formTemplate || null;

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
        formTemplateId: selectedForm.id,
        formTemplate: selectedForm,
        reference: `DECL-TEMP-${Date.now()}`,
        location: "",
        authorId: user?.nni || user?.id || "",
        authorName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
        teamId: team?.teamId || "",
        status: "draft",
        formData: initialFormData,
        submittedBy: "",
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
      setFormErrors({});
      setHasAttemptedSubmit(false);
    } else {
      setFormValues({});
      setFormErrors({});
      setHasAttemptedSubmit(false);
    }
  }, [finalSelectedDeclaration]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Handler for form value changes - sync with temp declaration
  const handleFormValuesChange = useCallback(
    (newValues: Record<string, unknown>) => {
      setFormValues(newValues);

      // Only show validation errors after user has attempted to submit
      if (hasAttemptedSubmit) {
        const validationErrors = validateForm(newValues);
        setFormErrors(validationErrors);
      }

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
    [finalSelectedDeclaration, updateTempDeclaration, validateForm, hasAttemptedSubmit],
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

  const handleCloseDeclaration = () => {
    // Remove temp declaration from both local Map and Zustand store
    if (currentTempId) {
      removeTempDeclaration(currentTempId);
      setTempDeclarations((prev) => {
        const next = new Map(prev);
        next.delete(currentTempId);
        return next;
      });
    }

    setFormValues({});
    setFormErrors({});
    setHasAttemptedSubmit(false);

    // Navigate first — the URL-change effect will set currentTempId to null
    // AFTER the URL has changed, preventing the creation effect from re-firing
    router.push("/declarations");
  };

  // Handler for editing an existing declaration
  const handleEditDeclaration = (declaration: Declaration) => {
    // Navigate to the declaration URL
    // The useEffect will handle opening the modal
    router.push(`/declarations?id=${declaration.id}`);
  };

  // Handler for submitting the form
  const handleSubmit = async () => {
    if (!finalSelectedDeclaration) return;

    // Validate on submit — show errors if invalid
    const validationErrors = validateForm(formValues);
    setFormErrors(validationErrors);
    setHasAttemptedSubmit(true);

    if (Object.keys(validationErrors).length > 0) {
      return; // Don't submit if there are errors
    }

    try {
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

      setFormValues({});
      setFormErrors({});
      setHasAttemptedSubmit(false);

      // Navigate — the URL-change effect will clear currentTempId
      // after the URL has updated, preventing the creation effect from re-firing
      router.push("/declarations");
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Erreur lors de la soumission de la déclaration",
      );
    }
  };

  return (
    <div className="max-w-480 mx-auto h-full">
      <Grid gridType="fluid">
        {!(isMobile && declarationDialogOpen) && (
          <Grid.Col xxs={2} xs={6} s={3} m={5}>
            <DeclarationsList
              onDeclarer={handleOpenSelection}
              onEditDeclaration={handleEditDeclaration}
              selectedDeclarationId={finalSelectedDeclaration?.id}
            />
          </Grid.Col>
        )}
        {declarationDialogOpen && (
          <Grid.Col xxs={2} xs={6} s={3} m={7}>
            <DeclarationDetailPanel
              open={declarationDialogOpen}
              onClose={handleCloseDeclaration}
              selectedForm={selectedForm}
              declaration={finalSelectedDeclaration}
              formValues={formValues}
              formErrors={formErrors}
              onFormValuesChange={handleFormValuesChange}
              isFormValid={isFormValid}
              onSubmit={handleSubmit}
              showHistory={showHistory}
              onToggleHistory={setShowHistory}
            />
          </Grid.Col>
        )}
      </Grid>

      {/* Modal de sélection du type de formulaire */}
      <FormSelectionModal
        open={selectionDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            router.push("/declarations");
          }
        }}
        onFormSelect={handleFormSelect}
      />
    </div>
  );
};

export default Declarations;
