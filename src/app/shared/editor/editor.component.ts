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
import { PluginKey } from '@tiptap/pm/state';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { I18nService } from '../services/i18n.service';

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
  showBalloonMenu = false;
  balloonMenuPosition = { top: '0px', left: '0px' };
  currentBlockType: string = 'fas fa-paragraph';
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
      
      if (!target.closest('.toolbar-dropdown')) {
        this.showBlocksDropdown = false;
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
  }

  private updateBalloonMenuPosition(): void {
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
