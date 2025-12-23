import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { CheckCircle, Loader2, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

interface PendingSubscription {
  email: string;
  plan_id: string;
  status: string;
}

const PLAN_NAMES: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
};

export default function SetupAccountPage() {
  const [, navigate] = useLocation();
  const { isSignedIn, user, isLoaded } = useUser();
  const [pending, setPending] = useState<PendingSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  // Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setError("Token de configuracao nao encontrado");
      setLoading(false);
      return;
    }

    verifyToken();
  }, [token]);

  // Complete setup when user signs in
  useEffect(() => {
    if (isLoaded && isSignedIn && pending && pending.status === "pending") {
      completeSetup();
    }
  }, [isLoaded, isSignedIn, pending]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/subscriptions/verify-token/${token}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Token invalido ou expirado");
        setLoading(false);
        return;
      }

      setPending(data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao verificar token");
      setLoading(false);
    }
  };

  const completeSetup = async () => {
    if (!token || completing) return;

    setCompleting(true);
    try {
      const response = await apiRequest("POST", "/api/subscriptions/complete-setup", {
        token,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao completar configuracao");
        setCompleting(false);
        return;
      }

      // Success! Redirect to dashboard
      navigate("/dashboard?welcome=true");
    } catch (err) {
      setError("Erro ao configurar conta");
      setCompleting(false);
    }
  };

  // Loading state
  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-gray-800/50 border-gray-700">
          <CardContent className="pt-8 pb-8 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <p className="text-gray-400 mt-4">Verificando pagamento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-gray-800/50 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-white">Erro</CardTitle>
            <CardDescription className="text-gray-400">{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate("/")} variant="outline">
              Voltar para o inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Already signed in and completing
  if (isSignedIn && completing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-gray-800/50 border-gray-700">
          <CardContent className="pt-8 pb-8 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <p className="text-gray-400 mt-4">Configurando sua conta...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state - show sign in options
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-white">Pagamento Confirmado!</CardTitle>
          <CardDescription className="text-gray-400">
            Seu plano <span className="text-purple-400 font-semibold">{PLAN_NAMES[pending?.plan_id || ""] || pending?.plan_id}</span> esta ativo.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 mb-6">
              Configure sua conta para comecar a criar suas paginas:
            </p>

            {/* Email info */}
            {pending?.email && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6 bg-gray-700/50 rounded-lg p-3">
                <Mail className="h-4 w-4" />
                <span>{pending.email}</span>
              </div>
            )}

            {/* Sign up / Sign in buttons */}
            <div className="space-y-3">
              <SignUpButton mode="modal" forceRedirectUrl={`/setup-account?token=${token}`}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Criar minha conta
                </Button>
              </SignUpButton>

              <SignInButton mode="modal" forceRedirectUrl={`/setup-account?token=${token}`}>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  Ja tenho uma conta
                </Button>
              </SignInButton>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Ao criar uma conta, voce concorda com nossos{" "}
              <a href="/termos" className="text-purple-400 hover:underline">
                Termos de Servico
              </a>{" "}
              e{" "}
              <a href="/privacidade" className="text-purple-400 hover:underline">
                Politica de Privacidade
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
