import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor, JSONContent } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorElement', { static: false })
  editorElement!: ElementRef<HTMLDivElement>;

  @Input() content: string = '<p>Digite aqui…</p>';
  @Input() readonly = false;
  @Input() placeholder: string = 'Digite aqui…';
  @Input() minHeight: string = '200px';

  @Input() enableHeading = true;
  @Input() enableBold = true;
  @Input() enableItalic = true;
  @Input() enableCode = false;

  @Input() toolbarPreset: 'minimal' | 'full' = 'minimal';
  @Input() outputFormat: 'html' | 'json' = 'html';

  @Output() contentChange = new EventEmitter<string>();
  @Output() jsonChange = new EventEmitter<JSONContent>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  private editor!: Editor;

  ngAfterViewInit(): void {
    const extensions = [
      StarterKit.configure({
        heading: this.enableHeading
          ? { levels: [1, 2, 3] }
          : false,
        bold: this.enableBold ? {} : false,
        italic: this.enableItalic ? {} : false,
        code: this.enableCode ? {} : false,
      }),
    ];

    this.editor = new Editor({
      element: this.editorElement.nativeElement,
      extensions,
      content: this.content,
      editable: !this.readonly,
      editorProps: {
        attributes: {
          'data-placeholder': this.placeholder,
        },
        handleDOMEvents: {
          focus: () => {
            this.focus.emit();
            return false;
          },
          blur: () => {
            this.blur.emit();
            return false;
          },
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        const json = editor.getJSON();
        if (this.outputFormat === 'html') {
          this.contentChange.emit(html);
        } else {
          this.contentChange.emit(JSON.stringify(json));
        }
        this.jsonChange.emit(json);
      },
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  toggleBold(): void {
    this.editor?.chain().focus().toggleBold().run();
  }

  toggleItalic(): void {
    this.editor?.chain().focus().toggleItalic().run();
  }

  toggleCode(): void {
    this.editor?.chain().focus().toggleCode().run();
  }

  setHeading(level: 1 | 2 | 3): void {
    this.editor?.chain().focus().toggleHeading({ level }).run();
  }

  setParagraph(): void {
    this.editor?.chain().focus().setParagraph().run();
  }

  getValue(): string {
    return this.editor?.getHTML() ?? '';
  }

  getJSON(): JSONContent | null {
    return this.editor ? this.editor.getJSON() : null;
  }
}
