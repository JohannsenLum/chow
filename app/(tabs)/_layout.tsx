import { router, Tabs, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import QuestModal from '@/components/quest-modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  exp_points: number;
  level: number;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [questModalVisible, setQuestModalVisible] = useState(false);
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      setProfileLoading(true);

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
          avatar_url,
          exp_points,
          level
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (userProfile) {
        console.log('Profile loaded in tab bar:', userProfile);
        setUserProfile(userProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const openQuestModal = () => {
    setQuestModalVisible(true);
  };

  const closeQuestModal = () => {
    setQuestModalVisible(false);
  };

  const getLevelName = (level: number) => {
    if (level <= 1) return 'ROOKIE';
    if (level <= 5) return 'EXPLORER';
    if (level <= 10) return 'ADVENTURER';
    if (level <= 20) return 'CHAMPION';
    return 'LEGEND';
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
            {profileLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : userProfile?.avatar_url ? (
              <Image
                source={{ uri: userProfile.avatar_url }}
                style={styles.avatarImage}
                onError={(error) => console.log('Image load error:', error)}
                onLoad={() => console.log('Image loaded successfully')}
              />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.avatarEmoji}></Text>
              </View>
            )}
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
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.background,
    ...Shadows.lg,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 40,
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
