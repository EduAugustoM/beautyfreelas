"use client";

import { useEffect, useState } from "react";
import { getProfessionalBySlug } from "@/lib/db";
import type { Professional } from "@/lib/db";
import BookingForm from "./components/BookingForm";
import { User, Phone, Sparkles } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";

export default function ProfileClient({ slug }: { slug: string }) {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (slug) {
        try {
          const data = await getProfessionalBySlug(slug as string);
          setProfessional(data);
        } catch (error) {
          console.error("[public-profile] Error:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#cfddea] flex items-center justify-center p-6 text-neutral-900">
        <SkeletonCard variant="profile" />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-[#cfddea] flex items-center justify-center p-6 text-neutral-900">
        <div className="glass-strong p-12 rounded-[2.5rem] text-center">
          <h1 className="text-2xl font-bold mb-4">Profissional não encontrado</h1>
          <p className="text-neutral-500">O link acessado pode estar incorreto ou o perfil não existe mais.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#cfddea] text-neutral-900 selection:bg-black selection:text-white">
      {/* Decorative Circles */}
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px] -z-10" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-rose-200/30 rounded-full blur-[100px] -z-10" />

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Profile Hero Section */}
        <section className="flex flex-col items-center text-center gap-8 mb-16">
          <div className="animate-slide-up">
            <div className="relative inline-block group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-card mb-6 transition-transform duration-500 group-hover:scale-105">
                {professional.photoUrl && /^https:\/\//i.test(professional.photoUrl) ? (
                  <img src={professional.photoUrl} alt={professional.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                    <User className="h-16 w-16 text-neutral-300" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-button group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 animate-slide-up animate-delay-100">
              {professional.name}
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-bold uppercase tracking-widest text-neutral-500 animate-slide-up animate-delay-200">
              {professional.phone && (
                <span className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full shadow-button">
                  <Phone className="h-4 w-4" /> {professional.phone}
                </span>
              )}
            </div>
          </div>

          <div className="max-w-2xl animate-fade-in animate-delay-400">
            <p className="text-lg md:text-xl text-neutral-500 leading-relaxed font-medium italic">
              "{professional.description || (professional as any).bio || "Especialista em beleza e bem-estar, dedicado a realçar sua melhor versão."}"
            </p>
          </div>
        </section>

        {/* Booking Section Container */}
        <div className="animate-slide-up animate-delay-600">
          <div className="glass-strong p-2 md:p-4 rounded-[3.5rem] shadow-glass border border-white/40 relative overflow-hidden">
             {/* Dynamic background element for the booking form */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-10" />
            
            <BookingForm 
              professional={professional}
            />
          </div>
        </div>

        {/* Footer info */}
        <footer className="mt-20 text-center text-neutral-400 font-bold text-[10px] uppercase tracking-widest animate-fade-in animate-delay-800">
          © 2026 BeautyFreelas • Agendamento Instantâneo
        </footer>
      </main>
    </div>
  );
}
