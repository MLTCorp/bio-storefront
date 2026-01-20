// Conteudo centralizado para landing pages segmentadas por ICP

export interface ICPFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ICPTestimonial {
  name: string;
  role: string;
  image?: string;
  quote: string;
}

export interface ICPContent {
  slug: string;
  name: string;
  heroTag: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroDescription: string;
  ctaText: string;
  ctaSubtext: string;
  features: ICPFeature[];
  useCases: string[];
  testimonials: ICPTestimonial[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const icpContent: Record<string, ICPContent> = {
  influenciadores: {
    slug: 'influenciadores',
    name: 'Influenciadores Digitais',
    heroTag: 'Para Criadores de Conteudo',
    heroTitle: 'Transforme seus seguidores',
    heroHighlight: 'em clientes.',
    heroSubtitle: 'Link na bio profissional para monetizar sua audiencia',
    heroDescription:
      'Seus seguidores ja confiam em voce. Agora de a eles um lugar para comprar, agendar e interagir com tudo que voce oferece.',
    ctaText: 'Comece Gratis',
    ctaSubtext: 'Sem necessidade de cartao de credito',
    features: [
      {
        icon: 'BarChart3',
        title: 'Analytics Detalhado',
        description:
          'Saiba exatamente quantos cliques cada link recebe, de onde vem seu trafego e quais conteudos convertem mais.',
      },
      {
        icon: 'Smartphone',
        title: 'Design Mobile-First',
        description:
          'Sua pagina fica perfeita em qualquer celular. Afinal, 95% dos seus seguidores acessam pelo Stories.',
      },
      {
        icon: 'Zap',
        title: 'PIX Integrado',
        description:
          'Receba pagamentos instantaneos. Venda ebooks, mentorias, presets - tudo direto pelo seu link na bio.',
      },
      {
        icon: 'Palette',
        title: 'Personalizacao Total',
        description:
          'Combine com sua identidade visual. Cores, fontes e estilos que refletem sua marca pessoal.',
      },
      {
        icon: 'Link',
        title: 'Links Ilimitados',
        description:
          'YouTube, TikTok, loja, WhatsApp, podcast - todos os seus links em um so lugar.',
      },
      {
        icon: 'Shield',
        title: 'Dominio Personalizado',
        description:
          'Use seu proprio dominio para parecer ainda mais profissional. seunome.com ao inves de bio.link/seunome.',
      },
    ],
    useCases: [
      'Divulgar links de afiliados',
      'Vender cursos e ebooks',
      'Promover lives e eventos',
      'Direcionar para WhatsApp Business',
      'Mostrar parceiros e collabs',
    ],
    testimonials: [
      {
        name: 'Marina Santos',
        role: 'Influenciadora de Lifestyle - 250k seguidores',
        quote:
          'Antes eu perdia vendas porque nao tinha onde colocar todos os meus links. Agora meus seguidores encontram tudo facilmente.',
      },
      {
        name: 'Pedro Alves',
        role: 'Creator de Fitness - 180k seguidores',
        quote:
          'O analytics me mostrou que 70% dos cliques vem do Instagram. Isso mudou minha estrategia de conteudo completamente.',
      },
    ],
    seo: {
      title: 'Link na Bio para Influenciadores | BioLanding',
      description:
        'Crie sua pagina de link na bio profissional. Monetize sua audiencia com analytics detalhado, PIX integrado e design personalizado.',
      keywords: [
        'link na bio',
        'influenciador digital',
        'monetizar instagram',
        'linktree alternativa',
        'pagina de links',
      ],
    },
  },

  empreendedores: {
    slug: 'empreendedores',
    name: 'Empreendedoras e Vendedoras',
    heroTag: 'Para Quem Vende Online',
    heroTitle: 'Sua loja virtual',
    heroHighlight: 'direto do Instagram.',
    heroSubtitle: 'Catalogo completo com pagamento integrado',
    heroDescription:
      'Transforme seu perfil em uma vitrine profissional. Mostre produtos, receba pedidos e feche vendas sem sair do Instagram.',
    ctaText: 'Criar Minha Loja',
    ctaSubtext: 'Comece a vender em 5 minutos',
    features: [
      {
        icon: 'ShoppingBag',
        title: 'Catalogo de Produtos',
        description:
          'Adicione fotos, descricoes e precos. Seus clientes navegam e escolhem direto pelo link na bio.',
      },
      {
        icon: 'CreditCard',
        title: 'PIX e Cartao',
        description:
          'Receba pagamentos na hora. PIX instantaneo ou parcelamento no cartao - voce escolhe.',
      },
      {
        icon: 'MessageCircle',
        title: 'WhatsApp Direto',
        description:
          'Cliente clicou no produto? Vai direto pro seu WhatsApp com a mensagem pronta para fechar a venda.',
      },
      {
        icon: 'Package',
        title: 'Gestao de Pedidos',
        description:
          'Acompanhe todas as vendas em um so lugar. Saiba o que esta vendendo mais e quando repor estoque.',
      },
      {
        icon: 'Percent',
        title: 'Cupons de Desconto',
        description:
          'Crie promocoes e cupons exclusivos. Incentive a primeira compra ou premie clientes fieis.',
      },
      {
        icon: 'TrendingUp',
        title: 'Relatorios de Vendas',
        description:
          'Veja quanto vendeu por dia, semana ou mes. Identifique seus produtos campeoes.',
      },
    ],
    useCases: [
      'Vender roupas e acessorios',
      'Loja de cosmeticos e skincare',
      'Produtos artesanais e personalizados',
      'Revenda de produtos',
      'Lancamentos e pre-vendas',
    ],
    testimonials: [
      {
        name: 'Carla Mendes',
        role: 'Loja de Acessorios - @carlaacessorios',
        quote:
          'Tripliquei minhas vendas no primeiro mes. Agora minhas clientes conseguem ver todos os produtos e ja mandam mensagem sabendo o que querem.',
      },
      {
        name: 'Juliana Costa',
        role: 'Confeitaria Artesanal - @jubolos',
        quote:
          'Antes eu passava horas respondendo "quanto custa?". Agora ta tudo la no catalogo e as clientes ja chegam prontas pra encomendar.',
      },
    ],
    seo: {
      title: 'Loja Virtual no Instagram | Catalogo de Produtos | BioLanding',
      description:
        'Crie seu catalogo de produtos e venda pelo Instagram. Pagamento por PIX e cartao, WhatsApp integrado e gestao de pedidos.',
      keywords: [
        'loja instagram',
        'catalogo produtos',
        'vender pelo instagram',
        'link na bio loja',
        'e-commerce instagram',
      ],
    },
  },

  consultores: {
    slug: 'consultores',
    name: 'Consultores e Coaches',
    heroTag: 'Para Profissionais de Servicos',
    heroTitle: 'Agende clientes',
    heroHighlight: 'no piloto automatico.',
    heroSubtitle: 'Integracao com Calendly e pagina profissional',
    heroDescription:
      'Pare de trocar mensagens para agendar. Seus clientes escolhem o horario, voce recebe a notificacao e foca no que importa: atender.',
    ctaText: 'Comecar Agora',
    ctaSubtext: 'Configure em menos de 10 minutos',
    features: [
      {
        icon: 'Calendar',
        title: 'Agendamento Online',
        description:
          'Integre com Calendly ou Google Calendar. Seus clientes marcam direto, sem vai-e-vem de mensagens.',
      },
      {
        icon: 'Star',
        title: 'Depoimentos em Destaque',
        description:
          'Mostre o que seus clientes falam sobre voce. Prova social que converte visitantes em clientes.',
      },
      {
        icon: 'Award',
        title: 'Credenciais e Certificacoes',
        description:
          'Exiba suas formacoes, certificados e experiencia. Construa credibilidade antes do primeiro contato.',
      },
      {
        icon: 'Video',
        title: 'Video de Apresentacao',
        description:
          'Adicione um video seu explicando como voce trabalha. Crie conexao antes mesmo da primeira sessao.',
      },
      {
        icon: 'FileText',
        title: 'Servicos e Pacotes',
        description:
          'Liste seus servicos com precos e descricoes claras. Facilite a decisao do cliente.',
      },
      {
        icon: 'MapPin',
        title: 'Localizacao',
        description:
          'Atende presencial? Mostre seu endereco com mapa integrado. Online? Destaque que atende todo Brasil.',
      },
    ],
    useCases: [
      'Coaching de carreira e vida',
      'Consultoria de negocios',
      'Psicologia e terapia',
      'Nutricao e personal trainer',
      'Mentoria e cursos',
    ],
    testimonials: [
      {
        name: 'Dr. Ricardo Lima',
        role: 'Coach Executivo - 15 anos de experiencia',
        quote:
          'Minha agenda agora se preenche sozinha. Os clientes ja chegam sabendo meus horarios disponiveis e valores.',
      },
      {
        name: 'Ana Paula Ferreira',
        role: 'Psicologa Clinica - CRP 06/12345',
        quote:
          'A pagina profissional me ajudou a transmitir seriedade. Meus pacientes dizem que ja se sentiram acolhidos so de ver meu perfil.',
      },
    ],
    seo: {
      title: 'Pagina Profissional para Consultores e Coaches | BioLanding',
      description:
        'Crie sua pagina profissional com agendamento online, depoimentos e credenciais. Ideal para coaches, consultores e terapeutas.',
      keywords: [
        'pagina profissional',
        'agendamento online',
        'coach',
        'consultor',
        'terapeuta',
        'calendly',
      ],
    },
  },

  criativos: {
    slug: 'criativos',
    name: 'Profissionais Criativos',
    heroTag: 'Para Artistas e Criadores',
    heroTitle: 'Seu portfolio',
    heroHighlight: 'que converte.',
    heroSubtitle: 'Mostre seu trabalho e feche contratos',
    heroDescription:
      'Seus projetos merecem ser vistos. Crie um portfolio impressionante que transforma visitantes em clientes pagantes.',
    ctaText: 'Criar Portfolio',
    ctaSubtext: 'Mostre seu talento ao mundo',
    features: [
      {
        icon: 'Image',
        title: 'Galeria de Projetos',
        description:
          'Exiba seus melhores trabalhos em uma galeria elegante. Fotos, videos, antes/depois - do seu jeito.',
      },
      {
        icon: 'Briefcase',
        title: 'Servicos e Precos',
        description:
          'Liste seus servicos com valores claros. Evite clientes que nao tem orcamento para seu trabalho.',
      },
      {
        icon: 'Send',
        title: 'Contato Direto',
        description:
          'Formulario de contato ou WhatsApp. O cliente interessado fala com voce na hora.',
      },
      {
        icon: 'Instagram',
        title: 'Redes Integradas',
        description:
          'Conecte Instagram, Behance, Dribbble, Pinterest. Todos os seus perfis em um so lugar.',
      },
      {
        icon: 'Clock',
        title: 'Disponibilidade',
        description:
          'Mostre quando esta disponivel para novos projetos. Evite perder tempo com propostas quando esta ocupado.',
      },
      {
        icon: 'Globe',
        title: 'SEO Otimizado',
        description:
          'Sua pagina aparece no Google quando clientes buscam por servicos como o seu na sua cidade.',
      },
    ],
    useCases: [
      'Fotografia e video',
      'Design grafico e web',
      'Tatuagem e body art',
      'Arquitetura e interiores',
      'Musica e producao',
    ],
    testimonials: [
      {
        name: 'Fernanda Reis',
        role: 'Fotografa de Casamentos',
        quote:
          'Meu portfolio antigo era complicado demais. Agora os noivos veem meus trabalhos, precos e ja mandam mensagem para fechar.',
      },
      {
        name: 'Lucas Tavares',
        role: 'Tatuador - @lucastattoo',
        quote:
          'Consigo mostrar meu trabalho de um jeito profissional. Os clientes ja chegam sabendo meu estilo e quanto custa.',
      },
    ],
    seo: {
      title: 'Portfolio Digital para Criativos | BioLanding',
      description:
        'Crie seu portfolio profissional online. Galeria de projetos, servicos com precos e contato direto. Ideal para fotografos, designers e artistas.',
      keywords: [
        'portfolio online',
        'portfolio fotografo',
        'portfolio designer',
        'site profissional',
        'mostrar trabalhos',
      ],
    },
  },
};

// Helper to get ICP content by slug
export function getICPContent(slug: string): ICPContent | undefined {
  return icpContent[slug];
}

// Get all ICP slugs
export function getAllICPSlugs(): string[] {
  return Object.keys(icpContent);
}
