import "./globals.css";
import React from "react";

export const metadata = {
  title: "Smart Farm Assistant",
  description: "AI-Powered Agricultural intellect platform for farmers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
