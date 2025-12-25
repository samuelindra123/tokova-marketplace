import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tokova - Shopping Online Terpercaya",
  description: "Trusted marketplace for online shopping with quality products from selected sellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased bg-slate-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
