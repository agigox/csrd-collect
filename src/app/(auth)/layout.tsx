"use client";

import AuthCarousel from "@/features/auth/AuthCarousel";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* Left panel — carousel / illustration */}
        <div
          className="hidden min-[1280px]:flex flex-col flex-1"
          style={{
            backgroundColor: "#15253c",
            borderRight: "1px solid #214770",
          }}
        >
          <AuthCarousel />
        </div>

        {/* Right panel — form (fixed 544px from 1280px+) */}
        <div
          className="flex flex-col items-center overflow-y-auto w-full min-[1280px]:w-[544px] min-[1280px]:min-w-[544px]"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <div className="w-full max-w-107 py-12 px-8">
            {/* Main heading */}
            <h1
              className="text-[40px] font-semibold leading-12 mb-8"
              style={{
                fontFamily: "var(--font-nunito), Nunito, sans-serif",
                color: "#201f1f",
                letterSpacing: "-1px",
              }}
            >
              Bienvenue{"\n"}
              <span className="block">sur le collecteur</span>
            </h1>

            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
