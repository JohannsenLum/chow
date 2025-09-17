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
            <IconSymbol name="xmark" size={24} color="#000" />
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  questList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  questCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 4,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
