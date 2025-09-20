import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

interface PetLocation {
  id: string;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  type: 'park' | 'vet' | 'store' | 'cafe' | 'grooming';
  rating: number;
}

const mockPetLocations: PetLocation[] = [
  {
    id: '1',
    title: 'Serangoon Central Dog Run',
    description: 'Large fenced dog run with agility equipment',
    coordinate: { latitude: 1.3502, longitude: 103.8729 },
    type: 'park',
    rating: 4.6
  },
  {
    id: '2',
    title: 'Pet Lovers Centre - Serangoon',
    description: 'Premium pet supplies and accessories',
    coordinate: { latitude: 1.3508, longitude: 103.8735 },
    type: 'store',
    rating: 4.4
  },
  {
    id: '3',
    title: 'Mount Pleasant Animal Hospital',
    description: '24/7 emergency veterinary care',
    coordinate: { latitude: 1.3515, longitude: 103.8742 },
    type: 'vet',
    rating: 4.8
  },
  {
    id: '4',
    title: 'Paws & Pans Cafe',
    description: 'Pet-friendly cafe with outdoor seating',
    coordinate: { latitude: 1.3498, longitude: 103.8721 },
    type: 'cafe',
    rating: 4.3
  },
  {
    id: '5',
    title: 'Furry Friends Grooming Studio',
    description: 'Professional pet grooming services',
    coordinate: { latitude: 1.3505, longitude: 103.8738 },
    type: 'grooming',
    rating: 4.7
  },
  {
    id: '6',
    title: 'Hougang Dog Park',
    description: 'Community dog park with separate areas for small and large dogs',
    coordinate: { latitude: 1.3521, longitude: 103.8755 },
    type: 'park',
    rating: 4.5
  },
  {
    id: '7',
    title: 'Pet Station - Nex Mall',
    description: 'Pet supplies and accessories in shopping mall',
    coordinate: { latitude: 1.3489, longitude: 103.8712 },
    type: 'store',
    rating: 4.2
  },
  {
    id: '8',
    title: 'Animal Clinic & Surgery',
    description: 'General veterinary services and consultations',
    coordinate: { latitude: 1.3518, longitude: 103.8748 },
    type: 'vet',
    rating: 4.6
  }
];

const getMarkerColor = (type: PetLocation['type']) => {
  switch (type) {
    case 'park': return '#4CAF50';
    case 'vet': return '#F44336';
    case 'store': return '#2196F3';
    case 'cafe': return '#FF9800';
    case 'grooming': return '#9C27B0';
    default: return '#4CAF50';
  }
};

const getMarkerIcon = (type: PetLocation['type']) => {
  switch (type) {
    case 'park': return 'leaf.fill';
    case 'vet': return 'cross.fill';
    case 'store': return 'bag.fill';
    case 'cafe': return 'cup.and.saucer.fill';
    case 'grooming': return 'scissors';
    default: return 'pawprint.fill';
  }
};

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<PetLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 1.3502, // Singapore Serangoon Central coordinates as fallback
    longitude: 103.8729,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationError(null);
      console.log('📍 Getting current location...');

      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        console.log('❌ Location permission denied');
        Alert.alert(
          'Location Permission Required',
          'Please enable location access to discover pet-friendly places near you.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        return;
      }

      // Get current position with high accuracy
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
      });

      console.log(' Current location:', locationResult.coords.latitude, locationResult.coords.longitude);
      setLocation(locationResult);

      // Update map region to user's location INSTANTLY
      const newRegion = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      // Set the region state
      setMapRegion(newRegion);

      // Animate to the new region instantly (no animation)
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 0); // 0ms = instant
      }

      console.log('️ Map region updated to user location');

    } catch (error) {
      console.error('❌ Error getting location:', error);
      setLocationError('Failed to get location');
      Alert.alert('Location Error', 'Unable to get your current location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleMarkerPress = (petLocation: PetLocation) => {
    setSelectedLocation(petLocation);
  };

  const handleGetDirections = () => {
    if (selectedLocation) {
      Alert.alert(
        'Directions',
        `Getting directions to ${selectedLocation.title}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleMyLocationPress = () => {
    if (location) {
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      // Update state
      setMapRegion(newRegion);

      // Animate instantly to user location
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 0); // 0ms = instant
      }

      console.log('📍 Centering map on user location');
    } else {
      getCurrentLocation();
    }
  };

  return (
    <View style={styles.container}>
      {/* Map - Full Screen */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        mapType="standard"
        followsUserLocation={false} // Disable auto-follow to prevent conflicts
        customMapStyle={[
          {
            featureType: "landscape",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#e8f5e8"
              }
            ]
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#87CEEB"
              }
            ]
          }
        ]}
      >
        {mockPetLocations.map((petLocation) => (
          <Marker
            key={petLocation.id}
            coordinate={petLocation.coordinate}
            onPress={() => handleMarkerPress(petLocation)}
          >
            <View style={[styles.markerContainer, { backgroundColor: getMarkerColor(petLocation.type) }]}>
              <IconSymbol
                name={getMarkerIcon(petLocation.type)}
                size={20}
                color="#fff"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Location Loading Indicator */}
      {locationLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4CAF50" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      )}

      {/* Location Error */}
      {locationError && (
        <View style={styles.errorContainer}>
          <IconSymbol name="location.slash" size={20} color="#F44336" />
          <Text style={styles.errorText}>{locationError}</Text>
          <TouchableOpacity onPress={getCurrentLocation} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Header with Profile and QR Code Buttons */}
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <IconSymbol name="pawprint.fill" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wireframeButton}
          onPress={() => router.push('/scan-pet')}
        >
          <IconSymbol name="square.grid.3x3" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* My Location Button */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={handleMyLocationPress}
      >
        <IconSymbol name="location.fill" size={24} color="#4CAF50" />
      </TouchableOpacity>

      <View style={styles.expContainer}>
        <Text style={styles.expLabel}>EXP</Text>
        <View style={styles.expValue}>
          <IconSymbol name="pawprint.fill" size={16} color="#4CAF50" />
          <Text style={styles.expText}>240</Text>
        </View>
      </View>

      {/* Location Details Card */}
      {selectedLocation && (
        <View style={styles.locationCard}>
          <View style={styles.cardHeader}>
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>{selectedLocation.title}</Text>
              <Text style={styles.locationDescription}>{selectedLocation.description}</Text>
              <View style={styles.ratingContainer}>
                <IconSymbol name="star.fill" size={16} color="#FFD700" />
                <Text style={styles.rating}>{selectedLocation.rating}</Text>
                <Text style={styles.ratingText}>• {selectedLocation.type}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedLocation(null)}
            >
              <IconSymbol name="xmark" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.directionsButton}
              onPress={handleGetDirections}
            >
              <IconSymbol name="location.fill" size={20} color="#fff" />
              <Text style={styles.directionsText}>Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.callButton}>
              <IconSymbol name="phone.fill" size={20} color="#4CAF50" />
              <Text style={styles.callText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton}>
              <IconSymbol name="bookmark" size={20} color="#666" />
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  errorContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  errorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#F44336',
  },
  retryButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 30, // Moved to bottom right
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerButtons: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wireframeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expContainer: {
    position: 'absolute',
    top: 110,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  expLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 2,
  },
  expValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  locationCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
  },
  directionsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
  },
  callText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  saveText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
