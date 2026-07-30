import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  function serviceWithLanguage(language: string) {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(language);
    return TestBed.inject(I18nService);
  }

  it('starts in the stored locale', () => {
    localStorage.setItem('caliper.locale', 'pt-BR');

    expect(serviceWithLanguage('en-US').locale()).toBe('pt-BR');
  });

  it('falls back to the browser language when nothing is stored', () => {
    expect(serviceWithLanguage('pt-BR').locale()).toBe('pt-BR');
  });

  it('falls back to english for any unsupported browser language', () => {
    expect(serviceWithLanguage('de-DE').locale()).toBe('en');
  });

  it('ignores a stored locale that is not supported anymore', () => {
    localStorage.setItem('caliper.locale', 'fr');

    expect(serviceWithLanguage('en-US').locale()).toBe('en');
  });

  it('swaps the dictionary, persists the choice and updates the document lang', () => {
    const service = serviceWithLanguage('en-US');

    service.setLocale('pt-BR');

    expect(service.messages().navCompare).toBe('Comparar');
    expect(localStorage.getItem('caliper.locale')).toBe('pt-BR');
    expect(document.documentElement.lang).toBe('pt-BR');
  });

  it('interpolates named placeholders', () => {
    const service = serviceWithLanguage('en-US');

    expect(service.format('compareProgress', { done: 2, total: 4 })).toBe('Auditing 2 of 4');
  });
});
