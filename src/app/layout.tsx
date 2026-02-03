import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AppSideNav from "@/components/AppSideNav";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CSRD Collect",
  description: "Application de collecte CSRD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="bleu_iceberg" data-mode="light">
      <body className={`${nunito.className} antialiased`}>
        <AppSideNav>
          <Providers>{children}</Providers>
        </AppSideNav>
      </body>
    </html>
  );
}
