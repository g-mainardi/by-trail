// Extend the vue-router RouteMeta interface to include the titleKey property
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    titleKey?: string;
    requiresAuth?: boolean;
  }
}

// Tell TypeScript that this global constant exists and is a string
declare global {
  const __MAP_API_KEY__: string;
}

export {};
