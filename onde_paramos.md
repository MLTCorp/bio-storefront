# Onde Paramos - Bio-Storefront

## Ultimo Commit: `8c379c5`

## Data: 15/12/2024

## O que foi feito:

### Funcionalidades Principais:
1. **Toggle de visibilidade para kits** - Agora pode ocultar kits sem deletar
2. **Destaque especial com shine-border** - Botao "Ativar Destaque" para kits especiais com borda animada roxa/rosa
3. **Borda dourada para produtos em promocao** - Gradient ambar/dourado para cards com desconto ativo
4. **Sistema de temas completo** - 5 temas (Light, Dark, Rose Gold, Mint, Cyber Glow)
5. **Seletor visual de temas** - Substituiu o color picker por cards visuais com preview
6. **Toggle de visibilidade para componentes** - Ocultar/mostrar componentes da pagina
7. **Download de imagens** - Botao para baixar fotos de produtos e thumbnails de video
8. **Inputs debounced** - Corrigido lag ao digitar nos campos
9. **Editor de produto melhorado** - Secoes colapsaveis e melhor UX
10. **Menu "Adicionar" colapsavel** - Interface mais limpa
11. **APIs admin** - Listagem de todas as paginas para admin
12. **Controle de posicao de imagem** - Ajustar zoom e posicao de fotos de perfil e produtos

### Correcoes:
- BackgroundEffect theme-aware (faixa rosa corrigida em temas escuros)
- Preview Modal com tema completo aplicado
- Erro React useMemo #310 corrigido
- Tema passado corretamente ao ComponentRenderer no editor

## Arquivos Principais Modificados:
- `client/src/components/ui/shirt-parallax-card.tsx` - Card de produto com shine-border
- `client/src/components/page-builder/editors/product-editor.tsx` - Editor com toggle visibilidade/destaque
- `client/src/components/magicui/shine-border.tsx` - Componente de borda animada
- `client/src/lib/themes.ts` - Sistema de temas
- `client/src/types/database.ts` - Interfaces ProductKit com isVisible/isSpecial

## Proximos Passos:
- Implementar analytics de visualizacoes
- Adicionar mais opcoes de animacao
- Melhorar responsividade mobile
- Opcao para ignorar desconto em links especificos (cancelado por enquanto)

## Progresso Estimado: 85%

## Deploy: Vercel (auto-deploy via git push)
- URL: https://bio-storefront.vercel.app
