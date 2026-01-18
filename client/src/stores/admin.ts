import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/stores/utility/axiosInstance';
import type { User, UserStatus } from '@/types';
import { UserStatusEnum } from '@/types';

const { ACTIVE, BANNED } = UserStatusEnum;

export const useAdminStore = defineStore('admin-users', () => {
  const users = ref<User[]>([]);
  const isLoading = ref(false);

  const fetchUsers = async () => {
    if (isLoading.value) return;
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
    if (isLoading.value) return false;
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
        (users.value[userIndex] as User).status = newStatus;
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
    if (isLoading.value) return false;
    isLoading.value = true;

    try {
      const success = await api.delete(`/users/${userId}`);
      if (!success || success.status !== 204)
        throw new Error('Failed to delete user');

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
