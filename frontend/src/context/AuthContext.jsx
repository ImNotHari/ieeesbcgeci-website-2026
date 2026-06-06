// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const profile = await fetchProfile(session.access_token);
          if (profile) setUser(profile);
        }
      } catch (err) {
        console.error('Session restore failed:', err.message);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
        } else if (session?.access_token) {
          const profile = await fetchProfile(session.access_token);
          if (profile) setUser(profile);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { ...res.data.data, access_token: token };
    } catch {
      return null;
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
      { email, password }
    );

    if (res.data.success) {
      const { access_token, user: userData } = res.data.data;
      setUser({ ...userData, access_token });
      return { success: true, role: userData.role };
    }

    return { success: false, error: res.data.error };
  };

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${user?.access_token}` } }
      );
    } catch {
      // clear local state anyway
    } finally {
      await supabase.auth.signOut();
      setUser(null);
    }
  };

  const value = { user, loading, login, logout, isAdmin: user?.role === 'admin' };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
