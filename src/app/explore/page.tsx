"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProfessionals } from "@/lib/db";
import type { Professional } from "@/lib/db";
import { User, Star, ArrowRight, Search } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";


export default function ExplorePage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllProfessionals();
        setProfessionals(data);
      } catch (error) {
        console.error("[explore] Error loading professionals:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredProfessionals = professionals.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#cfddea] text-neutral-900 selection:bg-black selection:text-white pb-20">
      {/* Decorative Circles */}
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-rose-200/30 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header */}
      <header className="bg-white/40 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tighter hover:opacity-70 transition-opacity">
            Beauty<span className="text-rose-500">Freelas</span>
          </Link>
          <Link href="/login" className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">
            Sou Profissional
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-12 md:pt-20">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Encontre o profissional perfeito</h1>
          <p className="text-lg text-neutral-600 font-medium leading-relaxed">
            Descubra os melhores especialistas da sua região, veja seus portfólios e agende seu horário com facilidade.
          </p>
          
          <div className="relative mt-8 max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou especialidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 border border-white focus:border-neutral-300 rounded-[2rem] py-4 pl-12 pr-4 shadow-sm outline-none transition-all placeholder:text-neutral-400 font-medium focus:ring-4 focus:ring-black/5"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} variant="professional-card" />
            ))}
          </div>

        ) : filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProfessionals.map((prof, idx) => (
              <Link 
                href={`/${prof.slug}`} 
                key={prof.uid || idx}
                className="glass p-6 rounded-[2.5rem] group hover:scale-[1.02] transition-all duration-500 flex flex-col items-center text-center animate-slide-up hover:shadow-glass border border-white/20 hover:border-white/50"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm mb-4 relative bg-white">
                  {prof.photoUrl ? (
                    <img src={prof.photoUrl} alt={prof.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                      <User className="h-10 w-10 text-neutral-300" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold tracking-tight mb-1">{prof.name}</h3>
                


                <p className="text-sm text-neutral-500 font-medium line-clamp-2 mb-6 flex-grow px-2">
                  {prof.description || "Especialista em beleza e bem-estar, dedicado a realçar sua melhor versão."}
                </p>
                
                <div className="w-full pt-6 border-t border-black/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold">
                    <Star className="h-3 w-3 fill-white" /> 4.9
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-rose-600 group-hover:text-rose-500 transition-colors">
                    Ver perfil <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-strong py-20 px-6 rounded-[3rem] text-center border-white/20 animate-fade-in max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold tracking-tight mb-2">Nenhum profissional encontrado</h3>
            <p className="text-neutral-500 font-medium">Não achamos correspondências para "{searchTerm}". Tente buscar por outros termos.</p>
          </div>
        )}
      </main>
    </div>
  );
}
