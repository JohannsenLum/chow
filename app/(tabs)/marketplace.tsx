import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  SafeAreaView,
  TextInput 
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';

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
            <IconSymbol name="star.fill" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{vendor.rating}</Text>
          </View>
          <View style={styles.distanceContainer}>
            <IconSymbol name="location.fill" size={14} color="#666" />
            <Text style={styles.distanceText}>{vendor.distance}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.cartButton}>
        <IconSymbol name="cart.fill" size={20} color="#4CAF50" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCategorySection = (category: 'food' | 'services' | 'retail', title: string, icon: string) => {
    const vendors = mockVendors.filter(vendor => vendor.category === category);
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <IconSymbol name={icon} size={20} color="#fff" />
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
          <IconSymbol name="xmark" size={24} color="#000" />
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
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <View style={styles.categoriesHeader}>
          <IconSymbol name="square.grid.3x3" size={20} color="#fff" />
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
            <IconSymbol name="pawprint.fill" size={20} color={selectedCategory === 'food' ? '#fff' : '#4CAF50'} />
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
            <IconSymbol name="scissors" size={20} color={selectedCategory === 'services' ? '#fff' : '#4CAF50'} />
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  pawPointsContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pawPointsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  categoriesSection: {
    marginBottom: 20,
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoriesTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  categoryButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flex: 1,
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 8,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  vendorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  vendorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  vendorImageContainer: {
    alignItems: 'center',
    marginBottom: 8,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  vendorDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  cartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
});
