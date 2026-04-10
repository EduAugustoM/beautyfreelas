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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="flex flex-col md:flex-row min-h-screen bg-[#cfddea] text-neutral-900">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden glass-strong border-b border-white/20 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-button">
            <span className="text-white font-black text-sm">B</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">BeautyFreelas</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white/40 rounded-xl hover:bg-white/60 transition-colors"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? "flex" : "hidden"} md:flex w-full md:w-72 glass-strong border-b md:border-b-0 md:border-r border-white/20 p-6 md:p-8 flex-col fixed md:sticky top-[73px] md:top-0 h-[calc(100vh-73px)] md:h-screen z-20 overflow-y-auto`}>
        <div className="hidden md:flex mb-12 items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-button">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">BeautyFreelas</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
            // To handle subroutes correctly if needed:
            // const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
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

        <div className="mt-8 space-y-6 pb-6 md:pb-0">
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
      <main className="flex-1 p-4 sm:p-10 overflow-x-hidden">
        <div className="mx-auto max-w-5xl animate-fade-in pointer-events-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
