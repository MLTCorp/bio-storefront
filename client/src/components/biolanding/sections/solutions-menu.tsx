'use client';

import React from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Menu data structure
const solutionsData = {
  porProfissao: {
    title: 'POR PROFISSAO',
    items: [
      {
        name: 'Influenciadores Digitais',
        href: '/para/influenciadores',
        description: 'Monetize sua audiencia',
      },
      {
        name: 'Empreendedoras',
        href: '/para/empreendedores',
        description: 'Venda pelo Instagram',
      },
      {
        name: 'Consultores e Coaches',
        href: '/para/consultores',
        description: 'Agende clientes online',
      },
      {
        name: 'Profissionais Criativos',
        href: '/para/criativos',
        description: 'Portfolio que converte',
      },
    ],
  },
  porCasoDeUso: {
    title: 'POR CASO DE USO',
    items: [
      {
        name: 'Link na Bio',
        href: '/para/influenciadores',
        description: 'Centralize seus links',
      },
      {
        name: 'Catalogo de Produtos',
        href: '/para/empreendedores',
        description: 'Vitrine virtual completa',
      },
      {
        name: 'Agendamento',
        href: '/para/consultores',
        description: 'Integre com Calendly',
      },
      {
        name: 'Portfolio Digital',
        href: '/para/criativos',
        description: 'Mostre seu trabalho',
      },
    ],
  },
  recursos: {
    title: 'RECURSOS',
    items: [
      {
        name: 'Construtor de Paginas',
        href: '/#recursos',
        description: 'Arrastar e soltar',
      },
      {
        name: 'Analytics Avancado',
        href: '/#recursos',
        description: 'Metricas detalhadas',
      },
      {
        name: 'Dominio Personalizado',
        href: '/#precos',
        description: 'Sua marca, seu dominio',
      },
    ],
  },
};

interface SolutionsMenuProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function SolutionsMenu({ isMobile = false, onClose }: SolutionsMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {solutionsData.porProfissao.title}
        </div>
        {solutionsData.porProfissao.items.map((item) => (
          <Link key={item.href} href={item.href} onClick={handleLinkClick}>
            <span className="block text-gray-600 hover:text-[#7F4AFF] duration-200">
              {item.name}
            </span>
          </Link>
        ))}

        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-4">
          {solutionsData.porCasoDeUso.title}
        </div>
        {solutionsData.porCasoDeUso.items.map((item) => (
          <Link key={item.href + item.name} href={item.href} onClick={handleLinkClick}>
            <span className="block text-gray-600 hover:text-[#7F4AFF] duration-200">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-1 text-gray-600 hover:text-[#7F4AFF] duration-200 font-medium text-sm',
          isOpen && 'text-[#7F4AFF]'
        )}
      >
        <span>Solucoes</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 min-w-[700px]">
              <div className="grid grid-cols-3 gap-8">
                {/* Por Profissao */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    {solutionsData.porProfissao.title}
                  </h3>
                  <ul className="space-y-3">
                    {solutionsData.porProfissao.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={handleLinkClick}>
                          <span className="group block">
                            <span className="text-gray-900 font-medium group-hover:text-[#7F4AFF] transition-colors">
                              {item.name}
                            </span>
                            <span className="block text-sm text-gray-500">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Por Caso de Uso */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    {solutionsData.porCasoDeUso.title}
                  </h3>
                  <ul className="space-y-3">
                    {solutionsData.porCasoDeUso.items.map((item) => (
                      <li key={item.href + item.name}>
                        <Link href={item.href} onClick={handleLinkClick}>
                          <span className="group block">
                            <span className="text-gray-900 font-medium group-hover:text-[#7F4AFF] transition-colors">
                              {item.name}
                            </span>
                            <span className="block text-sm text-gray-500">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recursos */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    {solutionsData.recursos.title}
                  </h3>
                  <ul className="space-y-3">
                    {solutionsData.recursos.items.map((item) => (
                      <li key={item.href + item.name}>
                        <Link href={item.href} onClick={handleLinkClick}>
                          <span className="group block">
                            <span className="text-gray-900 font-medium group-hover:text-[#7F4AFF] transition-colors">
                              {item.name}
                            </span>
                            <span className="block text-sm text-gray-500">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Banner */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link href="/signup" onClick={handleLinkClick}>
                  <span className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-colors">
                    <div>
                      <span className="font-semibold text-gray-900">
                        Comece gratis agora
                      </span>
                      <span className="block text-sm text-gray-600">
                        Crie sua pagina em menos de 5 minutos
                      </span>
                    </div>
                    <span
                      className="px-4 py-2 rounded-xl text-white text-sm font-medium"
                      style={{
                        background:
                          'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
                      }}
                    >
                      Criar Conta
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
