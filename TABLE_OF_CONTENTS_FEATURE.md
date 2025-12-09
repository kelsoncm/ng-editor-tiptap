# Feature: Table of Contents (Sumário/Índice)

## Descrição

A funcionalidade de Table of Contents (Sumário) rastreia automaticamente todos os títulos (headings) presentes no documento e os exibe em um painel lateral navegável. Esta funcionalidade utiliza a extensão oficial `@tiptap/extension-table-of-contents`.

## Características

- ✅ Rastreamento automático de todos os títulos H1-H3 do documento
- ✅ Painel lateral deslizante com animação suave
- ✅ Navegação por scroll suave com destaque temporário
- ✅ Hierarquia visual com indentação por nível
- ✅ Atualização automática quando títulos são adicionados/removidos/editados
- ✅ Indicador visual do título ativo (em foco)
- ✅ Suporte a internacionalização (pt-BR, en, es)
- ✅ **Desabilitado por padrão** (opcional)
- ✅ Responsivo e mobile-friendly
- ✅ Oculto automaticamente na impressão

## Implementação

### Arquitetura

A funcionalidade usa a extensão oficial do Tiptap como **rastreador de headings**, não como um nó inserível no documento. O painel lateral é renderizado separadamente pelo componente Angular.

**Como funciona:**
1. A extensão `TableOfContents` monitora todos os headings no documento
2. Armazena informações em `editor.storage.tableOfContents`
3. O componente Angular renderiza essas informações em um painel lateral
4. Cliques nos itens fazem scroll suave até o heading correspondente

**Instalação:**
```bash
npm install @tiptap/extension-table-of-contents
```

### Componente do Editor

**Propriedade de configuração:**
```typescript
@Input() enableTableOfContents = false; // Desabilitado por padrão
```

**Propriedades internas:**
```typescript
showTableOfContents = false; // Controla visibilidade do painel
tableOfContentsData: any[] = []; // Dados dos headings rastreados
```

**Métodos públicos:**
```typescript
// Alterna a visibilidade do painel lateral
toggleTableOfContents(): void {
  this.showTableOfContents = !this.showTableOfContents;
  if (this.showTableOfContents) {
    this.updateTableOfContents();
  }
}

// Atualiza os dados do storage da extensão
updateTableOfContents(): void {
  if (this.editor && this.enableTableOfContents) {
    const storage = this.editor.storage.tableOfContents;
    if (storage && storage.content) {
      this.tableOfContentsData = storage.content;
    }
  }
}

// Rola até o heading clicado com animação suave
scrollToHeading(item: any): void {
  if (item.dom) {
    item.dom.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Destaque temporário
    item.dom.style.backgroundColor = '#e7f1ff';
    setTimeout(() => {
      item.dom.style.backgroundColor = '';
    }, 1000);
  }
}
```

**Atualização automática:**
O método `updateTableOfContents()` é chamado automaticamente no evento `onUpdate` do editor sempre que o painel estiver visível.

### Localização

Adicionadas traduções em três idiomas:

- **Português (pt_br):** "Sumário"
- **English (en):** "Table of Contents"
- **Español (es):** "Tabla de Contenidos"

### Estilos

O Table of Contents possui estilos específicos para:

1. **Visualização no editor:**
   - Fundo cinza claro com borda
   - Título destacado com linha inferior azul
   - Links azuis com hover interativo
   - Indentação hierárquica por nível (H1-H6)
   - Tamanhos de fonte proporcionais ao nível

2. **Impressão:**
   - Evita quebra de página no meio do sumário
   - Remove cores dos links (preto)
   - Mantém a estrutura hierárquica

## Uso

### Habilitando a funcionalidade

```html
<app-editor
  [enableTableOfContents]="true"
  [(ngModel)]="content">
</app-editor>
```

### Exibindo o painel

**Via toolbar:**
1. Clique no botão "Inserir" (+)
2. Clique em "Sumário"
3. O painel lateral abrirá à direita

**Programaticamente:**
```typescript
@ViewChild(EditorComponent) editor!: EditorComponent;

showTOC() {
  this.editor.showTableOfContents = true;
  this.editor.updateTableOfContents();
}
```

### Navegando pelos títulos

1. Clique em qualquer item no painel lateral
2. O documento fará scroll suave até o título
3. O título será destacado temporariamente com cor de fundo azul claro

## Estrutura de Dados

Cada item na `tableOfContentsData` contém:

```typescript
{
  dom: HTMLHeadingElement;        // Elemento DOM do heading
  editor: Editor;                 // Instância do editor
  id: string;                     // ID único do heading
  isActive: boolean;              // Se está atualmente ativo/em foco
  isScrolledOver: boolean;        // Se o usuário já scrollou por ele
  itemIndex: number;              // Índice numérico (1, 2, 3...)
  level: number;                  // Nível do heading (1, 2, 3)
  node: Node;                     // Nó ProseMirror
  originalLevel: number;          // Nível original no documento
  pos: number;                    // Posição no documento
  textContent: string;            // Texto do heading
}
```

## Estilo Visual

O painel lateral tem as seguintes características visuais:

```
┌─────────────────────────────────┐
│ Sumário                      ✕  │
│ ═══════════════════════════════ │
│                                 │
│ 1. Título Principal (H1)        │
│   2. Subtítulo (H2)            │
│     3. Seção (H3)              │
│                                 │
└─────────────────────────────────┘
```

**Características:**
- Painel fixo à direita da tela
- Largura: 320px (280px em mobile)
- Altura: 100% da viewport
- Animação de slide-in da direita
- Fundo branco com sombra à esquerda
- Botão de fechar (✕) no topo
- Scroll independente do documento principal

## Estrutura de Níveis

- **H1 (Nível 1):** Negrito, tamanho 1rem, sem indentação
- **H2 (Nível 2):** Tamanho 0.95rem, indentação 1rem
- **H3 (Nível 3):** Tamanho 0.9rem, indentação 2rem

**Nota:** Apenas H1, H2 e H3 são rastreados por padrão (configuração do StarterKit).

## Comportamento

### Atualização Automática

O painel é atualizado automaticamente quando:
- Novos títulos são adicionados ao documento
- Títulos existentes são modificados (texto alterado)
- Títulos são removidos do documento
- O nível de um título é alterado (ex: H2 → H3)
- **Somente** quando o painel está visível (`showTableOfContents = true`)

### Navegação

Clicar em qualquer item do painel:
1. Fecha todos os dropdowns da toolbar
2. Rola suavemente (`smooth`) até o título correspondente
3. Posiciona o título no início (`block: 'start'`) da viewport
4. Aplica destaque temporário (fundo azul claro por 1 segundo)
5. Mantém o painel aberto para navegação contínua

### Estado Ativo

- Items com `isActive: true` são destacados visualmente
- Barra azul à esquerda e fundo azul claro
- Indica o título atualmente em foco no documento

## HTML Gerado

O painel lateral é renderizado pelo Angular, não pelo Tiptap:

```html
<!-- Painel lateral fixo -->
<div class="table-of-contents-panel">
  <div class="toc-header">
    <h3>Sumário</h3>
    <button class="close-btn">✕</button>
  </div>
  
  <div class="toc-content">
    <!-- Se não houver headings -->
    <div class="toc-empty">
      Nenhum título encontrado. Adicione títulos (H1, H2, H3)...
    </div>
    
    <!-- Lista de headings -->
    <ul class="toc-list">
      <li data-level="1" class="toc-item active">
        <a class="toc-link">
          <span class="toc-index">1.</span>
          <span class="toc-text">Título Principal</span>
        </a>
      </li>
      <li data-level="2" class="toc-item">
        <a class="toc-link">
          <span class="toc-index">2.</span>
          <span class="toc-text">Subtítulo</span>
        </a>
      </li>
    </ul>
  </div>
</div>
```

**Nota:** O painel é completamente separado do conteúdo do editor. Não insere nenhum elemento no documento Tiptap.

## Notas Técnicas

- Utiliza a extensão oficial `@tiptap/extension-table-of-contents` v3.13.0+
- A extensão funciona como **rastreador** (não insere nós no documento)
- Dados armazenados em `editor.storage.tableOfContents.content`
- Compatible com todas as versões do Tiptap v3+
- Atualização reativa via evento `onUpdate` do editor
- **Por padrão vem desabilitado** - precisa ser explicitamente habilitado via `[enableTableOfContents]="true"`
- Painel renderizado com Angular (não ProseMirror)
- Performance otimizada: só atualiza quando painel está visível
- Z-index 1000 para sobrepor outros elementos
- Não afeta o conteúdo exportável do documento

## Diferenças da Implementação Padrão

Esta implementação difere do uso típico da extensão Tiptap:

**Típico (inserir nó):**
```typescript
// ❌ Não usado nesta implementação
editor.commands.insertContent({ type: 'tableOfContents' });
```

**Nossa implementação (painel lateral):**
```typescript
// ✅ Nossa abordagem
toggleTableOfContents() {
  this.showTableOfContents = !this.showTableOfContents;
  if (this.showTableOfContents) {
    const data = this.editor.storage.tableOfContents.content;
    this.tableOfContentsData = data; // Renderiza no Angular
  }
}
```

**Vantagens da abordagem com painel:**
- ✅ Não polui o documento com elementos de UI
- ✅ Sempre visível enquanto editando (não precisa scrollar)
- ✅ Pode ser fechado/aberto sem modificar o documento
- ✅ Melhor UX para documentos longos
- ✅ Não interfere na exportação/impressão do conteúdo

## Casos de Uso

1. **Documentos longos:** Facilita navegação rápida em documentos extensos sem perder contexto
2. **Relatórios:** Oferece visão geral da estrutura enquanto edita
3. **Manuais:** Permite saltar rapidamente entre seções durante edição
4. **Artigos acadêmicos:** Visualizar hierarquia de capítulos e seções
5. **Documentação técnica:** Navegar eficientemente durante a escrita
6. **Revisão de conteúdo:** Ver estrutura completa sem scrolling manual

## Boas Práticas

1. **Estrutura hierárquica:** Use H1 → H2 → H3 em sequência lógica
2. **Títulos descritivos:** Mantenha títulos claros e concisos para melhor navegação
3. **Evite pular níveis:** Não vá de H1 direto para H3 sem H2
4. **Use o painel durante edição:** Mantenha aberto para ter visão geral da estrutura
5. **Feche ao terminar:** O painel não aparece na impressão, mas pode atrapalhar visualização
6. **Abuse dos headings:** Quanto mais títulos, mais útil o painel

## Limitações

- ⚠️ Apenas H1, H2 e H3 são rastreados (configuração do StarterKit)
- ⚠️ Para suportar H4-H6, seria necessário ajustar: `heading: { levels: [1, 2, 3, 4, 5, 6] }`
- ⚠️ O painel ocupa 320px da largura da tela
- ⚠️ Em telas pequenas (<768px) reduz para 280px
- ⚠️ Requer `enableHeading: true` para funcionar
- ⚠️ Não funciona se `enableTableOfContents: false` (padrão)

## Compatibilidade

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Impressão em navegadores
- ✅ Exportação para PDF via print
- ✅ Mobile responsive
- ✅ Acessibilidade (navegação por teclado)
