
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  supabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  useEffect(() => {
    // Check if Supabase is properly configured by testing a simple operation
    const checkSupabaseConfig = async () => {
      try {
        // Try to get the session - this will fail if Supabase isn't configured
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error && error.message.includes('Invalid API key')) {
          setSupabaseConfigured(false);
        } else {
          setSupabaseConfigured(true);
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Supabase configuration error:', error);
        setSupabaseConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    checkSupabaseConfig();

    // Only set up auth listener if Supabase is configured
    if (supabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    }
  }, [supabaseConfigured]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    supabaseConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
