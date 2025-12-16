# Onde Paramos - Bio-Storefront

## Ultimo Commit: `aac451b`

## Data: 16/12/2024

## O que foi feito:

### Funcionalidades Principais:
1. **Toggle de visibilidade para kits** - Agora pode ocultar kits sem deletar
2. **Destaque especial com shine-border** - Botao "Ativar Destaque" para kits especiais com borda animada roxa/rosa
3. **Borda dourada para produtos em promocao** - Gradient ambar/dourado para cards com desconto ativo
4. **Sistema de temas completo** - 5 temas (Light, Dark, Rosa, Saude, Cyber)
5. **Seletor visual de temas** - Substituiu o color picker por cards visuais com preview
6. **Toggle de visibilidade para componentes** - Ocultar/mostrar componentes da pagina
7. **Download de imagens** - Botao para baixar fotos de produtos e thumbnails de video
8. **Inputs debounced** - Corrigido lag ao digitar nos campos
9. **Editor de produto melhorado** - Secoes colapsaveis e melhor UX
10. **Menu "Adicionar" colapsavel** - Interface mais limpa
11. **APIs admin** - Listagem de todas as paginas para admin
12. **Controle de posicao de imagem** - Ajustar zoom e posicao de fotos de perfil e produtos
13. **Opcao "Ignorar Desconto" por kit** - Flag `ignoreDiscount` para desativar desconto em kits especificos
14. **Design V1 "A Melhorado" dos botoes** - Labels maiores, precos em negrito, melhor espacamento
15. **Bordas de avatar neutras** - Light, Dark e Cyber tem bordas cinza; Rosa e Saude mantem cores

### Correcoes:
- BackgroundEffect theme-aware (faixa rosa corrigida em temas escuros)
- Preview Modal com tema completo aplicado
- Erro React useMemo #310 corrigido
- Tema passado corretamente ao ComponentRenderer no editor
- Animacao @keyframes shine movida para escopo global CSS

## Arquivos Principais Modificados:
- `client/src/components/ui/shirt-parallax-card.tsx` - Card de produto com shine-border e ignoreDiscount
- `client/src/components/page-builder/editors/product-editor.tsx` - Editor com toggle visibilidade/destaque/ignorar desconto
- `client/src/components/magicui/shine-border.tsx` - Componente de borda animada
- `client/src/lib/themes.ts` - Sistema de temas com avatarBorder
- `client/src/lib/store.tsx` - Interface ProductKit com isVisible/isSpecial/ignoreDiscount
- `client/src/index.css` - Keyframes shine no escopo global

## Proximos Passos:
- **Remover negrito dos precos** (prioridade)
- Implementar analytics de visualizacoes
- Adicionar mais opcoes de animacao
- Melhorar responsividade mobile

## Progresso Estimado: 88%

## Deploy: Vercel (auto-deploy via git push)
- URL: https://bio-storefront.vercel.app
