# TiptapEditor

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Overview

A rich text editor component built with TipTap and Angular, featuring comprehensive formatting and table management capabilities.

## Features

### Text Formatting
- **Basic Formatting**: Bold, Italic, Underline, Strikethrough, Code
- **Advanced Formatting**: Subscript, Superscript
- **Typography**: Font family, font size, line height
- **Colors**: Text color and highlight with custom color picker
- **Blocks**: Headings (H1-H6), paragraphs, blockquotes, code blocks
- **Lists**: Bullet lists, ordered lists
- **Links**: Insert and remove hyperlinks
- **Mentions**: Custom mention system with @ trigger

### Table Features ✨ NEW
Complete table support with:
- **Table Management**: Insert, delete, duplicate tables
- **Caption**: Add captions with top/bottom positioning
- **Column Resizing**: Drag to resize columns
- **Row Operations**: Insert above/below, delete, toggle header row
- **Column Operations**: Insert before/after, delete
- **Cell Operations**: Merge/split cells
- **Cell Styling**: 
  - Vertical alignment (top, middle, bottom)
  - Background colors with color picker
- **Selection**: Row and column selection support

See [TABLE_FEATURES.md](./TABLE_FEATURES.md) for detailed documentation.

### Internationalization
Full support for:
- 🇧🇷 Portuguese (Brazil)
- 🇺🇸 English
- 🇪🇸 Spanish

### Accessibility
- Keyboard navigation
- ARIA labels
- Focus management
- Screen reader friendly

## Installation

```bash
npm install
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

```bash
npm start
# or
ng serve
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
npm run build
# or
ng build
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

```bash
npm test
# or
ng test
```

## Usage

### Basic Usage

```typescript
import { EditorComponent } from './shared/editor/editor.component';

@Component({
  selector: 'app-my-component',
  template: `
    <app-editor
      [formControl]="myControl"
      [placeholder]="'Type something...'"
      [minHeight]="'300px'">
    </app-editor>
  `
})
export class MyComponent {
  myControl = new FormControl('');
}
```

### Configuration Options

```typescript
<app-editor
  [toolbarPreset]="'full'"        // 'minimal' or 'full'
  [minHeight]="'250px'"
  [placeholder]="'Enter text...'"
  
  // Enable/disable features
  [enableHeading]="true"
  [enableBold]="true"
  [enableItalic]="true"
  [enableStrike]="true"
  [enableCode]="true"
  [enableMention]="true"
  [enableSubscript]="true"
  [enableSuperscript]="true"
  [enableLineHeight]="true"
  [enableFontFamily]="true"
  [enableFontSize]="true"
  [enableTextColor]="true"
  [enableHighlight]="true"
  [enableTable]="true"            // NEW: Table features
  
  // Custom mentions
  [mentionItems]="customMentions"
  
  // Events
  (jsonChange)="onContentChange($event)"
  (focus)="onFocus()"
  (blur)="onBlur()">
</app-editor>
```

### Custom Mentions

```typescript
customMentions = [
  { id: 'user1', label: 'John Doe' },
  { id: 'user2', label: 'Jane Smith' },
  { id: 'team1', label: 'Engineering Team' }
];
```

## Architecture

### Components
- `EditorComponent` - Main editor component with toolbar
- `AppComponent` - Demo application with tabs

### Extensions
Custom TipTap extensions:
- `font-size.ts` - Font size control
- `line-height.ts` - Line height control
- `table-caption.ts` - Table caption support

### Services
- `I18nService` - Internationalization service

## Dependencies

### Core
- Angular 17.3
- TipTap 3.11+
- RxJS 7.8
- ProseMirror

### TipTap Extensions
- @tiptap/core
- @tiptap/starter-kit
- @tiptap/extension-table
- @tiptap/extension-table-row
- @tiptap/extension-table-header
- @tiptap/extension-table-cell
- @tiptap/extension-mention
- @tiptap/extension-subscript
- @tiptap/extension-superscript
- @tiptap/extension-text-style
- @tiptap/extension-font-family
- @tiptap/extension-color
- @tiptap/extension-highlight

### UI
- FontAwesome 7.1
- Tippy.js 6.3
- @govbr-ds/core 3.7

## Project Structure

```
src/
├── app/
│   ├── app.component.ts        # Demo app
│   ├── editor/
│   │   └── editor.component.ts # Example usage
│   └── shared/
│       ├── editor/
│       │   ├── editor.component.ts      # Main editor
│       │   ├── editor.component.html    # Editor template
│       │   ├── editor.component.scss    # Editor styles
│       │   └── extensions/
│       │       ├── font-size.ts         # Custom extension
│       │       ├── line-height.ts       # Custom extension
│       │       └── table-caption.ts     # Custom extension
│       └── services/
│           └── i18n.service.ts          # Translation service
└── assets/
    └── i18n/
        ├── en.json              # English translations
        ├── pt_br.json           # Portuguese translations
        └── es.json              # Spanish translations
```

## Documentation

- [TABLE_FEATURES.md](./TABLE_FEATURES.md) - Detailed table feature documentation
- [TABLE_IMPLEMENTATION_SUMMARY.md](./TABLE_IMPLEMENTATION_SUMMARY.md) - Implementation details
- [GOVBR_INTEGRATION.md](./GOVBR_INTEGRATION.md) - GOV.BR design system integration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

See [LICENSE](./LICENSE) file for details.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

For TipTap documentation, visit [tiptap.dev](https://tiptap.dev).
