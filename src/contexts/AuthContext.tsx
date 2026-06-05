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
    try {
      // Use signInWithPopup by default for both desktop and mobile devices.
      // signInWithRedirect is blocked on many mobile browsers (like Safari and Chrome on iOS)
      // due to third-party cookie restrictions (ITP). signInWithPopup works when triggered
      // by a direct user gesture (button click).
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      // If popup was blocked (e.g., in-app webview or specific browser settings), fall back to redirect
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "auth/popup-blocked"
      ) {
        await signInWithRedirect(auth, provider);
        return;
      }
      console.error("Error signing in with Google:", error);
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

