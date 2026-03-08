import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Maths Tutor Quest",
  description: "A fun, gamified maths tutor web app for children aged 8 to 10.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${nunito.variable} antialiased`}>{children}</body>
    </html>
  );
}
