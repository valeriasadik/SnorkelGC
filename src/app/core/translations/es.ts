import type { Translations } from './en';

export const ES: Translations = {
  welcome: {
    tagline: 'Descubre los mejores spots de snorkel en Gran Canaria',
    cta: 'Explorar',
  },
  discover: {
    title: 'Descubrir Spots',
    subtitle: 'Gran Canaria · Condiciones en Vivo',
    featuredSection: 'Spots Destacados',
    noSpots: 'No se encontraron spots',
  },
  filters: {
    all: 'Todo',
    north: 'Norte',
    south: 'Sur',
  },
  nav: {
    map: 'Mapa',
    list: 'Listado',
    favorites: 'Favoritos',
    favoritesOnly: 'Mis Favoritos',
  },
  card: {
    viewDetails: 'Ver Detalles',
    visibility: 'Visibilidad',
    temp: 'Temp',
    waves: 'Olas',
    wind: 'Viento',
    addToFavorites: 'Añadir a favoritos',
    removeFromFavorites: 'Quitar de favoritos',
  },
  detail: {
    about: 'Sobre este spot',
    conditions: 'Condiciones Actuales',
    location: 'Ubicación',
    getDirections: 'Cómo llegar',
    wind: 'Viento',
    waves: 'Olas',
    waterTemp: 'Temp. Agua',
    visibility: 'Visibilidad',
    weather: 'Tiempo',
    bestTime: 'Mejor momento para visitar',
  },
  difficulty: {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  },
  badges: {
    'MOST POPULAR': 'Más Popular',
    'BEST VISIBILITY': 'Mejor Visibilidad',
    'CALM WATERS': 'Aguas Calmas',
    RECOMMENDED: 'Recomendado',
  } as Record<string, string | undefined>,
};
