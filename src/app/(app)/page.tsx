"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import Link from "next/link";

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

  // Brief fallback while redirecting
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
            Veuillez{" "}
            <Link href="/login" className="underline text-[#2b86ff]">
              vous connecter
            </Link>{" "}
            pour accéder à l&apos;application
          </p>
        </div>
      </div>
    </div>
  );
}
