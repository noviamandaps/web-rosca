import type { Metadata } from "next";
import "./globals.css";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "ROSCA - Modern Minimalist E-Commerce",
  description: "Premium products with clean aesthetics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
