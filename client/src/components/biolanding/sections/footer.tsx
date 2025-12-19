'use client';

import { Instagram, Twitter, Youtube, Mail } from 'lucide-react';

const footerLinks = {
  produto: [
    { name: 'Recursos', href: '#recursos' },
    { name: 'Precos', href: '#precos' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Integracoes', href: '#' },
  ],
  empresa: [
    { name: 'Sobre', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contato', href: '#' },
    { name: 'Carreiras', href: '#' },
  ],
  legal: [
    { name: 'Privacidade', href: '#' },
    { name: 'Termos', href: '#' },
    { name: 'Cookies', href: '#' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Mail, href: '#', label: 'Email' },
];

// Logo component
const Logo = () => (
  <div className="flex items-center gap-2">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
      style={{
        background: 'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
      }}
    >
      b
    </div>
    <span className="text-xl font-semibold tracking-tight text-white">
      BioLanding
    </span>
  </div>
);

export function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-[#111111] text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-sm">
              A plataforma mais simples para criadores criarem seu site de links na bio e venderem
              mais.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} BioLanding. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm">
              Feito com <span className="text-red-500">&#10084;</span> no Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
