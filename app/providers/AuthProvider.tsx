import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { ChakraProvider } from '@chakra-ui/react';
import { supabase } from '@/utils/supabase/client';
import CreateAccountModal from '@/components/modals/(user)/CreateAccountModal';

interface AuthContextProps {
  session: Session | null;
  user: any;
}

const AuthContext = createContext<AuthContextProps>({ session: null, user: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const setAuthData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        setSession(session);

        if (session?.user) {
          console.log('Fetching user record...');
          const { data: userRecord, error: userError } = await supabase.from('users').select('*').eq('uuid', session.user.id).maybeSingle();

          if (userError) setShowModal(true);
          else if (!userRecord) setShowModal(true);
          else setUser(userRecord);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error in setAuthData:', (error as Error).message);
        setLoading(false);
      }
    };

    setAuthData();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event: any, session: Session | null) => {
      try {
        console.log('Auth state changed:', event, session);
        setSession(session);

        if (session?.user) {
          console.log('Fetching user record...');
          const { data: userRecord, error: userError } = await supabase.from('users').select('*').eq('uuid', session.user.id).maybeSingle();

          if (userError) setShowModal(true);
          else if (!userRecord) setShowModal(true);
          else setUser(userRecord);
        } else setUser(null);
      } catch (error) {
        console.error('Error in authListener:', (error as Error).message);
      }
    });

    return () => { authListener?.subscription.unsubscribe(); };
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <AuthContext.Provider value={{ session, user }}>
        {showModal ? <CreateAccountModal /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
