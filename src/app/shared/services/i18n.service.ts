import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private currentLanguage$ = new BehaviorSubject<string>('pt_br');
  public language$ = this.currentLanguage$.asObservable();

  private defaultLanguage = 'pt_br';
  private supportedLanguages = ['en', 'pt_br', 'es'];

  constructor(private translateService: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Define idiomas suportados
    this.translateService.addLangs(this.supportedLanguages);
    this.translateService.setDefaultLang(this.defaultLanguage);

    // Detecta idioma do navegador ou usa o padrão
    const browserLanguage = this.getBrowserLanguage();
    const storedLanguage = this.getStoredLanguage();
    const language = storedLanguage || browserLanguage || this.defaultLanguage;

    this.setLanguage(language);
  }

  /**
   * Define o idioma atual
   */
  setLanguage(language: string): void {
    if (!this.supportedLanguages.includes(language)) {
      language = this.defaultLanguage;
    }

    this.translateService.use(language);
    this.currentLanguage$.next(language);
    localStorage.setItem('selectedLanguage', language);
  }

  /**
   * Retorna o idioma atual
   */
  getCurrentLanguage(): string {
    return this.currentLanguage$.value;
  }

  /**
   * Retorna o idioma atual como Observable
   */
  getCurrentLanguage$(): Observable<string> {
    return this.language$;
  }

  /**
   * Traduz uma chave
   */
  translateKey(key: string, params?: any): string {
    let result = '';
    this.translateService.get(key, params).subscribe((res) => {
      result = res;
    });
    return result;
  }

  /**
   * Traduz uma chave de forma assíncrona
   */
  translateAsync(key: string, params?: any): Observable<string> {
    return this.translateService.get(key, params);
  }

  /**
   * Retorna a lista de idiomas suportados
   */
  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  /**
   * Detecta o idioma do navegador
   */
  private getBrowserLanguage(): string {
    const browserLang = this.translateService.getBrowserLang();
    if (browserLang) {
      // Normaliza para pt_br em caso de pt
      if (browserLang.includes('pt')) {
        return 'pt_br';
      }
      // Normaliza para es em caso de es-ES, es-MX, etc
      if (browserLang.includes('es')) {
        return 'es';
      }
      // Normaliza para en em caso de en-US, etc
      if (browserLang.includes('en')) {
        return 'en';
      }
    }
    return this.defaultLanguage;
  }

  /**
   * Obtém o idioma armazenado no localStorage
   */
  private getStoredLanguage(): string | null {
    return localStorage.getItem('selectedLanguage');
  }
}

