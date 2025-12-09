# Feature: Page Break (Quebra de Página)

## Descrição

A funcionalidade de Page Break permite inserir quebras de página no documento. Esta é uma implementação customizada que adiciona marcadores visuais no editor e aplica quebras de página reais ao imprimir ou exportar o documento.

## Características

- ✅ Inserção de quebra de página via toolbar (menu "Inserir")
- ✅ Atalho de teclado: `Cmd/Ctrl + Enter`
- ✅ Indicador visual no editor (linha tracejada com texto)
- ✅ Comportamento adequado na impressão (page-break-after: always)
- ✅ Suporte a internacionalização (pt-BR, en, es)
- ✅ Hover effect interativo
- ✅ Pode ser habilitado/desabilitado via configuração

## Implementação

### Extensão Customizada

Criada uma extensão customizada em `src/app/shared/editor/extensions/page-break.ts` que:

1. Define um nó customizado do tipo "block"
2. Renderiza como uma div com atributo `data-type="page-break"`
3. Adiciona o comando `setPageBreak()` ao editor
4. Registra atalho de teclado `Mod-Enter`

### Componente do Editor

**Propriedade de configuração:**
```typescript
@Input() enablePageBreak = true;
```

**Método público:**
```typescript
setPageBreak(): void {
  this.editor?.chain().focus().setPageBreak().run();
}
```

### Localização

Adicionadas traduções em três idiomas:

- **Português (pt_br):** "Quebra de página"
- **English (en):** "Page break"
- **Español (es):** "Salto de página"

### Estilos

O Page Break possui estilos específicos para:

1. **Visualização no editor:**
   - Linha tracejada horizontal
   - Texto centralizado com fundo
   - Efeito hover (muda cor para azul)

2. **Impressão:**
   - Aplica `page-break-after: always` e `break-after: page`
   - Oculta indicadores visuais na impressão
   - Força quebra de página real

## Uso

### Habilitando a funcionalidade

```html
<app-editor
  [enablePageBreak]="true"
  [(ngModel)]="content">
</app-editor>
```

### Inserindo quebra de página

**Via toolbar:**
1. Clique no botão "Inserir" (+)
2. Selecione "Quebra de página"

**Via teclado:**
- Pressione `Cmd + Enter` (Mac) ou `Ctrl + Enter` (Windows/Linux)

**Programaticamente:**
```typescript
editor.commands.setPageBreak();
```

## Estilo Visual

O page break aparece no editor como:

```
─────────────────────────────────────
         [ PAGE BREAK ]
─────────────────────────────────────
```

Ao passar o mouse sobre ele, a cor muda para azul, indicando interatividade.

## Impressão e Exportação

Ao imprimir ou exportar para PDF:
- O indicador visual é ocultado
- Uma quebra de página real é aplicada
- O conteúdo após o page break inicia em uma nova página

## HTML Gerado

```html
<div data-type="page-break" class="page-break">
  <div class="page-break-line"></div>
  <div class="page-break-text">Page Break</div>
</div>
```

## Notas Técnicas

- Esta é uma implementação customizada, não utiliza o PageKit Pro do Tiptap
- A extensão é compatível com todas as versões do Tiptap v3+
- O page break é tratado como um nó do tipo "block" no ProseMirror
- Totalmente compatível com o sistema de undo/redo do editor

## Compatibilidade

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Impressão em navegadores
- ✅ Exportação para PDF via print
- ✅ Mobile responsive
