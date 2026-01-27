import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  storageWarning: boolean; // true when storage is degraded (in-app browser)
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Detect if localStorage is actually working
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__auth_storage_test__';
    window.localStorage.setItem(testKey, 'test');
    const result = window.localStorage.getItem(testKey);
    window.localStorage.removeItem(testKey);
    return result === 'test';
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => {
    // Check if storage is degraded (in-app browsers, strict privacy mode)
    if (typeof window !== 'undefined' && !isLocalStorageAvailable()) {
      console.warn('[Auth] localStorage indisponível - sessão pode não persistir entre reloads');
      setStorageWarning(true);
    }

    // Get initial session with error handling
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('[Auth] Erro ao recuperar sessão:', error.message);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((err) => {
        // Network error or storage corruption
        console.error('[Auth] Falha crítica ao recuperar sessão:', err);
        setSession(null);
        setUser(null);
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Estado alterado:', event, session ? 'com sessão' : 'sem sessão');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.warn('[Auth] Erro no login:', error.message);
      return { error };
    }

    // Update state immediately for faster UI response
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
    }

    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Disable email confirmation for direct login
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      console.warn('[Auth] Erro no cadastro:', error.message);
      return { error };
    }

    // If successful and session exists (auto-confirm), update state immediately
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
    }

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[Auth] Erro ao deslogar:', err);
      // Force clear state even if Supabase call fails
      setSession(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, storageWarning, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
