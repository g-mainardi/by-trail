import { createI18n } from 'vue-i18n';

function getSavedLocale(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem('locale');
    if (stored) {
      return stored;
    }
  }
  return 'en';
}

const savedLocale = getSavedLocale();
const messages = {
  en: {
    maps: 'Maps',
    routes: 'Routes',
    bivouacs: 'Bivouacs & Shelters',
    profile: 'Profile',
    activities: 'Activities',
    notifications: 'Notifications',
    settings: 'Settings',
    admin: 'Admin',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
  },
  it: {
    maps: 'Mappe',
    routes: 'Percorsi',
    bivouacs: 'Bivacchi e Rifugi',
    profile: 'Profilo',
    activities: 'Attività',
    notifications: 'Notifiche',
    settings: 'Impostazioni',
    admin: 'Amministratore',
    login: 'Accedi',
    signup: 'Registrati',
    logout: 'Esci',
  },
  es: {
    maps: 'Mapas',
    routes: 'Rutas',
    bivouacs: 'Vivacs & Refugios',
    profile: 'Perfil',
    activities: 'Actividades',
    notifications: 'Notificaciones',
    settings: 'Ajustes',
    admin: 'Administrador',
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    logout: 'Cerrar sesión',
  },
};

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
});
