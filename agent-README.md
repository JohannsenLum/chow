# 🐾 Chow - Pet Social Discovery App

## Overview
Chow is a comprehensive pet-focused social and discovery mobile application that combines location-based services, social networking, and marketplace functionality to create a complete ecosystem for pet owners. The app helps pet owners discover pet-friendly locations, connect with other pet owners, and access pet-related products and services.

## Development Team

### Senior Software Developer & Technical Lead
**Role**: Full-Stack Software Engineer with expertise in:
- **Frontend Development**: React Native, TypeScript, Expo, modern mobile UI/UX
- **Backend Development**: Supabase, PostgreSQL, API design, database architecture
- **Mobile Development**: Cross-platform iOS/Android applications
- **Database Design**: PostGIS spatial databases, RLS security, performance optimization
- **Real-time Systems**: Live data synchronization, WebSocket connections
- **DevOps**: CI/CD, deployment, monitoring, and infrastructure

**Responsibilities**:
- Architecture design and technical decision making
- Full-stack feature development from database to UI
- Code review and quality assurance
- Performance optimization and scalability planning
- Security implementation and best practices
- Team mentoring and technical leadership

## Core Features

### 1. Pet Scanning & Onboarding
- **Camera-based pet identification** using QR/barcode scanning
- **Manual pet addition** as fallback option
- **Pet profile creation** with breed, age, and preferences
- **Gamification elements** with EXP points and PawPoints system

### 2. Location Discovery (Main Feature)
- **Google Maps integration** for pet-friendly location discovery
- **Category-based filtering**: Parks, Vets, Stores, Cafes, Grooming
- **Real-time location services** with user permission handling
- **Interactive markers** with custom icons for different location types
- **Location details** with ratings, descriptions, and contact information
- **Directions integration** for navigation to selected locations

### 3. Social Features
- **Full-screen social feed** (TikTok/Instagram Stories style)
- **Three feed types**: Friends, Following, Public
- **Post interactions**: Like, Comment, Share, Save
- **User profiles** with pet information and post galleries
- **Follow/Unfollow functionality**
- **Achievement system** with level progression

### 4. Marketplace
- **Pet product discovery** with vendor listings
- **Category filtering**: Food & Treats, Services, Retail
- **Vendor profiles** with ratings and distance information
- **Search functionality** for products and services
- **PawPoints integration** for rewards system

## App Structure

### Navigation Architecture 
```
Root Stack Navigator
├── (tabs) - Main Tab Navigation
│   ├── marketplace - Pet products & services marketplace
│   ├── index - Google Maps discovery (main page)
│   └── profile - User profile & pet information
├── scan-pet - Modal for pet scanning/onboarding
├── social-feed - Full-screen social feed (FYP style)
└── modal - Generic modal screen
```

### Screen Breakdown

#### 1. **Scan Pet Screen** (`/scan-pet`)
- Camera view with QR/barcode scanning
- Pet identification and onboarding
- Manual pet addition option
- Welcome flow integration

#### 2. **Map Discovery Screen** (`/(tabs)/index`)
- Google Maps with custom styling
- Pet-friendly location markers
- Category filtering system
- Location detail cards
- User location tracking
- EXP points display

#### 3. **Social Feed Screen** (`/social-feed`)
- Full-screen vertical scrolling feed
- Tab navigation (Friends/Following/Public)
- Post interactions and engagement
- User profile integration

#### 4. **Marketplace Screen** (`/(tabs)/marketplace`)
- Vendor grid layout
- Category-based filtering
- Search functionality
- PawPoints integration
- Product/service discovery

#### 5. **Profile Screen** (`/(tabs)/profile`)
- Pet avatar with 3D platform design
- User stats and achievements
- Post gallery grid
- Level progression system
- Settings and customization

## Technology Stack

### Frontend Framework
- **React Native** (0.81.4) - Cross-platform mobile development
- **React** (19.1.0) - UI library with latest features
- **TypeScript** (5.9.2) - Type-safe development
- **Expo** (~54.0.7) - Development platform and tools

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database with PostGIS extension
- **Row Level Security (RLS)** - Data protection and access control
- **Real-time subscriptions** - Live updates for social features
- **Supabase Auth** - User authentication and management
- **Supabase Storage** - File storage for images and media

### Navigation & Routing
- **Expo Router** (~6.0.4) - File-based routing system
- **React Navigation** (v7) - Navigation library
- **React Navigation Bottom Tabs** (v7.4.0) - Tab navigation

### Maps & Location
- **React Native Maps** (1.20.1) - Google Maps integration
- **Expo Location** (~19.0.7) - Location services
- **Google Maps Provider** - Map rendering
- **PostGIS** - Spatial database queries for location search

### Camera & Media
- **Expo Camera** (~17.0.7) - Camera functionality
- **Expo Media Library** (~18.1.1) - Media access
- **Expo Image** (~3.0.8) - Optimized image handling
- **Supabase Storage** - Cloud storage for pet photos and posts

### UI & Styling
- **Expo Vector Icons** (^15.0.2) - Icon library
- **Expo Symbols** (~1.0.7) - SF Symbols integration
- **Custom Theme System** - Centralized styling
- **React Native Gesture Handler** (~2.28.0) - Touch gestures
- **React Native Reanimated** (~4.1.0) - Animations

### Development Tools
- **ESLint** (^9.25.0) - Code linting
- **Expo Lint** - Expo-specific linting rules
- **TypeScript** - Static type checking
- **Expo CLI** - Development and building
- **Supabase CLI** - Database management and migrations

### Platform Support
- **iOS** - Native iOS support with tablet compatibility
- **Android** - Native Android support with adaptive icons
- **Web** - Static web output for broader accessibility

## Database Schema

### Core Tables
- **users** - User profiles and authentication
- **pets** - Pet profiles and information
- **locations** - Pet-friendly locations with spatial data
- **posts** - Social media posts and content
- **vendors** - Marketplace vendors and merchants
- **products** - Pet products and services
- **achievements** - Gamification system

### Key Features
- **Spatial Indexing** - Fast location-based queries
- **Real-time Updates** - Live social feed updates
- **Row Level Security** - Secure data access
- **Full-text Search** - Product and location search
- **Image Storage** - Cloud storage for media files

## Key Design Patterns

### 1. **Component Architecture**
- Reusable UI components in `/components`
- Custom icon system with SF Symbols
- Themed components with consistent styling
- Custom hooks for color scheme management

### 2. **State Management**
- React hooks for local state
- Context-based theme management
- Supabase real-time subscriptions for live data
- Optimistic updates for better UX

### 3. **Styling System**
- Centralized theme configuration
- Consistent spacing and typography
- Platform-specific adaptations
- Dark/light mode support

### 4. **Navigation Patterns**
- File-based routing with Expo Router
- Modal presentations for scanning
- Tab-based main navigation
- Stack navigation for screen flows

### 5. **Data Management**
- Supabase client for API calls
- Real-time subscriptions for live updates
- Optimistic updates for immediate feedback
- Error handling and retry logic

## MVP Features Status

### ✅ Implemented
- Pet scanning with camera integration
- Google Maps discovery with markers
- Social feed with full-screen posts
- Marketplace with vendor listings
- User profiles with pet information
- Tab navigation system
- Theme system and styling
- Location permissions handling
- **Supabase database schema** - Complete database structure
- **User authentication** - Supabase Auth integration
- **Real-time data** - Live updates for social features

### 🚧 In Development
- **Supabase client integration** - Connecting app to database
- **User authentication flow** - Login/signup implementation
- **Real-time subscriptions** - Live social feed updates
- **Image upload system** - Pet photos and post images
- **Location data sync** - Real location data integration
- Push notifications
- Advanced filtering options

###  Planned
- Pet health tracking
- Social features enhancement
- Payment integration
- Advanced gamification
- Community features
- **Offline support** - Local data caching
- **Advanced search** - Full-text search implementation

## Development Guidelines

### Code Organization
- Feature-based file structure
- Shared components in `/components`
- Constants and themes centralized
- Type definitions for all interfaces
- **Database types** - Generated from Supabase schema

### Styling Standards
- Use theme constants for consistency
- Platform-specific adaptations
- Responsive design principles
- Accessibility considerations

### Performance Considerations
- Image optimization with Expo Image
- Lazy loading for large lists
- Memory management for camera
- Efficient re-renders with React optimization
- **Database query optimization** - Efficient Supabase queries
- **Real-time subscription management** - Proper cleanup and memory management

### Data Management
- **Use Supabase client** for all API calls
- **Implement error handling** for network requests
- **Optimistic updates** for better user experience
- **Real-time subscriptions** for live data updates

## Environment Setup

### Required Environment Variables
```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting Started

1. **Install dependencies**: `npm install`
2. **Set up environment variables**: Create `.env` file with Supabase credentials
3. **Start development server**: `npm start`
4. **Run on device**: `npm run ios` or `npm run android`
5. **Web development**: `npm run web`

## Project Structure
```
chow/
├── app/                    # Screen components (Expo Router)
├── components/            # Reusable UI components
├── constants/             # Theme and configuration
├── hooks/                 # Custom React hooks
├── lib/                   # Supabase client and utilities
├── types/                 # TypeScript type definitions
├── assets/               # Images and static assets
├── scripts/              # Build and utility scripts
└── supabase/             # Database migrations and functions
``` 