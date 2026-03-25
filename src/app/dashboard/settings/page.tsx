"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getProfessionalById, saveProfessional } from "@/lib/db";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, AtSign, Phone, Globe, Briefcase, Camera } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function loadProfessional() {
      if (user) {
        try {
          const data = await getProfessionalById(user.uid);
          if (data) {
            setName(data.name || "");
            setBio((data as any).bio || data.description || "");
            setSlug(data.slug || "");
            setPhone(data.phone || "");
          }
        } catch (error) {
          console.error("[settings] Failed to load data:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadProfessional();
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await saveProfessional(user.uid, {
        name,
        description: bio,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        phone,
        photoUrl: user.photoURL || undefined,
      });
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("[settings] Failed to update:", error);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-10 w-64 bg-white/20 rounded-xl" />
        <div className="h-[600px] bg-white/20 rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="animate-slide-up">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Configurações do Perfil</h1>
        <p className="text-neutral-500 font-medium">Personalize sua presença online e informações de contato.</p>
      </header>

      <div className="glass-strong rounded-[2.5rem] p-4 border border-white/40 shadow-glass animate-slide-up animate-delay-100">
        <form onSubmit={handleSave} className="space-y-12 p-6 lg:p-10">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left Column: Visual/Quick Actions */}
            <div className="space-y-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full bg-neutral-100 flex items-center justify-center border-4 border-white shadow-card overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-20 w-20 text-neutral-300" />
                    )}
                  </div>
                  <button type="button" className="absolute bottom-1 right-1 p-3 bg-black text-white rounded-full shadow-button hover:scale-110 transition-transform">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="mt-6 font-bold text-xl tracking-tight">{name || "Seu Nome"}</h3>
                <p className="text-sm text-neutral-400 font-medium">{user?.email}</p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50/50 border border-black/5">
                <p className="text-[10px] uppercase font-bold text-neutral-400 mb-4 tracking-widest">Informações da Conta</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <AtSign className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm font-semibold">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm font-semibold">Português (BR)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="md:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="perfName" className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <User className="h-3 w-3" /> Nome Completo
                  </Label>
                  <input
                    id="perfName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome profissional"
                    required
                    className="w-full bg-white/50 border-white/20 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300 text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <Globe className="h-3 w-3" /> Link Personalizado
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">/</span>
                    <input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="seu-nome"
                      required
                      className="w-full bg-white/50 border-white/20 rounded-xl pl-8 pr-4 py-3.5 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <Phone className="h-3 w-3" /> Telefone / WhatsApp
                  </Label>
                  <input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-white/50 border-white/20 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <Briefcase className="h-3 w-3" /> Minha Bio
                </Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte um pouco sobre sua experiência e especialidades..."
                  className="w-full bg-white/50 border-white/20 rounded-[1.5rem] px-4 py-4 min-h-[160px] focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300 text-sm font-medium resize-none"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary w-full sm:w-auto px-8 py-4 rounded-2xl font-bold min-w-[200px]"
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
