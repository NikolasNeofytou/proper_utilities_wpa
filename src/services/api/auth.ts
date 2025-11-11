import { apiClient, APIResponse } from './client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'ADMIN' | 'MANAGER' | 'CUSTOMER';
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<APIResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  },

  async register(data: RegisterRequest): Promise<APIResponse<RegisterResponse>> {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  },

  async getCurrentUser(): Promise<APIResponse<User>> {
    return apiClient.get<User>('/auth/me');
  },

  logout() {
    apiClient.setToken(null);
  },

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  },
};
