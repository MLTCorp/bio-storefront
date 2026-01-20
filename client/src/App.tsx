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
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import CheckoutSuccessPage from "@/pages/checkout-success";
import CheckoutCancelPage from "@/pages/checkout-cancel";
import ProdutoPage from "@/pages/produto";
import OnboardingPage from "@/pages/onboarding";
import DashboardPage from "@/pages/dashboard";
import PagesListPage from "@/pages/pages-list";
import PageEditorPage from "@/pages/page-editor";
import AnalyticsPage from "@/pages/analytics";
import SalesPage from "@/pages/sales";
import StorePage from "@/pages/store";
import SetupAccountPage from "@/pages/setup-account";

// Landing pages segmentadas por ICP
import InfluenciadoresPage from "@/pages/solucoes/influenciadores";
import EmpreendedoresPage from "@/pages/solucoes/empreendedores";
import ConsultoresPage from "@/pages/solucoes/consultores";
import CriativosPage from "@/pages/solucoes/criativos";

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
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      {/* Legacy routes redirect */}
      <Route path="/sign-in" component={LoginPage} />
      <Route path="/sign-up" component={SignupPage} />
      <Route path="/checkout/success" component={CheckoutSuccessPage} />
      <Route path="/checkout/cancel" component={CheckoutCancelPage} />
      <Route path="/analytics/:pageId" component={AnalyticsPage} />
      <Route path="/sales/:pageId" component={SalesPage} />
      <Route path="/setup-account" component={SetupAccountPage} />
      {/* Landing pages segmentadas por ICP - SEO */}
      <Route path="/para/influenciadores" component={InfluenciadoresPage} />
      <Route path="/para/empreendedores" component={EmpreendedoresPage} />
      <Route path="/para/consultores" component={ConsultoresPage} />
      <Route path="/para/criativos" component={CriativosPage} />
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
