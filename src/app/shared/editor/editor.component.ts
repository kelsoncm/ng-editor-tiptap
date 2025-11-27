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
import { Editor } from '@tiptap/core';
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

  @Output() contentChange = new EventEmitter<string>();

  private editor!: Editor;

  ngAfterViewInit(): void {
    this.editor = new Editor({
      element: this.editorElement.nativeElement,
      extensions: [StarterKit],
      content: this.content,
      editable: !this.readonly,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        this.contentChange.emit(html);
      },
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  getValue(): string {
    return this.editor?.getHTML() ?? '';
  }
}
