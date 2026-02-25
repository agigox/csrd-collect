"use client";

import { Grid } from "@rte-ds/react";
import AuthCarousel from "@/features/auth/AuthCarousel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Grid gridType="fluid" className="min-h-screen !p-0 !gap-0">
      {/* Left panel — carousel / illustration */}
      <Grid.Col
        m={7}
        className="hidden lg:flex flex-col"
        style={{
          backgroundColor: "#15253c",
          borderRight: "1px solid #214770",
        }}
      >
        <AuthCarousel />
      </Grid.Col>

      {/* Right panel — form */}
      <Grid.Col
        m={5}
        xxs={12}
        className="flex flex-col items-center overflow-y-auto"
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
      </Grid.Col>
    </Grid>
  );
}
