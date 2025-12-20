'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { BlurFade } from '../ui/blur-fade';

const faqs = [
  {
    question: 'Preciso saber programar para usar o BioLanding?',
    answer:
      'Nao! O BioLanding foi criado para ser super simples. Voce consegue criar sua pagina em minutos usando nossa interface de arrastar e soltar, sem nenhum conhecimento tecnico.',
  },
  {
    question: 'Como funciona o pagamento?',
    answer:
      'Integramos com PIX, cartao de credito e boleto atraves do Stripe e Mercado Pago. Voce recebe os pagamentos diretamente na sua conta, sem intermediarios.',
  },
  {
    question: 'Posso usar meu proprio dominio?',
    answer:
      'Sim! No plano Pro voce pode conectar seu dominio personalizado (ex: links.seusite.com.br) para ter uma URL mais profissional.',
  },
  {
    question: 'O plano gratuito tem alguma limitacao?',
    answer:
      'O plano gratuito permite 1 pagina com ate 5 produtos, integracao com WhatsApp e temas basicos. E perfeito para comecar e testar a plataforma.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer:
      'Sim! Voce pode cancelar sua assinatura a qualquer momento, sem multas ou taxas. Seu acesso continua ate o fim do periodo pago.',
  },
  {
    question: 'Tem suporte em portugues?',
    answer:
      'Com certeza! Somos uma empresa brasileira e todo nosso suporte e em portugues. Respondemos via WhatsApp e email em ate 24 horas.',
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ question, answer, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <motion.div
      className="border-b border-gray-200 last:border-b-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={onToggle}
        className="w-full py-4 sm:py-6 flex items-center justify-between text-left group"
      >
        <span className="text-base sm:text-lg font-medium text-black group-hover:text-[#7F4AFF] transition-colors pr-4 sm:pr-8">
          {question}
        </span>
        <motion.div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            background: isOpen ? '#7F4AFF' : '#F3F4F6',
          }}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          ) : (
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
          )}
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 sm:pb-6 text-sm sm:text-base text-gray-500 leading-relaxed pr-8 sm:pr-16">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <BlurFade inView className="text-center mb-8 sm:mb-12">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4"
            style={{
              background: 'rgba(127, 74, 255, 0.1)',
              color: '#7F4AFF',
            }}
          >
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            Perguntas{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #7F4AFF 0%, #B090FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              frequentes
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500">
            Tudo que voce precisa saber sobre o BioLanding.
          </p>
        </BlurFade>

        {/* FAQ Items */}
        <div className="bg-white rounded-2xl">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
