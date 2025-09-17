import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

interface TabItem {
  name: string;
  title: string;
  icon: string;
  route: string;
}

const tabs: TabItem[] = [
  {
    name: 'marketplace',
    title: 'Marketplace',
    icon: 'bag.fill',
    route: '/(tabs)/marketplace',
  },
  {
    name: 'profile',
    title: 'Quests',
    icon: 'list.bullet',
    route: '/(tabs)/profile',
  },
];

export default function CustomTabBar() {
  const pathname = usePathname();

  const handleTabPress = (route: string) => {
    router.push(route);
  };

  const handleCenterPress = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <View style={styles.container}>
      {/* Left Tab */}
      <TouchableOpacity
        style={[styles.tab, pathname === '/(tabs)/marketplace' && styles.activeTab]}
        onPress={() => handleTabPress('/(tabs)/marketplace')}
      >
        <IconSymbol 
          name={tabs[0].icon} 
          size={24} 
          color={pathname === '/(tabs)/marketplace' ? '#4CAF50' : '#fff'} 
        />
        <IconSymbol 
          name="textformat" 
          size={12} 
          color={pathname === '/(tabs)/marketplace' ? '#4CAF50' : '#fff'} 
          style={styles.tabLabel}
        />
      </TouchableOpacity>

      {/* Center Avatar */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={handleCenterPress}
        activeOpacity={0.8}
      >
        <View style={styles.avatarCircle}>
          <IconSymbol name="person.circle.fill" size={50} color="#4CAF50" />
        </View>
        <View style={styles.avatarLabel}>
          <IconSymbol name="textformat" size={16} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Right Tab */}
      <TouchableOpacity
        style={[styles.tab, pathname === '/(tabs)/profile' && styles.activeTab]}
        onPress={() => handleTabPress('/(tabs)/profile')}
      >
        <IconSymbol 
          name={tabs[1].icon} 
          size={24} 
          color={pathname === '/(tabs)/profile' ? '#4CAF50' : '#fff'} 
        />
        <IconSymbol 
          name="textformat" 
          size={12} 
          color={pathname === '/(tabs)/profile' ? '#4CAF50' : '#fff'} 
          style={styles.tabLabel}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2D5A5A',
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    // Add any active state styling if needed
  },
  centerButton: {
    position: 'absolute',
    left: '50%',
    marginLeft: -40,
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
    marginLeft: -20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tabLabel: {
    marginTop: 4,
  },
});
