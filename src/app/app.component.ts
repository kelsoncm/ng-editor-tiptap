import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditorComponent } from './shared/editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, EditorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form: FormGroup;
  editorValue: string = '';
  editorJson: any = null;
  editorFocused: boolean = false;
  activeTab: 'form' | 'html' | 'json' = 'form';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      body: ['<p>Texto inicial vindo do form.</p>'],
    });
  }

  submit() {
    console.log('Form value:', this.form.value);
  }

  onEditorChange(html: string): void {
    this.editorValue = html;
    console.log('Editor HTML changed:', html);
  }

  onJsonChange(json: any): void {
    this.editorJson = json;
    console.log('Editor JSON changed:', json);
  }

  onFocus(): void {
    this.editorFocused = true;
    console.log('Editor focused');
  }

  onBlur(): void {
    this.editorFocused = false;
    console.log('Editor blurred');
  }

  selectTab(tab: 'form' | 'html' | 'json'): void {
    this.activeTab = tab;
  }
}
