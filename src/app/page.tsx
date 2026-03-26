import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Star, Award } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#cfddea]">
      {/* Background Decorative Element */}
      <div className="fixed top-0 w-full h-screen bg-gradient-to-b from-blue-100/20 to-transparent -z-10 pointer-events-none" />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes customFloatReverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-3deg); }
        }
      `}} />

      <section id="hero" className="w-full max-w-7xl animate-fade-in">
        <div className="md:rounded-[32px] md:p-16 lg:p-24 overflow-hidden glass shadow-glass rounded-3xl p-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

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


            </div>

            {/* Visual Element / Card Stack */}
            <div className="hidden lg:flex relative animate-slide-in-left animate-delay-300">
               <div className="relative w-full aspect-square max-w-md mx-auto">
                  {/* Decorative Cards */}
                  <div 
                    className="absolute -top-20 -left-25 z-30"
                    style={{ animation: 'customFloat 6s ease-in-out infinite' }}
                  >
                    <div className="w-48 lg:w-64 aspect-[4/3] glass shadow-glass p-2 -rotate-6 rounded-[24px] overflow-hidden">
                      <div className="w-full h-full rounded-[16px] overflow-hidden">
                        <img 
                          src="/images/female_hands.jpg" 
                          alt="Portfolio Pro"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div 
                    className="absolute -bottom-20 -right-25 z-30"
                    style={{ animation: 'customFloatReverse 6s ease-in-out infinite' }}
                  >
                    <div className="w-48 lg:w-64 aspect-[4/5] glass shadow-glass p-2 rounded-[24px] rotate-6 flex flex-col justify-between overflow-hidden">
                      <div className="w-full h-full rounded-[16px] overflow-hidden">
                        <img 
                          src="/images/womans_eye.jpeg" 
                          alt="Agenda Lotada"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Main Video element */}
                  <div className="w-full h-full bg-gradient-to-br from-white to-neutral-200 rounded-[40px] shadow-glass border-8 border-white/50 relative overflow-hidden flex items-center justify-center z-20">
                     <video 
                       src="/videos/hero.mp4"
                       autoPlay 
                       muted 
                       loop 
                       playsInline
                       className="w-full h-full object-cover"
                     />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
