import { IconSymbol, SFSymbolName } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Vendor {
    id: string;
    name: string;
    description: string;
    rating: number;
    distance_km: number;
    image_url: string;
    category: 'food' | 'services' | 'retail';
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    latitude?: number;
    longitude?: number;
}

export default function MarketplaceScreen() {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'services' | 'retail'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('vendors')
                .select('*')
                .eq('is_active', true)
                .order('rating', { ascending: false });

            if (error) {
                console.error('Error loading vendors:', error);
                setError('Failed to load vendors');
                return;
            }

            setVendors(data || []);
        } catch (err) {
            console.error('Error loading vendors:', err);
            setError('Failed to load vendors');
        } finally {
            setLoading(false);
        }
    };

    // Filter vendors based on selected category and search query
    const filteredVendors = vendors.filter(vendor => {
        const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
        const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleBackPress = () => {
        router.push('/');
    };

    const formatDistance = (distanceKm: number) => {
        if (distanceKm < 1) {
            return `${Math.round(distanceKm * 1000)}m`;
        }
        return `${distanceKm}km`;
    };

    const renderVendorCard = (vendor: Vendor) => (
        <TouchableOpacity key={vendor.id} style={styles.vendorCard}>
            <View style={styles.vendorImageContainer}>
                <Image
                    source={{ uri: vendor.image_url }}
                    style={styles.vendorImage}
                    onError={() => console.log('Image load error for vendor:', vendor.name)}
                />
            </View>
            <View style={styles.vendorInfo}>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <Text style={styles.vendorDescription}>{vendor.description}</Text>
                <View style={styles.vendorDetails}>
                    <View style={styles.ratingContainer}>
                        <IconSymbol name="star.fill" size={14} color={Colors.accent} />
                        <Text style={styles.ratingText}>{vendor.rating}</Text>
                    </View>
                    <View style={styles.distanceContainer}>
                        <IconSymbol name="location.fill" size={14} color={Colors.textSecondary} />
                        <Text style={styles.distanceText}>{formatDistance(vendor.distance_km)}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.cartButton}>
                <IconSymbol name="cart.fill" size={20} color={Colors.primary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderCategorySection = (category: 'food' | 'services' | 'retail', title: string, icon: SFSymbolName) => {
        const categoryVendors = vendors.filter(vendor => vendor.category === category);

        return (
            <View style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                    <IconSymbol name={icon} size={20} color={Colors.textInverse} />
                    <Text style={styles.categoryTitle}>{title}</Text>
                </View>
                <View style={styles.vendorGrid}>
                    {categoryVendors.map(renderVendorCard)}
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <IconSymbol name="xmark" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Pet Marketplace</Text>
                    <View style={styles.pawPointsContainer}>
                        <Text style={styles.pawPointsText}>120 PawPoints</Text>
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading vendors...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <IconSymbol name="xmark" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Pet Marketplace</Text>
                    <View style={styles.pawPointsContainer}>
                        <Text style={styles.pawPointsText}>120 PawPoints</Text>
                    </View>
                </View>
                <View style={styles.errorContainer}>
                    <IconSymbol name="exclamationmark.triangle" size={40} color={Colors.textSecondary} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadVendors}>
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
                <TouchableOpacity onPress={handleBackPress}>
                    <IconSymbol name="xmark" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pet Marketplace</Text>
                <View style={styles.pawPointsContainer}>
                    <Text style={styles.pawPointsText}>120 PawPoints</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Find treats for your furry friend...."
                    placeholderTextColor={Colors.textTertiary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Categories */}
            <View style={styles.categoriesSection}>
                <View style={styles.categoriesHeader}>
                    <IconSymbol name="square.grid.3x3" size={20} color={Colors.textInverse} />
                    <Text style={styles.categoriesTitle}>Categories</Text>
                </View>
                <View style={styles.categoryButtons}>
                    <TouchableOpacity
                        style={[
                            styles.categoryButton,
                            selectedCategory === 'all' && styles.categoryButtonActive
                        ]}
                        onPress={() => setSelectedCategory('all')}
                    >
                        <IconSymbol name="grid" size={20} color={selectedCategory === 'all' ? Colors.textInverse : Colors.primary} />
                        <Text style={[
                            styles.categoryButtonText,
                            selectedCategory === 'all' && styles.categoryButtonTextActive
                        ]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.categoryButton,
                            selectedCategory === 'food' && styles.categoryButtonActive
                        ]}
                        onPress={() => setSelectedCategory('food')}
                    >
                        <IconSymbol name="pawprint.fill" size={20} color={selectedCategory === 'food' ? Colors.textInverse : Colors.primary} />
                        <Text style={[
                            styles.categoryButtonText,
                            selectedCategory === 'food' && styles.categoryButtonTextActive
                        ]}>
                            Food & Treats
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.categoryButton,
                            selectedCategory === 'services' && styles.categoryButtonActive
                        ]}
                        onPress={() => setSelectedCategory('services')}
                    >
                        <IconSymbol name="scissors" size={20} color={selectedCategory === 'services' ? Colors.textInverse : Colors.primary} />
                        <Text style={[
                            styles.categoryButtonText,
                            selectedCategory === 'services' && styles.categoryButtonTextActive
                        ]}>
                            Services
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.categoryButton,
                            selectedCategory === 'retail' && styles.categoryButtonActive
                        ]}
                        onPress={() => setSelectedCategory('retail')}
                    >
                        <IconSymbol name="cart.fill" size={20} color={selectedCategory === 'retail' ? Colors.textInverse : Colors.primary} />
                        <Text style={[
                            styles.categoryButtonText,
                            selectedCategory === 'retail' && styles.categoryButtonTextActive
                        ]}>
                            Retail
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content - Show filtered results */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {searchQuery ? (
                    // Show search results
                    <View style={styles.searchResultsSection}>
                        <View style={styles.searchResultsHeader}>
                            <IconSymbol name="magnifyingglass" size={20} color={Colors.textInverse} />
                            <Text style={styles.searchResultsTitle}>
                                Search Results ({filteredVendors.length})
                            </Text>
                        </View>
                        <View style={styles.vendorGrid}>
                            {filteredVendors.map(renderVendorCard)}
                        </View>
                        {filteredVendors.length === 0 && (
                            <View style={styles.noResultsContainer}>
                                <IconSymbol name="magnifyingglass" size={40} color={Colors.textSecondary} />
                                <Text style={styles.noResultsText}>No results found</Text>
                                <Text style={styles.noResultsSubtext}>Try a different search term</Text>
                            </View>
                        )}
                    </View>
                ) : selectedCategory === 'all' ? (
                    // Show all vendors when "All" is selected
                    <View style={styles.allVendorsSection}>
                        <View style={styles.allVendorsHeader}>
                            <IconSymbol name="grid" size={20} color={Colors.textInverse} />
                            <Text style={styles.allVendorsTitle}>
                                All Vendors ({vendors.length})
                            </Text>
                        </View>
                        <View style={styles.vendorGrid}>
                            {vendors.map(renderVendorCard)}
                        </View>
                    </View>
                ) : (
                    // Show specific category
                    renderCategorySection(selectedCategory,
                        selectedCategory === 'food' ? 'Food & Treats' :
                            selectedCategory === 'services' ? 'Services' : 'Retail',
                        selectedCategory === 'food' ? 'pawprint.fill' :
                            selectedCategory === 'services' ? 'scissors' : 'cart.fill'
                    )
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    headerTitle: {
        fontSize: Typography.xl,
        fontWeight: Typography.bold,
        color: Colors.text,
    },
    pawPointsContainer: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.round,
    },
    pawPointsText: {
        color: Colors.textInverse,
        fontSize: Typography.sm,
        fontWeight: Typography.semibold,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: Spacing.md,
        fontSize: Typography.md,
        color: Colors.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    errorText: {
        fontSize: Typography.md,
        color: Colors.textSecondary,
        marginTop: Spacing.md,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginTop: Spacing.md,
    },
    retryButtonText: {
        color: Colors.textInverse,
        fontSize: Typography.md,
        fontWeight: Typography.semibold,
    },
    searchContainer: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
    },
    searchInput: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        fontSize: Typography.md,
        color: Colors.text,
    },
    categoriesSection: {
        marginBottom: Spacing.xl,
    },
    categoriesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        marginHorizontal: Spacing.xl,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
    },
    categoriesTitle: {
        color: Colors.textInverse,
        fontSize: Typography.md,
        fontWeight: Typography.semibold,
        marginLeft: Spacing.sm,
    },
    categoryButtons: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.xl,
        gap: Spacing.sm,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.round,
        borderWidth: 1,
        borderColor: Colors.border,
        flex: 1,
    },
    categoryButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryButtonText: {
        fontSize: Typography.xs,
        fontWeight: Typography.semibold,
        color: Colors.primary,
        marginLeft: Spacing.xs,
    },
    categoryButtonTextActive: {
        color: Colors.textInverse,
    },
    content: {
        flex: 1,
    },
    searchResultsSection: {
        marginBottom: Spacing.xxl,
    },
    searchResultsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        marginHorizontal: Spacing.xl,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
    },
    searchResultsTitle: {
        color: Colors.textInverse,
        fontSize: Typography.md,
        fontWeight: Typography.semibold,
        marginLeft: Spacing.sm,
    },
    noResultsContainer: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl,
        paddingHorizontal: Spacing.xl,
    },
    noResultsText: {
        fontSize: Typography.lg,
        fontWeight: Typography.semibold,
        color: Colors.text,
        marginTop: Spacing.md,
    },
    noResultsSubtext: {
        fontSize: Typography.sm,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    categorySection: {
        marginBottom: Spacing.xxl,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        marginHorizontal: Spacing.xl,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
    },
    categoryTitle: {
        color: Colors.textInverse,
        fontSize: Typography.md,
        fontWeight: Typography.semibold,
        marginLeft: Spacing.sm,
    },
    vendorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Spacing.xl,
        gap: Spacing.md,
    },
    vendorCard: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        width: '48%',
        ...Shadows.sm,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    vendorImageContainer: {
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    vendorImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    vendorInfo: {
        flex: 1,
    },
    vendorName: {
        fontSize: Typography.sm,
        fontWeight: Typography.bold,
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    vendorDescription: {
        fontSize: Typography.xs,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
        lineHeight: 16,
    },
    vendorDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: Typography.xs,
        fontWeight: Typography.semibold,
        color: Colors.text,
        marginLeft: Spacing.xs,
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    distanceText: {
        fontSize: Typography.xs,
        color: Colors.textSecondary,
        marginLeft: Spacing.xs,
    },
    cartButton: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        padding: Spacing.xs,
    },
    allVendorsSection: {
        marginBottom: Spacing.xxl,
    },
    allVendorsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        marginHorizontal: Spacing.xl,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
    },
    allVendorsTitle: {
        color: Colors.textInverse,
        fontSize: Typography.md,
        fontWeight: Typography.semibold,
        marginLeft: Spacing.sm,
    },
});
