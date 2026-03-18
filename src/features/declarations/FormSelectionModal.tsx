"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Card, Toast } from "@rte-ds/react";
import { useAuthStore, selectIsAdmin } from "@/stores/authStore";
import { useFormsStore } from "@/stores";
import type { FormTemplate } from "@/models/FormTemplate";
import { API_BASE_URL } from "@/api/config";
import { authHeaders } from "@/api/authHeaders";
import { normalizeSchema } from "@/lib/utils/normalizeSchema";

interface FormSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormSelect: (form: FormTemplate) => void;
}

const FormSelectionDialog = ({
  open,
  onOpenChange,
  onFormSelect,
}: FormSelectionDialogProps) => {
  const { forms, loading: formsLoading, fetchForms } = useFormsStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore(selectIsAdmin);
  const teamId = user?.teamId || user?.teamId;

  const [teamForms, setTeamForms] = useState<FormTemplate[]>([]);
  const [teamFormsLoading, setTeamFormsLoading] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // For admins: fetch all forms. For users with team: fetch team-assigned forms.
  useEffect(() => {
    if (!open) return;

    if (isAdmin) {
      fetchForms();
    } else if (teamId) {
      setTeamFormsLoading(true);
      fetch(`${API_BASE_URL}/form-template-assignments/by-team/${teamId}`, {
        headers: authHeaders(),
      })
        .then((res) => res.json())
        .then((templates: FormTemplate[]) => {
          const normalized = templates
            .filter((t) => t.isPublished)
            .map((t) => ({
              ...t,
              schema: normalizeSchema(t.schema as Record<string, unknown>),
            }));
          setTeamForms(normalized);
        })
        .catch((err) => {
          console.error("Error fetching team templates:", err);
          setTeamForms([]);
        })
        .finally(() => setTeamFormsLoading(false));
    }
  }, [open, isAdmin, teamId, fetchForms]);

  // Use appropriate form list based on user role
  const availableForms = isAdmin ? forms.filter((f) => f.isPublished) : teamForms;
  const loading = isAdmin ? formsLoading : teamFormsLoading;

  const handleCancel = () => {
    setSelectedFormId(null);
    onOpenChange(false);
  };

  const handleAdd = () => {
    const selectedForm = availableForms.find((f) => f.id === selectedFormId);
    if (selectedForm) {
      onFormSelect(selectedForm);
      setSelectedFormId(null);
      // Don't call onOpenChange(false) here - the modal state is derived from URL
      // and will close automatically when the URL changes
    }
  };

  const handleNotInList = () => {
    setSelectedFormId(null);
    onOpenChange(false);
    setShowToast(true);
  };

  return (
    <>
      <Modal
        id="form-selection"
        isOpen={open}
        onClose={handleCancel}
        title="Nouvelle déclaration"
        size="s"
        primaryButton={
          <Button
            onClick={handleAdd}
            disabled={!selectedFormId}
            label="Ajouter"
          />
        }
        secondaryButton={
          <Button variant="secondary" onClick={handleCancel} label="Annuler" />
        }
      >
        <div className="flex flex-col w-full gap-4">
          <div className="text-sm text-content-secondary">
            Que souhaitez vous déclarer ?
          </div>
          <div className="flex flex-col gap-6  w-98 self-center">
            {loading ? (
              <div className="text-center py-8 text-content-secondary">
                Chargement des formulaires...
              </div>
            ) : availableForms.length === 0 ? (
              <div className="text-center py-8 text-content-secondary">
                Aucun formulaire disponible
              </div>
            ) : (
              <div className="flex flex-col gap-[8.5px]">
                {availableForms.map((form) => (
                  <Card
                    key={form.id}
                    size="m"
                    cardType="default"
                    clickable
                    onClick={() => setSelectedFormId(form.id)}
                    style={{
                      width: "100%",
                      padding: "7px 12px",
                      alignItems: "flex-start",
                      cursor: "pointer",
                      border:
                        selectedFormId === form.id
                          ? "2px solid var(--border-brand-default)"
                          : undefined,
                      backgroundColor:
                        selectedFormId === form.id
                          ? "var(--background-brand-secondary)"
                          : undefined,
                    }}
                  >
                    <div className="w-full flex flex-col">
                      <div className="text-base font-medium text-content-tertiary">
                        {form.code}
                      </div>
                      <div className="font-semibold text-content-primary">
                        {form.name}
                      </div>
                      {form.description && (
                        <div className="text-sm text-content-secondary">
                          {form.description}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}

                <Card
                  size="m"
                  cardType="outlined"
                  clickable
                  onClick={handleNotInList}
                  style={{
                    width: "100%",
                    padding: "7px 12px",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderStyle: "dashed",
                    borderWidth: "2px",
                    borderColor: "var(--border-tertiary)",
                  }}
                >
                  <div className="text-sm text-content-secondary">
                    La déclaration que je souhaite faire n&apos;est pas dans la
                    liste
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Toast
        message="Ne t'inquiète pas on va informer l'admin"
        type="neutral"
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        closable
        autoDismiss
        duration="medium"
        placement="bottom-right"
      />
    </>
  );
};

export default FormSelectionDialog;
