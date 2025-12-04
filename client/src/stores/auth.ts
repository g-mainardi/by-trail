import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  
  // State
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<any | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  // Actions
  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // API Call to Backend
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Update State & LocalStorage
      token.value = data.token;
      user.value = data.user;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to Home
      router.push('/');
      return true;
    } catch (err: any) {
      console.error(err);
      error.value = err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return { token, user, error, isLoading, login, logout };
});