import { router, Tabs, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import QuestModal from '@/components/quest-modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
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
          tabBarActiveTintColor: Colors.primary,
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
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="bag.fill" color={Colors.textInverse} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Map',
            tabBarIcon: ({ color }) => <IconSymbol size={32} name="map.fill" color={Colors.textInverse} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Quests',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="list.bullet" color={Colors.textInverse} />,
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
            color={pathname === '/(tabs)/marketplace' ? Colors.primary : Colors.textInverse}
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
            color={pathname === '/(tabs)/profile' ? Colors.primary : Colors.textInverse}
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
            <IconSymbol name="person.circle.fill" size={50} color={Colors.primary} />
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
    backgroundColor: Colors.primaryDark,
    height: 80,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    position: 'relative',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
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
    color: Colors.textInverse,
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    marginTop: Spacing.xs,
  },
  activeTabLabel: {
    color: Colors.primary,
  },
  centerButton: {
    position: 'absolute',
    left: '45%',
    bottom: 30,
    alignItems: 'center',
    zIndex: 10,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.background,
    ...Shadows.lg,
  },
  avatarLabel: {
    position: 'absolute',
    top: -15,
    left: '50%',
    marginLeft: -25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.md,
  },
  avatarLabelText: {
    color: Colors.textInverse,
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },
});
