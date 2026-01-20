import { ShoppingCart, DollarSign, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { SalesSummary } from '@/types/database';

interface SalesSummaryCardsProps {
  summary: SalesSummary | null;
  isLoading: boolean;
}

export function SalesSummaryCards({ summary, isLoading }: SalesSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total de Vendas',
      value: summary?.totalSales ?? 0,
      icon: ShoppingCart,
      format: (v: number) => v.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Faturamento',
      value: summary?.totalRevenue ?? 0,
      icon: DollarSign,
      format: formatCurrency,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Comissão Recebida',
      value: summary?.totalCommission ?? 0,
      icon: Wallet,
      format: formatCurrency,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.format(card.value)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
