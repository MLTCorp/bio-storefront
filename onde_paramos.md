# Onde Paramos - Bio-Storefront

## Ultimo Commit: `9534bba`

## Data: 08/01/2025

## Informacoes de Deploy (IMPORTANTE)

### Vercel Project
- **Project Name**: bio-storefront
- **Team**: sincron-team
- **Project ID**: prj_TJHJrkaUnREkfdYimWY6l6mVIaHY

### URLs de Producao
- **Dominio Principal**: https://biolanding.com
- **Dominio Vercel**: https://biolanding.vercel.app
- **Preview URLs**: https://bio-storefront-[hash]-sincron-team.vercel.app

### ATENCAO
- NAO usar `bio-storefront.vercel.app` - este dominio pertence a outro projeto!
- Para testar a API: `curl https://biolanding.vercel.app/api/debug/pages`
- Deploy automatico via git push para branch main

---

## O que foi feito nesta sessao:

### Correcao Critica - Supabase Auth Integration (08/01/2025):
O sistema foi migrado de Clerk Auth para Supabase Auth, mas a API serverless da Vercel (`api/index.ts`) nao foi atualizada, causando erro ao criar paginas.

**Problema**: Usuarios novos com Supabase Auth nao conseguiam criar paginas porque:
1. O frontend enviava `x-supabase-user-id` corretamente
2. A API tentava buscar usuario na tabela `users` pelo campo `clerk_id`
3. Como o usuario nao existia na tabela `users`, retornava erro 404

**Solucao aplicada**:
1. Adicionada funcao `getOrCreateUser()` em `api/index.ts`
2. Atualizado POST `/api/pages` para aceitar `email` e auto-criar usuario
3. Sistema agora cria automaticamente registro na tabela `users` quando usuario tenta criar primeira pagina

### Arquivos modificados:
- `api/index.ts` - Adicionada funcao getOrCreateUser + atualizacao POST /api/pages
- `server/routes.ts` - Mesma correcao para desenvolvimento local
- `client/src/pages/pages-list.tsx` - Frontend envia email ao criar pagina

### Commits:
- `9534bba` - fix: add user auto-creation to Vercel serverless API
- `acef365` - fix: use x-supabase-user-id header for Supabase Auth
- `c7e00b7` - feat: upgrade modal improvements

---

## Sessao Anterior (06/01/2025):

### Melhorias na Landing Page:
- Removida secao LogoCloud (icones de integracoes)
- Mockup do Hero traduzido para portugues (Agenda, Cursos, Mentoria Individual, etc)
- Botoes CTA atualizados para scroll ate secao de precos (em vez de /signup direto)
- Feature "Integracoes Poderosas" -> "Vitrine de Produtos"
- Feature "Checkout Simplificado" -> "Agendamento Integrado"

---

## Dados dos Usuarios:

### Michelle (Admin):
- Email: michelle.faustino.b@gmail.com
- Supabase Auth ID: 45a8652d-f87e-4b5a-97ea-e86743313115
- Plano: pro
- Paginas: michellebarbosa, daianeorcioli, ameninalongbeauty

### Usuario Pro (Teste Stripe):
- Email: oitaua@hotmail.com
- Plano: pro (comprado via Stripe)
- Status: Precisa criar primeira pagina para auto-criar registro em `users`

---

## Arquitetura Auth (Pos-Migracao)

### Frontend:
- Usa `@supabase/supabase-js` para auth
- Contexto em `client/src/contexts/auth-context.tsx`
- Envia `x-supabase-user-id` header com `user.id` do Supabase Auth

### Backend:
- Coluna `clerk_id` na tabela `users` agora armazena Supabase Auth User ID
- Funcao `getOrCreateUser()` busca/cria usuario automaticamente
- Compativel com usuarios antigos (Clerk) e novos (Supabase Auth)

### Fluxo de Criacao de Pagina:
1. Usuario faz login (Supabase Auth)
2. Frontend envia POST /api/pages com `x-supabase-user-id` e `email`
3. Backend chama `getOrCreateUser(authId, email)`
4. Se usuario nao existe em `users`, cria automaticamente
5. Pagina e criada vinculada ao `user.id`

---

## Proximos passos:
- Testar criacao de paginas com usuario oitaua@hotmail.com
- Verificar se limites de plano Pro estao sendo aplicados corretamente
- Considerar renomear coluna `clerk_id` para `auth_id` (opcional, breaking change)

## Progresso Estimado: 100%
