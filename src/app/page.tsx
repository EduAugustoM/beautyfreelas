import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Star, Award } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#cfddea]">
      {/* Background Decorative Element */}
      <div className="fixed top-0 w-full h-screen bg-gradient-to-b from-blue-100/20 to-transparent -z-10 pointer-events-none" />

      <section id="hero" className="w-full max-w-7xl animate-fade-in">
        <div className="md:rounded-[32px] md:p-16 lg:p-24 overflow-hidden glass shadow-glass rounded-3xl p-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Badge */}
              <div className="flex items-center bg-white/50 backdrop-blur-sm rounded-full pl-4 pr-6 py-2 w-max mb-8 animate-slide-up shadow-sm">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm">
                      <img 
                        src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                        alt="User" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span className="ml-4 text-xs sm:text-sm font-medium">
                  <span className="font-bold underline decoration-rose-500/30">+2k</span> profissionais cadastrados
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up animate-delay-200 text-neutral-900">
                Sua beleza merece o <span className="text-rose-600">melhor agendamento.</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-neutral-600 max-w-xl mb-10 animate-slide-up animate-delay-400 leading-relaxed font-medium">
                Transforme seu talento em um negócio profissional. Crie seu 
                portfólio em minutos e receba agendamentos diretamente pelo 
                seu link na bio. Simples, rápido e elegante.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animate-delay-600">
                <Link href="/login">
                  <span className="btn-primary cursor-pointer w-full sm:w-auto">
                    <Award className="w-5 h-5" />
                    Sou Profissional
                  </span>
                </Link>
                
                <Link href="/explore">
                  <span className="btn-secondary cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2">
                    <Star className="w-5 h-5" />
                    Sou Cliente
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>

              {/* Ratings */}
              <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 animate-slide-up animate-delay-800">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-neutral-700">4.9/5 Avaliação</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-neutral-700">Líder no Segmento</span>
                </div>
              </div>
            </div>

            {/* Visual Element / Card Stack */}
            <div className="hidden lg:flex relative animate-slide-in-left animate-delay-300">
               <div className="relative w-full aspect-square max-w-md mx-auto">
                  {/* Decorative Cards */}
                  <div className="absolute top-10 -right-10 w-64 h-80 bg-white rounded-[24px] shadow-card rotate-6 z-10 p-6 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                        <Award className="w-6 h-6 text-rose-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Agenda Lotada</h3>
                      <p className="text-sm text-neutral-500">Seus horários são otimizados automaticamente para sua conveniência.</p>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-rose-500 rounded-full" />
                    </div>
                  </div>

                  <div className="absolute -bottom-5 -left-5 w-64 h-48 glass shadow-glass -rotate-3 z-20 rounded-[24px] p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Star className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="font-bold">Portfolio Pro</div>
                    </div>
                    <p className="text-sm text-neutral-600">Exiba seus melhores trabalhos com estilo e sofisticação.</p>
                  </div>

                  {/* Main Image placeholder-like element */}
                  <div className="w-full h-full bg-gradient-to-br from-white to-neutral-200 rounded-[40px] shadow-glass border-4 border-white/50 relative overflow-hidden flex items-center justify-center">
                     <div className="text-rose-500/20 font-black text-8xl rotate-12">BEAUTY</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="mt-12 text-center animate-fade-in animate-delay-800">
        <p className="text-sm font-semibold text-neutral-500">
          Para clientes: acesse o link direto do seu profissional favorito.
        </p>
      </footer>
    </main>
  );
}
