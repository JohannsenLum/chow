import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface UserPost {
    id: string;
    image: string;
    likes: number;
    comments: number;
}

interface UserProfile {
    id: string;
    display_name: string;
    bio: string;
    avatar_url: string | null;
    exp_points: number;
    paw_points: number;
    level: number;
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
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'posts' | 'achievements'>('posts');
    const [isEditing, setIsEditing] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [userName, setUserName] = useState('');
    const [userBio, setUserBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Load user profile from database
    useEffect(() => {
        if (user) {
            loadUserProfile();
        }
    }, [user]);

    const loadUserProfile = async () => {
        try {
            setLoading(true);

            if (!user) {
                console.error('No authenticated user found');
                return;
            }

            // Fetch user profile from database - only select existing columns
            const { data: userProfile, error } = await supabase
                .from('users')
                .select(`
                    id,
                    display_name,
                    bio,
                    avatar_url,
                    exp_points,
                    paw_points,
                    level
                `)
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                Alert.alert('Error', 'Failed to load profile. Please try again.');
                return;
            }

            if (userProfile) {
                setProfile(userProfile);
                setUserName(userProfile.display_name || '');
                setUserBio(userProfile.bio || '');
                setAvatarUrl(userProfile.avatar_url);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToIndex = () => {
        router.push('/');
    };

    const handleEditProfile = () => {
        setEditModalVisible(true);
    };

    const handleImagePicker = async () => {
        try {
            // Request permission
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('Permission Required', 'Please allow access to your photo library to upload an avatar.');
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                await uploadProfilePicture(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const uploadProfilePicture = async (imageAsset: any) => {
        setUploading(true);
        try {
            if (!user) {
                Alert.alert('Error', 'You must be logged in to upload an avatar.');
                return;
            }

            // Simple approach: just use the image URI directly
            const imageUrl = await uploadProfilePictureToSupabase(imageAsset.uri);

            if (imageUrl) {
                setAvatarUrl(imageUrl);
                // Update profile state
                if (profile) {
                    setProfile({ ...profile, avatar_url: imageUrl });
                }
                Alert.alert('Success', 'Profile picture updated!');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const uploadProfilePictureToSupabase = async (imageUri: string): Promise<string | null> => {
        try {
            if (!user) {
                throw new Error('No authenticated user found');
            }

            // Get file extension from URI
            const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `profile-pictures/${fileName}`;

            // Use FormData for React Native
            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                type: `image/${fileExt}`,
                name: fileName,
            } as any);

            // Get session for authentication
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('No authenticated session found');
            }

            // Upload using fetch with proper headers
            const uploadResponse = await fetch(
                `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/avatars/${filePath}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                }
            );

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('Upload error:', errorText);
                throw new Error(`Upload failed: ${errorText}`);
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            console.log('Upload successful, public URL:', publicUrl);

            // Update user profile in database
            const { error: updateError } = await supabase
                .from('users')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) {
                console.error('Database update error:', updateError);
                Alert.alert('Error', 'Failed to update profile. Please try again.');
                return null;
            }

            return publicUrl;
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            return null;
        }
    };

    const handleSaveProfile = async () => {
        try {
            if (!user) {
                Alert.alert('Error', 'You must be logged in to update your profile.');
                return;
            }

            // Update user profile in database
            const { error } = await supabase
                .from('users')
                .update({
                    display_name: userName,
                    bio: userBio
                })
                .eq('id', user.id);

            if (error) {
                console.error('Database update error:', error);
                Alert.alert('Error', 'Failed to update profile. Please try again.');
                return;
            }

            // Update local profile state
            if (profile) {
                setProfile({ ...profile, display_name: userName, bio: userBio });
            }

            setEditModalVisible(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'Failed to save profile. Please try again.');
        }
    };

    const handleCancelEdit = () => {
        setEditModalVisible(false);
    };

    const getLevelName = (level: number) => {
        if (level <= 1) return 'ROOKIE';
        if (level <= 5) return 'EXPLORER';
        if (level <= 10) return 'ADVENTURER';
        if (level <= 20) return 'CHAMPION';
        return 'LEGEND';
    };

    const renderPost = ({ item }: { item: UserPost }) => (
        <TouchableOpacity style={styles.postItem}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!profile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Failed to load profile</Text>
                    <TouchableOpacity onPress={loadUserProfile} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackToIndex}>
                    <IconSymbol name="xmark" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={handleEditProfile}>
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
                            {avatarUrl ? (
                                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                            ) : (
                                <Text style={styles.avatarEmoji}>🐕</Text>
                            )}
                        </View>
                    </View>

                    {/* Level Banner */}
                    <View style={styles.levelBanner}>
                        <Text style={styles.levelText}>{getLevelName(profile.level)}</Text>
                        <Text style={styles.levelSubtext}>LEVEL {profile.level}</Text>
                    </View>
                </View>

                {/* User Info */}
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{profile.display_name || 'Pet Owner'}</Text>
                    <Text style={styles.userBio}>{profile.bio || 'No bio yet'}</Text>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                    <View style={styles.statItem}>
                        <IconSymbol name="pawprint.fill" size={16} color="#4CAF50" />
                        <Text style={styles.statNumber}>{profile.exp_points || 0}</Text>
                        <Text style={styles.statLabel}>EXP</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{profile.paw_points || 0}</Text>
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

            {/* Edit Profile Modal */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={handleCancelEdit}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={handleCancelEdit}>
                            <Text style={styles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        <TouchableOpacity onPress={handleSaveProfile}>
                            <Text style={styles.saveButton}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <View style={styles.editSection}>
                            <Text style={styles.editLabel}>Pet Name</Text>
                            <TextInput
                                style={styles.editInput}
                                value={userName}
                                onChangeText={setUserName}
                                placeholder="Enter pet name"
                                maxLength={20}
                            />
                        </View>

                        <View style={styles.editSection}>
                            <Text style={styles.editLabel}>Bio</Text>
                            <TextInput
                                style={[styles.editInput, styles.bioInput]}
                                value={userBio}
                                onChangeText={setUserBio}
                                placeholder="Tell us about your pet..."
                                multiline
                                numberOfLines={4}
                                maxLength={150}
                            />
                            <Text style={styles.characterCount}>{userBio.length}/150</Text>
                        </View>

                        <View style={styles.editSection}>
                            <Text style={styles.editLabel}>Pet Avatar</Text>
                            <TouchableOpacity
                                style={styles.avatarEditButton}
                                onPress={handleImagePicker}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color="#4CAF50" />
                                ) : (
                                    <IconSymbol name="camera.fill" size={24} color="#4CAF50" />
                                )}
                                <Text style={styles.avatarEditText}>
                                    {uploading ? 'Uploading...' : 'Change Avatar'}
                                </Text>
                            </TouchableOpacity>

                            {avatarUrl && (
                                <View style={styles.currentAvatarContainer}>
                                    <Text style={styles.currentAvatarLabel}>Current Avatar:</Text>
                                    <Image source={{ uri: avatarUrl }} style={styles.currentAvatarImage} />
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
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
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    cancelButton: {
        fontSize: 16,
        color: '#666',
    },
    saveButton: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    editSection: {
        marginVertical: 20,
    },
    editLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    editInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    characterCount: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
        marginTop: 5,
    },
    avatarEditButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderRadius: 8,
        paddingVertical: 15,
        backgroundColor: '#f0f8f0',
    },
    avatarEditText: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
        marginLeft: 8,
    },
    currentAvatarContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    currentAvatarLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    currentAvatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
});
