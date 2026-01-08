import { useState } from "react";
import { Crown, Lock, Sparkles, Zap, Check, MessageCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type UpgradeFeature =
  | "pages"
  | "products"
  | "components"
  | "ai"
  | "analytics";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature: UpgradeFeature;
  currentPlan?: string;
  currentCount?: number;
  limit?: number;
}

const FEATURE_CONFIG: Record<UpgradeFeature, {
  title: string;
  description: string;
  icon: React.ElementType;
}> = {
  pages: {
    title: "Limite de Paginas",
    description: "Voce atingiu o limite de paginas do seu plano.",
    icon: Lock,
  },
  products: {
    title: "Limite de Produtos",
    description: "Voce atingiu o limite de produtos do seu plano.",
    icon: Lock,
  },
  components: {
    title: "Limite de Componentes",
    description: "Voce atingiu o limite de componentes por pagina.",
    icon: Lock,
  },
  ai: {
    title: "Geracoes com IA",
    description: "Geracoes com IA estao disponiveis nos planos pagos.",
    icon: Sparkles,
  },
  analytics: {
    title: "Analytics Avancado",
    description: "Acesse historico completo de analytics com planos pagos.",
    icon: Zap,
  },
};

const PLANS_DATA = {
  free: {
    id: "free",
    name: "Gratis",
    price: 0,
    features: [
      "1 pagina",
      "3 produtos por pagina",
      "10 componentes por pagina",
      "7 dias de analytics",
      "Branding Bio-Storefront",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 29.90,
    features: [
      "3 paginas",
      "10 produtos por pagina",
      "20 componentes por pagina",
      "1 geracao IA por dia",
      "30 dias de analytics",
      "Sem branding",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 97,
    popular: true,
    features: [
      "10 paginas",
      "Produtos ilimitados",
      "Componentes ilimitados",
      "3 geracoes IA por dia",
      "365 dias de analytics",
      "Sem branding",
      "Dominio proprio",
      "Facebook Pixel",
      "Google Analytics",
    ],
  },
};

interface PlanCardProps {
  plan: typeof PLANS_DATA.free;
  isCurrentPlan: boolean;
  onSelect: () => void;
  loading: boolean;
  recommended?: boolean;
}

function PlanCard({ plan, isCurrentPlan, onSelect, loading, recommended }: PlanCardProps) {
  return (
    <div
      className={`relative rounded-xl p-4 flex flex-col h-full ${
        recommended
          ? "bg-gradient-to-br from-purple-50 to-indigo-50 ring-2 ring-purple-500"
          : isCurrentPlan
          ? "bg-gray-100 ring-2 ring-gray-300"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      {/* Badges */}
      {recommended && !isCurrentPlan && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg whitespace-nowrap">
          <Sparkles className="w-3 h-3" />
          RECOMENDADO
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold bg-gray-500 shadow-lg whitespace-nowrap">
          SEU PLANO
        </div>
      )}

      {/* Plan name */}
      <div className="text-center mb-3 mt-2">
        <h3 className={`font-bold text-lg ${recommended ? "text-purple-700" : "text-gray-700"}`}>
          {plan.name}
        </h3>
      </div>

      {/* Price */}
      <div className="text-center mb-4">
        {plan.price === 0 ? (
          <span className="text-2xl font-bold text-gray-600">Gratis</span>
        ) : (
          <>
            <span className={`text-2xl font-bold ${recommended ? "text-purple-600" : "text-gray-800"}`}>
              R$ {plan.price.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-gray-500 text-sm">/mes</span>
          </>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-4 flex-1">
        {plan.features.slice(0, 5).map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
            <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${recommended ? "text-purple-500" : "text-green-500"}`} />
            <span>{feature}</span>
          </li>
        ))}
        {plan.features.length > 5 && (
          <li className="text-[11px] text-gray-400 pl-5">
            +{plan.features.length - 5} mais...
          </li>
        )}
      </ul>

      {/* CTA */}
      {isCurrentPlan ? (
        <Button
          disabled
          variant="outline"
          className="w-full h-9 text-xs font-semibold rounded-lg"
        >
          Plano Atual
        </Button>
      ) : (
        <Button
          onClick={onSelect}
          disabled={loading || plan.price === 0}
          className={`w-full h-9 text-xs font-semibold rounded-lg ${
            recommended
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              : "bg-gray-800 text-white hover:bg-gray-900"
          }`}
        >
          {loading ? (
            <span className="animate-pulse">Processando...</span>
          ) : plan.price === 0 ? (
            "Atual"
          ) : (
            <>
              <Crown className="w-3.5 h-3.5 mr-1" />
              Assinar
            </>
          )}
        </Button>
      )}
    </div>
  );
}

function ProLimitView({ onClose, feature, currentCount, limit }: {
  onClose: () => void;
  feature: UpgradeFeature;
  currentCount?: number;
  limit?: number;
}) {
  const config = FEATURE_CONFIG[feature];
  const Icon = config.icon;

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Oi! Sou usuario Pro do Bio-Storefront e preciso de um plano personalizado com mais recursos.");
    window.open(`https://wa.me/5519994317797?text=${message}`, "_blank");
  };

  return (
    <div className="text-center py-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
        <Crown className="h-8 w-8 text-white" />
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Voce ja e Pro!
      </h3>

      <p className="text-gray-600 mb-2">
        {config.description}
      </p>

      {currentCount !== undefined && limit !== undefined && (
        <p className="text-sm text-gray-500 mb-4">
          Uso atual: <span className="font-semibold text-gray-700">{currentCount}</span> / {limit}
        </p>
      )}

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-700 mb-1">
          <strong>Precisa de mais?</strong>
        </p>
        <p className="text-xs text-gray-600">
          Entre em contato para um plano personalizado com limites maiores.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 h-10"
        >
          Fechar
        </Button>
        <Button
          onClick={handleWhatsApp}
          className="flex-1 h-10 bg-green-600 hover:bg-green-700 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Falar no WhatsApp
        </Button>
      </div>
    </div>
  );
}

export function UpgradeModal({
  open,
  onClose,
  feature,
  currentPlan = "free",
  currentCount,
  limit,
}: UpgradeModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const config = FEATURE_CONFIG[feature];
  const Icon = config.icon;

  const handleCheckout = async (planId: string) => {
    if (planId === "free") return;

    setLoadingPlan(planId);
    try {
      const response = await fetch("/api/subscriptions/anonymous-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  // Determina quais planos mostrar baseado no plano atual
  const getPlansToShow = () => {
    switch (currentPlan) {
      case "pro":
        return []; // PRO tem layout especial
      case "starter":
        return [PLANS_DATA.starter, PLANS_DATA.pro];
      case "free":
      default:
        return [PLANS_DATA.free, PLANS_DATA.starter, PLANS_DATA.pro];
    }
  };

  const plansToShow = getPlansToShow();
  const isPro = currentPlan === "pro";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`${isPro ? "sm:max-w-md" : "sm:max-w-2xl"} p-0 overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{config.title}</h2>
              <p className="text-white/80 text-sm">{config.description}</p>
            </div>
          </div>
          {currentCount !== undefined && limit !== undefined && !isPro && (
            <div className="mt-3 text-sm text-white/90">
              Uso atual: <span className="font-bold">{currentCount}</span> / {limit}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {isPro ? (
            <ProLimitView
              onClose={onClose}
              feature={feature}
              currentCount={currentCount}
              limit={limit}
            />
          ) : (
            <>
              {/* Plans Grid */}
              <div className={`grid gap-4 mb-6 ${
                plansToShow.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
              }`}>
                {plansToShow.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isCurrentPlan={plan.id === currentPlan}
                    onSelect={() => handleCheckout(plan.id)}
                    loading={loadingPlan === plan.id}
                    recommended={plan.id === "pro"}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="text-center space-y-3">
                <p className="text-xs text-gray-400">
                  Cancele a qualquer momento. Pagamento seguro via Stripe.
                </p>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Continuar com plano atual
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
