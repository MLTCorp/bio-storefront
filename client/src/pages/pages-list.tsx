import { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePlanLimits } from "@/hooks/use-plan-limits";
import { UpgradeModal } from "@/components/upgrade-modal";
import { Plus, ExternalLink, Edit, Eye, Loader2, Copy, Check, Trash2, BarChart2, MousePointer, Lock, Crown } from "lucide-react";
import type { Page } from "@/types/database";

export default function PagesListPage() {
  const { user, isLoaded } = useUser();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { limits, plan, canCreatePage, isFree } = usePlanLimits();

  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [newPageUsername, setNewPageUsername] = useState("");
  const [newPageName, setNewPageName] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Dynamic max pages based on plan
  const maxPages = limits.pages === -1 ? Infinity : limits.pages;

  // Fetch user's pages
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchPages = async () => {
      try {
        const response = await fetch("/api/pages", {
          headers: {
            "x-clerk-user-id": user.id,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPages(data);
        }
      } catch (error) {
        console.error("Erro ao buscar páginas:", error);
        toast({
          title: "Erro ao carregar páginas",
          className: "bg-red-600 text-white",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [isLoaded, user]);

  const handleCreatePage = async () => {
    if (!newPageUsername.trim()) {
      toast({
        title: "Digite um username para a página",
        className: "bg-red-600 text-white",
      });
      return;
    }

    // Validar username (apenas letras, números e hífen)
    const usernameRegex = /^[a-z0-9-]+$/;
    if (!usernameRegex.test(newPageUsername.toLowerCase())) {
      toast({
        title: "Username inválido",
        description: "Use apenas letras, números e hífen",
        className: "bg-red-600 text-white",
      });
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user!.id,
        },
        body: JSON.stringify({
          username: newPageUsername.toLowerCase(),
          profile_name: newPageName || "Minha Página",
        }),
      });

      if (response.ok) {
        const newPage = await response.json();
        setPages([...pages, newPage]);
        setShowCreateModal(false);
        setNewPageUsername("");
        setNewPageName("");

        toast({
          title: "Página criada!",
          className: "bg-green-600 text-white",
        });

        // Redireciona para o editor da nova página
        navigate(`/dashboard/${newPage.id}`);
      } else {
        const error = await response.json();
        toast({
          title: error.message || "Erro ao criar página",
          className: "bg-red-600 text-white",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao criar página",
        className: "bg-red-600 text-white",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePage = async (pageId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta página?")) return;

    setDeletingId(pageId);

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: "DELETE",
        headers: {
          "x-clerk-user-id": user!.id,
        },
      });

      if (response.ok) {
        setPages(pages.filter((p) => p.id !== pageId));
        toast({
          title: "Página excluída",
          className: "bg-green-600 text-white",
        });
      } else {
        toast({
          title: "Erro ao excluir página",
          className: "bg-red-600 text-white",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir página",
        className: "bg-red-600 text-white",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const copyLink = (username: string, pageId: number) => {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
    setCopiedId(pageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Show loading only while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // If not signed in, Clerk will handle redirect below
  if (!user) {
    return (
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    );
  }

  // Show loading while fetching pages
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white border-b">
            <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
              <h1 className="font-semibold text-lg">Minhas Páginas</h1>
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          {/* Content */}
          <main className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Grid de páginas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => (
                <Card
                  key={page.id}
                  className="group relative overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    {/* Preview da página */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-gray-100">
                      {page.profile_image ? (
                        <img
                          src={page.profile_image}
                          alt={page.profile_name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-md">
                          {page.profile_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">{page.profile_name}</h3>
                        <p className="text-sm text-gray-500">@{page.username}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          <Eye className="h-3 w-3" />
                          {page.views || 0}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          <MousePointer className="h-3 w-3" />
                          {(page as any).clicks || 0}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 mt-4">
                      {/* Primary action */}
                      <Button
                        size="sm"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => navigate(`/dashboard/${page.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Página
                      </Button>

                      {/* Secondary actions */}
                      <div className="grid grid-cols-4 gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/${page.username}`, "_blank")}
                          title="Ver página"
                          className="hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/analytics/${page.id}`)}
                          title="Ver analytics"
                          className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                        >
                          <BarChart2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyLink(page.username, page.id)}
                          title="Copiar link"
                          className={copiedId === page.id ? "bg-green-50 text-green-600 border-green-200" : "hover:bg-gray-100"}
                        >
                          {copiedId === page.id ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePage(page.id)}
                          disabled={deletingId === page.id}
                          title="Excluir página"
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          {deletingId === page.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Card de criar nova página */}
              {canCreatePage(pages.length) ? (
                <Card
                  className="border-dashed border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                  onClick={() => setShowCreateModal(true)}
                >
                  <CardContent className="p-4 h-full flex flex-col items-center justify-center min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center mb-3 transition-colors">
                      <Plus className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="font-medium text-gray-700">Nova Página</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {limits.pages === -1 ? "Ilimitado" : `${maxPages - pages.length} restante${maxPages - pages.length !== 1 ? "s" : ""}`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  className="border-dashed border-2 border-gray-200 hover:border-purple-300 transition-all cursor-pointer group"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <CardContent className="p-4 h-full flex flex-col items-center justify-center min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mb-3 transition-colors">
                      <Lock className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="font-medium text-gray-700">Limite Atingido</p>
                    <p className="text-sm text-purple-600 mt-1 flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Fazer Upgrade
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Info do plano */}
            <div className="text-center text-sm text-gray-500 mt-8 space-y-1">
              <p>
                {pages.length} / {limits.pages === -1 ? "∞" : limits.pages} páginas criadas
              </p>
              {isFree && (
                <p className="text-purple-600 flex items-center justify-center gap-1">
                  <Crown className="h-3 w-3" />
                  <button onClick={() => setShowUpgradeModal(true)} className="hover:underline">
                    Fazer upgrade para mais páginas
                  </button>
                </p>
              )}
            </div>
          </main>
        </div>

        {/* Modal de criar página */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Página</DialogTitle>
              <DialogDescription>
                Escolha um username único para sua página
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-1">@</span>
                  <Input
                    id="username"
                    placeholder="minhaloja"
                    value={newPageUsername}
                    onChange={(e) => setNewPageUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Sua página ficará em: {window.location.origin}/{newPageUsername || "username"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome da Página (opcional)</Label>
                <Input
                  id="name"
                  placeholder="Minha Loja"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreatePage}
                disabled={creating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Criando...
                  </>
                ) : (
                  "Criar Página"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upgrade Modal */}
        <UpgradeModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature="pages"
          currentPlan={plan}
          currentCount={pages.length}
          limit={limits.pages}
        />
      </SignedIn>
    </>
  );
}
