"use client";

import { useRouter } from "next/navigation";
import { Modal, Button } from "@rte-ds/react";
import { useAuthStore } from "@/stores";

export default function AdminApprovalModal() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <style>{`#admin-approval-pending [data-testid="modal-close-button"] { display: none; }`}</style>
      <Modal
        id="admin-approval-pending"
        isOpen={true}
        onClose={() => {}}
        title="En attente d'approbation"
        description="Votre compte est en cours de validation. Un administrateur doit approuver votre accès. Vous serez notifié par email une fois votre compte activé."
        size="xs"
        primaryButton={
          <Button
            variant="danger"
            label="Se déconnecter"
            onClick={handleLogout}
            data-testid="btn-deconnecter"
          />
        }
      />
    </>
  );
}
