import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useAuth, useUser, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { ArrowLeft, Eye, MousePointer, TrendingUp, Smartphone, Monitor, Tablet, Loader2, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  ctr: number;
  chartData: Array<{ date: string; views: number; clicks: number }>;
  deviceStats: Record<string, number>;
  topComponents: Array<{ count: number; label: string; type: string }>;
  period: string;
}

export default function AnalyticsPage() {
  const [, params] = useRoute("/analytics/:pageId");
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7d");
  const [pageName, setPageName] = useState("");

  useEffect(() => {
    if (!params?.pageId || !user) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await fetch(`/api/analytics/${params.pageId}?period=${period}`, {
          headers: {
            "x-clerk-user-id": user.id,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch analytics");

        const data = await response.json();
        setAnalytics(data);

        // Also fetch page name
        const pageResponse = await fetch(`/api/pages/${params.pageId}`, {
          headers: {
            "x-clerk-user-id": user.id,
          },
        });

        if (pageResponse.ok) {
          const pageData = await pageResponse.json();
          setPageName(pageData.profile_name || pageData.username);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [params?.pageId, user, period, getToken]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "whatsapp":
        return "bg-green-500";
      case "button":
        return "bg-blue-500";
      case "link":
        return "bg-purple-500";
      case "social":
        return "bg-pink-500";
      case "product":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    return (
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    );
  }

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum dado disponível</p>
          <Link href="/pages">
            <button className="mt-4 text-blue-600 hover:underline">Voltar para páginas</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/pages">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Analytics</h1>
              <p className="text-sm text-gray-500">{pageName}</p>
            </div>
          </div>

          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="1d">Hoje</TabsTrigger>
              <TabsTrigger value="7d">7 dias</TabsTrigger>
              <TabsTrigger value="30d">30 dias</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                nos últimos {period === "1d" ? "24h" : period === "7d" ? "7 dias" : "30 dias"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cliques</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalClicks}</div>
              <p className="text-xs text-muted-foreground">
                em botões, links e produtos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Cliques (CTR)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.ctr.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                cliques por visualização
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Visitas e Cliques</CardTitle>
            <CardDescription>Evolução ao longo do período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(label) => formatDate(label as string)}
                    formatter={(value: number, name: string) => [
                      value,
                      name === "views" ? "Visualizações" : "Cliques",
                    ]}
                  />
                  <Legend
                    formatter={(value) =>
                      value === "views" ? "Visualizações" : "Cliques"
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Components */}
          <Card>
            <CardHeader>
              <CardTitle>Componentes Mais Clicados</CardTitle>
              <CardDescription>Ranking de interações</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topComponents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum clique registrado ainda
                </p>
              ) : (
                <div className="space-y-3">
                  {analytics.topComponents.map((component, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{component.label}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full text-white ${getTypeColor(
                              component.type
                            )}`}
                          >
                            {component.type}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-lg">{component.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Dispositivos</CardTitle>
              <CardDescription>De onde vêm seus visitantes</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(analytics.deviceStats).length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma visita registrada ainda
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(analytics.deviceStats).map(([device, count]) => {
                    const total = Object.values(analytics.deviceStats).reduce(
                      (a, b) => a + b,
                      0
                    );
                    const percentage = ((count / total) * 100).toFixed(1);

                    return (
                      <div key={device} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(device)}
                            <span className="capitalize">
                              {device === "mobile"
                                ? "Celular"
                                : device === "tablet"
                                ? "Tablet"
                                : device === "desktop"
                                ? "Computador"
                                : device}
                            </span>
                          </div>
                          <span className="text-gray-500">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
