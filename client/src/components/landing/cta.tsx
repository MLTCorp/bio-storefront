import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "100% Gratuito para começar",
  "Sem taxa de adesão",
  "Suporte via WhatsApp",
  "Personalizações ilimitadas",
];

export function CTASection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-pink-600 to-purple-700" />

      {/* Animated shapes */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Comece agora, é grátis!</span>
          </motion.div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto para transformar sua{" "}
            <span className="text-pink-200">bio em vendas</span>?
          </h2>

          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empreendedores que já estão vendendo mais com Bio Storefront.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Check className="w-4 h-4 text-green-300" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="h-16 px-10 text-lg font-bold gap-3 bg-white text-pink-600 hover:bg-pink-50 shadow-2xl shadow-black/20 hover:scale-105 transition-transform"
            >
              Criar Minha Loja Grátis
              <ArrowRight className="w-5 h-5" />
            </Button>
          </SignInButton>

          <p className="mt-4 text-white/60 text-sm">
            Nenhum cartão de crédito necessário
          </p>
        </motion.div>
      </div>
    </section>
  );
}
