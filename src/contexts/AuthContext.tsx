"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result when returning from signInWithRedirect
    getRedirectResult(auth).catch((error) => {
      // Only log non-null errors (null means no redirect result pending)
      if (error) {
        console.error("Error processing redirect sign-in:", error);
        
        let message = "Falha ao completar a autenticação via redirecionamento.";
        if (error.code === "auth/redirect-cancelled-by-user") {
          message = "O login foi cancelado pelo usuário.";
        } else if (error.code === "auth/network-request-failed") {
          message = "Erro de rede ao se conectar ao servidor de autenticação.";
        } else if (error.code === "auth/operation-not-allowed") {
          message = "Esta operação de login não está ativa. Contate o suporte.";
        } else if (error.code === "auth/internal-error") {
          message = "Ocorreu um erro interno na autenticação. Tente novamente.";
        }
        
        toast.error(message);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    // Force redirect flow on mobile devices. Popups are aggressively blocked
    // on mobile Safari/Chrome, and redirect offers a better user experience.
    const isMobile = typeof window !== "undefined" && 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      try {
        await signInWithRedirect(auth, provider);
      } catch (error) {
        console.error("Error launching mobile Google sign-in redirect:", error);
        toast.error("Erro ao iniciar login. Tente novamente ou verifique as permissões de cookies.");
        throw error;
      }
      return;
    }

    try {
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      // If popup was blocked (e.g., in-app webview or specific browser settings), fall back to redirect
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "auth/popup-blocked"
      ) {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError) {
          console.error("Error falling back to redirect:", redirectError);
          toast.error("O popup de login foi bloqueado e o redirecionamento falhou.");
          throw redirectError;
        }
        return;
      }
      console.error("Error signing in with Google:", error);
      toast.error("Erro ao entrar com o Google. Tente novamente.");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

