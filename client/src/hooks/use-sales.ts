import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { Sale, SaleFormData, SalesSummary } from '@/types/database';

interface UseSalesReturn {
  sales: Sale[];
  summary: SalesSummary | null;
  isLoading: boolean;
  error: string | null;
  createSale: (data: SaleFormData & { page_id: number }) => Promise<Sale | null>;
  deleteSale: (saleId: number) => Promise<boolean>;
  refresh: () => void;
}

export function useSales(pageId: number | undefined, period: string = '30d'): UseSalesReturn {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.id || !pageId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch sales list and summary in parallel
      const [salesResponse, summaryResponse] = await Promise.all([
        fetch(`/api/sales/${pageId}?period=${period}`, {
          headers: { 'x-supabase-user-id': user.id },
        }),
        fetch(`/api/sales/${pageId}/summary?period=${period}`, {
          headers: { 'x-supabase-user-id': user.id },
        }),
      ]);

      if (!salesResponse.ok || !summaryResponse.ok) {
        throw new Error('Failed to fetch sales data');
      }

      const [salesData, summaryData] = await Promise.all([
        salesResponse.json(),
        summaryResponse.json(),
      ]);

      setSales(salesData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sales');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, pageId, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createSale = async (data: SaleFormData & { page_id: number }): Promise<Sale | null> => {
    if (!user?.id) return null;

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-supabase-user-id': user.id,
        },
        body: JSON.stringify({
          ...data,
          sale_date: data.sale_date.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create sale');
      }

      const newSale = await response.json();

      // Refresh data after creating
      fetchData();

      return newSale;
    } catch (err) {
      console.error('Error creating sale:', err);
      setError(err instanceof Error ? err.message : 'Failed to create sale');
      return null;
    }
  };

  const deleteSale = async (saleId: number): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/sales/sale/${saleId}`, {
        method: 'DELETE',
        headers: { 'x-supabase-user-id': user.id },
      });

      if (!response.ok) {
        throw new Error('Failed to delete sale');
      }

      // Refresh data after deleting
      fetchData();

      return true;
    } catch (err) {
      console.error('Error deleting sale:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete sale');
      return false;
    }
  };

  return {
    sales,
    summary,
    isLoading,
    error,
    createSale,
    deleteSale,
    refresh: fetchData,
  };
}
