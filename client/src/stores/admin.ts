import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/stores/utility/axiosInstance';
import type { User, UserStatus } from '@/stores/auth';
import { UserStatusEnum } from '@/stores/auth';

const { ACTIVE, BANNED } = UserStatusEnum;

export const useAdminUsersStore = defineStore('admin-users', () => {
  const users = ref<User[]>([]);
  const isLoading = ref(false);

  const fetchUsers = async () => {
    isLoading.value = true;
    try {
      const res = await api.get('/users');
      const data = res.data;

      if (!data || !Array.isArray(data.users)) {
        throw new Error('Invalid data format received from server');
      }

      users.value = data.users;
    } catch (err: any) {
      console.error('Error fetching users:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const toggleUserBlock = async (userId: string, currentStatus: UserStatus) => {
    isLoading.value = true;

    try {
      const newStatus = currentStatus === ACTIVE ? BANNED : ACTIVE;
      await api.patch(`/users/${userId}/status`, { status: newStatus });

      // Local update
      const userIndex = users.value.findIndex(
        (u) => u.id === userId || u._id === userId
      );
      if (userIndex !== -1) {
        // Create a copy for safe reactivity or modify directly if it's a deep ref
        (users.value[userIndex] as any).status = newStatus;
      }

      return true;
    } catch (err: any) {
      console.error(`Error changing status for user ${userId}:`, err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteUser = async (userId: string) => {
    isLoading.value = true;

    try {
      await api.delete(`/users/${userId}`);

      // Remove from the local users array
      users.value = users.value.filter(
        (u) => u.id !== userId && u._id !== userId
      );

      return true;
    } catch (err: any) {
      console.error(`Error deleting user ${userId}:`, err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    isLoading,
    fetchUsers,
    toggleUserBlock,
    deleteUser,
  };
});
