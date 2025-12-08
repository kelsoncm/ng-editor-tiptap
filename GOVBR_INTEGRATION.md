# Integração GOV.BR Design System

## Resumo da Integração

Este projeto foi configurado para usar o **@govbr-ds/webcomponents-angular** como tema de design system.

## Pacotes Instalados

- **@govbr-ds/core** `^3.7.0` - Estilos e tokens do GOV.BR Design System
- **@govbr-ds/webcomponents-angular** `^2.0.0-next.57` - Wrapper Angular para Web Components

## Mudanças Realizadas

### 1. **src/styles.scss**
Importação dos estilos do GOV.BR Design System Core:
```scss
@import '@govbr-ds/core/dist/core-tokens.min.css';
```

### 2. **src/app/app.component.ts**
- Adicionado `CUSTOM_ELEMENTS_SCHEMA` para permitir Web Components
- Adicionado `FormsModule` nas importações para suporte a formulários

```typescript
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  // ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ReactiveFormsModule, FormsModule, EditorComponent],
})
```

### 3. **src/app/shared/editor/editor.component.ts**
- Adicionado `CUSTOM_ELEMENTS_SCHEMA` no componente de editor

### 4. **Corrigido o componente EditorComponent**
- Corrigido acesso ao atributo `href` usando notation com chaves: `['href']`
- Removidas referências a métodos não disponíveis no Tiptap (toggleHighlight, toggleSuperscript, toggleSubscript)

## Como Usar Web Components do GOV.BR

### Componentes Standalone
Importe os componentes conforme necessário:

```typescript
import { BrButton } from '@govbr-ds/webcomponents-angular/standalone'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BrButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<br-button emphasis="primary">Clique aqui</br-button>`,
})
export class AppComponent {}
```

### Componentes com ngModel
Para usar com formulários reactive forms:

```html
<br-checkbox
  name="example"
  [(ngModel)]="value"
  ngDefaultControl
>
  Concordo
</br-checkbox>
```

## Recursos Disponíveis

- **Documentação Oficial**: [gov.br/ds/webcomponents](https://gov.br/ds/webcomponents)
- **Design Tokens**: Variáveis CSS para cores, tipografia, espaçamento, etc.
- **Componentes Web**: Botões, checkboxes, inputs, modais, e muito mais

## Compilação

O projeto está pronto para build e development:

```bash
# Development
npm start

# Build para produção
npm run build

# Testes
npm test
```

## Notas

- O projeto usa **standalone components** (Angular 17+)
- O CUSTOM_ELEMENTS_SCHEMA é necessário para permitir Web Components não reconhecidos pelo Angular
- Os estilos do GOV.BR são carregados automaticamente via import no styles.scss
