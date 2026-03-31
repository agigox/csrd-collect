"use client";

import { useState } from "react";
import { IconButton, Tab, Button, Modal, Toast } from "@rte-ds/react";
import type { User } from "@/models/User";
import { useAuthStore } from "@/stores/authStore";
import { suspendUser, approveUser, rejectUser } from "@/api/users";
import { RolesTab } from "./tabs/RolesTab";
import { TeamsTab } from "./tabs/TeamsTab";

const TAB_OPTIONS = [
  { id: "roles", panelId: "panel-roles", label: "Rôle" },
  { id: "equipes", panelId: "panel-equipes", label: "Équipe(s)" },
];

interface UserDetailPanelProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
  onUserDeleted: (userId: string) => void;
}

export function UserDetailPanel({
  user,
  open,
  onClose,
  onUserUpdated,
  onUserDeleted,
}: UserDetailPanelProps) {
  const [activeTabId, setActiveTabId] = useState("roles");
  const [prevUserId, setPrevUserId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });
  const currentUser = useAuthStore((s) => s.user);

  // Reset to first tab when user changes
  if (user && prevUserId !== user.id) {
    setPrevUserId(user.id);
    setActiveTabId("roles");
  }

  if (!user || !open) return null;

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const fullName =
    `${user.firstName ? capitalize(user.firstName) : ""} ${user.lastName ? capitalize(user.lastName) : ""}`.trim();
  const isSelf = currentUser?.id === user.id;
  const isPending = user.status === "PENDING";
  const isSuspended = user.status === "SUSPENDED";

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await suspendUser(user.id);
      onUserDeleted(user.id);
      setShowDeleteConfirm(false);
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Erreur lors de la suppression de l'utilisateur",
      });
      setShowDeleteConfirm(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const updated = await approveUser(user.id);
      onUserUpdated(updated);
    } catch (err) {
      console.error("Erreur lors de l'approbation:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await rejectUser(user.id);
      onUserDeleted(user.id);
    } catch (err) {
      console.error("Erreur lors du rejet:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <div
        className="flex flex-col h-screen w-full sticky top-0 border-l bg-background pl-4 gap-4"
        style={{
          boxShadow:
            "0 2px 4px var(--elevation-shadow-ambient), 0 2px 4px var(--elevation-shadow-key)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col gap-1 px-6 pt-4">
          <div className="flex items-center justify-between">
            <h2
              className="text-[24px] font-bold truncate flex-1"
              style={{ fontFamily: "Nunito, sans-serif", fontSize: "20px" }}
            >
              {fullName}
            </h2>
            <div className="flex items-center gap-2">
              {isPending ? (
                <>
                  <Button
                    variant="primary"
                    label="Approuver"
                    onClick={handleApprove}
                    disabled={actionLoading}
                    size="s"
                  />
                  <Button
                    variant="danger"
                    label="Rejeter"
                    onClick={handleReject}
                    disabled={actionLoading}
                    size="s"
                  />
                </>
              ) : (
                !isSelf && (
                  <IconButton
                    appearance="outlined"
                    aria-label="Supprimer l'utilisateur"
                    name="suspended"
                    onClick={() => setShowDeleteConfirm(true)}
                    size="m"
                    variant="neutral"
                    iconColor={isSuspended ? undefined : "#ED1C1C"}
                    disabled={isSuspended}
                  />
                )
              )}
              <IconButton
                appearance="outlined"
                aria-label="Fermer"
                name="close"
                onClick={onClose}
                size="m"
                variant="neutral"
                iconColor="var(--content-tertiary)"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="flex flex-col gap-4">
            <Tab
              options={TAB_OPTIONS}
              selectedTabId={activeTabId}
              onChange={setActiveTabId}
              compactSpacing
            />

            {activeTabId === "roles" && (
              <div role="tabpanel" id="panel-roles" aria-labelledby="roles">
                <RolesTab
                  user={user}
                  onRoleChanged={onUserUpdated}
                  readOnly={isSuspended}
                />
              </div>
            )}
            {activeTabId === "equipes" && (
              <div role="tabpanel" id="panel-equipes" aria-labelledby="equipes">
                <TeamsTab
                  user={user}
                  onUserUpdated={onUserUpdated}
                  readOnly={isSuspended}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        id="delete-user-confirm"
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Supprimer l'utilisateur"
        size="s"
        primaryButton={
          <Button
            variant="danger"
            label="Supprimer"
            onClick={handleDelete}
            disabled={actionLoading}
          />
        }
        secondaryButton={
          <Button
            variant="neutral"
            label="Annuler"
            onClick={() => setShowDeleteConfirm(false)}
          />
        }
      >
        <p>
          Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
          <strong>{fullName}</strong> ? Cette action est irréversible.
        </p>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.open}
        autoDismiss
        duration="medium"
        placement="bottom-right"
        onClose={() =>
          setToast((prev) => (prev.open ? { ...prev, open: false } : prev))
        }
      />
    </>
  );
}
