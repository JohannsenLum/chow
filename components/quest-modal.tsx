import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useProfile } from '@/lib/profile-context';
import { useQuest } from '@/lib/quest-context';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface QuestModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function QuestModal({ visible, onClose }: QuestModalProps) {
  const { quests, userQuests, loading, startQuest, completeQuest, claimReward, resetDailyQuests } = useQuest();
  const { refreshProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available');

  // Fix the available quests logic
  const availableQuests = quests.filter(quest => {
    const userQuest = userQuests.find(uq => uq.quest_id === quest.id);
    return !userQuest || userQuest.status === 'available';
  });

  const activeQuests = userQuests.filter(userQuest => userQuest.status === 'active');

  // Updated: Include both 'completed' and 'claimed' statuses in completed quests
  const completedQuests = userQuests.filter(userQuest =>
    userQuest.status === 'completed' || userQuest.status === 'claimed'
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Basic': return '#E3F2FD';
      case 'Advanced': return '#F3E5F5';
      case 'Expert': return '#FFEBEE';
      default: return '#E3F2FD';
    }
  };

  const getDifficultyTextColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Basic': return '#1976D2';
      case 'Advanced': return '#7B1FA2';
      case 'Expert': return '#D32F2F';
      default: return '#1976D2';
    }
  };

  const handleStartQuest = async (questId: string) => {
    const success = await startQuest(questId);
    if (success) {
      Alert.alert('Quest Started!', 'Good luck on your quest!');
    } else {
      Alert.alert('Error', 'Failed to start quest. Please try again.');
    }
  };

  const handleCompleteQuest = async (questId: string) => {
    const success = await completeQuest(questId);
    if (success) {
      Alert.alert('Quest Completed!', 'Great job! You can now claim your reward.');
    } else {
      Alert.alert('Error', 'Failed to complete quest. Please try again.');
    }
  };

  const handleClaimReward = async (questId: string) => {
    const success = await claimReward(questId);
    if (success) {
      Alert.alert('Reward Claimed!', 'Your rewards have been added to your profile.');
      // Refresh profile to show updated points
      await refreshProfile();
    } else {
      Alert.alert('Error', 'Failed to claim reward. Please try again.');
    }
  };

  const handleResetDailyQuests = async () => {
    Alert.alert(
      'Reset Daily Quests',
      'This will reset all your active and completed quests. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const success = await resetDailyQuests();
            if (success) {
              Alert.alert('Success', 'Daily quests have been reset!');
            } else {
              Alert.alert('Error', 'Failed to reset quests. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderQuestCard = (quest: any, userQuest?: any) => (
    <View key={quest.id} style={styles.questCard}>
      <View style={styles.questHeader}>
        <Text style={styles.questTitle}>{quest.title}</Text>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quest.difficulty) }]}>
          <Text style={[styles.difficultyText, { color: getDifficultyTextColor(quest.difficulty) }]}>
            {quest.difficulty}
          </Text>
        </View>
      </View>
      <Text style={styles.questDescription}>{quest.description}</Text>
      <View style={styles.questFooter}>
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardText}>+{quest.reward_exp} EXP</Text>
          <IconSymbol name="pawprint.fill" size={16} color="#8D6E63" />
          <Text style={styles.rewardText}>+{quest.reward_paw_points} PawPoints</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.actionButton,
            userQuest?.status === 'completed' && styles.claimButton,
            userQuest?.status === 'claimed' && styles.claimedButton // Add claimed button style
          ]}
          onPress={() => {
            if (userQuest?.status === 'completed') {
              handleClaimReward(quest.id);
            } else if (userQuest?.status === 'active') {
              handleCompleteQuest(quest.id);
            } else {
              handleStartQuest(quest.id);
            }
          }}
        >
          <Text style={styles.actionButtonText}>
            {userQuest?.status === 'claimed' ? 'Reward Claimed' :
              userQuest?.status === 'completed' ? 'Claim Reward' :
                userQuest?.status === 'active' ? 'Complete Quest' : 'Start Quest'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading quests...</Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Quests</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleResetDailyQuests} style={styles.resetButton}>
              <IconSymbol name="arrow.clockwise" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'available' && styles.activeTab]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
              Available ({availableQuests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              Active ({activeQuests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Completed ({completedQuests.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.questList} showsVerticalScrollIndicator={false}>
          {activeTab === 'available' && availableQuests.map(quest => renderQuestCard(quest))}
          {activeTab === 'active' && activeQuests.map(userQuest => renderQuestCard(userQuest.quest, userQuest))}
          {activeTab === 'completed' && completedQuests.map(userQuest => renderQuestCard(userQuest.quest, userQuest))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.textInverse,
  },
  questList: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  questCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  questTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  difficultyText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },
  questDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    marginRight: Spacing.xs,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
  },
  startButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
  },
  claimButton: {
    backgroundColor: '#4CAF50',
  },
  claimedButton: {
    backgroundColor: '#9E9E9E', // Gray for claimed quests
  },
  actionButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resetButton: {
    padding: 8,
  },
});
