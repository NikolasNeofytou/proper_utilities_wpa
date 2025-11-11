import { apiClient, APIResponse, PaginatedResponse } from './client';

export interface Payment {
  id: string;
  paymentNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CASH' | 'ONLINE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  notes?: string;
  userId: string;
  billId: string;
  createdAt: string;
  updatedAt: string;
  bill?: {
    id: string;
    billNumber: string;
    totalAmount: number;
    dueDate: string;
  };
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface PaymentStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  totalAmount: number;
}

export interface CreatePaymentRequest {
  billId: string;
  amount: number;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CASH' | 'ONLINE';
  transactionId?: string;
  notes?: string;
}

export const paymentService = {
  async getPayments(
    page = 1,
    limit = 10,
    status?: string,
    billId?: string
  ): Promise<APIResponse<PaginatedResponse<Payment>>> {
    let url = `/payments?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (billId) url += `&billId=${billId}`;
    
    return apiClient.get<PaginatedResponse<Payment>>(url);
  },

  async getPayment(id: string): Promise<APIResponse<Payment>> {
    return apiClient.get<Payment>(`/payments/${id}`);
  },

  async createPayment(data: CreatePaymentRequest): Promise<APIResponse<Payment>> {
    return apiClient.post<Payment>('/payments', data);
  },

  async getPaymentStats(): Promise<APIResponse<PaymentStats>> {
    return apiClient.get<PaymentStats>('/payments/stats/overview');
  },
};
