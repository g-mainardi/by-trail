export const getMapApiKey = (): string => {
  // Try Production Injection (from docker-entrypoint.sh)
  const runtimeConfig = (window as any).__RUNTIME_CONFIG__;
  if (runtimeConfig && runtimeConfig.VITE_MAP_API_KEY)
    return runtimeConfig.VITE_MAP_API_KEY;

  // Fallback to Development Injection (Vite define)
  // __MAP_API_KEY__ might be undefined in strict contexts
  try {
    return __MAP_API_KEY__;
  } catch (e) {
    console.warn('Map API Key not found in config.');
    return '';
  }
};
