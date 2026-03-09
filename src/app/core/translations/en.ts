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
    allSpots: string;
    searchPlaceholder: string;
    noSearchResults: string;
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
  };
  card: {
    viewDetails: string;
    visibility: string;
    temp: string;
    waves: string;
    wind: string;
    addToFavorites: string;
    removeFromFavorites: string;
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
  };
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
    sortedByDistance: 'Sorted by distance from you',
    allSpots: 'All Spots',
    searchPlaceholder: 'Search spots…',
    noSearchResults: 'No spots match your search.',
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
  },
  card: {
    viewDetails: 'View Details',
    visibility: 'Visibility',
    temp: 'Temp',
    waves: 'Waves',
    wind: 'Wind',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
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
  } as Record<string, string | undefined>,
};
