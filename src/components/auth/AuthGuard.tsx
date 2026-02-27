"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore, selectIsPendingApproval, selectNeedsTeamOnboarding } from "@/stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import TeamOnboardingModal from "./TeamOnboardingModal";
import AdminApprovalModal from "./AdminApprovalModal";

interface AuthGuardProps {
  children: ReactNode;
}

const AUTH_ROUTES = ["/login", "/register"];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const isPendingApproval = useAuthStore(selectIsPendingApproval);
  const needsTeamOnboarding = useAuthStore(selectNeedsTeamOnboarding);
  const pathname = usePathname();
  const router = useRouter();

  const onAuthPage = isAuthRoute(pathname);

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated → redirect to login (unless already on auth page)
    if (!isAuthenticated && !onAuthPage) {
      router.replace("/login");
      return;
    }

    // Authenticated on auth page → redirect to declarations
    if (isAuthenticated && onAuthPage) {
      router.replace("/declarations");
      return;
    }

    // Non-admin on admin routes → redirect to declarations
    if (
      isAuthenticated &&
      user?.role !== "admin" &&
      pathname.startsWith("/admin")
    ) {
      router.replace("/declarations");
      return;
    }
  }, [isLoading, isAuthenticated, onAuthPage, user, pathname, router]);

  // Show loading state while checking auth (only on protected pages, not auth pages)
  if (isLoading && !onAuthPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Not authenticated and not on auth page → don't render (redirect in progress)
  if (!isAuthenticated && !onAuthPage) {
    return null;
  }

  // Authenticated user on auth page → don't render (redirect in progress)
  if (isAuthenticated && onAuthPage) {
    return null;
  }

  // User pending approval → show blocking modal
  if (isPendingApproval) {
    return (
      <>
        {children}
        <AdminApprovalModal />
      </>
    );
  }

  // User needs team onboarding → show blocking modal
  if (needsTeamOnboarding) {
    return (
      <>
        {children}
        <TeamOnboardingModal />
      </>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
