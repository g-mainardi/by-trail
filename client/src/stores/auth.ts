import { socket } from '@/services/socket';
import api from '@/stores/utility/axiosInstance'; // Import the global instance
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// --- Interfaces ---

const UserEnum = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

type UserType = (typeof UserEnum)[keyof typeof UserEnum];

// Matches the User model fields we expose
export interface User {
  _id?: string; // Optional because sometimes Mongo uses _id, sometimes id
  id?: string;
  name: string;
  email: string;
  favRegions?: string[];
  type?: UserType;
}

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  const router = useRouter();
  const isAccountDeleteFailed = ref(false);
  const accountDeleteMessage = ref<string>('');
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  // --- Actions ---

  const fetchProfile = async (skipLoadingState = false): Promise<boolean> => {
    if (!token.value) return false;

    if (!skipLoadingState) {
      isLoading.value = true;
    }
    try {
      // Axios directly returns the response object. Data is in .data
      const res = await api.get('/users/profile');

      // No need to check !res.ok, axios throws if status is not 2xx
      const data = res.data;

      user.value = data.user;
      localStorage.setItem('user', JSON.stringify(user.value));

      return true;
    } catch (err: any) {
      console.error('Fetch Profile Error:', err);
      // Handle axios error object structure
      error.value = err.response?.data?.message || err.message;
      return false;
    } finally {
      if (!skipLoadingState) {
        isLoading.value = false;
      }
    }
  };

  const updateProfile = async (updateData: Partial<User>) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Axios put
      await api.patch('/users/profile', updateData);

      // If we are here, it was successful (2xx)
      const profileSuccess = await fetchProfile(true);
      if (!profileSuccess) {
        console.warn(
          'Profile updated on server, but failed to refresh local user state.'
        );
        error.value =
          'Your profile was updated, but we could not refresh your data. Please reload the page.';
      }
      return true;
    } catch (err: any) {
      console.error('Update Profile Error:', err);
      error.value = err.response?.data?.message || err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const body = { email, password };
      const res = await api.post('/auth/login', body);
      const data = res.data;

      token.value = data.token;
      user.value = data.user;

      // No need to manually set token on helper, the interceptor reads localStorage
      localStorage.setItem('token', token.value || '');
      localStorage.setItem('user', JSON.stringify(user.value));

      // Fetch the latest profile to sync state (skip nested loading state management)
      const profileSuccess = await fetchProfile(true);
      if (!profileSuccess) {
        throw new Error('Failed to load user profile');
      }

      // Redirect to Home
      router.push('/');
      return true;
    } catch (err: any) {
      console.error(err);
      error.value = err.response?.data?.message || err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    error.value = null;
    isLoading.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socket.disconnect();
    router.push('/login');
  };

  const signup = async (
    name: string,
    email: string,
    signupPassword: string,
    favRegions: string[] = []
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      const body = {
        name,
        email,
        password: signupPassword,
        favRegions,
      };
      await api.post('/auth/signup', body);
      router.push('/login');
      return true;
    } catch (err: any) {
      console.error(err);
      error.value = err.response?.data?.message || err.message;
      return false;
    } finally {
      console.log('Account creation process finished.');
      isLoading.value = false;
    }
  };

  const deleteAccount = async (email: string, password: string) => {
    // For safety, we check if token exists before attempting account deletion.
    if (!token.value) return;

    isAccountDeleteFailed.value = false;
    isLoading.value = true;
    error.value = null;

    try {
      const body = { email: email, password: password };
      await api.post('/auth/delete', body);

      clearAuthenticationStore();
      router.push('/login');
    } catch (err: any) {
      log(err.response?.data?.error || err.message);
      isAccountDeleteFailed.value = true;
      accountDeleteMessage.value =
        err.response?.data?.error || 'Account deletion failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  function clearAuthenticationStore() {
    token.value = null;
    user.value = null;
    error.value = null;
    isLoading.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function log(message: string) {
    error.value = message;
    console.error(message);
  }

  return {
    token,
    user,
    error,
    isLoading,
    isAccountDeleteFailed,
    accountDeleteMessage,
    login,
    signup,
    logout,
    deleteAccount,
    fetchProfile,
    updateProfile,
  };
});
