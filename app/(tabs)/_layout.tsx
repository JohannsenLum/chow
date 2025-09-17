import { router, Tabs, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import QuestModal from '@/components/quest-modal';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [questModalVisible, setQuestModalVisible] = useState(false);

  const openQuestModal = () => {
    setQuestModalVisible(true);
  };

  const closeQuestModal = () => {
    setQuestModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            display: 'none', // Hide the default tab bar
          },
        }}>
        <Tabs.Screen
          name="marketplace"
          options={{
            title: 'Marketplace',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="bag.fill" color="#fff" />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Map',
            tabBarIcon: ({ color }) => <IconSymbol size={32} name="map.fill" color="#fff" />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Quests',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="list.bullet" color="#fff" />,
          }}
        />
      </Tabs>

      {/* Custom Tab Bar with 2 buttons + center icon */}
      <View style={styles.tabBar}>
        {/* Left Tab - Marketplace (40%) */}
        <TouchableOpacity
          style={[styles.tab, styles.leftTab, pathname === '/(tabs)/marketplace' && styles.activeTab]}
          onPress={() => router.push('/(tabs)/marketplace')}
        >
          <IconSymbol
            name="bag.fill"
            size={24}
            color={pathname === '/(tabs)/marketplace' ? '#4CAF50' : '#fff'}
          />
          <Text style={[styles.tabLabel, pathname === '/(tabs)/marketplace' && styles.activeTabLabel]}>
            Marketplace
          </Text>
        </TouchableOpacity>

        {/* Center Space (20%) - for the floating avatar */}
        <View style={styles.centerSpace} />

        {/* Right Tab - Quests (40%) */}
        <TouchableOpacity
          style={[styles.tab, styles.rightTab, pathname === '/(tabs)/profile' && styles.activeTab]}
          onPress={openQuestModal}
        >
          <IconSymbol
            name="list.bullet"
            size={24}
            color={pathname === '/(tabs)/profile' ? '#4CAF50' : '#fff'}
          />
          <Text style={[styles.tabLabel, pathname === '/(tabs)/profile' && styles.activeTabLabel]}>
            Quests
          </Text>
        </TouchableOpacity>

        {/* Center Avatar - Floating over the center space */}
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <View style={styles.avatarCircle}>
            <IconSymbol name="person.circle.fill" size={50} color="#4CAF50" />
          </View>
          <View style={styles.avatarLabel}>
            {/* <Text style={styles.avatarLabelText}>ROOKIE</Text> */}
          </View>
        </TouchableOpacity>
      </View>

      {/* Quest Modal */}
      <QuestModal visible={questModalVisible} onClose={closeQuestModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#2D5A5A',
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  leftTab: {
    flex: 0.4, // 40%

  },
  centerSpace: {
    flex: 0.5, // 20% - reserved space for the floating avatar

  },
  rightTab: {
    flex: 0.4, // 40%

  },
  activeTab: {
    // Add any active state styling if needed
  },
  tabLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#4CAF50',
  },
  centerButton: {
    position: 'absolute',
    left: '45%',
    //marginLeft: -10,
    bottom: 30,
    alignItems: 'center',
    zIndex: 10,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarLabel: {
    position: 'absolute',
    top: -15,
    left: '50%',
    marginLeft: -25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  avatarLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
