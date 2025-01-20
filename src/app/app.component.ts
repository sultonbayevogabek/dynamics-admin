import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

export interface ILanguageOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, TranslateModule ],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  private _availableLanguages = [ 'uz', 'ru', 'uz_latn', 'en', 'kaa' ];
  private _translateService = inject(TranslateService);
  languageOptions: ILanguageOption[] = [];

  ngOnInit(): void {
    this._translateService.addLangs(this._availableLanguages);
    this._buildLanguageOptions();

    const lang = localStorage.getItem('lang');
    this._translateService.setDefaultLang(this._availableLanguages.includes(lang) ? lang : 'uz_latn');

    this.tokenPasteListener();
  }

  tokenPasteListener(): void {
    document.addEventListener('keydown', async (event) => {
      if (!(event.ctrlKey && ['t', 'g'].includes(event.key))) {
        return;
      }
      const accessToken = prompt('Yangi tokenni kiriting');
      if (!accessToken) {
        return;
      }
      localStorage.setItem('access_token', accessToken);
      window.location.href = window.location.origin;
    });
  }

  private _buildLanguageOptions() {
    forkJoin(this._availableLanguages.map(lang => {
      return this._translateService.get(lang.toUpperCase())
    })).subscribe(
      _response => {
        this._availableLanguages.forEach((lang, index) => {
          this.languageOptions.push({
            value: lang,
            label: _response[index]
          });
        })
      }
    );
  }
}
