import { motion } from "framer-motion";
import { Zap, Palette, ShoppingBag, MessageCircle, CreditCard, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Rápido e Fácil",
    description: "Configure sua loja em menos de 5 minutos. Sem código, sem complicação.",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50",
  },
  {
    icon: Palette,
    title: "Design Profissional",
    description: "Templates modernos e responsivos que deixam sua marca com cara de premium.",
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: ShoppingBag,
    title: "Vitrine de Produtos",
    description: "Mostre seus produtos com fotos, preços e descrições de forma organizada.",
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Integrado",
    description: "Receba pedidos direto no WhatsApp com mensagem personalizada.",
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
  },
  {
    icon: CreditCard,
    title: "Pagamentos Online",
    description: "Aceite PIX, cartões e boleto com integração segura via Stripe.",
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: BarChart3,
    title: "Análise de Cliques",
    description: "Acompanhe quantas pessoas visitam sua loja e clicam nos produtos.",
    color: "from-cyan-400 to-teal-500",
    bgColor: "bg-cyan-50",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-sm font-medium mb-4">
            Recursos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo que você precisa para{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              vender mais
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Ferramentas profissionais para transformar seu link da bio em uma máquina de vendas.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
