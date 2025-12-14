import { useUser, SignInButton } from "@clerk/clerk-react";
import { Redirect } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Store, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundEffect } from "@/components/background-effect";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading while Clerk loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect logged-in users to dashboard
  if (isSignedIn) {
    return <Redirect to="/dashboard" />;
  }

  // Landing page for non-logged-in users
  return (
    <div className="min-h-screen pb-12 transition-colors duration-500 relative">
      <BackgroundEffect />

      <motion.main
        className="max-w-[480px] mx-auto min-h-screen bg-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] px-6 py-12 md:my-8 md:rounded-[32px] md:min-h-[calc(100vh-4rem)] md:border border-white/50 backdrop-blur-2xl relative overflow-hidden ring-1 ring-white/60"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo/Brand */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-lg">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bio Storefront</h1>
          <p className="text-muted-foreground">Crie sua loja digital em minutos</p>
        </motion.div>

        {/* Features */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Rápido e Fácil</h3>
              <p className="text-sm text-muted-foreground">Configure sua loja em poucos cliques</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Design Profissional</h3>
              <p className="text-sm text-muted-foreground">Templates modernos e responsivos</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Produtos & Links</h3>
              <p className="text-sm text-muted-foreground">Mostre seus produtos e redes sociais</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <SignInButton mode="modal">
            <Button className="w-full h-12 text-lg font-semibold gap-2" size="lg">
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </Button>
          </SignInButton>

          <p className="text-center text-xs text-muted-foreground">
            Já tem uma conta?{" "}
            <SignInButton mode="modal">
              <button className="text-primary hover:underline font-medium">
                Fazer login
              </button>
            </SignInButton>
          </p>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-muted-foreground">
            © 2025 Bio Storefront. Todos os direitos reservados.
          </p>
        </motion.footer>
      </motion.main>
    </div>
  );
}
