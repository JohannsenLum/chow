import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import { useProfile } from './profile-context'; // Add this import
import { supabase } from './supabase';

interface Quest {
    id: string;
    title: string;
    description: string;
    reward_exp: number;
    reward_paw_points: number;
    difficulty: 'Basic' | 'Advanced' | 'Expert';
    category: 'walk' | 'social' | 'health' | 'discovery' | 'marketplace';
    requirements: any;
    is_active: boolean;
}

interface UserQuest {
    id: string;
    user_id: string;
    quest_id: string;
    status: 'available' | 'active' | 'completed' | 'claimed';
    progress: any;
    started_at: string | null;
    completed_at: string | null;
    claimed_at: string | null;
    quest: Quest;
}

interface QuestContextType {
    quests: Quest[];
    userQuests: UserQuest[];
    loading: boolean;
    refreshQuests: () => Promise<void>;
    startQuest: (questId: string) => Promise<boolean>;
    completeQuest: (questId: string) => Promise<boolean>;
    claimReward: (questId: string) => Promise<boolean>;
    resetDailyQuests: () => Promise<boolean>;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export function QuestProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { refreshProfile } = useProfile(); // Add this to access profile refresh
    const [quests, setQuests] = useState<Quest[]>([]);
    const [userQuests, setUserQuests] = useState<UserQuest[]>([]);
    const [loading, setLoading] = useState(true);

    const loadQuests = async () => {
        try {
            setLoading(true);

            if (!user) {
                setQuests([]);
                setUserQuests([]);
                return;
            }

            // Load available quests
            const { data: questsData, error: questsError } = await supabase
                .from('quests')
                .select('*')
                .eq('is_active', true)
                .order('difficulty', { ascending: true });

            if (questsError) {
                console.error('Error loading quests:', questsError);
                return;
            }

            setQuests(questsData || []);

            // Load user quests
            const { data: userQuestsData, error: userQuestsError } = await supabase
                .from('user_quests')
                .select(`
                    *,
                    quest:quests(*)
                `)
                .eq('user_id', user.id);

            if (userQuestsError) {
                console.error('Error loading user quests:', userQuestsError);
                return;
            }

            setUserQuests(userQuestsData || []);
        } catch (error) {
            console.error('Error loading quests:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshQuests = async () => {
        await loadQuests();
    };

    const resetDailyQuests = async (): Promise<boolean> => {
        try {
            const { error } = await supabase.rpc('reset_daily_quests');
            if (error) {
                console.error('Error resetting quests:', error);
                return false;
            }
            await refreshQuests();
            return true;
        } catch (error) {
            console.error('Error resetting quests:', error);
            return false;
        }
    };

    const startQuest = async (questId: string): Promise<boolean> => {
        try {
            if (!user) return false;

            console.log('Starting quest:', questId);

            // Check if quest already exists
            const existingQuest = userQuests.find(uq => uq.quest_id === questId);

            if (existingQuest) {
                // Update existing quest to active
                const { error } = await supabase
                    .from('user_quests')
                    .update({
                        status: 'active',
                        started_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id)
                    .eq('quest_id', questId);

                if (error) {
                    console.error('Error updating quest:', error);
                    return false;
                }
            } else {
                // Insert new quest
                const { error } = await supabase
                    .from('user_quests')
                    .insert({
                        user_id: user.id,
                        quest_id: questId,
                        status: 'active',
                        started_at: new Date().toISOString(),
                        progress: {}
                    });

                if (error) {
                    console.error('Error inserting quest:', error);
                    return false;
                }
            }

            await refreshQuests();
            return true;
        } catch (error) {
            console.error('Error starting quest:', error);
            return false;
        }
    };

    const completeQuest = async (questId: string): Promise<boolean> => {
        try {
            if (!user) return false;

            console.log('Completing quest:', questId);

            const { error } = await supabase
                .from('user_quests')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString()
                })
                .eq('user_id', user.id)
                .eq('quest_id', questId);

            if (error) {
                console.error('Error completing quest:', error);
                return false;
            }

            await refreshQuests();
            return true;
        } catch (error) {
            console.error('Error completing quest:', error);
            return false;
        }
    };

    const claimReward = async (questId: string): Promise<boolean> => {
        try {
            if (!user) return false;

            // Get quest details
            const quest = quests.find(q => q.id === questId);
            if (!quest) {
                console.error('Quest not found:', questId);
                return false;
            }

            console.log('=== CLAIMING REWARD ===');
            console.log('Quest:', quest.title);
            console.log('Reward EXP:', quest.reward_exp);
            console.log('Reward PawPoints:', quest.reward_paw_points);

            // Get current user data first
            const { data: currentUser, error: fetchError } = await supabase
                .from('users')
                .select('exp_points, paw_points')
                .eq('id', user.id)
                .single();

            if (fetchError) {
                console.error('Error fetching user data:', fetchError);
                return false;
            }

            console.log('Current EXP:', currentUser?.exp_points);
            console.log('Current PawPoints:', currentUser?.paw_points);

            const newExp = (currentUser?.exp_points || 0) + quest.reward_exp;
            const newPawPoints = (currentUser?.paw_points || 0) + quest.reward_paw_points;

            console.log('New EXP will be:', newExp);
            console.log('New PawPoints will be:', newPawPoints);

            // Update user quest status first
            const { error: questError } = await supabase
                .from('user_quests')
                .update({
                    status: 'claimed',
                    claimed_at: new Date().toISOString()
                })
                .eq('user_id', user.id)
                .eq('quest_id', questId);

            if (questError) {
                console.error('Error claiming quest:', questError);
                return false;
            }

            console.log('Quest status updated successfully');

            // Update user profile with rewards
            const { data: updateData, error: profileError } = await supabase
                .from('users')
                .update({
                    exp_points: newExp,
                    paw_points: newPawPoints
                })
                .eq('id', user.id)
                .select('exp_points, paw_points');

            if (profileError) {
                console.error('Error updating profile:', profileError);
                return false;
            }

            console.log('Profile update result:', updateData);
            console.log('=== REWARD CLAIMED SUCCESSFULLY ===');

            // Refresh quests first, then profile to ensure proper order
            await refreshQuests();

            // Add a small delay to ensure database update is complete
            await new Promise(resolve => setTimeout(resolve, 500));

            // Refresh profile context
            await refreshProfile();

            return true;
        } catch (error) {
            console.error('Error claiming reward:', error);
            return false;
        }
    };

    useEffect(() => {
        loadQuests();
    }, [user]);

    return (
        <QuestContext.Provider
            value={{
                quests,
                userQuests,
                loading,
                refreshQuests,
                startQuest,
                completeQuest,
                claimReward,
                resetDailyQuests,
            }}
        >
            {children}
        </QuestContext.Provider>
    );
}

export function useQuest() {
    const context = useContext(QuestContext);
    if (context === undefined) {
        throw new Error('useQuest must be used within a QuestProvider');
    }
    return context;
} 