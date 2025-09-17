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
    const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');

    const renderPost = ({ item }: { item: UserPost }) => (
        <TouchableOpacity style={styles.postItem}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <View style={styles.postOverlay}>
                <View style={styles.postStats}>
                    <View style={styles.statItem}>
                        <IconSymbol name="heart.fill" size={16} color="#fff" />
                        <Text style={styles.statText}>{item.likes}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <IconSymbol name="message.fill" size={16} color="#fff" />
                        <Text style={styles.statText}>{item.comments}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity>
                    <IconSymbol name="gearshape" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarEmoji}>🐕</Text>
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <IconSymbol name="camera.fill" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>Sarah & Luna</Text>
                    <Text style={styles.userBio}>Dog mom �� | Adventure seeker | Luna's personal photographer 📸</Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statColumn}>
                            <Text style={styles.statNumber}>127</Text>
                            <Text style={styles.statLabel}>Posts</Text>
                        </View>
                        <View style={styles.statColumn}>
                            <Text style={styles.statNumber}>1.2K</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>
                        <View style={styles.statColumn}>
                            <Text style={styles.statNumber}>856</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareButton}>
                            <IconSymbol name="square.and.arrow.up" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Pet Info */}
                <View style={styles.petSection}>
                    <Text style={styles.sectionTitle}>My Pet</Text>
                    <View style={styles.petCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100' }}
                            style={styles.petImage}
                        />
                        <View style={styles.petInfo}>
                            <Text style={styles.petName}>Luna</Text>
                            <Text style={styles.petDetails}>Golden Retriever • 3 years old</Text>
                            <Text style={styles.petDetails}>Loves: Fetch, Swimming, Treats</Text>
                        </View>
                    </View>
                </View>

                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
                        onPress={() => setActiveTab('posts')}
                    >
                        <IconSymbol
                            name="grid"
                            size={20}
                            color={activeTab === 'posts' ? '#4CAF50' : '#666'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
                        onPress={() => setActiveTab('saved')}
                    >
                        <IconSymbol
                            name="bookmark"
                            size={20}
                            color={activeTab === 'saved' ? '#4CAF50' : '#666'}
                        />
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
    profileSection: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#4CAF50',
    },
    avatarEmoji: {
        fontSize: 40,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    userBio: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 25,
    },
    statColumn: {
        alignItems: 'center',
        marginHorizontal: 25,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 15,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    shareButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    petSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    petCard: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    petInfo: {
        flex: 1,
    },
    petName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    petDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    tabContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
    },
    activeTab: {
        borderTopWidth: 2,
        borderTopColor: '#4CAF50',
    },
    postsGrid: {
        paddingTop: 1,
    },
    postItem: {
        flex: 1,
        aspectRatio: 1,
        margin: 0.5,
        position: 'relative',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    postOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
    },
    postStats: {
        flexDirection: 'row',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    statText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
}); 