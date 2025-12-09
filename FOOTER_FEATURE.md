# Editor Footer Feature

## Descrição

Uma barra de rodapé foi adicionada ao editor Tiptap que exibe contadores de caracteres, palavras e parágrafos em tempo real.

## Funcionalidades

### Contadores em Tempo Real

A barra de rodapé exibe três contadores que são atualizados automaticamente conforme o usuário digita:

- **Caracteres**: Conta todos os caracteres excluindo espaços em branco
- **Palavras**: Conta palavras separadas por espaços
- **Parágrafos**: Conta parágrafos não vazios no documento

### Limites Configuráveis

Cada contador pode ter um limite opcional configurado através de propriedades Input:

- `characterLimit?: number` - Limite máximo de caracteres
- `wordLimit?: number` - Limite máximo de palavras  
- `paragraphLimit?: number` - Limite máximo de parágrafos

### Exibição de Limites

Quando um limite é configurado:

- O contador mostra o formato `x/y` onde:
  - `x` = quantidade atual
  - `y` = limite máximo
- Se o limite for excedido, o contador fica vermelho para alertar o usuário

Quando não há limite configurado:

- O contador mostra apenas a quantidade atual

## Uso

### Exemplo Básico (sem limites)

```html
<app-editor
  formControlName="body"
  [toolbarPreset]="'full'">
</app-editor>
```

O rodapé mostrará:
```
Caracteres: 150    Palavras: 25    Parágrafos: 3
```

### Exemplo com Limites

```html
<app-editor
  formControlName="body"
  [toolbarPreset]="'full'"
  [characterLimit]="1000"
  [wordLimit]="200"
  [paragraphLimit]="10">
</app-editor>
```

O rodapé mostrará:
```
Caracteres: 150/1000    Palavras: 25/200    Parágrafos: 3/10
```

Se algum limite for excedido (ex: 1050 caracteres):
```
Caracteres: 1050/1000 (em vermelho)    Palavras: 25/200    Parágrafos: 3/10
```

## Traduções

Os rótulos da barra de rodapé são totalmente traduzíveis e suportam os seguintes idiomas:

- **Português (Brasil)**: Caracteres, Palavras, Parágrafos
- **English**: Characters, Words, Paragraphs
- **Español**: Caracteres, Palabras, Párrafos

As chaves de tradução são:
- `editor.footer.characters`
- `editor.footer.words`
- `editor.footer.paragraphs`

## Estilização

A barra de rodapé possui:

- Fundo cinza claro (`#f8f8f8`)
- Borda arredondada
- Contadores alinhados à direita
- Valores com fonte monoespaçada para facilitar leitura
- Cor vermelha (`#d32f2f`) quando o limite é excedido

## Implementação Técnica

### Métodos Principais

- `updateCounts()`: Atualiza todos os contadores calculando caracteres, palavras e parágrafos do documento
- Chamado automaticamente no evento `onUpdate` do editor
- Inicializado após a criação do editor

### Cálculo dos Contadores

- **Caracteres**: `editor.getText().replace(/\s/g, '').length`
- **Palavras**: `text.trim().split(/\s+/).filter(word => word.length > 0).length`
- **Parágrafos**: Percorre o documento contando nós do tipo `paragraph` com conteúdo não vazio

## Notas

- Os contadores são atualizados em tempo real conforme o usuário digita
- Os limites são opcionais - se não informados, apenas a contagem é exibida
- A validação dos limites é visual apenas (não bloqueia a digitação)
- Para implementar bloqueio de digitação ao atingir limites, seria necessário adicionar lógica adicional no editor
