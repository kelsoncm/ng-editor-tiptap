import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
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
import { Indent } from './extensions/indent';
import { CustomOrderedList, OrderedListType } from './extensions/ordered-list';
import { CustomBulletList, BulletListType } from './extensions/bullet-list';
import { PageBreak } from './extensions/page-break';
import TableOfContents from '@tiptap/extension-table-of-contents';

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
  @Input() enablePageBreak = true;
  @Input() enableTableOfContents = false;
  @Input() mentionItems: { id: string; label: string }[] = [
    { id: 'inicioEdital', label: 'inicioEdital' },
    { id: 'fimEdital', label: 'fimEdital' },
    { id: 'nomeEdital', label: 'nomeEdital' },
    { id: 'descricaoEdital', label: 'descricaoEdital' },
  ];

  // Footer settings
  @Input() showFooter = true;
  @Input() characterLimit?: number;
  @Input() characterMinimum?: number;
  @Input() wordLimit?: number;
  @Input() wordMinimum?: number;
  @Input() paragraphLimit?: number;
  @Input() paragraphMinimum?: number;

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
  showInsertDropdown = false;
  showTableDropdown = false;
  showTableCellAlignDropdown = false;
  showTableCellBackgroundDropdown = false;
  showOrderedListTypeDropdown = false;
  showBulletListTypeDropdown = false;
  showBalloonMenu = false;
  balloonMenuPosition = { top: '0px', left: '0px' };
  isInTable = false;
  showTableOfContents = false;
  tableOfContentsData: any[] = [];
  currentBlockType: string = 'fas fa-paragraph';
  currentLineHeight: string = 'normal';
  currentFontFamily: string = 'Default';
  currentFontSize: string = '16px';
  currentTextColor: string = '#000000';
  currentHighlightColor: string = '#ffff00';
  currentTextAlign: string = 'left';
  currentTableCellBackground: string = '#ffffff';
  currentOrderedListType: OrderedListType = 'decimal';
  currentBulletListType: BulletListType = 'disc';
  captionPosition: 'top' | 'bottom' = 'top';

  // Counters for footer
  characterCount = 0;
  wordCount = 0;
  paragraphCount = 0;

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

  orderedListTypes: { value: OrderedListType; labelKey: string; icon: string }[] = [
    { value: 'decimal', labelKey: 'editor.orderedListTypes.decimal', icon: '1.' },
    { value: 'decimal-leading-zero', labelKey: 'editor.orderedListTypes.decimalLeadingZero', icon: '01.' },
    { value: 'lower-alpha', labelKey: 'editor.orderedListTypes.lowerAlpha', icon: 'a.' },
    { value: 'upper-alpha', labelKey: 'editor.orderedListTypes.upperAlpha', icon: 'A.' },
    { value: 'lower-roman', labelKey: 'editor.orderedListTypes.lowerRoman', icon: 'i.' },
    { value: 'upper-roman', labelKey: 'editor.orderedListTypes.upperRoman', icon: 'I.' },
  ];

  bulletListTypes: { value: BulletListType; labelKey: string; icon: string }[] = [
    { value: 'disc', labelKey: 'editor.bulletListTypes.disc', icon: '●' },
    { value: 'circle', labelKey: 'editor.bulletListTypes.circle', icon: '○' },
    { value: 'square', labelKey: 'editor.bulletListTypes.square', icon: '■' },
    { value: '"\\2714"', labelKey: 'editor.bulletListTypes.check', icon: '✔' },
    { value: '"\\2705"', labelKey: 'editor.bulletListTypes.checkmark', icon: '✅' },
    { value: '"\\2610"', labelKey: 'editor.bulletListTypes.checkbox', icon: '☐' },
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
        orderedList: false, // Disable default OrderedList
        bulletList: false, // Disable default BulletList
      }),
      CustomOrderedList, // Use custom OrderedList
      CustomBulletList, // Use custom BulletList
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

    // Add Indent extension
    extensions.push(Indent.configure({
      types: ['paragraph', 'heading', 'blockquote'],
      indentLevels: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300],
      defaultIndentLevel: 0,
    }));

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

    // Add PageBreak extension
    if (this.enablePageBreak) {
      extensions.push(PageBreak);
    }

    // Add TableOfContents extension
    if (this.enableTableOfContents) {
      extensions.push(TableOfContents);
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
        this.updateCounts();
        if (this.showTableOfContents) {
          this.updateTableOfContents();
        }
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
        this.showInsertDropdown = false;
      }
    });

    // Initialize counts
    setTimeout(() => {
      this.updateCounts();
    }, 0);
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Verifica se o clique foi em um dropdown, na toolbar ou no balloon menu
    const clickedInsideToolbar = target.closest('.toolbar');
    const clickedInsideDropdown = target.closest('.dropdown-menu') || target.closest('.dropdown-trigger');
    const clickedInsideBalloon = target.closest('.balloon-menu');
    const clickedInsideEditor = this.editorElement?.nativeElement.contains(target);
    
    // Se clicou fora da toolbar, dropdowns e balloon menu, fecha tudo
    if (!clickedInsideToolbar && !clickedInsideDropdown && !clickedInsideBalloon) {
      this.closeAllToolbarDropdowns();
    }
    
    // Se clicou no editor mas não no balloon, fecha o balloon
    if (clickedInsideEditor && !clickedInsideBalloon) {
      // Não fecha o balloon aqui, pois updateBalloonMenuPosition vai cuidar disso
    }
  }

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
    // After creating the list, set its type
    setTimeout(() => {
      this.editor?.chain().focus().setBulletListType(this.currentBulletListType).run();
    }, 0);
  }

  toggleBulletListTypeDropdown(): void {
    const willOpen = !this.showBulletListTypeDropdown;
    this.showBulletListTypeDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('bulletListType');
      this.closeBalloonMenu();
    }
  }

  closeBulletListTypeDropdown(): void {
    this.showBulletListTypeDropdown = false;
  }

  applyBulletListType(listType: BulletListType): void {
    this.currentBulletListType = listType;
    
    // Check if we're already in a bullet list
    const isInBulletList = this.editor?.isActive('bulletList');
    
    if (!isInBulletList) {
      // Create new bullet list
      this.editor?.chain().focus().toggleBulletList().run();
    }
    
    // Set the list type
    setTimeout(() => {
      this.editor?.chain().focus().setBulletListType(listType).run();
    }, 0);
    
    this.closeBulletListTypeDropdown();
  }

  removeBulletList(): void {
    this.editor?.chain().focus().toggleBulletList().run();
    this.closeBulletListTypeDropdown();
  }

  isInBulletList(): boolean {
    return this.editor?.isActive('bulletList') ?? false;
  }

  getBulletListTypeIcon(): string {
    const type = this.bulletListTypes.find(t => t.value === this.currentBulletListType);
    return type ? type.icon : '●';
  }

  toggleOrderedList(): void {
    this.editor?.chain().focus().toggleOrderedList().run();
    // After creating the list, set its type
    setTimeout(() => {
      this.editor?.chain().focus().setOrderedListType(this.currentOrderedListType).run();
    }, 0);
  }

  toggleOrderedListTypeDropdown(): void {
    const willOpen = !this.showOrderedListTypeDropdown;
    this.showOrderedListTypeDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('orderedListType');
      this.closeBalloonMenu();
    }
  }

  closeOrderedListTypeDropdown(): void {
    this.showOrderedListTypeDropdown = false;
  }

  applyOrderedListType(listType: OrderedListType): void {
    this.currentOrderedListType = listType;
    
    // Check if we're already in an ordered list
    const isInOrderedList = this.editor?.isActive('orderedList');
    
    if (!isInOrderedList) {
      // Create new ordered list
      this.editor?.chain().focus().toggleOrderedList().run();
    }
    
    // Set the list type
    setTimeout(() => {
      this.editor?.chain().focus().setOrderedListType(listType).run();
    }, 0);
    
    this.closeOrderedListTypeDropdown();
  }

  removeOrderedList(): void {
    this.editor?.chain().focus().toggleOrderedList().run();
    this.closeOrderedListTypeDropdown();
  }

  isInOrderedList(): boolean {
    return this.editor?.isActive('orderedList') ?? false;
  }

  setOrderedListType(listType: OrderedListType): void {
    this.currentOrderedListType = listType;
    this.editor?.chain().focus().setOrderedListType(listType).run();
    this.closeOrderedListTypeDropdown();
  }

  getOrderedListTypeIcon(): string {
    const type = this.orderedListTypes.find(t => t.value === this.currentOrderedListType);
    return type ? type.icon : '1.';
  }

  indent(): void {
    // Try to indent list item first
    if (this.editor?.can().sinkListItem('listItem')) {
      this.editor?.chain().focus().sinkListItem('listItem').run();
    } else {
      // Otherwise, indent the block
      this.editor?.chain().focus().indent().run();
    }
  }

  outdent(): void {
    // Try to outdent list item first
    if (this.editor?.can().liftListItem('listItem')) {
      this.editor?.chain().focus().liftListItem('listItem').run();
    } else {
      // Otherwise, outdent the block
      this.editor?.chain().focus().outdent().run();
    }
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
    const willOpen = !this.showTextFormattingDropdown;
    this.showTextFormattingDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('textFormatting');
      this.closeBalloonMenu();
    }
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
    const willOpen = !this.showLineHeightDropdown;
    this.showLineHeightDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('lineHeight');
      this.closeBalloonMenu();
    }
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
    const willOpen = !this.showFontFamilyDropdown;
    this.showFontFamilyDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('fontFamily');
      this.closeBalloonMenu();
    }
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
    const willOpen = !this.showFontSizeDropdown;
    this.showFontSizeDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('fontSize');
      this.closeBalloonMenu();
    }
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
    const willOpen = !this.showTextColorDropdown;
    this.showTextColorDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('textColor');
      this.closeBalloonMenu();
    }
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
    const willOpen = !this.showHighlightColorDropdown;
    this.showHighlightColorDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('highlightColor');
      this.closeBalloonMenu();
    }
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
    const willOpen = !this.showTextAlignDropdown;
    this.showTextAlignDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('textAlign');
      this.closeBalloonMenu();
    }
  }

  closeTextAlignDropdown(): void {
    this.showTextAlignDropdown = false;
  }

  // Insert dropdown methods
  toggleInsertDropdown(): void {
    const willOpen = !this.showInsertDropdown;
    this.showInsertDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('insert');
      this.closeBalloonMenu();
    }
  }

  closeInsertDropdown(): void {
    this.showInsertDropdown = false;
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
    const willOpen = !this.showTableDropdown;
    this.showTableDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('table');
      this.closeBalloonMenu();
    }
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
    const willOpen = !this.showTableCellAlignDropdown;
    this.showTableCellAlignDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('tableCellAlign');
      this.closeBalloonMenu();
    }
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
    const willOpen = !this.showTableCellBackgroundDropdown;
    this.showTableCellBackgroundDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('tableCellBackground');
      this.closeBalloonMenu();
    }
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

  setPageBreak(): void {
    this.editor?.chain().focus().setPageBreak().run();
  }

  toggleTableOfContents(): void {
    this.showTableOfContents = !this.showTableOfContents;
    if (this.showTableOfContents) {
      this.updateTableOfContents();
    }
  }

  updateTableOfContents(): void {
    if (this.editor && this.enableTableOfContents) {
      const storage = this.editor.storage.tableOfContents;
      if (storage && storage.content) {
        this.tableOfContentsData = storage.content;
      }
    }
  }

  scrollToHeading(item: any): void {
    if (item.dom) {
      item.dom.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Highlight the heading temporarily
      item.dom.style.backgroundColor = '#e7f1ff';
      setTimeout(() => {
        item.dom.style.backgroundColor = '';
      }, 1000);
    }
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
    const willOpen = !this.showBlocksDropdown;
    this.showBlocksDropdown = willOpen;
    if (willOpen) {
      this.closeAllToolbarDropdownsExcept('blocks');
      this.closeBalloonMenu();
    }
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
    // Verifica se há seleção de texto ou se está dentro de uma tabela
    const { from, to } = this.editor!.state.selection;
    const isEmpty = from === to;
    
    // Verifica se o cursor está dentro de uma tabela
    const isInsideTable = this.editor?.isActive('table') || false;
    this.isInTable = isInsideTable;

    // Mostra o balloon se houver seleção OU se estiver dentro de uma tabela (e enableTable estiver ativo)
    const shouldShow = (!isEmpty && this.enableBalloonMenu) || (isInsideTable && this.enableTable);

    if (!shouldShow) {
      this.showBalloonMenu = false;
      return;
    }

    // Obtém as coordenadas da seleção ou do cursor
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Posiciona o menu abaixo da seleção/cursor
        const top = rect.bottom + 60;
        let left = rect.left + rect.width / 2;

        // Ajusta a posição horizontal para evitar que o menu seja cortado
        // Estima a largura do balloon menu (aproximadamente 400px para tabelas, 300px para texto)
        const estimatedMenuWidth = isInsideTable ? 400 : 300;
        const viewportWidth = window.innerWidth;
        const menuHalfWidth = estimatedMenuWidth / 2;

        // Garante que o menu não ultrapasse a borda esquerda
        if (left - menuHalfWidth < 10) {
          left = menuHalfWidth + 10;
        }
        
        // Garante que o menu não ultrapasse a borda direita
        if (left + menuHalfWidth > viewportWidth - 10) {
          left = viewportWidth - menuHalfWidth - 10;
        }

        this.balloonMenuPosition = {
          top: `${top}px`,
          left: `${left}px`,
        };

        this.showBalloonMenu = true;
        // Fecha todos os dropdowns da toolbar quando o balloon menu é exibido
        this.closeAllToolbarDropdowns();
      }
    }, 0);
  }

  closeBalloonMenu(): void {
    this.showBalloonMenu = false;
  }

  // Fecha todos os dropdowns da toolbar
  private closeAllToolbarDropdowns(): void {
    this.showBlocksDropdown = false;
    this.showTextFormattingDropdown = false;
    this.showLineHeightDropdown = false;
    this.showFontFamilyDropdown = false;
    this.showFontSizeDropdown = false;
    this.showTextColorDropdown = false;
    this.showHighlightColorDropdown = false;
    this.showTextAlignDropdown = false;
    this.showInsertDropdown = false;
    this.showTableDropdown = false;
    this.showTableCellAlignDropdown = false;
    this.showTableCellBackgroundDropdown = false;
    this.showOrderedListTypeDropdown = false;
    this.showBulletListTypeDropdown = false;
  }

  // Fecha todos os dropdowns exceto o especificado
  private closeAllToolbarDropdownsExcept(exception: string): void {
    if (exception !== 'blocks') this.showBlocksDropdown = false;
    if (exception !== 'textFormatting') this.showTextFormattingDropdown = false;
    if (exception !== 'lineHeight') this.showLineHeightDropdown = false;
    if (exception !== 'fontFamily') this.showFontFamilyDropdown = false;
    if (exception !== 'fontSize') this.showFontSizeDropdown = false;
    if (exception !== 'textColor') this.showTextColorDropdown = false;
    if (exception !== 'highlightColor') this.showHighlightColorDropdown = false;
    if (exception !== 'textAlign') this.showTextAlignDropdown = false;
    if (exception !== 'insert') this.showInsertDropdown = false;
    if (exception !== 'table') this.showTableDropdown = false;
    if (exception !== 'tableCellAlign') this.showTableCellAlignDropdown = false;
    if (exception !== 'tableCellBackground') this.showTableCellBackgroundDropdown = false;
    if (exception !== 'orderedListType') this.showOrderedListTypeDropdown = false;
    if (exception !== 'bulletListType') this.showBulletListTypeDropdown = false;
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
    return this.translateService.instant(key) || key;
  }

  /**
   * Updates character, word, and paragraph counts
   */
  private updateCounts(): void {
    if (!this.editor) return;

    const text = this.editor.getText();
    
    // Character count (excluding whitespace)
    this.characterCount = text.replace(/\s/g, '').length;
    
    // Word count
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    this.wordCount = words.length;
    
    // Paragraph count
    const doc = this.editor.state.doc;
    let paragraphCount = 0;
    doc.descendants((node) => {
      if (node.type.name === 'paragraph' && node.textContent.trim().length > 0) {
        paragraphCount++;
      }
      return true;
    });
    this.paragraphCount = paragraphCount;
  }
}
