import { IconSymbol, SFSymbolName } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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
    distance: string;
    image: string;
    category: 'food' | 'services' | 'retail';
}

const mockVendors: Vendor[] = [
    {
        id: '1',
        name: 'Crunchy...',
        description: 'Customisable Food Products',
        rating: 5.0,
        distance: '1.8 km',
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200',
        category: 'food'
    },
    {
        id: '2',
        name: 'Kohepets',
        description: 'Pet store for food, treats and essentials',
        rating: 4.8,
        distance: '2.5 km',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200',
        category: 'food'
    },
    {
        id: '3',
        name: 'Pet\'s Gal...',
        description: 'Cat Grooming Specialist',
        rating: 4.9,
        distance: '750m',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200',
        category: 'services'
    },
    {
        id: '4',
        name: 'Wheeky...',
        description: 'Pet Groomer, 10+ years in business',
        rating: 4.9,
        distance: '2.5 km',
        image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=200',
        category: 'services'
    },
    {
        id: '5',
        name: 'PET TO DDHouse...',
        description: 'Pet supplies store',
        rating: 5.0,
        distance: '2.1km',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200',
        category: 'retail'
    },
    {
        id: '6',
        name: 'SG Pet...',
        description: 'Affordable selection of Pet Accessories, Food and Toys',
        rating: 4.9,
        distance: '7.8km',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200',
        category: 'retail'
    }
];

export default function MarketplaceScreen() {
    const [selectedCategory, setSelectedCategory] = useState<'food' | 'services' | 'retail'>('food');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVendors = mockVendors.filter(vendor =>
        vendor.category === selectedCategory &&
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderVendorCard = (vendor: Vendor) => (
        <TouchableOpacity key={vendor.id} style={styles.vendorCard}>
            <View style={styles.vendorImageContainer}>
                <Image source={{ uri: vendor.image }} style={styles.vendorImage} />
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
                        <Text style={styles.distanceText}>{vendor.distance}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.cartButton}>
                <IconSymbol name="cart.fill" size={20} color={Colors.primary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderCategorySection = (category: 'food' | 'services' | 'retail', title: string, icon: SFSymbolName) => {
        const vendors = mockVendors.filter(vendor => vendor.category === category);

        return (
            <View style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                    <IconSymbol name={icon} size={20} color={Colors.textInverse} />
                    <Text style={styles.categoryTitle}>{title}</Text>
                </View>
                <View style={styles.vendorGrid}>
                    {vendors.map(renderVendorCard)}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
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
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderCategorySection('food', 'Food & Treats', 'pawprint.fill')}
                {renderCategorySection('services', 'Services', 'scissors')}
                {renderCategorySection('retail', 'Retail', 'cart.fill')}
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
        gap: Spacing.md,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
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
        fontSize: Typography.sm,
        fontWeight: Typography.semibold,
        color: Colors.primary,
        marginLeft: Spacing.sm,
    },
    categoryButtonTextActive: {
        color: Colors.textInverse,
    },
    content: {
        flex: 1,
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
});
