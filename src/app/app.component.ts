import { Component } from '@angular/core';
import { EditorComponent } from './shared/editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EditorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  editorValue = '<p>Conteúdo inicial com <strong>bold</strong>.</p>';
  editorJson = '';
  editorFocused = false;

  onEditorChange(html: string) {
    this.editorValue = html;
  }

  onJsonChange(json: unknown) {
    this.editorJson = JSON.stringify(json, null, 2);
  }

  onFocus() {
    this.editorFocused = true;
  }

  onBlur() {
    this.editorFocused = false;
    // aqui daria para marcar formControl como touched
  }
}
