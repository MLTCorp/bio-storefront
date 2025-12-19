'use client';

import React from 'react';
import { motion, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignInButton } from '@clerk/clerk-react';

const menuItems = [
  { name: 'Recursos', href: '#recursos' },
  { name: 'Precos', href: '#precos' },
  { name: 'Como Funciona', href: '#como-funciona' },
  { name: 'FAQ', href: '#faq' },
];

// Logo component with gradient
const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* B icon with gradient */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
        style={{
          background: 'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
        }}
      >
        b
      </div>
      <span className="text-xl font-semibold tracking-tight">
        <span className="text-[#7F4AFF]">Bio</span>
        <span className="text-black">Landing</span>
      </span>
    </div>
  );
};

export function Navbar() {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrolled(latest > 0.02);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuState(false);
  };

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className={cn(
          'group fixed z-50 w-full border-b border-transparent transition-all duration-300',
          scrolled && 'bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-sm'
        )}
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Logo */}
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <a href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  className={cn(
                    'm-auto size-6 duration-200',
                    menuState && 'rotate-180 scale-0 opacity-0'
                  )}
                />
                <X
                  className={cn(
                    'absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200',
                    menuState && 'rotate-0 scale-100 opacity-100'
                  )}
                />
              </button>

              {/* Desktop menu */}
              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => scrollToSection(item.href)}
                        className="text-gray-600 hover:text-[#7F4AFF] block duration-200 font-medium"
                      >
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Auth buttons */}
            <div
              className={cn(
                'bg-white lg:bg-transparent mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-gray-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-4 lg:space-y-0 lg:border-transparent lg:p-0 lg:shadow-none',
                menuState && 'block'
              )}
            >
              {/* Mobile menu items */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => scrollToSection(item.href)}
                        className="text-gray-600 hover:text-[#7F4AFF] block duration-200"
                      >
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm" className="rounded-xl border-gray-200">
                    <span>Login</span>
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    className="rounded-xl text-white"
                    style={{
                      background:
                        'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
                    }}
                  >
                    <span>Criar Conta</span>
                  </Button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
