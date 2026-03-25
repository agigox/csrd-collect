"use client";

import { useState, useCallback, useRef } from "react";
import { Modal, Tab, Button, Icon } from "@rte-ds/react";
import { useAuthStore } from "@/stores";
import PersonalInfoTab from "./tabs/PersonalInfoTab";
import TeamTab from "./tabs/TeamTab";
import PasswordTab from "./tabs/PasswordTab";

const PROFILE_TAB_OPTIONS = [
  {
    id: "personal-info",
    panelId: "panel-personal-info",
    label: "Informations personnelles",
  },
  { id: "team", panelId: "panel-team", label: "Equipe" },
  { id: "password", panelId: "panel-password", label: "Mot de passe" },
];

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
}: UserProfileModalProps) {
  const user = useAuthStore((s) => s.user);
  const [activeTabId, setActiveTabId] = useState("personal-info");
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const isDirtyRef = useRef(false);
  const pendingTabRef = useRef<string | null>(null);
  const pendingCloseRef = useRef(false);

  const profileName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "";

  const handleDirtyChange = useCallback((dirty: boolean) => {
    isDirtyRef.current = dirty;
  }, []);

  const handleTabChange = useCallback((newTabId: string) => {
    if (isDirtyRef.current) {
      pendingTabRef.current = newTabId;
      pendingCloseRef.current = false;
      setShowUnsavedWarning(true);
    } else {
      setActiveTabId(newTabId);
    }
  }, []);

  const handleClose = useCallback(() => {
    if (isDirtyRef.current) {
      pendingTabRef.current = null;
      pendingCloseRef.current = true;
      setShowUnsavedWarning(true);
    } else {
      setActiveTabId("personal-info");
      onClose();
    }
  }, [onClose]);

  const handleDiscardChanges = useCallback(() => {
    isDirtyRef.current = false;
    setShowUnsavedWarning(false);
    if (pendingCloseRef.current) {
      setActiveTabId("personal-info");
      onClose();
    } else if (pendingTabRef.current) {
      setActiveTabId(pendingTabRef.current);
    }
    pendingTabRef.current = null;
    pendingCloseRef.current = false;
  }, [onClose]);

  const handleStay = useCallback(() => {
    setShowUnsavedWarning(false);
    pendingTabRef.current = null;
    pendingCloseRef.current = false;
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <Modal
        id="user-profile"
        isOpen={true}
        onClose={handleClose}
        title="Votre compte"
        size="s"
        showCloseIcon={true}
        closeOnOverlayClick={false}
        titleContent={
          <div className="flex items-center gap-2">
            <Icon name="user-circle" size={24} />
            <div>
              {profileName && (
                <p className="text-base font-semibold text-content-secondary">
                  {profileName}
                </p>
              )}
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-4 w-full">
          {/* Tabs */}
          <Tab
            options={PROFILE_TAB_OPTIONS}
            selectedTabId={activeTabId}
            onChange={handleTabChange}
          />

          {/* Tab panels */}
          {activeTabId === "personal-info" && (
            <PersonalInfoTab
              onDirtyChange={handleDirtyChange}
              onClose={handleClose}
            />
          )}
          {activeTabId === "team" && (
            <TeamTab onDirtyChange={handleDirtyChange} onClose={handleClose} />
          )}
          {activeTabId === "password" && (
            <PasswordTab
              onDirtyChange={handleDirtyChange}
              onClose={handleClose}
            />
          )}
        </div>
      </Modal>

      {/* Unsaved changes warning */}
      {showUnsavedWarning && (
        <Modal
          id="unsaved-changes-warning"
          isOpen={true}
          onClose={handleStay}
          title="Modifications non sauvegardées"
          description="Vous avez des modifications non sauvegardées. Voulez-vous les abandonner ?"
          size="xs"
          primaryButton={
            <Button
              label="Rester"
              onClick={handleStay}
              variant="primary"
              data-testid="btn-stay"
            />
          }
          secondaryButton={
            <Button
              label="Abandonner"
              onClick={handleDiscardChanges}
              variant="secondary"
              data-testid="btn-discard"
            />
          }
        />
      )}
    </>
  );
}
