# Bio-Storefront - Especificacao UX para Page Builder

## Visao Geral do Produto

**Bio-Storefront** e um construtor de paginas de link (estilo Linktree) voltado para influencers, vendedores e profissionais. O objetivo e permitir que usuarios criem paginas personalizadas com diversos componentes arrataveis, de forma extremamente simples e intuitiva.

### Publico-Alvo
- Influenciadores digitais
- Vendedores/Empreendedores
- Profissionais liberais
- **Nivel tecnico**: Baixo - deve ser tao simples quanto Linktree

### Principio Central
> "Se o usuario precisa pensar, esta complexo demais"

---

## Fluxo Principal do Usuario

### 1. Login/Cadastro
- Autenticacao via Clerk (Google, Email)
- Apos login: redireciona para **Lista de Paginas**
- Excecao: Se usuario tem apenas 1 pagina, vai direto para o **Editor**

### 2. Lista de Paginas (Dashboard)
```
+------------------------------------------+
|  Minhas Paginas                    [+]   |
+------------------------------------------+
|                                          |
|  +------------+  +------------+          |
|  | @joao      |  | @loja-fit  |          |
|  | 234 views  |  | 89 views   |          |
|  | [Editar]   |  | [Editar]   |          |
|  +------------+  +------------+          |
|                                          |
|  Voce pode criar ate 3 paginas           |
+------------------------------------------+
```

**Funcionalidades:**
- Ver todas as paginas do usuario (maximo 3 no plano atual)
- Criar nova pagina (se < 3)
- Cada card mostra: username, visualizacoes, botao editar
- Acesso rapido ao link publico

### 3. Editor de Pagina (Core do Sistema)

#### Layout do Editor
```
+--------------------------------------------------+
|  [<- Voltar]    @username    [Visualizar] [Salvar]|
+--------------------------------------------------+
|                                                   |
|  +---------------------------------------------+ |
|  |              PREVIEW DA PAGINA              | |
|  |                                             | |
|  |    +----------------------------------+     | |
|  |    |      [Foto de Perfil]            |     | |
|  |    |      Nome do Usuario             |     | |
|  |    |      "Bio ou frase aqui"         |     | |
|  |    +----------------------------------+     | |
|  |                                             | |
|  |    +----------------------------------+     | |
|  |    | [Componente 1]            [drag] |     | |
|  |    +----------------------------------+     | |
|  |                                             | |
|  |    +----------------------------------+     | |
|  |    | [Componente 2]            [drag] |     | |
|  |    +----------------------------------+     | |
|  |                                             | |
|  |    +----------------------------------+     | |
|  |    | [Componente 3]            [drag] |     | |
|  |    +----------------------------------+     | |
|  |                                             | |
|  +---------------------------------------------+ |
|                                                   |
|  +---------------------------------------------+ |
|  |  [+] Adicionar Componente                   | |
|  |                                             | |
|  |  [Botao] [Texto] [Produto] [Video] [Link]   | |
|  +---------------------------------------------+ |
|                                                   |
|  +---------------------------------------------+ |
|  |  Personalizacao         [v expandir]        | |
|  |  - Background                               | |
|  |  - Fonte                                    | |
|  +---------------------------------------------+ |
|                                                   |
|  +---------------------------------------------+ |
|  |  Templates              [v expandir]        | |
|  |  [Salvar como Template] [Importar Template] | |
|  +---------------------------------------------+ |
|                                                   |
+--------------------------------------------------+
```

---

## Componentes Disponiveis

### 1. PERFIL (Fixo no topo)
Sempre presente, nao pode ser movido ou removido.

**Elementos:**
- Foto de perfil (circular, com upload)
- Nome/Titulo
- Bio/Frase curta

**Edicao inline:**
- Clicar na foto abre seletor de arquivo
- Clicar no nome/bio permite editar texto direto
- Botao "Gerar com IA" abre modal de geracao de imagem

```
+----------------------------------+
|        [Foto Circular]           |
|        [Gerar com IA]            |
|                                  |
|     "Maria Silva" (editavel)     |
|  "Sua frase aqui" (editavel)     |
+----------------------------------+
```

---

### 2. BOTAO

**Tipos de Botao:**

#### A) Botao WhatsApp (destaque)
- Estilo grande, verde, com icone do WhatsApp
- Configuracoes: Numero + Mensagem customizavel
- Texto do botao editavel (ex: "Fale Comigo")

```
+----------------------------------+
| [WhatsApp Icon]  Fale Comigo     |
+----------------------------------+
```

#### B) Botoes de Redes Sociais (pequenos/icones)
- Instagram, TikTok, YouTube, Facebook, Twitter/X
- Podem aparecer em linha (4-6 por linha)
- Apenas icone ou icone + label curto

```
+------+ +------+ +------+ +------+
| [IG] | | [TT] | | [YT] | | [FB] |
+------+ +------+ +------+ +------+
```

#### C) Botao de Link Grande
- Com icone customizavel
- Cabe 2 por linha (lado a lado)
- Icone pode ser: lista pre-definida, busca, ou URL externa

```
+----------------+ +----------------+
| [Icon] Loja    | | [Icon] Blog    |
+----------------+ +----------------+
```

**Edicao inline:**
- Clicar no botao expande opcoes de edicao
- Campos: Texto, URL, Tipo, Icone
- Para WhatsApp: Numero + Mensagem

---

### 3. TEXTO

Paragrafo de texto livre com formatacao basica.

**Opcoes:**
- Formatacao: Negrito, Italico (toolbar simples)
- Alinhamento: Esquerda, Centro, Direita
- Tamanho: Pequeno, Medio, Grande

```
+----------------------------------+
| [B] [I] | [<-] [=] [->] | Tam[v] |
+----------------------------------+
| "Seu texto aqui. Pode ter        |
|  multiplas linhas e formatacao." |
+----------------------------------+
```

**Edicao inline:**
- Clicar no texto ativa modo edicao
- Toolbar aparece acima do texto
- Simples como editor de notas

---

### 4. PRODUTO

Sistema atual de produto com kits e descontos.

**Elementos:**
- Imagem do produto (com zoom)
- Titulo
- Descricao
- Kits com precos
- Desconto opcional
- Destino: Link externo ou WhatsApp

```
+----------------------------------+
|  +--------+                      |
|  | [Img]  |  Produto XYZ         |
|  | [IA]   |  Descricao aqui...   |
|  +--------+                      |
|                                  |
|  1 Un - R$ 99    [Comprar]       |
|  3 Un - R$ 249   [Comprar]       |
|  5 Un - R$ 399   [Comprar]       |
|                                  |
|  [-10%] Desconto ativo!          |
+----------------------------------+
```

**Edicao inline:**
- Campos editaveis ao clicar
- Botao "Gerar com IA" para imagem (abre modal)
- Configurar kits e links

---

### 5. VIDEO

Incorporacao de video do YouTube.

**Elementos:**
- Thumbnail (upload ou automatico)
- Titulo opcional
- Player embutido ou link

```
+----------------------------------+
|  +---------------------------+   |
|  |                           |   |
|  |    [Thumbnail 16:9]       |   |
|  |         [Play]            |   |
|  |                           |   |
|  +---------------------------+   |
|  "Titulo do Video" (opcional)    |
+----------------------------------+
```

**Edicao inline:**
- Campo para URL do YouTube
- Upload de thumbnail customizada
- Toggle: mostrar/ocultar titulo
- Botao "Gerar com IA" para thumbnail (abre modal)

---

### 6. LINK SIMPLES

Link basico com icone e texto.

```
+----------------------------------+
| [Icon]  Meu Portfolio  [->]      |
+----------------------------------+
```

**Edicao inline:**
- Texto do link
- URL destino
- Icone (lista ou busca)

---

## Interacoes Principais

### Drag & Drop
- Cada componente tem area de "pega" (grip/handle)
- Arrastar para reorganizar ordem
- Feedback visual durante arrasto (sombra, outline)
- Area de drop highlighted

### Edicao Inline
- Clicar em qualquer elemento editavel ativa edicao
- Campos de texto ficam editaveis no lugar
- Toolbar contextual aparece quando necessario
- Salvar: ao clicar fora ou pressionar Enter/Esc

### Modal de Geracao IA
Unico modal compartilhado para todas as geracoes de imagem.

```
+------------------------------------------+
|  Gerar Imagem com IA            [X]      |
+------------------------------------------+
|                                          |
|  +----------------+ +----------------+   |
|  | [Upload]       | | [Upload]       |   |
|  | Sua Foto       | | Foto Produto   |   |
|  +----------------+ +----------------+   |
|                                          |
|  Cenario: [Dropdown de opcoes]           |
|  - Na praia segurando o produto          |
|  - Em estudio com fundo branco           |
|  - No dia a dia usando o produto         |
|  - Customizado...                        |
|                                          |
|  Prompt: (editavel)                      |
|  +------------------------------------+  |
|  | "Foto profissional de uma pessoa  |  |
|  |  segurando [produto] na praia..." |  |
|  +------------------------------------+  |
|                                          |
|  [Gerar Imagem]                          |
|                                          |
|  +------------------------------------+  |
|  |        [Resultado Preview]         |  |
|  +------------------------------------+  |
|                                          |
|  [Usar Esta Imagem] [Gerar Novamente]    |
+------------------------------------------+
```

---

## Personalizacao da Pagina

Secao colapsavel no editor.

### Background
- Cor solida (color picker)
- Gradiente (2 cores + direcao)
- Imagem (upload)

### Fonte
- Selecao de fonte unica para toda pagina
- Opcoes pre-definidas (5-8 fontes)
- Preview em tempo real

```
+------------------------------------------+
|  Personalizacao                    [-]   |
+------------------------------------------+
|                                          |
|  Background:                             |
|  [Cor] [Gradiente] [Imagem]              |
|  [###] [###->###]  [Upload]              |
|                                          |
|  Fonte:                                  |
|  [Inter      v]                          |
|                                          |
+------------------------------------------+
```

---

## Sistema de Templates

Secao colapsavel, menos prominente.

### Salvar Template
- Salva: ordem dos componentes, tipos, configuracoes basicas
- NAO salva: links, URLs, conteudo especifico
- Pode nomear o template

### Importar Template
- Lista de templates publicos/compartilhados
- Preview antes de aplicar
- Aviso: "Isso substituira sua configuracao atual"

```
+------------------------------------------+
|  Templates                         [-]   |
+------------------------------------------+
|                                          |
|  [Salvar como Template]                  |
|                                          |
|  Importar:                               |
|  +------------+ +------------+           |
|  | Template 1 | | Template 2 |           |
|  | [Preview]  | | [Preview]  |           |
|  | [Usar]     | | [Usar]     |           |
|  +------------+ +------------+           |
|                                          |
+------------------------------------------+
```

---

## Tela de Visualizacao (Preview)

Visualizacao da pagina como usuario final ve.

```
+------------------------------------------+
|  [<- Voltar ao Editor]                   |
+------------------------------------------+
|                                          |
|          (Pagina renderizada             |
|           exatamente como                |
|           aparece para visitantes)       |
|                                          |
+------------------------------------------+
```

**Importante:**
- Botao claro para voltar ao editor
- Pode ser em modal ou pagina separada
- Mostrar como fica em mobile (principal)

---

## Fluxo de Adicionar Componente

1. Usuario clica em "+ Adicionar Componente"
2. Aparece barra/menu com opcoes: [Botao] [Texto] [Produto] [Video] [Link]
3. Ao clicar em uma opcao, componente e inserido no final
4. Componente ja aparece em modo de edicao inline
5. Usuario configura e clica fora para finalizar

---

## Requisitos de UX

### Simplicidade
- Maximo 2 cliques para qualquer acao
- Zero necessidade de documentacao
- Feedback visual imediato

### Mobile-First
- Editor deve funcionar bem em celular
- Preview mostra versao mobile
- Touch-friendly para drag & drop

### Performance
- Salvamento automatico (debounced)
- Feedback de "salvando..." / "salvo"
- Carregamento rapido

### Acessibilidade
- Contraste adequado
- Fontes legiveis
- Areas de toque grandes (44px minimo)

---

## Pagina Publica (Visitante)

URL: `seusite.com/@username`

```
+----------------------------------+
|                                  |
|        [Foto de Perfil]          |
|         Maria Silva              |
|    "Empreendedora Digital"       |
|                                  |
|  +----------------------------+  |
|  | [WA] Fale Comigo           |  |
|  +----------------------------+  |
|                                  |
|  [IG] [TT] [YT] [FB]             |
|                                  |
|  +----------------------------+  |
|  | Meu novo lancamento!       |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | [Produto]                  |  |
|  | Nome do Produto            |  |
|  | Kits e precos...           |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | [Video Thumbnail]          |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
```

---

## Resumo de Telas Necessarias

1. **Lista de Paginas** - Dashboard com cards das paginas
2. **Editor de Pagina** - Core do sistema com componentes
3. **Preview** - Visualizacao final
4. **Modal IA** - Geracao de imagens
5. **Pagina Publica** - O que visitante ve

---

## Stack Tecnica (Referencia)

- Frontend: React + TypeScript + Tailwind
- Componentes: Shadcn/ui
- Auth: Clerk
- Storage: Supabase
- Drag & Drop: @dnd-kit ou react-beautiful-dnd
- IA: OpenRouter + Nano Banana Pro

---

## Notas para o Designer

1. **Priorize mobile** - 80%+ dos usuarios acessam por celular
2. **Mantenha clean** - Menos e mais, estilo Linktree/Notion
3. **Edicao inline e chave** - Evite formularios separados
4. **Feedback visual** - Estados de hover, loading, sucesso
5. **Cores neutras** - Deixe o conteudo do usuario brilhar
