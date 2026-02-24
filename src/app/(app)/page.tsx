"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Redirect authenticated users to declarations
    if (isAuthenticated) {
      router.push("/declarations");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-content-text">
          Bienvenue sur CSRD Collect
        </h1>
        <p className="text-lg text-muted-foreground">
          Plateforme de collecte et de gestion des déclarations CSRD
        </p>
        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Veuillez vous authentifier pour accéder à l&apos;application
          </p>
        </div>
      </div>
    </div>
  );
}
