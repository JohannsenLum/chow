# 🐾 Chow App - Complete Wireframe & Implementation

## App Overview
Chow is a pet-focused social and discovery app with three main features:
1. **Pet Scanning** - Camera-based pet identification to get started
2. **Map Discovery** - Google Maps integration to find pet-friendly locations  
3. **Social Features** - Connect with other pet owners and share experiences

## �� Navigation Structure

### Root Stack Navigator
```
├── (tabs) - Main Tab Navigation
│   ├── marketplace - Pet products & services
│   ├── index - Google Maps discovery (main page)
│   └── profile - User profile & pet info
├── scan-pet - Modal for pet scanning
├── social-feed - Full-screen social feed (FYP style)
└── modal - Generic modal screen
```

### Bottom Tab Navigation (3 Tabs as requested)
- **Marketplace** (left) - Pet products and services
- **Map** (center) - Main Google Maps discovery page  
- **Profile** (right) - User profile and pet information

##  Screen Wireframes

### 1. Pet Scanning Screen (`/scan-pet`)
```
┌─────────────────────────────────────┐
│ [X]           Scan Your Pet         │
├─────────────────────────────────────┤
│                                     │
│        ┌─────────────────┐          │
│        │                 │          │
│        │   CAMERA VIEW   │          │
│        │                 │          │
│        │  ┌───┐     ┌───┐ │          │
│        │  │   │     │   │ │          │
│        │  └───┘     └───┘ │          │
│        │                 │          │
│        │  ┌───┐     ┌───┐ │          │
│        │  │   │     │   │ │          │
│        │  └───┘     └───┘ │          │
│        └─────────────────┘          │
│                                     │
│    Position your pet within frame   │
│         The journey starts here   │
│                                     │
├─────────────────────────────────────┤
│        [Skip & Add Manually]        │
└─────────────────────────────────────┘
```

### 2. Main Map Screen (`/(tabs)/index`)
```
┌─────────────────────────────────────┐
│ [🐕]        Chow        [📷]        │
├─────────────────────────────────────┤
│ [All] [Parks] [Vets] [Stores] [Cafes] │
├─────────────────────────────────────┤
│                                     │
│           GOOGLE MAPS               │
│                                     │
│    📍 Dog Park    🏥 Vet Clinic     │
│                                     │
│  🛍️ Pet Store    ☕ Pet Cafe        │
│                                     │
│           💇 Grooming               │
│                                     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Central Dog Park            [X] │ │
│ │ Large off-leash area with...    │ │
│ │ ⭐ 4.8 • park                   │ │
│ │ [📍 Directions] [📞] [💾]       │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ [🛍️ Marketplace] [️ Map] [ Profile] │
└─────────────────────────────────────┘
```

### 3. Social Feed Screen (`/social-feed`)
```
┌─────────────────────────────────────┐
│ [<] [Friends] [Following] [Public]  │
├─────────────────────────────────────┤
│                                     │
│                                     │
│         FULL SCREEN IMAGE           │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ 🐕 Sarah & Luna        [Follow]     │
│ 2h ago                              │
│                                     │
│ Just discovered this amazing dog    │
│ park! Luna loves the agility course │
│ 🎾 #DogLife #Adventure              │
│                                     │
│ [❤️ 124] [💬 28] [📤]        [💾]   │
└─────────────────────────────────────┘
```

### 4. Marketplace Screen (`/(tabs)/marketplace`)
```
┌─────────────────────────────────────┐
│ Pet Marketplace              []   │
├─────────────────────────────────────┤
│ 🔍 Search for pet products...       │
├─────────────────────────────────────┤
│ [All] [Food] [Toys] [Accessories]   │
├─────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐     │
│ │   Dog Food  │ │  Cat Toy    │     │
│ │   Image     │ │   Image     │     │
│ │             │ │             │     │
│ │ Premium...  │ │ Interactive │     │
│ │ PetCo       │ │ Whiskers&Co │     │
│ │ $29.99 ⭐4.8 │ │ $15.99 ⭐4.6 │     │
│ └─────────────┘ └─────────────┘     │
│ ┌─────────────┐ ┌─────────────┐     │
│ │  Pet Bed    │ │ Dog Walking │     │
│ │   Image     │ │   Service   │     │
│ │             │ │   Image     │     │
│ │ Cozy Pet... │ │ Happy Walks │     │
│ │ Comfort Pet │ │ Service     │     │
│ │ $45.00 ⭐4.9 │ │ $25.00 ⭐4.7 │     │
│ └─────────────┘ └─────────────┘     │
├─────────────────────────────────────┤
│ [🛍️ Marketplace] [️ Map] [ Profile] │
└─────────────────────────────────────┘
```

### 5. Profile Screen (`/(tabs)/profile`)
```
┌─────────────────────────────────────┐
│ [<]          Profile          [⚙️]  │
├─────────────────────────────────────┤
│              ┌─────┐                │
│              │   │ [📷]           │
│              └─────┘                │
│                                     │
│           Sarah & Luna              │
│    Dog mom  | Adventure seeker    │
│       Luna's personal photographer  │
│                                     │
│   127      1.2K      856           │
│  Posts   Followers Following       │
│                                     │
│  [Edit Profile]           [📤]      │
├─────────────────────────────────────┤
│ My Pet                              │
│ ┌─────────────────────────────────┐ │
│ │ [] Luna                       │ │
│ │      Golden Retriever • 3 years │ │
│ │      Loves: Fetch, Swimming...  │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│        [] []                    │
├─────────────────────────────────────┤
│ [📷] [📷] [📷]                      │
│ [📷] [📷] [📷]                      │
│ [📷] [📷] [📷]                      │
├
...

Let me reevaluate and take a different approach.

<think>The user is asking me to help implement the chow app and they're not seeing any changes to their folders. I've been creating files but they mentioned that files were deleted. Let me check what's actually in the project and create the files properly.

Looking at the conversation, I see that I've been trying to create files but they keep getting deleted. The user wants me to actually implement the app with the features they requested:

1. scan pet to get started
2. main page: Google maps to see the different places near you to go (in terms of pet stuff)
3. bottom nav should only have 3 items (marketplace, the middle button to see like followers, social)

Main interface:
- My avatar -> Posts made by friends throughout the day (newest to oldest), directly goes to full screen (FYP), friends/following/public at the top
- My Profile (top right) → Profile (same type of interface as friend's profile), with the avatar dressed up and the posts they made, settings
- Marketplace

I need to actually create the files instead of just showing code blocks. Let me create the files one by one and make sure they're actually saved to the filesystem.
</think>

I see the issue! Let me actually create the files in your project. I'll create each screen step by step to make sure they're properly saved. 