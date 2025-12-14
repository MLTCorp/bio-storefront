import { motion } from "framer-motion";
import { UserPlus, Paintbrush, Share2, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Crie sua conta",
    description: "Cadastre-se gratuitamente em segundos usando seu Google ou email.",
    color: "from-pink-500 to-rose-500",
  },
  {
    number: "02",
    icon: Paintbrush,
    title: "Personalize sua loja",
    description: "Adicione seus produtos, links sociais e customize as cores da sua marca.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    number: "03",
    icon: Share2,
    title: "Compartilhe seu link",
    description: "Cole seu link na bio do Instagram e comece a vender para seus seguidores.",
    color: "from-green-500 to-emerald-500",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 px-4 bg-gradient-to-b from-white to-pink-50/50 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            Como Funciona
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Três passos para sua{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              loja online
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            De zero a vendendo em menos de 5 minutos. Sem conhecimento técnico necessário.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-200 via-purple-200 to-green-200 -translate-y-1/2 z-0" />

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg shadow-pink-100/50 border border-gray-100 h-full relative group hover:shadow-xl transition-shadow duration-300">
                  {/* Step Number Badge */}
                  <div className={`absolute -top-4 left-8 px-4 py-1 rounded-full bg-gradient-to-r ${step.color} text-white text-sm font-bold shadow-lg`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>

                  {/* Arrow for non-last items on large screens */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md items-center justify-center z-20"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4 text-pink-500" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
