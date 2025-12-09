import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Editor, JSONContent, AnyExtension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { PluginKey } from '@tiptap/pm/state';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { I18nService } from '../services/i18n.service';
import { LineHeight } from './extensions/line-height';
import { FontSize } from './extensions/font-size';
import { TableCaption } from './extensions/table-caption';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true,
    },
  ],
})
export class EditorComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor
{
  @ViewChild('editorElement', { static: false })
  editorElement!: ElementRef<HTMLDivElement>;

  // Config visual / comportamento
  @Input() placeholder: string = 'editor.placeholders.default';
  @Input() minHeight: string = '200px';
  @Input() toolbarPreset: 'minimal' | 'full' = 'full';

  @Input() enableHeading = true;
  @Input() enableBold = true;
  @Input() enableItalic = true;
  @Input() enableStrike = true;
  @Input() enableCode = true;
  @Input() enableMention = true;
  @Input() enableSubscript = true;
  @Input() enableSuperscript = true;
  @Input() enableLineHeight = true;
  @Input() enableFontFamily = true;
  @Input() enableFontSize = true;
  @Input() enableTextColor = true;
  @Input() enableHighlight = true;
  @Input() enableTextAlign = true;
  @Input() enableTable = true;
  @Input() enableBalloonMenu = true;
  @Input() mentionItems: { id: string; label: string }[] = [
    { id: 'inicioEdital', label: 'inicioEdital' },
    { id: 'fimEdital', label: 'fimEdital' },
    { id: 'nomeEdital', label: 'nomeEdital' },
    { id: 'descricaoEdital', label: 'descricaoEdital' },
  ];

  @Output() jsonChange = new EventEmitter<JSONContent>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  showMentionDialog = false;
  showBlocksDropdown = false;
  showTextFormattingDropdown = false;
  showLineHeightDropdown = false;
  showFontFamilyDropdown = false;
  showFontSizeDropdown = false;
  showTextColorDropdown = false;
  showHighlightColorDropdown = false;
  showTextAlignDropdown = false;
  showTableDropdown = false;
  showTableCellAlignDropdown = false;
  showTableCellBackgroundDropdown = false;
  showBalloonMenu = false;
  balloonMenuPosition = { top: '0px', left: '0px' };
  currentBlockType: string = 'fas fa-paragraph';
  currentLineHeight: string = 'normal';
  currentFontFamily: string = 'Default';
  currentFontSize: string = '16px';
  currentTextColor: string = '#000000';
  currentHighlightColor: string = '#ffff00';
  currentTextAlign: string = 'left';
  currentTableCellBackground: string = '#ffffff';
  captionPosition: 'top' | 'bottom' = 'top';

  fontFamilies = [
    { value: 'Default', label: 'Default' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: '"Times New Roman", serif', label: 'Times New Roman' },
    { value: '"Courier New", monospace', label: 'Courier New' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma' },
    { value: '"Comic Sans MS", cursive', label: 'Comic Sans MS' },
  ];

  fontSizes = [
    { value: '10px', label: '10' },
    { value: '12px', label: '12' },
    { value: '14px', label: '14' },
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
    { value: '20px', label: '20' },
    { value: '24px', label: '24' },
    { value: '28px', label: '28' },
    { value: '32px', label: '32' },
    { value: '36px', label: '36' },
  ];

  textColors = [
    { value: '#000000', label: 'Preto' },
    { value: '#FFFFFF', label: 'Branco' },
    { value: '#FF0000', label: 'Vermelho' },
    { value: '#00FF00', label: 'Verde' },
    { value: '#0000FF', label: 'Azul' },
    { value: '#FFFF00', label: 'Amarelo' },
    { value: '#FF00FF', label: 'Magenta' },
    { value: '#00FFFF', label: 'Ciano' },
    { value: '#FFA500', label: 'Laranja' },
    { value: '#800080', label: 'Roxo' },
    { value: '#808080', label: 'Cinza' },
    { value: '#A52A2A', label: 'Marrom' },
  ];

  highlightColors = [
    { value: '#FFFF00', label: 'Amarelo' },
    { value: '#00FF00', label: 'Verde' },
    { value: '#00FFFF', label: 'Ciano' },
    { value: '#FF00FF', label: 'Magenta' },
    { value: '#FFA500', label: 'Laranja' },
    { value: '#FFB6C1', label: 'Rosa' },
    { value: '#90EE90', label: 'Verde Claro' },
    { value: '#ADD8E6', label: 'Azul Claro' },
    { value: '#FFFFE0', label: 'Amarelo Claro' },
    { value: '#FFE4B5', label: 'Pêssego' },
    { value: '#E6E6FA', label: 'Lavanda' },
    { value: '#F0E68C', label: 'Khaki' },
  ];
  private editor!: Editor;

  // ControlValueAccessor
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  isDisabled = false;

  private innerValue = '<p>Digite aqui…</p>';

  constructor(
    private i18nService: I18nService,
    private translateService: TranslateService
  ) {}

  ngAfterViewInit(): void {
    const extensions: AnyExtension[] = [
      StarterKit.configure({
        heading: this.enableHeading
          ? { levels: [1, 2, 3] }
          : false,
        bold: this.enableBold ? {} : false,
        italic: this.enableItalic ? {} : false,
        strike: this.enableStrike ? {} : false,
        code: this.enableCode ? {} : false,
      }),
    ];

    // Add Subscript extension
    if (this.enableSubscript) {
      extensions.push(Subscript);
    }

    // Add Superscript extension
    if (this.enableSuperscript) {
      extensions.push(Superscript);
    }

    // Add Line Height extension
    if (this.enableLineHeight) {
      extensions.push(LineHeight.configure({
        types: ['paragraph', 'heading'],
        defaultLineHeight: 'normal',
      }));
    }

    // Add TextStyle extension (required for Font Family, Color)
    if (this.enableFontFamily || this.enableTextColor) {
      extensions.push(TextStyle);
    }

    // Add Font Family extension
    if (this.enableFontFamily) {
      extensions.push(FontFamily);
    }

    // Add Font Size extension
    if (this.enableFontSize) {
      extensions.push(FontSize.configure({
        types: ['textStyle'],
      }));
    }

    // Add Color extension
    if (this.enableTextColor) {
      extensions.push(Color);
    }

    // Add Highlight extension
    if (this.enableHighlight) {
      extensions.push(Highlight.configure({
        multicolor: true,
      }));
    }

    // Add TextAlign extension
    if (this.enableTextAlign) {
      extensions.push(TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }));
    }

    // Add Table extensions
    if (this.enableTable) {
      extensions.push(
        Table.configure({
          resizable: true,
          HTMLAttributes: {
            class: 'tiptap-table',
          },
        }),
        TableRow,
        TableHeader,
        TableCell.configure({
          HTMLAttributes: {
            class: 'tiptap-table-cell',
          },
        }),
        TableCaption
      );
    }

    if (this.enableMention) {
      const self = this;
      extensions.push(
        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          suggestion: {
            pluginKey: new PluginKey('mention'),
            char: '@',
            items: ({ query }) => {
              return this.mentionItems
                .filter(item =>
                  item.label.toLowerCase().includes(query.toLowerCase())
                )
                .slice(0, 5);
            },
            render: () => {
              let component: HTMLElement;
              let popup: TippyInstance[];

              return {
                onStart: (props: any) => {
                  component = document.createElement('div');
                  component.className = 'mention-dropdown';

                  if (!props.clientRect) {
                    return;
                  }

                  popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                  });

                  self.renderMentionList(component, props.items, props.command);
                },

                onUpdate(props: any) {
                  if (!props.clientRect) {
                    return;
                  }

                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                  });

                  component.innerHTML = '';
                  self.renderMentionList(component, props.items, props.command);
                },

                onKeyDown(props: any) {
                  if (props.event.key === 'Escape') {
                    popup[0].hide();
                    return true;
                  }

                  const items = component.querySelectorAll('.mention-item');
                  const selectedIndex = Array.from(items).findIndex((item: Element) =>
                    item.classList.contains('selected')
                  );

                  if (props.event.key === 'ArrowDown') {
                    const nextIndex = (selectedIndex + 1) % items.length;
                    items.forEach((item: Element, idx: number) => {
                      item.classList.toggle('selected', idx === nextIndex);
                    });
                    return true;
                  }

                  if (props.event.key === 'ArrowUp') {
                    const prevIndex =
                      (selectedIndex - 1 + items.length) % items.length;
                    items.forEach((item: Element, idx: number) => {
                      item.classList.toggle('selected', idx === prevIndex);
                    });
                    return true;
                  }

                  if (props.event.key === 'Enter') {
                    const selected = items[selectedIndex >= 0 ? selectedIndex : 0];
                    if (selected) {
                      (selected as HTMLElement).click();
                      return true;
                    }
                  }

                  return false;
                },

                onExit() {
                  popup[0].destroy();
                },
              };
            },
          },
        })
      );
    }

    // Traduz o placeholder
    const translatedPlaceholder = this.isKeyTranslatable(this.placeholder)
      ? this.translateSync(this.placeholder)
      : this.placeholder;

    this.editor = new Editor({
      element: this.editorElement.nativeElement,
      extensions,
      content: this.innerValue,
      editable: !this.isDisabled,
      editorProps: {
        attributes: {
          'data-placeholder': translatedPlaceholder,
        },
        handleDOMEvents: {
          focus: () => {
            this.focus.emit();
            return false;
          },
          blur: () => {
            this.blur.emit();
            this.onTouched();
            return false;
          },
          mousedown: (view, event) => {
            const target = event.target as HTMLElement;
            if (target.closest('a')) {
              event.preventDefault();
              return true;
            }
            return false;
          },
          click: (view, event) => {
            const target = event.target as HTMLElement;
            if (target.closest('a')) {
              event.preventDefault();
              return true;
            }
            return false;
          },
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        const json = editor.getJSON();
        this.innerValue = html;
        this.onChange(html);
        this.jsonChange.emit(json);
        this.updateCurrentBlockType();
      },
      onSelectionUpdate: ({ editor }) => {
        this.updateCurrentBlockType();
        this.updateBalloonMenuPosition();
      },
    });

    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (!target.closest('.toolbar-dropdown') && !target.closest('.toolbar-color-picker')) {
        this.showBlocksDropdown = false;
        this.showLineHeightDropdown = false;
        this.showFontFamilyDropdown = false;
        this.showFontSizeDropdown = false;
        this.showTextColorDropdown = false;
        this.showHighlightColorDropdown = false;
        this.showTextAlignDropdown = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  // Helper method for rendering mention dropdown
  private renderMentionList(
    container: HTMLElement,
    items: any[],
    command: any
  ): void {
    if (items.length === 0) {
      container.innerHTML = `<div class="mention-item">${this.translateSync('editor.messages.noResults')}</div>`;
      return;
    }

    items.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = 'mention-item';
      if (index === 0) {
        button.classList.add('selected');
      }
      button.textContent = item.label;
      button.addEventListener('click', () => {
        command({ id: item.id, label: item.label });
      });
      container.appendChild(button);
    });
  }

  // Toolbar actions

  undo(): void {
    this.editor?.chain().focus().undo().run();
  }

  redo(): void {
    this.editor?.chain().focus().redo().run();
  }

  setParagraph(): void {
    this.editor?.chain().focus().setParagraph().run();
  }

  setHeading(level: 1 | 2 | 3 | 4 | 5 | 6): void {
    this.editor?.chain().focus().toggleHeading({ level }).run();
  }

  toggleBulletList(): void {
    this.editor?.chain().focus().toggleBulletList().run();
  }

  toggleOrderedList(): void {
    this.editor?.chain().focus().toggleOrderedList().run();
  }

  toggleBlockquote(): void {
    this.editor?.chain().focus().toggleBlockquote().run();
  }

  toggleCodeBlock(): void {
    this.editor?.chain().focus().toggleCodeBlock().run();
  }

  toggleBold(): void {
    this.editor?.chain().focus().toggleBold().run();
  }

  toggleItalic(): void {
    this.editor?.chain().focus().toggleItalic().run();
  }

  toggleUnderline(): void {
    this.editor?.chain().focus().toggleUnderline().run();
  }

  toggleCode(): void {
    this.editor?.chain().focus().toggleCode().run();
  }

  toggleStrike(): void {
    this.editor?.chain().focus().toggleStrike().run();
  }

  toggleSubscript(): void {
    this.editor?.chain().focus().toggleSubscript().run();
  }

  toggleSuperscript(): void {
    this.editor?.chain().focus().toggleSuperscript().run();
  }

  // Text Formatting Dropdown
  toggleTextFormattingDropdown(): void {
    this.showTextFormattingDropdown = !this.showTextFormattingDropdown;
  }

  closeTextFormattingDropdown(): void {
    this.showTextFormattingDropdown = false;
  }

  setLineHeight(lineHeight: string): void {
    this.editor?.chain().focus().setLineHeight(lineHeight).run();
    this.currentLineHeight = lineHeight;
    this.closeLineHeightDropdown();
  }

  toggleLineHeightDropdown(): void {
    this.showLineHeightDropdown = !this.showLineHeightDropdown;
  }

  closeLineHeightDropdown(): void {
    this.showLineHeightDropdown = false;
  }

  getLineHeightLabel(): string {
    switch (this.currentLineHeight) {
      case 'normal':
        return this.translateSync('editor.lineHeight.simple');
      case '1.15':
        return '1.15';
      case '1.5':
        return '1.5';
      case '2':
        return this.translateSync('editor.lineHeight.double');
      default:
        return this.translateSync('editor.lineHeight.simple');
    }
  }

  // Font Family methods
  toggleFontFamilyDropdown(): void {
    this.showFontFamilyDropdown = !this.showFontFamilyDropdown;
  }

  closeFontFamilyDropdown(): void {
    this.showFontFamilyDropdown = false;
  }

  setFontFamily(fontFamily: string): void {
    if (fontFamily === 'Default') {
      this.editor?.chain().focus().unsetFontFamily().run();
    } else {
      this.editor?.chain().focus().setFontFamily(fontFamily).run();
    }
    this.currentFontFamily = fontFamily;
    this.closeFontFamilyDropdown();
  }

  getFontFamilyLabel(): string {
    const family = this.fontFamilies.find(f => f.value === this.currentFontFamily);
    return family ? family.label : 'Default';
  }

  // Font Size methods
  toggleFontSizeDropdown(): void {
    this.showFontSizeDropdown = !this.showFontSizeDropdown;
  }

  closeFontSizeDropdown(): void {
    this.showFontSizeDropdown = false;
  }

  setFontSize(fontSize: string): void {
    this.editor?.chain().focus().setFontSize(fontSize).run();
    this.currentFontSize = fontSize;
    this.closeFontSizeDropdown();
  }

  getFontSizeLabel(): string {
    return this.currentFontSize.replace('px', '');
  }

  // Text Color methods
  toggleTextColorDropdown(): void {
    this.showTextColorDropdown = !this.showTextColorDropdown;
  }

  closeTextColorDropdown(): void {
    this.showTextColorDropdown = false;
  }

  setTextColor(color: string): void {
    this.editor?.chain().focus().setColor(color).run();
    this.currentTextColor = color;
  }

  setTextColorFromPicker(event: Event): void {
    const input = event.target as HTMLInputElement;
    const color = input.value;
    this.setTextColor(color);
  }

  selectTextColor(color: string): void {
    this.setTextColor(color);
    this.closeTextColorDropdown();
  }

  // Highlight Color methods
  toggleHighlightColorDropdown(): void {
    this.showHighlightColorDropdown = !this.showHighlightColorDropdown;
  }

  closeHighlightColorDropdown(): void {
    this.showHighlightColorDropdown = false;
  }

  setHighlightColor(color: string): void {
    this.editor?.chain().focus().setHighlight({ color }).run();
    this.currentHighlightColor = color;
  }

  setHighlightColorFromPicker(event: Event): void {
    const input = event.target as HTMLInputElement;
    const color = input.value;
    this.setHighlightColor(color);
  }

  selectHighlightColor(color: string): void {
    this.setHighlightColor(color);
    this.closeHighlightColorDropdown();
  }

  removeHighlight(): void {
    this.editor?.chain().focus().unsetHighlight().run();
  }

  // Text Align methods
  toggleTextAlignDropdown(): void {
    this.showTextAlignDropdown = !this.showTextAlignDropdown;
  }

  closeTextAlignDropdown(): void {
    this.showTextAlignDropdown = false;
  }

  setTextAlign(align: 'left' | 'center' | 'right' | 'justify'): void {
    this.editor?.chain().focus().setTextAlign(align).run();
    this.currentTextAlign = align;
    this.closeTextAlignDropdown();
  }

  getTextAlignIcon(): string {
    switch (this.currentTextAlign) {
      case 'left':
        return 'fas fa-align-left';
      case 'center':
        return 'fas fa-align-center';
      case 'right':
        return 'fas fa-align-right';
      case 'justify':
        return 'fas fa-align-justify';
      default:
        return 'fas fa-align-left';
    }
  }

  // Table methods
  toggleTableDropdown(): void {
    this.showTableDropdown = !this.showTableDropdown;
  }

  closeTableDropdown(): void {
    this.showTableDropdown = false;
  }

  insertTable(): void {
    this.editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
    this.closeTableDropdown();
  }

  deleteTable(): void {
    this.editor?.chain().focus().deleteTable().run();
    this.closeTableDropdown();
  }

  duplicateTable(): void {
    // Get current table content
    const { state } = this.editor!;
    const { selection } = state;
    const { $from } = selection;
    
    // Find the table node
    let tableNode: any = null;
    let tablePos = -1;
    
    for (let d = $from.depth; d > 0; d--) {
      const node = $from.node(d);
      if (node.type.name === 'table') {
        tableNode = node;
        tablePos = $from.before(d);
        break;
      }
    }

    if (tableNode && tablePos >= 0) {
      this.editor
        ?.chain()
        .focus()
        .insertContentAt(tablePos + tableNode.nodeSize, tableNode.toJSON())
        .run();
    }
    this.closeTableDropdown();
  }

  toggleHeaderRow(): void {
    this.editor?.chain().focus().toggleHeaderRow().run();
    this.closeTableDropdown();
  }

  addRowBefore(): void {
    this.editor?.chain().focus().addRowBefore().run();
    this.closeTableDropdown();
  }

  addRowAfter(): void {
    this.editor?.chain().focus().addRowAfter().run();
    this.closeTableDropdown();
  }

  deleteRow(): void {
    this.editor?.chain().focus().deleteRow().run();
    this.closeTableDropdown();
  }

  addColumnBefore(): void {
    this.editor?.chain().focus().addColumnBefore().run();
    this.closeTableDropdown();
  }

  addColumnAfter(): void {
    this.editor?.chain().focus().addColumnAfter().run();
    this.closeTableDropdown();
  }

  deleteColumn(): void {
    this.editor?.chain().focus().deleteColumn().run();
    this.closeTableDropdown();
  }

  mergeCells(): void {
    this.editor?.chain().focus().mergeCells().run();
    this.closeTableDropdown();
  }

  splitCell(): void {
    this.editor?.chain().focus().splitCell().run();
    this.closeTableDropdown();
  }

  toggleTableCellAlignDropdown(): void {
    this.showTableCellAlignDropdown = !this.showTableCellAlignDropdown;
  }

  closeTableCellAlignDropdown(): void {
    this.showTableCellAlignDropdown = false;
  }

  setCellVerticalAlign(align: 'top' | 'middle' | 'bottom'): void {
    const alignValue = align === 'top' ? 'top' : align === 'middle' ? 'middle' : 'bottom';
    this.editor?.chain().focus().setCellAttribute('verticalAlign', alignValue).run();
    this.closeTableCellAlignDropdown();
  }

  toggleTableCellBackgroundDropdown(): void {
    this.showTableCellBackgroundDropdown = !this.showTableCellBackgroundDropdown;
  }

  closeTableCellBackgroundDropdown(): void {
    this.showTableCellBackgroundDropdown = false;
  }

  setCellBackground(color: string): void {
    this.editor?.chain().focus().setCellAttribute('backgroundColor', color).run();
    this.currentTableCellBackground = color;
  }

  setCellBackgroundFromPicker(event: Event): void {
    const input = event.target as HTMLInputElement;
    const color = input.value;
    this.setCellBackground(color);
  }

  selectCellBackground(color: string): void {
    this.setCellBackground(color);
    this.closeTableCellBackgroundDropdown();
  }

  removeCellBackground(): void {
    this.editor?.chain().focus().setCellAttribute('backgroundColor', null).run();
    this.closeTableCellBackgroundDropdown();
  }

  addTableCaption(): void {
    const { state } = this.editor!;
    const { selection } = state;
    const { $from } = selection;
    
    // Find the table node
    let tablePos = -1;
    
    for (let d = $from.depth; d > 0; d--) {
      const node = $from.node(d);
      if (node.type.name === 'table') {
        tablePos = $from.before(d);
        break;
      }
    }

    if (tablePos >= 0) {
      const captionText = prompt('Digite o texto da legenda:');
      if (captionText) {
        // Insert caption at the beginning of the table
        const captionPos = this.captionPosition === 'top' ? tablePos + 1 : tablePos;
        this.editor
          ?.chain()
          .focus()
          .insertContentAt(captionPos, {
            type: 'tableCaption',
            content: [{ type: 'text', text: captionText }],
          })
          .run();
      }
    }
    this.closeTableDropdown();
  }

  toggleCaptionPosition(): void {
    this.captionPosition = this.captionPosition === 'top' ? 'bottom' : 'top';
    // Note: Moving caption requires more complex logic with ProseMirror
    // For now, we'll just toggle the state
    this.closeTableDropdown();
  }

  // Link simples (abre prompt por enquanto)
  setLink(): void {
    const previousUrl = this.editor?.getAttributes('link')['href'] as string | undefined;
    const prompt = this.translateSync('editor.dialogs.linkPrompt');
    const defaultValue = this.translateSync('editor.dialogs.linkDefault');
    const url = window.prompt(prompt, previousUrl || defaultValue);

    if (url === null) {
      return;
    }

    if (url === '') {
      this.editor?.chain().focus().unsetLink().run();
      return;
    }

    this.editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }

  unsetLink(): void {
    this.editor?.chain().focus().unsetLink().run();
  }

  openMentionDialog(): void {
    this.showMentionDialog = true;
  }

  closeMentionDialog(): void {
    this.showMentionDialog = false;
  }

  insertMention(item: { id: string; label: string }): void {
    this.editor
      ?.chain()
      .focus()
      .insertContent({
        type: 'mention',
        attrs: { id: item.id, label: item.label },
      })
      .run();
    this.closeMentionDialog();
  }

  toggleBlocksDropdown(): void {
    this.showBlocksDropdown = !this.showBlocksDropdown;
  }

  closeBlocksDropdown(): void {
    this.showBlocksDropdown = false;
  }

  selectBlockType(type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'quote' | 'code-block'): void {
    switch (type) {
      case 'paragraph':
        this.setParagraph();
        break;
      case 'h1':
        this.setHeading(1);
        break;
      case 'h2':
        this.setHeading(2);
        break;
      case 'h3':
        this.setHeading(3);
        break;
      case 'h4':
        this.setHeading(4);
        break;
      case 'h5':
        this.setHeading(5);
        break;
      case 'h6':
        this.setHeading(6);
        break;
      case 'quote':
        this.toggleBlockquote();
        break;
      case 'code-block':
        this.toggleCodeBlock();
        break;
    }
    this.closeBlocksDropdown();
    this.updateCurrentBlockType();
  }

  private updateCurrentBlockType(): void {
    if (!this.editor) return;

    const { $from } = this.editor.state.selection;
    const node = $from.node();

    if (node.type.name === 'heading') {
      const level = node.attrs['level'];
      this.currentBlockType = `fas fa-heading`;
    } else if (node.type.name === 'blockquote') {
      this.currentBlockType = 'fas fa-quote-left';
    } else if (node.type.name === 'code_block') {
      this.currentBlockType = 'fas fa-code';
    } else if (node.type.name === 'paragraph') {
      this.currentBlockType = 'fas fa-paragraph';
    } else {
      this.currentBlockType = 'fas fa-paragraph';
    }

    // Update current text alignment
    const textAlign = node.attrs['textAlign'] || 'left';
    this.currentTextAlign = textAlign;
  }

  private updateBalloonMenuPosition(): void {
    // Verifica se o balloon menu está habilitado
    if (!this.enableBalloonMenu) {
      this.showBalloonMenu = false;
      return;
    }

    // Verifica se há seleção de texto
    const { from, to } = this.editor!.state.selection;
    const isEmpty = from === to;

    if (isEmpty) {
      this.showBalloonMenu = false;
      return;
    }

    // Obtém as coordenadas da seleção
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Posiciona o menu acima da seleção
        const top = rect.top - 10;
        const left = rect.left + rect.width / 2;

        this.balloonMenuPosition = {
          top: `${top}px`,
          left: `${left}px`,
        };

        this.showBalloonMenu = true;
      }
    }, 0);
  }

  closeBalloonMenu(): void {
    this.showBalloonMenu = false;
  }

  // ControlValueAccessor

  writeValue(value: string | null): void {
    this.innerValue = value ?? '';
    if (this.editor) {
      this.editor.commands.setContent(this.innerValue || '');
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.editor) {
      this.editor.setEditable(!isDisabled);
    }
  }

  /**
   * Verifica se a string é uma chave de tradução
   */
  private isKeyTranslatable(key: string): boolean {
    return key.includes('.');
  }

  /**
   * Traduz uma chave de forma síncrona
   */
  private translateSync(key: string): string {
    let result = '';
    this.translateService.get(key).subscribe((res) => {
      result = res;
    });
    return result || key;
  }
}
