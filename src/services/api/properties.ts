import { apiClient, APIResponse, PaginatedResponse } from './client';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  type: 'APARTMENT' | 'HOUSE' | 'COMMERCIAL' | 'BUILDING';
  totalUnits: number;
  createdAt: string;
  updatedAt: string;
  units?: Unit[];
  _count?: {
    units: number;
    bills: number;
  };
}

export interface Unit {
  id: string;
  unitNumber: string;
  floor?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  isOccupied: boolean;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyRequest {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country?: string;
  type: 'APARTMENT' | 'HOUSE' | 'COMMERCIAL' | 'BUILDING';
  totalUnits?: number;
}

export interface CreateUnitRequest {
  unitNumber: string;
  floor?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  isOccupied?: boolean;
}

export const propertyService = {
  async getProperties(page = 1, limit = 10): Promise<APIResponse<PaginatedResponse<Property>>> {
    return apiClient.get<PaginatedResponse<Property>>(`/properties?page=${page}&limit=${limit}`);
  },

  async getProperty(id: string): Promise<APIResponse<Property>> {
    return apiClient.get<Property>(`/properties/${id}`);
  },

  async createProperty(data: CreatePropertyRequest): Promise<APIResponse<Property>> {
    return apiClient.post<Property>('/properties', data);
  },

  async createUnit(propertyId: string, data: CreateUnitRequest): Promise<APIResponse<Unit>> {
    return apiClient.post<Unit>(`/properties/${propertyId}/units`, data);
  },
};
