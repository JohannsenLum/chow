import { IconSymbol } from '@/components/ui/icon-symbol';
import * as React from 'react';
import { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  difficulty: 'Basic' | 'Advanced';
  status: 'active' | 'complete';
}

const mockQuests: Quest[] = [
  {
    id: '1',
    title: 'Evening Walk',
    description: 'Stretch those little paws! Take your furry friend for a 30-minute stroll.',
    reward: '+50 EXP',
    difficulty: 'Basic',
    status: 'active',
  },
  {
    id: '2',
    title: 'Pet Cafe Review',
    description: 'Share the love! Write a fun review of a pet-friendly café you visited.',
    reward: '+200 EXP',
    difficulty: 'Advanced',
    status: 'active',
  },
  {
    id: '3',
    title: 'Weekend Pet Meet',
    description: 'Sniff, wag, and mingle! Bring your pet to the weekend social event.',
    reward: '+350 EXP',
    difficulty: 'Advanced',
    status: 'active',
  },
  {
    id: '4',
    title: 'First Vet Visit',
    description: 'Take your pet for their first health checkup.',
    reward: '+100 EXP',
    difficulty: 'Basic',
    status: 'complete',
  },
];

interface QuestModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function QuestModal({ visible, onClose }: QuestModalProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'complete'>('active');

  const activeQuests = mockQuests.filter(quest => quest.status === 'active');
  const completeQuests = mockQuests.filter(quest => quest.status === 'complete');

  const getDifficultyColor = (difficulty: string) => {
    return difficulty === 'Basic' ? '#E3F2FD' : '#F3E5F5';
  };

  const getDifficultyTextColor = (difficulty: string) => {
    return difficulty === 'Basic' ? '#1976D2' : '#7B1FA2';
  };

  const renderQuestCard = (quest: Quest) => (
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
          <Text style={styles.rewardText}>{quest.reward}</Text>
          <IconSymbol name="pawprint.fill" size={16} color="#8D6E63" />
        </View>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Quest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              Active ({activeQuests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'complete' && styles.activeTab]}
            onPress={() => setActiveTab('complete')}
          >
            <Text style={[styles.tabText, activeTab === 'complete' && styles.activeTabText]}>
              Complete ({completeQuests.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.questList} showsVerticalScrollIndicator={false}>
          {activeTab === 'active' 
            ? activeQuests.map(renderQuestCard)
            : completeQuests.map(renderQuestCard)
          }
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
});
