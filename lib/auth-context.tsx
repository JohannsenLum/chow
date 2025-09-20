import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    signUp: (email: string, password: string, username: string, displayName: string) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    createUserProfile: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        // Get initial session and restore from AsyncStorage
        const getInitialSession = async () => {
            try {
                // First try to get session from Supabase
                const { data: { session: currentSession } } = await supabase.auth.getSession();

                if (currentSession) {
                    console.log('Found active session:', currentSession.user?.email);
                    setSession(currentSession);
                    setUser(currentSession.user);
                    setLoading(false);
                    setIsInitialLoad(false);
                    return;
                }

                // If no active session, try to restore from AsyncStorage
                const storedSession = await AsyncStorage.getItem('supabase_session');
                if (storedSession) {
                    try {
                        const parsedSession = JSON.parse(storedSession);
                        console.log('Restoring session from storage:', parsedSession.user?.email);

                        // Verify the session is still valid by refreshing it
                        const { data: { session: refreshedSession }, error } = await supabase.auth.setSession({
                            access_token: parsedSession.access_token,
                            refresh_token: parsedSession.refresh_token
                        });

                        if (refreshedSession && !error) {
                            console.log('Session restored successfully');
                            setSession(refreshedSession);
                            setUser(refreshedSession.user);
                        } else {
                            console.log('Stored session is invalid, clearing...');
                            await AsyncStorage.removeItem('supabase_session');
                        }
                    } catch (parseError) {
                        console.error('Error parsing stored session:', parseError);
                        await AsyncStorage.removeItem('supabase_session');
                    }
                }
            } catch (error) {
                console.error('Error getting initial session:', error);
            } finally {
                setLoading(false);
                setIsInitialLoad(false);
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.email);

                // Don't clear session on initial load if we're still loading
                if (event === 'INITIAL_SESSION' && isInitialLoad) {
                    console.log('Skipping initial session clear');
                    return;
                }

                if (session) {
                    setSession(session);
                    setUser(session.user);

                    // Store session in AsyncStorage for persistence
                    try {
                        await AsyncStorage.setItem('supabase_session', JSON.stringify(session));
                        console.log('Session stored in AsyncStorage');
                    } catch (error) {
                        console.error('Error storing session:', error);
                    }
                } else {
                    setSession(null);
                    setUser(null);

                    // Only clear stored session if this is not the initial load
                    if (!isInitialLoad) {
                        try {
                            await AsyncStorage.removeItem('supabase_session');
                            console.log('Session cleared from AsyncStorage');
                        } catch (error) {
                            console.error('Error clearing session:', error);
                        }
                    }
                }

                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [isInitialLoad]);

    const signUp = async (email: string, password: string, username: string, displayName: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        display_name: displayName
                    }
                }
            });

            if (error) {
                return { error };
            }

            if (data.user) {
                await createUserProfile(data.user);
            }

            return { error: null };
        } catch (error) {
            return { error };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return { error };
            }

            return { error: null };
        } catch (error) {
            return { error };
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const createUserProfile = async (user: User) => {
        try {
            const { error } = await supabase
                .from('users')
                .insert({
                    id: user.id,
                    email: user.email,
                    display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Pet Owner',
                    bio: '',
                    exp_points: 0,
                    paw_points: 0,
                    level: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error('Error creating user profile:', error);
            }
        } catch (error) {
            console.error('Error creating user profile:', error);
        }
    };

    const value = {
        session,
        user,
        loading,
        isAuthenticated: !!session,
        signUp,
        signIn,
        signOut,
        createUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
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