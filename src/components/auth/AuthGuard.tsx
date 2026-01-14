"use client";

import { ReactNode } from "react";
import { useAuthStore } from "@/stores";
import { usePathname } from "next/navigation";
import LoginModal from "./LoginModal";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const pathname = usePathname();

  // Skip auth for admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Admin routes don't need team login
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Show login modal if not authenticated (for member routes)
  return (
    <>
      <LoginModal open={!isAuthenticated} />
      {children}
    </>
  );
};

export default AuthGuard;
