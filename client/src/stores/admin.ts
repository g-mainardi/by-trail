import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/stores/utility/axiosInstance';
import type { Bivouac, User, UserStatus } from '@/types';
import { UserStatusEnum } from '@/types';

const { ACTIVE, BANNED } = UserStatusEnum;

export const useAdminStore = defineStore('admin', () => {
  const users = ref<User[]>([]);
  const bivouacs = ref<Bivouac[]>([]);
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
      const response = await api.delete(`/users/${userId}`);
      if (!response || response.status !== 204)
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

  const fetchBivouacs = async () => {
    if (isLoading.value) return;
    isLoading.value = true;

    try {
      const res = await api.post('/bivouacs/list', {});
      const data = res.data;

      if (!data || !Array.isArray(data.bivouacs)) {
        throw new Error('Invalid data format received from server');
      }

      bivouacs.value = data.bivouacs;
    } catch (err: any) {
      console.error('Error fetching bivouacs:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const updateBivouac = async (
    bivouacId: string,
    updates: Record<string, any>
  ) => {
    isLoading.value = true;

    try {
      const res = await api.patch(`/bivouacs/${bivouacId}`, updates);
      if (!res || res.status !== 201)
        throw new Error('Failed to update bivouac');

      // Local update
      const index = bivouacs.value.findIndex(
        (b) => (b.id || b._id) === bivouacId
      );
      if (index !== -1) {
        bivouacs.value[index] = {
          ...bivouacs.value[index],
          ...updates,
        };
      }

      return true;
    } catch (err: any) {
      console.error(`Error updating bivouac ${bivouacId}:`, err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteBivouac = async (bivouacId: string) => {
    if (isLoading.value) return false;
    isLoading.value = true;

    try {
      const response = await api.delete(`/bivouacs/${bivouacId}`);
      if (!response || response.status !== 204)
        throw new Error('Failed to delete bivouac');
      bivouacs.value = bivouacs.value.filter(
        (b) => (b.id || b._id) !== bivouacId
      );
      return true;
    } catch (err: any) {
      console.error(`Error deleting bivouac ${bivouacId}:`, err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    bivouacs,
    isLoading,
    fetchUsers,
    toggleUserBlock,
    deleteUser,
    fetchBivouacs,
    updateBivouac,
    deleteBivouac,
  };
});
