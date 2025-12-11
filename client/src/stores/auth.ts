import { HttpHelper } from '@/stores/httpHelper';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface User {
  id: string;
  name: string;
  email: string;
  favRegions?: string[];
}

export const useAuthStore = defineStore('auth', () => {

  const router = useRouter();
  const isAccountDeleteFailed = ref(false);
  const accountDeleteMessage = ref<string>('');

  // State
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
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
      router.push('/homepage');
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

  const signup = async (name: string, email: string, signupPassword: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const body = {
        name,
        email,
        password: signupPassword
      };
      const res = await httpHelper.post('/auth/signup', body);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Signup failed');

      router.push('/login');
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

  const deleteAccount = async (email: string, password: string) => {
    if (!token.value) return;
    isLoading.value = true;
    error.value = null;

    try {
      const body = { email: email, password: password };
      let res = await httpHelper.post('/auth/delete', body);
      let data = await res.json();
      if (res.status === 200) {
        clearAuthenticationStore();
        router.push('/login');
      } else {
        isAccountDeleteFailed.value = true;
        accountDeleteMessage.value = data.error || 'Account deletion failed';
      }
    } catch (err: any) {
      log(err.message);
      return false;
    } finally {
      isLoading.value = false;
    };
  };

  function clearAuthenticationStore() {
    token.value = null;
    user.value = null;
    error.value = null;
    isLoading.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  function log(message: string) {
    error.value = message;
    console.error(message);
  };

  return { token, user, error, isLoading, isAccountDeleteFailed, accountDeleteMessage, login, signup, logout, deleteAccount };
});
