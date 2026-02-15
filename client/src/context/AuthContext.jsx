import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const buildUser = (authUser) => {
        if (!authUser) return null;
        const meta = authUser.user_metadata || {};
        return {
            id: authUser.id,
            email: authUser.email,
            name: meta.name || authUser.email?.split('@')[0] || 'User',
            role: meta.role || 'member',
            membershipPlan: meta.membership_plan || null,
            membershipExpiry: meta.membership_expiry || null,
            phone: meta.phone || '',
        };
    };

    useEffect(() => {
        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ? buildUser(session.user) : null);
            } catch (e) {
                console.error('Session error:', e);
            }
            setLoading(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ? buildUser(session.user) : null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const u = buildUser(data.user);
        setUser(u);
        return u;
    };

    const register = async ({ name, email, password, role }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, role: role || 'member' } }
        });
        if (error) throw error;
        const u = buildUser(data.user);
        setUser(u);
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const updateUser = (updates) => setUser(prev => prev ? { ...prev, ...updates } : prev);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}
