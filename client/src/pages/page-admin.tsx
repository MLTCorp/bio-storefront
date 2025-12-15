import { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RefreshCw, UserPlus, Loader2 } from "lucide-react";
import { Link } from "wouter";

interface PageWithOwner {
  id: number;
  user_id: string;
  username: string;
  profile_name: string;
  is_active: boolean;
  created_at: string;
  users: {
    email: string;
  };
}

interface User {
  id: string;
  clerk_id: string;
  email: string;
  created_at: string;
}

export default function PageAdminPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [pages, setPages] = useState<PageWithOwner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pagesRes, usersRes] = await Promise.all([
        fetch("/api/admin/all-pages"),
        fetch("/api/debug/users"),
      ]);

      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        setPages(pagesData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransfer = async (pageId: number) => {
    if (!user) return;

    setTransferring(pageId);
    try {
      const response = await fetch(`/api/admin/transfer-page/${pageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user.id,
        },
        body: JSON.stringify({
          email: currentUserEmail,
        }),
      });

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Propriedade da pagina transferida para sua conta",
          className: "bg-green-600 text-white border-none",
        });
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.error || "Falha ao transferir pagina",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao transferir pagina",
        variant: "destructive",
      });
    } finally {
      setTransferring(null);
    }
  };

  const currentUserEmail = user?.emailAddresses?.[0]?.emailAddress;

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gray-50/50 p-4 pb-24 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-gray-50/95 backdrop-blur z-10 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Admin - Paginas</h1>
                  <p className="text-xs text-muted-foreground">Gerenciar propriedade das paginas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Atualizar
                </Button>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>

            {/* Current User Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <p className="text-sm">
                  <strong>Voce esta logado como:</strong>{" "}
                  <span className="font-mono text-blue-700">{currentUserEmail}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Clerk ID: {user?.id}
                </p>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>Usuarios Cadastrados</CardTitle>
                <CardDescription>Todos os usuarios no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className={`p-3 rounded-lg border ${
                          u.email === currentUserEmail
                            ? "bg-green-50 border-green-200"
                            : "bg-white"
                        }`}
                      >
                        <p className="font-medium text-sm">{u.email}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          ID: {u.id.slice(0, 8)}... | Clerk: {u.clerk_id.slice(0, 12)}...
                        </p>
                        {u.email === currentUserEmail && (
                          <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Sua conta
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pages List */}
            <Card>
              <CardHeader>
                <CardTitle>Todas as Paginas</CardTitle>
                <CardDescription>
                  Clique em "Transferir" para mover a propriedade de uma pagina para sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : pages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma pagina encontrada
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pages.map((page) => {
                      const isOwner = page.users?.email === currentUserEmail;

                      return (
                        <div
                          key={page.id}
                          className={`p-4 rounded-lg border ${
                            isOwner ? "bg-green-50 border-green-200" : "bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-lg">{page.profile_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                @{page.username}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Proprietario: <span className="font-mono">{page.users?.email || "Desconhecido"}</span>
                              </p>
                              {isOwner && (
                                <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                  Voce e o proprietario
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <a
                                href={`/${page.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Ver pagina
                              </a>
                              {!isOwner && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleTransfer(page.id)}
                                  disabled={transferring === page.id}
                                >
                                  {transferring === page.id ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                    <UserPlus className="w-4 h-4 mr-2" />
                                  )}
                                  Transferir para mim
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
