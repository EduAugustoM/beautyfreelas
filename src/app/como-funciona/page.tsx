"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Chrome,
  Settings,
  Scissors,
  Share2,
  Search,
  CalendarCheck,
  CheckCircle,
  Rocket,
  DollarSign,
  Smartphone,
  ArrowRight,
  Award,
  Star,
  Sparkles,
  Play,
} from "lucide-react";

const professionalSteps = [
  {
    number: 1,
    icon: Chrome,
    title: "Crie sua Conta",
    description:
      "Faça login com Google em segundos. Sem formulários complicados, sem senhas para decorar.",
    color: "text-blue-500",
    bg: "bg-blue-50",
    accent: "from-blue-500/10 to-blue-500/5",
  },
  {
    number: 2,
    icon: Settings,
    title: "Configure seu Perfil",
    description:
      "Adicione seu nome, bio, foto profissional e crie seu link personalizado (/seu-nome).",
    color: "text-rose-500",
    bg: "bg-rose-50",
    accent: "from-rose-500/10 to-rose-500/5",
  },
  {
    number: 3,
    icon: Scissors,
    title: "Cadastre seus Serviços",
    description:
      "Defina serviços, preços, duração e seus horários de atendimento disponíveis.",
    color: "text-green-500",
    bg: "bg-green-50",
    accent: "from-green-500/10 to-green-500/5",
  },
  {
    number: 4,
    icon: Share2,
    title: "Compartilhe seu Link",
    description:
      "Coloque seu link na bio do Instagram e comece a receber agendamentos automaticamente!",
    color: "text-purple-500",
    bg: "bg-purple-50",
    accent: "from-purple-500/10 to-purple-500/5",
  },
];

const clientSteps = [
  {
    number: 1,
    icon: Search,
    title: "Encontre um Profissional",
    description:
      "Explore nossa vitrine de profissionais ou acesse diretamente o link que recebeu.",
    color: "text-blue-500",
    bg: "bg-blue-50",
    accent: "from-blue-500/10 to-blue-500/5",
  },
  {
    number: 2,
    icon: CalendarCheck,
    title: "Escolha Serviço, Data e Hora",
    description:
      "Selecione o serviço desejado, uma data disponível e o horário que mais combina com você.",
    color: "text-rose-500",
    bg: "bg-rose-50",
    accent: "from-rose-500/10 to-rose-500/5",
  },
  {
    number: 3,
    icon: CheckCircle,
    title: "Confirme o Agendamento",
    description:
      "Informe seu nome e telefone para contato. Pronto! Agendamento confirmado na hora.",
    color: "text-green-500",
    bg: "bg-green-50",
    accent: "from-green-500/10 to-green-500/5",
  },
];

const benefits = [
  {
    icon: Rocket,
    title: "Rápido",
    description: "Cadastro em menos de 2 minutos. Comece a receber agendamentos hoje mesmo.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: DollarSign,
    title: "Gratuito",
    description: "Sem taxas, sem mensalidades, sem surpresas. Totalmente free para sempre.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Smartphone,
    title: "Link na Bio",
    description: "Funciona direto do Instagram, WhatsApp ou qualquer rede social.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export default function ComoFuncionaPage() {
  const [activeTab, setActiveTab] = useState<"professional" | "client">("professional");

  const steps = activeTab === "professional" ? professionalSteps : clientSteps;

  return (
    <div className="min-h-screen bg-[#cfddea] text-neutral-900 selection:bg-black selection:text-white">
      {/* Decorative Circles */}
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-rose-200/30 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header */}
      <header className="bg-white/40 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-black text-xl tracking-tighter hover:opacity-70 transition-opacity"
          >
            Beauty<span className="text-rose-500">Freelas</span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity"
          >
            Sou Profissional
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20">
        {/* ====== HERO ====== */}
        <section className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-button">
            <Sparkles className="h-3.5 w-3.5 fill-white" />
            Guia Completo
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
            Como funciona o{" "}
            <span className="text-rose-600">BeautyFreelas?</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Conheça o caminho completo — do cadastro ao agendamento confirmado.
            Simples para profissionais, instantâneo para clientes.
          </p>
        </section>

        {/* ====== TABS ====== */}
        <section className="mb-8 animate-slide-up animate-delay-200">
          <div className="flex justify-center gap-3 mb-14">
            <button
              onClick={() => setActiveTab("professional")}
              className={`px-6 py-3.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === "professional"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              <Award className="w-4 h-4" />
              Sou Profissional
            </button>
            <button
              onClick={() => setActiveTab("client")}
              className={`px-6 py-3.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === "client"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              <Star className="w-4 h-4" />
              Sou Cliente
            </button>
          </div>

          {/* ====== STEP CARDS ====== */}
          <div
            key={activeTab}
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              activeTab === "professional" ? "lg:grid-cols-4" : "lg:grid-cols-3"
            } gap-6 animate-fade-in`}
          >
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="glass p-7 rounded-[2rem] border border-white/20 hover:border-white/50 group hover:scale-[1.03] transition-all duration-500 relative overflow-hidden animate-slide-up"
                style={{ animationDelay: `${idx * 100 + 100}ms` }}
              >
                {/* Subtle gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${step.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
                />

                {/* Step number badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center text-sm font-black shadow-button">
                    {step.number}
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${step.bg} ${step.color} shadow-sm group-hover:shadow-md transition-shadow`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                  {step.description}
                </p>

                {/* Connector line (not on last card) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-neutral-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ====== VISUAL FLOW SUMMARY ====== */}
        <section className="my-20 animate-slide-up animate-delay-400">
          <div className="glass-strong p-8 md:p-12 rounded-[2.5rem] border border-white/40 shadow-glass text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-10" />

            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-[0.2em] mb-4">
              Resumo Visual
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-8">
              {activeTab === "professional"
                ? "Cadastro → Configuração → Serviços → Link na Bio ✨"
                : "Explorar → Agendar → Confirmado ✨"}
            </h2>

            {/* Horizontal flow */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {steps.map((step, idx) => (
                <div key={step.number} className="flex items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2.5 rounded-xl ${step.bg} ${step.color}`}
                    >
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold whitespace-nowrap">
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-neutral-300 hidden sm:block flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-black/5" />

            {/* Tutoriais em Vídeo Section */}
            <div className="text-center">
              <h3 className="text-lg font-black tracking-tight mb-6 flex items-center justify-center gap-2">
                <Play className="h-5 w-5 fill-rose-500 text-rose-500" />
                Assista ao Tutorial
              </h3>
              
              <div key={activeTab} className="max-w-3xl mx-auto animate-fade-in">
                {activeTab === "client" ? (
                  /* Client Video */
                  <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                    <div className="flex items-center justify-center gap-2.5 mb-4">
                      <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-neutral-800">Tutorial do Cliente</h4>
                        <p className="text-[11px] text-neutral-500 font-medium">Como agendar um serviço em segundos</p>
                      </div>
                    </div>
                    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-inner border border-black/5 bg-black/5 relative">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/oZ6y6l2-nUk"
                        title="Tutorial do Cliente - BeautyFreelas"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                ) : (
                  /* Professional Video */
                  <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                    <div className="flex items-center justify-center gap-2.5 mb-4">
                      <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
                        <Scissors className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-neutral-800">Tutorial do Profissional</h4>
                        <p className="text-[11px] text-neutral-500 font-medium">Como criar sua conta e configurar seu link</p>
                      </div>
                    </div>
                    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-inner border border-black/5 bg-black/5 relative">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/rBWUCO5YctQ"
                        title="Tutorial do Profissional - BeautyFreelas"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ====== BENEFITS ====== */}
        <section className="mb-20 animate-slide-up animate-delay-500">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-[0.2em] mb-4">
              Vantagens
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Por que o BeautyFreelas?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="glass-strong p-8 rounded-[2rem] border border-white/40 text-center hover:scale-[1.03] transition-all duration-500 group animate-slide-up"
                style={{ animationDelay: `${idx * 100 + 200}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${benefit.bg} ${benefit.color} flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow group-hover:scale-110 duration-300`}
                >
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ====== FINAL CTA ====== */}
        <section className="text-center animate-slide-up animate-delay-600">
          <div className="glass-strong p-12 md:p-16 rounded-[3rem] border border-white/40 shadow-glass relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10" />

            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Pronto para começar?
            </h2>
            <p className="text-lg text-neutral-500 font-medium max-w-lg mx-auto mb-10">
              Junte-se à plataforma que conecta profissionais de beleza aos
              seus clientes de forma simples e elegante.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <span className="btn-primary cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2">
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
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-neutral-400 font-bold text-[10px] uppercase tracking-widest animate-fade-in animate-delay-800">
          © 2026 BeautyFreelas • Agendamento Instantâneo
        </footer>
      </main>
    </div>
  );
}
