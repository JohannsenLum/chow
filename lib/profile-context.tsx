import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import { supabase } from './supabase';

interface UserProfile {
    id: string;
    display_name: string;
    bio: string;
    avatar_url: string | null;
    exp_points: number;
    paw_points: number;
    level: number;
}

interface ProfileContextType {
    userProfile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUserProfile = async () => {
        try {
            setLoading(true);

            if (!user) {
                console.error('No authenticated user found');
                return;
            }

            // Fetch user profile from database
            const { data: userProfile, error } = await supabase
                .from('users')
                .select(`
          id,
          display_name,
          bio,
          avatar_url,
          exp_points,
          paw_points,
          level
        `)
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                return;
            }

            if (userProfile) {
                console.log('Profile loaded:', userProfile);
                setUserProfile(userProfile);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshProfile = async () => {
        await loadUserProfile();
    };

    const updateProfile = (updates: Partial<UserProfile>) => {
        if (userProfile) {
            setUserProfile({ ...userProfile, ...updates });
        }
    };

    useEffect(() => {
        if (user) {
            loadUserProfile();
        }
    }, [user]);

    const value = {
        userProfile,
        loading,
        refreshProfile,
        updateProfile
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
} 