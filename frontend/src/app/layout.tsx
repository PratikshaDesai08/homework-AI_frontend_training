import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "@/styles/globals.scss";

// Public Sans: the font used in the design
const fontBase = Public_Sans({
  variable: "--font-base",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Admin",
  description: "Student management — AI frontend training homework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={fontBase.variable}>{children}</body>
    </html>
  );
}
