import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { useSales } from '@/hooks/use-sales';
import { ArrowLeft, Plus, Loader2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  NewSaleModal,
  SalesSummaryCards,
  SalesTable,
  SalesChart,
} from '@/components/sales';
import type { ProductConfig, SaleFormData } from '@/types/database';

function SalesPageContent() {
  const [, params] = useRoute('/sales/:pageId');
  const { user, loading: authLoading } = useAuth();
  const [period, setPeriod] = useState('30d');
  const [pageName, setPageName] = useState('');
  const [products, setProducts] = useState<ProductConfig[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const pageId = params?.pageId ? parseInt(params.pageId) : undefined;
  const { sales, summary, isLoading, createSale, deleteSale, error } = useSales(pageId, period);

  // Fetch page info and products
  useEffect(() => {
    if (!params?.pageId || !user) return;

    const fetchPageData = async () => {
      try {
        // Fetch page details
        const pageResponse = await fetch(`/api/pages/${params.pageId}`, {
          headers: { 'x-supabase-user-id': user.id },
        });

        if (pageResponse.ok) {
          const pageData = await pageResponse.json();
          setPageName(pageData.profile_name || pageData.username);
        }

        // Fetch page components to get products
        const componentsResponse = await fetch(`/api/pages/${params.pageId}/components`, {
          headers: { 'x-supabase-user-id': user.id },
        });

        if (componentsResponse.ok) {
          const components = await componentsResponse.json();
          const productComponents = components
            .filter((c: any) => c.type === 'product')
            .map((c: any) => c.config as ProductConfig);
          setProducts(productComponents);
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
      }
    };

    fetchPageData();
  }, [params?.pageId, user]);

  const handleCreateSale = async (data: SaleFormData): Promise<boolean> => {
    if (!pageId) return false;

    const result = await createSale({ ...data, page_id: pageId });

    if (result) {
      toast({
        title: 'Venda registrada',
        description: 'A venda foi adicionada com sucesso.',
      });
      return true;
    } else {
      toast({
        title: 'Erro',
        description: error || 'Não foi possível registrar a venda.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleDeleteSale = async (saleId: number): Promise<boolean> => {
    const success = await deleteSale(saleId);

    if (success) {
      toast({
        title: 'Venda excluída',
        description: 'A venda foi removida com sucesso.',
      });
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a venda.',
        variant: 'destructive',
      });
    }

    return success;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                Vendas
              </h1>
              {pageName && (
                <p className="text-sm text-muted-foreground">{pageName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Tabs value={period} onValueChange={setPeriod}>
              <TabsList>
                <TabsTrigger value="7d">7 dias</TabsTrigger>
                <TabsTrigger value="30d">30 dias</TabsTrigger>
                <TabsTrigger value="90d">90 dias</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button onClick={() => setModalOpen(true)} disabled={products.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Venda
            </Button>
          </div>
        </div>

        {/* Warning if no products */}
        {products.length === 0 && !isLoading && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Esta página não possui produtos cadastrados.
              Adicione produtos à sua página para poder registrar vendas.
            </p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="mb-6">
          <SalesSummaryCards summary={summary} isLoading={isLoading} />
        </div>

        {/* Chart */}
        <div className="mb-6">
          <SalesChart summary={summary} isLoading={isLoading} />
        </div>

        {/* Sales Table */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Histórico de Vendas</h2>
          <SalesTable
            sales={sales}
            isLoading={isLoading}
            onDelete={handleDeleteSale}
          />
        </div>

        {/* New Sale Modal */}
        <NewSaleModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          products={products}
          onSave={handleCreateSale}
        />
      </div>
    </div>
  );
}

export default function SalesPage() {
  return (
    <ProtectedRoute>
      <SalesPageContent />
    </ProtectedRoute>
  );
}
