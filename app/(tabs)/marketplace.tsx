import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  SafeAreaView,
  FlatList,
  TextInput 
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  seller: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Dog Food',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200',
    category: 'Food & Treats',
    rating: 4.8,
    seller: 'PetCo'
  },
  {
    id: '2',
    name: 'Interactive Cat Toy',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=200',
    category: 'Toys',
    rating: 4.6,
    seller: 'Whiskers & Co'
  },
  {
    id: '3',
    name: 'Cozy Pet Bed',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200',
    category: 'Accessories',
    rating: 4.9,
    seller: 'Comfort Pets'
  },
  {
    id: '4',
    name: 'Dog Walking Service',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200',
    category: 'Services',
    rating: 4.7,
    seller: 'Happy Walks'
  }
];

const categories = ['All', 'Food & Treats', 'Toys', 'Accessories', 'Services'];

export default function MarketplaceScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productSeller}>{item.seller}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>${item.price}</Text>
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={12} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.categoryChip, selectedCategory === item && styles.selectedCategory]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[styles.categoryText, selectedCategory === item && styles.selectedCategoryText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pet Marketplace</Text>
        <TouchableOpacity>
          <IconSymbol name="cart" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for pet products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
        columnWrapperStyle={styles.productRow}
      />
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  categoryChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  productsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '48%',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productSeller: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});
