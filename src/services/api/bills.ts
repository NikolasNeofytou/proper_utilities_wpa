import { apiClient, APIResponse, PaginatedResponse } from './client';

export interface Bill {
  id: string;
  billNumber: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  issueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'DISPUTED';
  totalAmount: number;
  consumption?: number;
  rate?: number;
  taxes: number;
  fees: number;
  userId: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    name: string;
    address: string;
  };
  payments?: Array<{
    id: string;
    amount: number;
    paymentDate: string;
    status: string;
  }>;
}

export interface BillStats {
  total: number;
  pending: number;
  paid: number;
  overdue: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

export interface CreateBillRequest {
  propertyId: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  totalAmount: number;
  consumption?: number;
  rate?: number;
  taxes?: number;
  fees?: number;
}

export const billService = {
  async getBills(
    page = 1,
    limit = 10,
    status?: string,
    propertyId?: string
  ): Promise<APIResponse<PaginatedResponse<Bill>>> {
    let url = `/bills?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (propertyId) url += `&propertyId=${propertyId}`;
    
    return apiClient.get<PaginatedResponse<Bill>>(url);
  },

  async getBill(id: string): Promise<APIResponse<Bill>> {
    return apiClient.get<Bill>(`/bills/${id}`);
  },

  async createBill(data: CreateBillRequest): Promise<APIResponse<Bill>> {
    return apiClient.post<Bill>('/bills', data);
  },

  async getBillStats(): Promise<APIResponse<BillStats>> {
    return apiClient.get<BillStats>('/bills/stats/overview');
  },
};
