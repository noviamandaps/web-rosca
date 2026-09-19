import type { Metadata } from "next";
import "./globals.css";
import { PageLayout } from "@/components/layout/PageLayout";
import { Providers } from "./providers";

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
        <Providers>
          <PageLayout>{children}</PageLayout>
        </Providers>
      </body>
    </html>
  );
}
