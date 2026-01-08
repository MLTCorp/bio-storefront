'use client';

const footerLinks = {
  produto: [
    { name: 'Recursos', href: '#recursos' },
    { name: 'Precos', href: '#precos' },
    { name: 'FAQ', href: '#faq' },
  ],
};

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
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Logo and description */}
          <div>
            <Logo />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-sm">
              A plataforma mais simples para criadores criarem seu site de links na bio e venderem
              mais.
            </p>

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

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} BioLanding. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-gray-500 text-sm">
                Feito com <span className="text-red-500">&#10084;</span> no Brasil
              </p>
              <span className="text-gray-600">|</span>
              <a
                href="https://sincronia.digital"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Desenvolvido por sincronia.digital
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
