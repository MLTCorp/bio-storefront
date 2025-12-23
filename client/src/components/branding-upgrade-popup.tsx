import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Crown, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrandingUpgradePopupProps {
  open: boolean;
  onClose: () => void;
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "R$ 29,90",
    period: "/mes",
    description: "Para comecar",
    features: [
      "3 paginas",
      "Sem branding",
      "1 imagem IA/dia",
      "Analytics 30 dias",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 97",
    period: "/mes",
    description: "Mais vendido",
    features: [
      "10 paginas",
      "Sem branding",
      "Muito mais IA",
      "Analytics 1 ano",
      "Dominio proprio",
      "Pixel e Google Analytics",
    ],
    popular: true,
  },
];

export function BrandingUpgradePopup({ open, onClose }: BrandingUpgradePopupProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
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

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-lg sm:bottom-8 z-[101] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-lg">Muito mais IA!</span>
              </div>
              <p className="text-white/80 text-sm">
                Crie imagens incriveis com inteligencia artificial
              </p>
            </div>

            {/* Plans */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-xl p-4 ${
                    plan.popular
                      ? "bg-gradient-to-br from-purple-50 to-indigo-50 ring-2 ring-purple-500"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      RECOMENDADO
                    </div>
                  )}

                  {/* Plan name */}
                  <div className="text-center mb-3 mt-1">
                    <h3 className={`font-bold ${plan.popular ? "text-purple-700" : "text-gray-700"}`}>
                      {plan.name}
                    </h3>
                    <p className="text-xs text-gray-500">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-3">
                    <span className={`text-2xl font-bold ${plan.popular ? "text-purple-600" : "text-gray-800"}`}>
                      {plan.price}
                    </span>
                    <span className="text-gray-500 text-xs">{plan.period}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                        <Check className={`w-3 h-3 flex-shrink-0 ${plan.popular ? "text-purple-500" : "text-green-500"}`} />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-[10px] text-gray-400 pl-4">
                        +{plan.features.length - 4} mais...
                      </li>
                    )}
                  </ul>

                  {/* CTA */}
                  <Button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={loadingPlan === plan.id}
                    className={`w-full h-9 text-xs font-semibold rounded-lg ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      "..."
                    ) : plan.popular ? (
                      <>
                        <Zap className="w-3 h-3 mr-1" />
                        Assinar Pro
                      </>
                    ) : (
                      "Assinar"
                    )}
                  </Button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 text-center">
              <p className="text-[10px] text-gray-400">
                Cancele a qualquer momento. Pagamento seguro via Stripe.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
