import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#cfddea] flex justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl w-full relative z-10 glass-strong p-8 md:p-14 rounded-[3rem] shadow-glass border border-white/40 animate-slide-up">
        
        <Link href="/login" className="inline-flex items-center gap-2 text-neutral-500 hover:text-black mb-10 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Voltar para o Login</span>
        </Link>

        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Termos e Privacidade</h1>
        <p className="text-neutral-500 font-medium mb-12">Atualizado em Março de 2026</p>

        <div className="space-y-12 text-neutral-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">1. Termos de Serviço</h2>
            <p className="leading-relaxed">
              Bem-vindo ao BeautyFreelas. Ao acessar e utilizar nossa plataforma de agendamentos, você concorda com os presentes termos. 
              O BeautyFreelas é um sistema desenvolvido para facilitar a gestão de horários e serviços para profissionais autônomos de beleza e bem-estar.
            </p>
            <p className="leading-relaxed">
              Você é responsável por manter a confidencialidade das credenciais de sua conta e por todas as atividades que ocorrem sob ela. 
              Nos reservamos o direito de atualizar ou modificar as funções do sistema a qualquer momento para melhorar sua experiência.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">2. Política de Privacidade</h2>
            <p className="leading-relaxed">
              Sua privacidade é nossa prioridade. Coletamos e armazenamos apenas as informações estritamente necessárias para o 
              funcionamento do sistema (como nome, contato e dados do agendamento), visando aproximar profissionais e clientes.
            </p>
            <p className="leading-relaxed">
              <strong>Como usamos seus dados:</strong> Utilizamos suas informações exclusivamente para facilitar os agendamentos, 
              enviar notificações sobre os serviços e melhorar o aplicativo. Nunca venderemos seus dados a terceiros.
            </p>
            <p className="leading-relaxed">
              <strong>Segurança:</strong> Implementamos tecnologias em nuvem de ponta (Firebase) e práticas de segurança rigorosas para garantir 
              que os dados dos profissionais e de seus clientes permaneçam sempre em um ambiente seguro.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">3. Comunicações e Suporte</h2>
            <p className="leading-relaxed">
              O sistema utiliza seu contato cadastrado para envio de informações cruciais sobre os serviços e autenticação.
              Ao utilizar a plataforma, você nos autoriza a enviar mensagens necessárias para a prestação do serviço contratado 
              (confirmação e status de agendamento via WhatsApp ou E-mail).
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/30 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            © 2026 BeautyFreelas • Agendamento Instantâneo
          </p>
        </div>

      </div>
    </div>
  );
}
