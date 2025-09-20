import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface UserPost {
    id: string;
    image: string;
    likes: number;
    comments: number;
}

const mockUserPosts: UserPost[] = [
    { id: '1', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300', likes: 24, comments: 8 },
    { id: '2', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300', likes: 18, comments: 5 },
    { id: '3', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300', likes: 31, comments: 12 },
    { id: '4', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300', likes: 22, comments: 7 },
    { id: '5', image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=300', likes: 15, comments: 3 },
    { id: '6', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300', likes: 28, comments: 9 },
];

export default function ProfileScreen() {
    const [activeTab, setActiveTab] = useState<'posts' | 'achievements'>('posts');

    const renderPost = ({ item }: { item: UserPost }) => (
        <TouchableOpacity style={styles.postItem}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="xmark" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity>
                        <IconSymbol name="gearshape" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.editCosmetics}>Edit Cosmetics</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarPlatform}>
                            <View style={styles.avatarPlatformTop} />
                            <View style={styles.avatarPlatformBottom} />
                        </View>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarEmoji}>🐕</Text>
                        </View>
                    </View>
                    
                    {/* ROOKIE Level Banner */}
                    <View style={styles.levelBanner}>
                        <Text style={styles.levelText}>ROOKIE</Text>
                        <Text style={styles.levelSubtext}>LEVEL 1</Text>
                    </View>
                </View>

                {/* User Info */}
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Luna</Text>
                    <Text style={styles.userBio}>Adventure-loving white golden retriever who loves exploring new parks and making friends!</Text>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>34</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                    <View style={styles.statItem}>
                        <IconSymbol name="pawprint.fill" size={16} color="#4CAF50" />
                        <Text style={styles.statNumber}>245</Text>
                        <Text style={styles.statLabel}>EXP</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>120</Text>
                        <Text style={styles.statLabel}>PawPoints</Text>
                    </View>
                </View>

                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
                        onPress={() => setActiveTab('posts')}
                    >
                        <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                            Posts (6)
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
                        onPress={() => setActiveTab('achievements')}
                    >
                        <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
                            Achievements (3)
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Posts Grid */}
                <FlatList
                    data={mockUserPosts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    scrollEnabled={false}
                    contentContainerStyle={styles.postsGrid}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    editCosmetics: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    avatarPlatform: {
        position: 'relative',
        width: 120,
        height: 40,
        marginBottom: 10,
    },
    avatarPlatformTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 20,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    avatarPlatformBottom: {
        position: 'absolute',
        bottom: 0,
        left: 10,
        right: 10,
        height: 20,
        backgroundColor: '#D0D0D0',
        borderRadius: 8,
    },
    avatar: {
        position: 'absolute',
        top: -30,
        left: 20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF8DC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFD700',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarEmoji: {
        fontSize: 50,
    },
    levelBanner: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    levelText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    levelSubtext: {
        fontSize: 12,
        color: '#fff',
        marginTop: 2,
    },
    userInfo: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    userBio: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    statItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    tabContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: 'transparent',
    },
    activeTab: {
        backgroundColor: '#E8F5E8',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    postsGrid: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    postItem: {
        flex: 1,
        aspectRatio: 1,
        margin: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    postImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
});
