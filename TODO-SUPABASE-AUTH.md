# TODO: Corrigir Migracao Clerk -> Supabase Auth

## Status: CONCLUIDO (06/01/2025)

---

## 1. Configurar Supabase Dashboard (MANUAL)

### URL Configuration
- [ ] Ir em **Authentication -> URL Configuration**
- [ ] **Site URL**: Mudar de `http://localhost:3000` para `https://biolanding.com`
- [ ] **Redirect URLs**: Adicionar `https://biolanding.com/*`

### Desabilitar Confirmacao de Email (opcional)
- [ ] Ir em **Authentication -> Providers -> Email**
- [ ] Desabilitar **"Confirm email"** para permitir login direto

---

## 2. Vincular Conta da Michelle (SQL) - CONCLUIDO

O ID correto foi encontrado e atualizado:

- **auth.users ID**: `45a8652d-f87e-4b5a-97ea-e86743313115`
- **public.users clerk_id**: `45a8652d-f87e-4b5a-97ea-e86743313115`

```sql
-- SQL executado para corrigir
UPDATE public.users
SET clerk_id = '45a8652d-f87e-4b5a-97ea-e86743313115'
WHERE email = 'michelle.faustino.b@gmail.com';
```

---

## 3. Verificar Paginas Vinculadas - CONCLUIDO

Paginas da Michelle (3 paginas):
1. michellebarbosa - Michelle Barbosa
2. daianeorcioli - Daiane Orcioli
3. ameninalongbeauty - A menina do Long Beauty

---

## 4. Testar - CONCLUIDO

- [x] Michelle faz login em https://biolanding.com/login
- [x] Verifica se o dashboard mostra as paginas dela
- [x] Verifica se o plano aparece como premium/pro
- [ ] Testa editar uma pagina

---

## Dados da Michelle

- **Email**: michelle.faustino.b@gmail.com
- **Supabase Auth ID (auth.users)**: 45a8652d-f87e-4b5a-97ea-e86743313115
- **Plano**: pro

---

## Nota Importante

O problema original era que o `clerk_id` estava com um ID incorreto (`20668369-...`).
O ID correto do Supabase Auth e `45a8652d-f87e-4b5a-97ea-e86743313115`.

Para novos usuarios, o sistema deve usar `user.id` do Supabase Auth como `clerk_id`.
