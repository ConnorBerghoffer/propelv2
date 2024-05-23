'use client'
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getSession = async () => {
        const { data: session, error } = await supabase.auth.getSession()
        setUser(session?.session?.user ?? null);
        setLoading(false);
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); });
        return () => { listener?.subscription.unsubscribe(); };
    }
    getSession()
    }, []);

    const login = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
          });
        if (error) console.error('Login error', error);
        setLoading(false);
    };

    const logout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Logout error', error);
        setLoading(false);
    };

    return {
        user,
        loading,
        login,
        logout,
    };
};
