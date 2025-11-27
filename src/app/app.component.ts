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
  editorValue = '<p>Conteúdo inicial vindo do AppComponent.</p>';

  onEditorChange(html: string) {
    this.editorValue = html;
  }
}
