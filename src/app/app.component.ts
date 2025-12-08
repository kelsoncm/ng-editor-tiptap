import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EditorComponent } from './shared/editor';
import { I18nService } from './shared/services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, EditorComponent, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  form: FormGroup;
  editorValue: string = '';
  editorJson: any = null;
  editorFocused: boolean = false;
  activeTab: 'form' | 'html' | 'json' = 'form';
  currentLanguage: string = 'pt_br';
  supportedLanguages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private i18nService: I18nService,
    private translateService: TranslateService
  ) {
    this.form = this.fb.group({
      body: ['<p>Texto inicial vindo do form.</p>'],
    });
  }

  ngOnInit(): void {
    // Inicializa as linguagens suportadas
    this.supportedLanguages = this.i18nService.getSupportedLanguages();
    this.currentLanguage = this.i18nService.getCurrentLanguage();

    // Subscribe para mudanças de idioma
    this.i18nService.getCurrentLanguage$().subscribe((language) => {
      this.currentLanguage = language;
    });
  }

  setLanguage(language: string): void {
    this.i18nService.setLanguage(language);
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
