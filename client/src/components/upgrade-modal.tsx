import { useLocation } from "wouter";
import { Crown, Lock, Sparkles, Zap } from "lucide-react";
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
  starterHas: boolean;
  proHas: boolean;
}> = {
  pages: {
    title: "Limite de Paginas",
    description: "Voce atingiu o limite de paginas do seu plano. Faca upgrade para criar mais paginas.",
    icon: Lock,
    starterHas: true, // 3 pages
    proHas: true, // 10 pages
  },
  products: {
    title: "Limite de Produtos",
    description: "Voce atingiu o limite de produtos do seu plano. Faca upgrade para adicionar mais produtos.",
    icon: Lock,
    starterHas: true, // 10 products
    proHas: true, // unlimited
  },
  components: {
    title: "Limite de Componentes",
    description: "Voce atingiu o limite de componentes por pagina. Faca upgrade para adicionar mais componentes.",
    icon: Lock,
    starterHas: true, // 20 components
    proHas: true, // unlimited
  },
  ai: {
    title: "Geracoes com IA",
    description: "Geracoes com IA estao disponiveis apenas nos planos pagos. Faca upgrade para usar a IA.",
    icon: Sparkles,
    starterHas: true, // 1/day
    proHas: true, // 3/day
  },
  analytics: {
    title: "Analytics Avancado",
    description: "Acesse historico completo de analytics com planos pagos.",
    icon: Zap,
    starterHas: true, // 30 days
    proHas: true, // 365 days
  },
};

const PLAN_BENEFITS = {
  starter: [
    "3 paginas",
    "10 produtos por pagina",
    "20 componentes por pagina",
    "1 geracao IA por dia",
    "30 dias de analytics",
    "Sem branding",
  ],
  pro: [
    "10 paginas",
    "Produtos ilimitados",
    "Componentes ilimitados",
    "3 geracoes IA por dia",
    "365 dias de analytics",
    "Sem branding",
  ],
};

export function UpgradeModal({
  open,
  onClose,
  feature,
  currentPlan = "free",
  currentCount,
  limit,
}: UpgradeModalProps) {
  const [, navigate] = useLocation();
  const config = FEATURE_CONFIG[feature];
  const Icon = config.icon;

  const handleUpgrade = () => {
    onClose();
    navigate("/#precos");
  };

  const recommendedPlan = currentPlan === "starter" ? "pro" : "starter";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
            <Icon className="h-6 w-6 text-purple-500" />
          </div>
          <DialogTitle className="text-center">{config.title}</DialogTitle>
          <DialogDescription className="text-center">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {currentCount !== undefined && limit !== undefined && (
          <div className="text-center text-sm text-muted-foreground mb-4">
            Uso atual: <span className="font-semibold text-foreground">{currentCount}</span> / {limit}
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold">
              Plano {recommendedPlan === "starter" ? "Starter" : "Pro"}
            </span>
          </div>
          <ul className="space-y-2">
            {PLAN_BENEFITS[recommendedPlan].map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleUpgrade} className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Crown className="h-4 w-4 mr-2" />
            Ver Planos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
