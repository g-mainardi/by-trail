import { HttpHelper } from '@/stores/utility/httpHelper';
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
  const httpHelper = new HttpHelper('/api', token.value || undefined);

  // --- Actions ---

  // 1. Fetch Profile (The Source of Truth)
  // Call this when the app starts or after login to get fresh data
  const fetchProfile = async (): Promise<boolean> => {
    if (!token.value) return false;

    isLoading.value = true;
    try {
      const res = await httpHelper.get('/users/profile');

      if (!res.ok) {
        // If token is invalid (401), force logout
        if (res.status === 401) logout();
        throw new Error('Failed to fetch profile');
      }

      const data = await res.json();

      // Update state with fresh data from DB
      user.value = data.user;

      // Update localStorage to keep it somewhat in sync
      localStorage.setItem('user', JSON.stringify(user.value));

      return true;
    } catch (err: any) {
      console.error('Fetch Profile Error:', err);
      error.value = err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 2. Update Profile
  const updateProfile = async (updateData: Partial<User>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await httpHelper.put('/users/profile', updateData);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Update failed');

      // Fetch the latest profile to sync state
      const profileSuccess = await fetchProfile();
      if (!profileSuccess) {
        throw new Error('Failed to load user profile');
      }

      return true;
    } catch (err: any) {
      console.error('Update Profile Error', err);
      error.value = err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 3. Login (Updated)
  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      // API Call to Backend
      const body = { email, password };
      const res = await httpHelper.post('/auth/login', body);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Save critical auth data
      token.value = data.token;
      user.value = data.user;

      httpHelper.setToken(data.token);

      localStorage.setItem('token', token.value || '');
      localStorage.setItem('user', JSON.stringify(user.value));

      // FETCH FULL PROFILE NOW
      const profileSuccess = await fetchProfile();
      if (!profileSuccess) {
        throw new Error('Failed to load user profile');
      }

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

  // 4. Logout
  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // 5. Signup
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
      console.log('Account creation process finished.');
      isLoading.value = false;
    }
  };

  const deleteAccount = async (email: string, password: string) => {
    if (!token.value) return;
    isAccountDeleteFailed.value = false;
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
