# Tipos de Lista Ordenada (Ordered List Types)

Esta funcionalidade permite criar listas ordenadas com diferentes estilos de numeração no editor Tiptap.

## Tipos Disponíveis

O editor agora suporta os seguintes tipos de numeração para listas ordenadas:

1. **decimal** - Numeração padrão: 1, 2, 3, 4, ...
2. **decimal-leading-zero** - Numeração com zero à esquerda: 01, 02, 03, 04, ...
3. **lower-alpha** - Letras minúsculas: a, b, c, d, ...
4. **upper-alpha** - Letras maiúsculas: A, B, C, D, ...
5. **lower-roman** - Números romanos minúsculos: i, ii, iii, iv, ...
6. **upper-roman** - Números romanos maiúsculos: I, II, III, IV, ...

## Como Usar

### Na Interface do Usuário

1. Clique no botão de lista numerada na barra de ferramentas (ícone `fas fa-list-ol`)
2. Clique na seta dropdown ao lado do botão de lista numerada
3. Selecione o tipo de numeração desejado
4. A lista será atualizada automaticamente com o novo estilo

### Alternando Entre Tipos

Você pode alternar entre diferentes tipos de numeração a qualquer momento:

1. Posicione o cursor dentro de uma lista ordenada existente
2. Abra o dropdown de tipos de lista
3. Selecione um novo tipo
4. A lista inteira será atualizada com o novo estilo de numeração

## Implementação Técnica

### Arquivos Modificados/Criados

1. **`src/app/shared/editor/extensions/ordered-list.ts`** (novo)
   - Extensão customizada que estende `@tiptap/extension-ordered-list`
   - Adiciona atributo `listType` para armazenar o tipo de numeração
   - Implementa comando `setOrderedListType` para alterar o tipo

2. **`src/app/shared/editor/editor.component.ts`**
   - Importa a extensão customizada `CustomOrderedList`
   - Adiciona propriedade `currentOrderedListType` para rastrear o tipo selecionado
   - Adiciona array `orderedListTypes` com as opções disponíveis
   - Implementa métodos:
     - `toggleOrderedListTypeDropdown()` - Abre/fecha o dropdown
     - `setOrderedListType(listType)` - Define o tipo de numeração

3. **`src/app/shared/editor/editor.component.html`**
   - Adiciona dropdown com botões para cada tipo de lista
   - Integra com o sistema de tradução usando `translate` pipe

4. **`src/app/shared/editor/editor.component.scss`**
   - Adiciona estilos para `.dropdown-trigger-mini`
   - Adiciona regras CSS para aplicar `list-style-type` baseado no atributo `data-list-type`

5. **Arquivos de Tradução** (`src/assets/i18n/`)
   - `pt_br.json` - Traduções em português
   - `en.json` - Traduções em inglês
   - `es.json` - Traduções em espanhol

### Estrutura de Dados

```typescript
export type OrderedListType =
  | 'decimal'
  | 'decimal-leading-zero'
  | 'lower-alpha'
  | 'upper-alpha'
  | 'lower-roman'
  | 'upper-roman';
```

### HTML Renderizado

As listas ordenadas são renderizadas com atributos especiais:

```html
<ol style="list-style-type: lower-roman" data-list-type="lower-roman">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ol>
```

## Compatibilidade

Esta funcionalidade é compatível com:

- ✅ Todas as versões modernas de navegadores (Chrome, Firefox, Safari, Edge)
- ✅ Exportação para HTML
- ✅ Exportação para JSON
- ✅ Sistema de tradução i18n
- ✅ Todos os comandos de edição de lista (indent, outdent, etc.)

## Limitações

- O tipo de numeração é aplicado a toda a lista (não é possível ter diferentes tipos em diferentes níveis de aninhamento)
- A mudança de tipo afeta toda a lista, não apenas um item individual

## Exemplos de Uso

### Criando uma lista com números romanos maiúsculos

1. Digite algum texto
2. Clique no botão de lista numerada
3. Abra o dropdown de tipos
4. Selecione "I, II, III (romanos maiúsculos)"
5. Continue digitando os itens da lista

### Convertendo uma lista existente

1. Posicione o cursor em uma lista numerada existente
2. Abra o dropdown de tipos de lista
3. Selecione o novo tipo desejado
4. A lista será imediatamente atualizada

## Internacionalização

As traduções estão disponíveis em três idiomas:

- **Português (Brasil)**: "1, 2, 3 (decimal)", "i, ii, iii (romanos minúsculos)", etc.
- **English**: "1, 2, 3 (decimal)", "i, ii, iii (lower roman)", etc.
- **Español**: "1, 2, 3 (decimal)", "i, ii, iii (romanos minúsculas)", etc.
