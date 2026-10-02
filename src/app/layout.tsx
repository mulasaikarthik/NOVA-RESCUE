import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NOVA RESCUE — Predict. Prevent. Rescue. Learn.",
    template: "%s | NOVA RESCUE",
  },
  description:
    "Live operational intelligence platform for detecting fulfillment risk early and coordinating authorized rescue actions.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
