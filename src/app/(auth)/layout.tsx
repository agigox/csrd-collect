"use client";

import AuthCarousel from "@/features/auth/AuthCarousel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel — carousel / illustration */}
      <div
        className="hidden lg:flex w-184 shrink-0 flex-col"
        style={{
          backgroundColor: "#15253c",
          borderRight: "1px solid #214770",
        }}
      >
        <AuthCarousel />
      </div>

      {/* Right panel — form */}
      <div
        className="flex-1 flex flex-col items-center overflow-y-auto"
        style={{ backgroundColor: "#f5f5f5" }}
      >
        <div className="w-full max-w-102 py-12 px-6 pl-17 lg:px-0">
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
  );
}
