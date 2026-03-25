"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Copy, Calendar, Users, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getProfessionalById } from "@/lib/db";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchSlug = async () => {
      if (user) {
        try {
          const professional = await getProfessionalById(user.uid);
          if (professional?.slug) {
            setSlug(professional.slug);
          }
        } catch (error) {
          console.error("[dashboard] Failed to fetch slug:", error);
        }
      }
    };
    fetchSlug();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#cfddea]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/20" />
          <p className="text-sm font-medium text-neutral-500">Carregando Dashboard...</p>
        </div>
      </div>
    );
  }

  const publicUrl = slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/${slug}` : null;

  const handleCopyLink = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      toast.success("Link copiado com sucesso!");
    } else {
      toast.error("Configure seu perfil primeiro.");
      router.push("/dashboard/settings");
    }
  };

  const navItems = [
    { label: "Resumo", href: "/dashboard", icon: LayoutDashboard },
    { label: "Agenda", href: "/dashboard/agenda", icon: Calendar },
    { label: "Serviços", href: "/dashboard/services", icon: Users },
    { label: "Configurações", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#cfddea] text-neutral-900">
      {/* Sidebar */}
      <aside className="w-72 glass-strong border-r border-white/20 p-8 flex flex-col sticky top-0 h-screen z-20">
        <div className="mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-button">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">BeautyFreelas</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <button 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                    isActive 
                    ? "bg-black text-white shadow-button" 
                    : "hover:bg-white/50 text-neutral-600 hover:text-black"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-neutral-400 group-hover:text-black"}`} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-6">
          <div className="p-4 rounded-2xl bg-white/40 border border-white/20">
            <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2 tracking-widest">Acesso Rápido</p>
            <button 
              className="w-full btn-primary text-xs py-3 px-4 flex items-center justify-center gap-2 rounded-xl"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4" />
              Link Público
            </button>
          </div>

          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors group" 
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-semibold text-sm">Sair da Conta</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="mx-auto max-w-5xl animate-fade-in pointer-events-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
