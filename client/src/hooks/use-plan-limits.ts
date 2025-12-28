import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";

export interface PlanLimits {
  pages: number;
  products: number;
  components_per_page: number;
  ai_generations_per_day: number;
  analytics_days: number;
  show_branding: boolean;
}

export interface PlanInfo {
  plan: string;
  limits: PlanLimits;
  subscription?: {
    status: string;
    current_period_end: string;
  };
}

const FREE_LIMITS: PlanLimits = {
  pages: 1,
  products: 3,
  components_per_page: 10,
  ai_generations_per_day: 0,
  analytics_days: 7,
  show_branding: true,
};

export function usePlanLimits() {
  const { isSignedIn, user } = useUser();

  const { data, isLoading, error } = useQuery<PlanInfo>({
    queryKey: ["plan-limits", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const response = await fetch("/api/subscriptions/current", {
        headers: {
          "x-clerk-user-id": user.id,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch plan limits");
      }
      return response.json();
    },
    enabled: isSignedIn && !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const limits = data?.limits || FREE_LIMITS;
  const plan = data?.plan || "free";

  return {
    plan,
    limits,
    isLoading,
    error,

    // Helper functions
    canCreatePage: (currentCount: number) =>
      limits.pages === -1 || currentCount < limits.pages,

    canAddProduct: (currentCount: number) =>
      limits.products === -1 || currentCount < limits.products,

    canAddComponent: (currentCount: number) =>
      limits.components_per_page === -1 || currentCount < limits.components_per_page,

    canUseAI: limits.ai_generations_per_day > 0,

    showBranding: limits.show_branding,

    // Get limit display value
    getLimitDisplay: (limitKey: keyof PlanLimits) => {
      const value = limits[limitKey];
      if (typeof value === "boolean") return value ? "Sim" : "Nao";
      return value === -1 ? "Ilimitado" : String(value);
    },

    // Check if user is on free plan
    isFree: plan === "free",
    isStarter: plan === "starter",
    isPro: plan === "pro",
  };
}
