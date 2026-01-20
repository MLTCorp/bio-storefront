# Prompt para Otimização da Landing Page BioLanding

## Contexto

Você vai trabalhar na otimização de performance, acessibilidade e SEO da landing page do BioLanding (https://biolanding.com).

**Scores atuais do PageSpeed Insights (Mobile):**
- Performance: 29/100 (CRÍTICO)
- Acessibilidade: 85/100
- Práticas Recomendadas: 100/100
- SEO: 75/100

**Core Web Vitals atuais:**
- LCP: 8.0s (ideal: < 2.5s)
- FCP: 4.4s (ideal: < 1.8s)
- TBT: 5.510ms (ideal: < 200ms)
- CLS: 0 (OK)
- Speed Index: 8.3s (ideal: < 3.4s)

---

## Documento de Referência

Leia o arquivo `.claude/plans/witty-stirring-giraffe.md` que contém a análise completa com:
- Breakdown de payload (3.3 MB total)
- Problemas identificados com soluções detalhadas
- Código de implementação para cada correção
- Checklist de prioridades

---

## Tarefas de Implementação

### FASE 1: Correções Rápidas (SEO + Acessibilidade)

**1. Corrigir `client/index.html`:**
- Adicionar `<title>BioLanding - Crie seu Site de Links Personalizado | Link na Bio Grátis</title>`
- Adicionar `<meta name="description" content="Crie sua página de links personalizada em minutos. BioLanding oferece vitrine de produtos, agendamento integrado e analytics. Comece grátis hoje!">`
- Remover `maximum-scale=1` do viewport (acessibilidade)
- Adicionar dados estruturados JSON-LD (Schema.org SoftwareApplication)

**2. Criar/Corrigir `client/public/robots.txt`:**
```
User-agent: *
Allow: /

Sitemap: https://biolanding.com/sitemap.xml
```

**3. Criar `client/public/sitemap.xml`** com as URLs principais

---

### FASE 2: Otimização de Imagens (MAIOR IMPACTO)

**Problema:** 3 imagens PNG somam 2.5 MB (76% do payload)
- `/public/images/features/nail-designer.png` (867 KB)
- `/public/images/features/fitness-influencer.png` (861 KB)
- `/public/images/features/elegant-influencer.png` (856 KB)

**Ações:**
1. Converter todas para WebP (economia ~60%)
2. Criar versões responsivas (400px, 600px, 800px)
3. Atualizar `client/src/components/biolanding/sections/features.tsx` para usar `<picture>` com srcset
4. Adicionar `loading="lazy"`, `decoding="async"`, `width` e `height` explícitos

---

### FASE 3: Otimização de JavaScript

**Problema:** 374 KB de JS, 265 KB não utilizado, TBT de 5.5s

**Ações:**

1. **Implementar lazy loading em `client/src/pages/home.tsx`:**
   - Manter Navbar e Hero como imports diretos (above-the-fold)
   - Usar `React.lazy()` para: Features, HowItWorks, Pricing, FAQ, CTAFinal, Footer
   - Envolver em `<Suspense>` com fallback

2. **Melhorar code splitting em `vite.config.ts`:**
   - Separar chunks: vendor, ui, animations, charts, stripe, supabase

---

### FASE 4: Otimização de Fontes

**Problema:** Google Fonts bloqueando por 750ms

**Ações:**
1. Instalar fontsource: `npm install @fontsource/dm-sans @fontsource/inter`
2. Importar apenas os weights necessários (400, 500, 600, 700)
3. Remover links do Google Fonts do `index.html`
4. Ou: Reduzir para apenas UMA família de fonte (DM Sans)

---

### FASE 5: Otimização de Animações

**Problema:** Framer Motion consumindo 34.869ms de CPU

**Ações:**
1. Criar hook `useReducedMotion()` em `client/src/hooks/`
2. Desativar animações complexas em mobile
3. Substituir animações simples por CSS puro onde possível
4. Aplicar em: hero.tsx, features.tsx, how-it-works.tsx, pricing.tsx, faq.tsx

---

### FASE 6: Correções de Acessibilidade

**Ações:**
1. Corrigir hierarquia de headings (H1 → H2 → H3 sequencial)
2. Ajustar contraste: trocar `text-gray-400` por `text-gray-600`
3. Substituir avatares de `randomuser.me` por locais ou UI Avatars
4. Adicionar `width` e `height` em todas as imagens

---

## Arquivos Principais a Modificar

| Arquivo | Mudanças |
|---------|----------|
| `client/index.html` | Title, meta, viewport, JSON-LD |
| `client/src/pages/home.tsx` | Lazy loading |
| `client/src/components/biolanding/sections/features.tsx` | Imagens otimizadas, headings |
| `client/src/components/biolanding/sections/hero.tsx` | Animações condicionais |
| `vite.config.ts` | Code splitting |
| `client/public/robots.txt` | Criar/corrigir |
| `client/public/sitemap.xml` | Criar |
| `client/src/index.css` | Cores de contraste |

---

## Metas de Score

Após implementação:
- Performance: 75+ (atualmente 29)
- Acessibilidade: 95+ (atualmente 85)
- SEO: 95+ (atualmente 75)
- LCP: < 2.5s (atualmente 8.0s)
- TBT: < 300ms (atualmente 5.5s)

---

## Comandos de Verificação

```bash
# Build de produção
npm run build

# Lighthouse local
npx lighthouse https://biolanding.com --view

# Verificar bundle size
npx vite-bundle-visualizer
```

---

## Regras Importantes

1. **NÃO quebrar funcionalidades existentes** - teste após cada mudança
2. **Manter compatibilidade mobile** - testar em viewport 375px
3. **Preservar design visual** - apenas otimizar, não redesenhar
4. **Commits incrementais** - uma feature por commit
5. **Documentar mudanças** - comentar código quando necessário

---

## Ordem de Execução Recomendada

1. ✅ Fase 1 (SEO rápido) - 10 min
2. ✅ Fase 6 (Acessibilidade) - 15 min
3. ✅ Fase 2 (Imagens) - 30 min ← MAIOR IMPACTO
4. ✅ Fase 4 (Fontes) - 15 min
5. ✅ Fase 3 (JavaScript) - 30 min
6. ✅ Fase 5 (Animações) - 30 min

**Tempo total estimado: 2-3 horas**

---

Comece pela Fase 1 e vá progredindo. Após cada fase, faça um build para verificar se não há erros.
