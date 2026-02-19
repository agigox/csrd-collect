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
    <Modal
      id="admin-approval-pending"
      isOpen={true}
      onClose={() => {
        // No-op — cannot close this modal
      }}
      title="En attente d'approbation par un Super administrateur"
      description="Votre compte administrateur est en cours de validation. Un super administrateur doit approuver votre accès. Vous serez notifié par email une fois votre compte activé."
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
  );
}
