import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfigProvider } from "@/lib/store";
import Home from "@/pages/home";
import AdminPage from "@/pages/admin";
import PageAdminPage from "@/pages/page-admin";
import NotFound from "@/pages/not-found";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";
import CheckoutSuccessPage from "@/pages/checkout-success";
import CheckoutCancelPage from "@/pages/checkout-cancel";
import ProdutoPage from "@/pages/produto";
import OnboardingPage from "@/pages/onboarding";
import DashboardPage from "@/pages/dashboard";
import PagesListPage from "@/pages/pages-list";
import PageEditorPage from "@/pages/page-editor";
import AnalyticsPage from "@/pages/analytics";
import StorePage from "@/pages/store";
import SetupAccountPage from "@/pages/setup-account";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/config" component={AdminPage} />
      <Route path="/page-admin" component={PageAdminPage} />
      <Route path="/dashboard" component={PagesListPage} />
      <Route path="/dashboard/:pageId" component={PageEditorPage} />
      <Route path="/dashboard-old" component={DashboardPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/produto/:id" component={ProdutoPage} />
      <Route path="/sign-in" component={SignInPage} />
      <Route path="/sign-up" component={SignUpPage} />
      <Route path="/checkout/success" component={CheckoutSuccessPage} />
      <Route path="/checkout/cancel" component={CheckoutCancelPage} />
      <Route path="/analytics/:pageId" component={AnalyticsPage} />
      <Route path="/setup-account" component={SetupAccountPage} />
      <Route path="/:username" component={StorePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;