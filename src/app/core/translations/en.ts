export interface Translations {
  welcome: {
    tagline: string;
    cta: string;
  };
  discover: {
    title: string;
    subtitle: string;
    featuredSection: string;
    nearYou: string;
    noSpots: string;
    noNearby: string;
    locating: string;
    locationDenied: string;
    sortedByDistance: string;
    sortedByScore: string;
    allSpots: string;
    searchPlaceholder: string;
    noSearchResults: string;
    offlineMode: string;
    cachedData: string;
  };
  filters: {
    all: string;
    north: string;
    south: string;
    nearMe: string;
  };
  nav: {
    map: string;
    list: string;
    favorites: string;
    favoritesOnly: string;
    switchToMap: string;
    switchToList: string;
  };
  card: {
    viewDetails: string;
    visibility: string;
    temp: string;
    waves: string;
    wind: string;
    addToFavorites: string;
    removeFromFavorites: string;
    distance: string;
  };
  detail: {
    about: string;
    conditions: string;
    location: string;
    getDirections: string;
    wind: string;
    waves: string;
    waterTemp: string;
    visibility: string;
    weather: string;
    bestTime: string;
    goBack: string;
    score: string;
    facilities: string;
    accessibility: string;
  };
  suitability: Record<string, string | undefined>;
  waveLevel: Record<string, string | undefined>;
  facilityType: Record<string, string | undefined>;
  difficulty: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  badges: Record<string, string | undefined>;
}

export const EN: Translations = {
  welcome: {
    tagline: 'Discover the best snorkeling spots in Gran Canaria',
    cta: 'Explore Now',
  },
  discover: {
    title: 'Discover Spots',
    subtitle: 'Gran Canaria · Live Conditions',
    featuredSection: 'All Spots',
    nearYou: 'Near You',
    noSpots: 'No spots found',
    noNearby: 'No spots found nearby. Try expanding your range.',
    locating: 'Finding your location…',
    locationDenied: 'Location access denied. Please enable it in your browser settings.',
    sortedByDistance: 'Sorted by score & distance from you',
    sortedByScore: 'Sorted by conditions score',
    allSpots: 'All Spots',
    searchPlaceholder: 'Search spots…',
    noSearchResults: 'No spots match your search.',
    offlineMode: 'You\'re offline — showing cached data',
    cachedData: 'Data from {hours}h ago',
  },
  filters: {
    all: 'All',
    north: 'North',
    south: 'South',
    nearMe: 'Near Me',
  },
  nav: {
    map: 'Map',
    list: 'List',
    favorites: 'Favorites',
    favoritesOnly: 'My Favorites',
    switchToMap: 'Switch to map view',
    switchToList: 'Switch to list view',
  },
  card: {
    viewDetails: 'View Details',
    visibility: 'Visibility',
    temp: 'Temp',
    waves: 'Waves',
    wind: 'Wind',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    distance: 'km away',
  },
  detail: {
    about: 'About this spot',
    conditions: 'Current Conditions',
    location: 'Location',
    getDirections: 'Get Directions',
    wind: 'Wind',
    waves: 'Waves',
    waterTemp: 'Water Temp',
    visibility: 'Visibility',
    weather: 'Weather',
    bestTime: 'Best time to visit',
    goBack: 'Go back',
    score: 'Conditions Score',
    facilities: 'Facilities',
    accessibility: 'Accessibility',
  },
  suitability: {
    Excellent: 'Excellent',
    Good: 'Good',
    Fair: 'Fair',
    Poor: 'Poor',
  },
  waveLevel: {
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
    Calm: 'Calm',
    Moderate: 'Moderate',
  },
  facilityType: {
    parking: 'Parking',
    showers: 'Showers',
    'equipment-rental': 'Equipment rental',
    restaurant: 'Restaurant',
    restrooms: 'Restrooms',
    lifeguard: 'Lifeguard',
  },
  difficulty: {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  },
  badges: {
    'MOST POPULAR': 'Most Popular',
    'BEST VISIBILITY': 'Best Visibility',
    'CALM WATERS': 'Calm Waters',
    RECOMMENDED: 'Recommended',
  },
};
