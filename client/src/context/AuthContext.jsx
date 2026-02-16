import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch profile from profiles table, fall back to user_metadata
    const fetchProfile = async (authUser) => {
        if (!authUser) return null;
        const meta = authUser.user_metadata || {};

        // Try to get profile from the profiles table
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (!error && profile) {
                return {
                    id: authUser.id,
                    email: authUser.email,
                    name: profile.name || meta.name || authUser.email?.split('@')[0] || 'User',
                    role: profile.role || meta.role || 'member',
                    membershipPlan: profile.membership_plan || meta.membership_plan || null,
                    membershipExpiry: profile.membership_expiry || meta.membership_expiry || null,
                    phone: profile.phone || meta.phone || '',
                };
            }
        } catch (e) {
            console.error('Profile fetch error:', e);
        }

        // Fallback to user_metadata if profile query fails
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
                if (session?.user) {
                    const u = await fetchProfile(session.user);
                    setUser(u);
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.error('Session error:', e);
            }
            setLoading(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const u = await fetchProfile(session.user);
                setUser(u);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const u = await fetchProfile(data.user);
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
        const u = await fetchProfile(data.user);
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
