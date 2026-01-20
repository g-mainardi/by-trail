import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import api from '@/stores/utility/axiosInstance';
import type { ProposalWithEmail, User, UserStatus } from '@/types';
import { useBivouacStore } from '@/stores/bivouacs';
import { useRouteStore } from './routes';
import { UserStatusEnum } from '@/types';

const { ACTIVE, BANNED } = UserStatusEnum;

export const useAdminStore = defineStore('admin', () => {
  const bivouacStore = useBivouacStore();
  const routeStore = useRouteStore();
  const { bivouacs } = storeToRefs(bivouacStore);
  const { routes } = storeToRefs(routeStore);
  const { fetchBivouacs } = bivouacStore;
  const { fetchRoutes } = routeStore;
  const users = ref<User[]>([]);
  const proposals = ref<ProposalWithEmail[]>([]);
  const isLoading = ref(false);

  const fetchUsers = async () => {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
      const res = await api.get('/admin/users');
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
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });

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
      const response = await api.delete(`/admin/users/${userId}`);
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

  const updateBivouac = async (
    bivouacId: string,
    updates: Record<string, any>
  ) => {
    if (isLoading.value) return false;
    isLoading.value = true;

    try {
      if (Object.keys(updates).length === 0) return true;

      const res = await api.patch(`/admin/bivouacs/${bivouacId}`, updates);
      if (!res || res.status !== 200)
        throw new Error('Failed to update bivouac');

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
      const response = await api.delete(`/admin/bivouacs/${bivouacId}`);
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

  const updateRoute = async (routeId: string, updates: Record<string, any>) => {
    if (isLoading.value) return false;
    isLoading.value = true;

    try {
      if (Object.keys(updates).length === 0) return true;
      const res = await api.patch(`/admin/routes/${routeId}`, updates);
      if (!res || res.status !== 200) throw new Error('Failed to update route');
      return true;
    } catch (err: any) {
      console.error(`Error updating route ${routeId}:`, err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteRoute = async (routeId: string) => {
    if (isLoading.value) return false;
    isLoading.value = true;

    try {
      const response = await api.delete(`/admin/routes/${routeId}`);
      if (!response || response.status !== 204)
        throw new Error('Failed to delete route');
      routes.value = routes.value.filter((r) => (r.id || r._id) !== routeId);
      return true;
    } catch (err: any) {
      console.error(`Error deleting route ${routeId}:`, err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProposals = async () => {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
      const res = await api.get('/admin/proposals');
      const data = res.data;

      if (!data || !Array.isArray(data.proposals)) {
        throw new Error('Invalid data format received from server');
      }

      proposals.value = data.proposals;
    } catch (err: any) {
      console.error('Error fetching proposals:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteProposal = async (proposalId: string) => {
    if (isLoading.value) return false;
    isLoading.value = true;

    try {
      const response = await api.delete(`/admin/proposals/${proposalId}`);
      if (!response || response.status !== 204)
        throw new Error('Failed to delete proposal');

      // Remove from the local proposals array
      proposals.value = proposals.value.filter(
        (p) => p.id !== proposalId && p._id !== proposalId
      );

      return true;
    } catch (err: any) {
      console.error(`Error deleting proposal ${proposalId}:`, err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    bivouacs,
    routes,
    proposals,
    isLoading,
    fetchUsers,
    toggleUserBlock,
    deleteUser,
    fetchBivouacs,
    updateBivouac,
    deleteBivouac,
    fetchRoutes,
    updateRoute,
    deleteRoute,
    fetchProposals,
    deleteProposal,
  };
});
