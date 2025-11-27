import { Component } from '@angular/core';
import { EditorComponent } from './editor/editor.component'; // <-- importe aqui

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EditorComponent],           // <-- adicione aqui
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tiptap-editor';
}
