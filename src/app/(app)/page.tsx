"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import LoadingState from "@/lib/ui/loading-state";

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace("/declarations");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return <LoadingState message="Redirection en cours..." />;
}
