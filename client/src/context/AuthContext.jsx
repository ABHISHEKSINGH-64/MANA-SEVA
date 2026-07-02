import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('mana_seva_token')));

  useEffect(() => {
    const token = localStorage.getItem('mana_seva_token');
    if (!token) return;
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('mana_seva_token'))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAdmin: user?.role === 'admin',
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('mana_seva_token', data.token);
      setUser(data.user);
      return data.user;
    },
    async register(payload) {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('mana_seva_token', data.token);
      setUser(data.user);
      return data.user;
    },
    async updateProfile(payload) {
      const { data } = await api.put('/auth/profile', payload);
      setUser(data.user);
      return data.user;
    },
    logout() {
      localStorage.removeItem('mana_seva_token');
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
