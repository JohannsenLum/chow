import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  exp_points: number;
  level: number;
}

export function CustomTabBar({ state, descriptors, navigation }: any) {
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

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Special handling for the middle button (profile)
        if (route.name === 'profile') {
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.middleTab}
            >
              <View style={styles.profileButton}>
                {profileLoading ? (
                  <ActivityIndicator size="small" color="#4CAF50" />
                ) : userProfile?.avatar_url ? (
                  <Image
                    source={{ uri: userProfile.avatar_url }}
                    style={styles.profileAvatar}
                    onError={(error) => console.log('Image load error:', error)}
                    onLoad={() => console.log('Image loaded successfully')}
                  />
                ) : (
                  <View style={styles.defaultAvatar}>
                    <Text style={styles.avatarEmoji}>🐕</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.middleTabLabel, isFocused && styles.middleTabLabelFocused]}>
                Profile
              </Text>
            </TouchableOpacity>
          );
        }

        // Regular tab buttons
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <IconSymbol
              name={options.tabBarIcon}
              size={24}
              color={isFocused ? '#4CAF50' : '#666'}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  middleTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tabLabelFocused: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  middleTabLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  middleTabLabelFocused: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});
