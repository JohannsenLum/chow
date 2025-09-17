import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface FullScreenPost {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    content: string;
    image: string;
    likes: number;
    comments: number;
    timestamp: string;
    isLiked: boolean;
}

const mockFullScreenPosts: FullScreenPost[] = [
    {
        id: '1',
        user: { name: 'Sarah & Luna', avatar: '🐕' },
        content: 'Just discovered this amazing dog park! Luna loves the agility course 🎾 #DogLife #Adventure',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
        likes: 124,
        comments: 28,
        timestamp: '2h ago',
        isLiked: false
    },
    {
        id: '2',
        user: { name: 'Mike & Whiskers', avatar: '🐱' },
        content: 'Found the perfect cat cafe downtown. Whiskers made so many friends! ☕ #CatCafe #Socializing',
        image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
        likes: 89,
        comments: 15,
        timestamp: '4h ago',
        isLiked: true
    },
    {
        id: '3',
        user: { name: 'Emma & Charlie', avatar: '🐕' },
        content: 'Charlie tried a new treat today and absolutely loved it! Highly recommend 🦴 #TreatTime #HappyDog',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
        likes: 156,
        comments: 42,
        timestamp: '6h ago',
        isLiked: false
    }
];

export default function SocialFeedScreen() {
    const [posts, setPosts] = useState(mockFullScreenPosts);
    const [activeTab, setActiveTab] = useState<'friends' | 'following' | 'public'>('friends');

    const handleLike = (postId: string) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        isLiked: !post.isLiked,
                        likes: post.isLiked ? post.likes - 1 : post.likes + 1
                    }
                    : post
            )
        );
    };

    const renderPost = ({ item }: { item: FullScreenPost }) => (
        <View style={styles.postContainer}>
            <Image source={{ uri: item.image }} style={styles.postImage} />

            {/* Overlay Content */}
            <View style={styles.overlay}>
                {/* Top Section */}
                <View style={styles.topSection}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <IconSymbol name="chevron.left" size={24} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.tabContainer}>
                        {(['friends', 'following', 'public'] as const).map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tab, activeTab === tab && styles.activeTab]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* User Info */}
                    <View style={styles.userSection}>
                        <View style={styles.userInfo}>
                            <Text style={styles.avatar}>{item.user.avatar}</Text>
                            <View style={styles.userDetails}>
                                <Text style={styles.userName}>{item.user.name}</Text>
                                <Text style={styles.timestamp}>{item.timestamp}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.followButton}>
                            <Text style={styles.followButtonText}>Follow</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <Text style={styles.postContent}>{item.content}</Text>

                    {/* Actions */}
                    <View style={styles.actionsContainer}>
                        <View style={styles.leftActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleLike(item.id)}
                            >
                                <IconSymbol
                                    name={item.isLiked ? "heart.fill" : "heart"}
                                    size={28}
                                    color={item.isLiked ? "#FF6B6B" : "#fff"}
                                />
                                <Text style={styles.actionText}>{item.likes}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton}>
                                <IconSymbol name="message" size={28} color="#fff" />
                                <Text style={styles.actionText}>{item.comments}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton}>
                                <IconSymbol name="square.and.arrow.up" size={28} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.saveButton}>
                            <IconSymbol name="bookmark" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={Dimensions.get('window').height}
                decelerationRate="fast"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    postContainer: {
        width,
        height: Dimensions.get('window').height,
        position: 'relative',
    },
    postImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
    },
    topSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        marginRight: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    activeTab: {
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    tabText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#333',
    },
    bottomSection: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        backgroundColor: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        fontSize: 32,
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    timestamp: {
        fontSize: 12,
        color: '#ccc',
        marginTop: 2,
    },
    followButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    followButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    postContent: {
        fontSize: 16,
        color: '#fff',
        lineHeight: 22,
        marginBottom: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        alignItems: 'center',
        marginRight: 25,
    },
    actionText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    saveButton: {
        padding: 8,
    },
}); 