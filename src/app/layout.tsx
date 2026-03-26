import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap", // Prevents FOIT; text shows immediately in fallback font
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#cfddea",
};

export const metadata: Metadata = {
  title: {
    default: "BeautyFreelas",
    template: "%s | BeautyFreelas",
  },
  description: "Portfólio e Agendamento para Profissionais de Beleza. Crie seu link na bio e receba agendamentos em minutos.",
  keywords: ["agendamento", "beleza", "manicure", "cabelo", "freelancer", "profissional de beleza"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "BeautyFreelas — Agendamento Profissional",
    description: "Transforme seu talento em um negócio. Crie seu portfólio e receba agendamentos pelo link da bio.",
    type: "website",
    locale: "pt_BR",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${manrope.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
