import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ModalProvider } from "@/context/ModalContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Vora Crimson Noir",
  description: "A cinematic streaming experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased bg-obsidian text-rose-50 selection:bg-red-900/30 selection:text-white`}>
        <div className="fixed inset-0 z-[-1] bg-obsidian" />

        {/* Ambient Aura Glows */}
        <div className="fixed -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-red-950/20 opacity-60 rounded-full blur-3xl pointer-events-none z-[-1]" />
        <div className="fixed top-[20%] right-[10%] w-[30vw] h-[30vw] bg-rose-900/10 opacity-40 animate-pulse-slow rounded-full blur-3xl pointer-events-none z-[-1]" />

        <ModalProvider>
          <Sidebar />
          <Header />

          <main className="pl-32 min-h-screen relative z-0">
            {children}
          </main>
        </ModalProvider>
      </body>
    </html>
  );
}
