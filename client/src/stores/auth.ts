import { HttpHelper } from '@/stores/httpHelper';
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
  const httpHelper = new HttpHelper('/api', token.value || undefined);

  // Actions
  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      // API Call to Backend
      const body = { email, password };
      const res = await httpHelper.post('/auth/login', body);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Update State & LocalStorage
      token.value = data.token;
      user.value = data.user;
      httpHelper.setToken(data.token);

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

  const signup = async (name: string, email: string, pass: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password: pass
          // favRegions: [] //todo
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Signup failed');

      return true;

    } catch (err: any) {
      console.error(err);
      error.value = err.message;
      return false;
    } finally {
      console.log("Account creation process finished.");
      isLoading.value = false;
    }
  };

  const deleteAccount = async (password: String) => {
    if (!token.value) return;
    isLoading.value = true;
    error.value = null;

    try {
      const body = { email: user.value.email, password: password };
      httpHelper.post('/auth/delete', body);
    } catch (err: any) {
      log(err.message);
      return false;
    } finally {
      isLoading.value = false;
      router.push('/');
    }
  }

  const log = (message: string) => {
    error.value = message;
    console.error(message);
  };

  return { token, user, error, isLoading, login, signup, logout, deleteAccount };
});
