import { apiClient, APIResponse } from './client';
import type { User as AuthUser } from './auth';

export interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  totalBills: number;
  billsByStatus: Record<string, number>;
  totalRevenue: number;
  recentPayments: number;
}

export interface User extends AuthUser {
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'ADMIN' | 'MANAGER' | 'CUSTOMER';
}

export interface UsersListResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminService = {
  async getStats(): Promise<APIResponse<AdminStats>> {
    return apiClient.get<AdminStats>('/admin/stats');
  },

  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<APIResponse<UsersListResponse>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);

    const url = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<UsersListResponse>(url);
  },

  async createUser(data: CreateUserRequest): Promise<APIResponse<User>> {
    return apiClient.post<User>('/admin/users', data);
  },

  async updateUserStatus(userId: string, isActive: boolean): Promise<APIResponse<User>> {
    return apiClient.patch<User>(`/admin/users/${userId}/status`, { isActive });
  },

  async updateUserRole(userId: string, role: 'ADMIN' | 'MANAGER' | 'CUSTOMER'): Promise<APIResponse<User>> {
    return apiClient.patch<User>(`/admin/users/${userId}/role`, { role });
  },

  async deleteUser(userId: string): Promise<APIResponse<void>> {
    return apiClient.delete(`/admin/users/${userId}`);
  },
};
