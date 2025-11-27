import { Component, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('editorElement', { static: false }) editorElement!: ElementRef<HTMLDivElement>;

  editor!: Editor;

  ngAfterViewInit(): void {
    this.editor = new Editor({
      element: this.editorElement.nativeElement,
      extensions: [StarterKit],
      content: '<p>Hello, Tiptap in Angular!</p>',
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }
}
