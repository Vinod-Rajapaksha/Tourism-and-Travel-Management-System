import { Promotion, Payment } from '../types/Event';

const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Only parse JSON if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return { data };
      }

      // No content (e.g., DELETE returns 204)
      return { data: undefined as unknown as T };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  // Promotion endpoints
  async getPromotions(): Promise<ApiResponse<Promotion[]>> {
    return this.request<Promotion[]>('/promotions');
  }

  async getActivePromotions(): Promise<ApiResponse<Promotion[]>> {
    return this.request<Promotion[]>('/promotions/active');
  }

  async createPromotion(promotion: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Promotion>> {
    return this.request<Promotion>('/promotions', {
      method: 'POST',
      body: JSON.stringify(promotion),
    });
  }

  async updatePromotion(id: string, promotion: Partial<Promotion>): Promise<ApiResponse<Promotion>> {
    return this.request<Promotion>(`/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promotion),
    });
  }

  async deletePromotion(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/promotions/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment endpoints
  async getPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>('/payments');
  }

  async getConfirmedPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>('/payments/confirmed');
  }

  async getPaymentsByStatus(status: string): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>(`/payments/status/${status}`);
  }

  async createPayment(payment: Omit<Payment, 'id'>): Promise<ApiResponse<Payment>> {
    return this.request<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return this.request<Payment>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payment),
    });
  }

  async deletePayment(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/payments/${id}`, {
      method: 'DELETE',
    });
  }

  // Report endpoints
  async getDailyReport(days: number = 30): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/reports/daily?days=${days}`);
  }

  async getWeeklyReport(weeks: number = 12): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/reports/weekly?weeks=${weeks}`);
  }

  async getMonthlyReport(months: number = 12): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/reports/monthly?months=${months}`);
  }

  async getTotalConfirmedAmount(): Promise<ApiResponse<number>> {
    return this.request<number>('/payments/reports/total-amount');
  }

  async getTotalConfirmedCount(): Promise<ApiResponse<number>> {
    return this.request<number>('/payments/reports/total-count');
  }

  async getPackageTotals(): Promise<ApiResponse<Record<string, number>>> {
    return this.request<Record<string, number>>('/payments/reports/package-totals');
  }

  async getPackageQuantities(): Promise<ApiResponse<Record<string, number>>> {
    return this.request<Record<string, number>>('/payments/reports/package-quantities');
  }

  async getPaymentsByDateRange(startDate: string, endDate: string): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>(`/payments/reports/date-range?startDate=${startDate}&endDate=${endDate}`);
  }
}

export const apiService = new ApiService();
export default apiService;
