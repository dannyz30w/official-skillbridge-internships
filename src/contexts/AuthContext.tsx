import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  accountType: string | null;
  signOut: () => Promise<void>;
  refreshAccountType: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null, user: null, loading: true, accountType: null,
  signOut: async () => {}, refreshAccountType: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState<string | null>(null);

  const fetchAccountType = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("account_type").eq("user_id", userId).maybeSingle();
    setAccountType(data?.account_type ?? null);
  };

  const refreshAccountType = async () => {
    if (session?.user) await fetchAccountType(session.user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setTimeout(() => fetchAccountType(session.user.id), 0);
      } else {
        setAccountType(null);
      }
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchAccountType(session.user.id);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setAccountType(null);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, accountType, signOut, refreshAccountType }}>
      {children}
    </AuthContext.Provider>
  );
};
