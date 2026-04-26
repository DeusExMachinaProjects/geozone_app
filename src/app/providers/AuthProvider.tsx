import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {AuthSession} from '../../features/auth/types/types';
import {
  bootstrapStoredSession,
  refreshStoredSession,
  remoteLogoutCurrentSession,
} from '../../services/auth/sessionManager';
import {saveAuthSession} from '../../services/auth/authStorage';

type AuthStatus = 'loading' | 'guest' | 'authenticated';

type AuthContextValue = {
  status: AuthStatus;
  session: AuthSession | null;
  signIn: (session: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const storedSession = await bootstrapStoredSession();

        if (!isMounted) {
          return;
        }

        if (storedSession) {
          setSession(storedSession);
          setStatus('authenticated');
          return;
        }

        setSession(null);
        setStatus('guest');
      } catch (error) {
        console.error('Error bootstrap auth:', error);

        if (!isMounted) {
          return;
        }

        setSession(null);
        setStatus('guest');
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (nextSession: AuthSession) => {
    await saveAuthSession(nextSession);
    setSession(nextSession);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async () => {
    await remoteLogoutCurrentSession();
    setSession(null);
    setStatus('guest');
  }, []);

  const refreshSession = useCallback(async () => {
    const nextSession = await refreshStoredSession();

    if (!nextSession) {
      setSession(null);
      setStatus('guest');
      return false;
    }

    setSession(nextSession);
    setStatus('authenticated');
    return true;
  }, []);

  const value = useMemo(
    () => ({
      status,
      session,
      signIn,
      signOut,
      refreshSession,
    }),
    [status, session, signIn, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}