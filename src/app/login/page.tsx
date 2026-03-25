"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#cfddea]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/20" />
          <p className="text-sm font-medium text-neutral-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#cfddea] p-4 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />

      <Card className="w-full max-w-md glass shadow-glass border-white/20 animate-slide-up rounded-[32px] overflow-hidden">
        <CardHeader className="text-center pb-2 pt-10 px-8">
          <Link href="/" className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-button rotate-3 hover:rotate-6 hover:scale-110 transition-all duration-300">
             <span className="text-white font-black text-2xl">B</span>
          </Link>
          <CardTitle className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
            Bem-vindo(a)
          </CardTitle>
          <CardDescription className="text-base text-neutral-600 font-medium">
            Gerencie sua agenda com sofisticação e facilidade.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-8">
          <button 
            onClick={signInWithGoogle} 
            className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
            Entrar com Google
          </button>
          
          <div className="space-y-3 mt-4">
            <div className="flex justify-center text-xs uppercase">
              <span className="text-neutral-400 font-bold tracking-widest">Acesso Seguro</span>
            </div>
            
            <p className="text-[11px] text-center text-neutral-500 leading-relaxed font-medium">
              Ao entrar, você concorda com nossos <br />
              <button onClick={() => router.push('/termos')} className="underline cursor-pointer hover:text-black transition-colors">Termos de Serviço</button> e 
              <button onClick={() => router.push('/termos')} className="underline cursor-pointer hover:text-black transition-colors ms-1">Política de Privacidade</button>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
