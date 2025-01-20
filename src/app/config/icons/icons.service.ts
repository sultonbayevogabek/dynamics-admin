import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class IconsService {
  domSanitizer = inject(DomSanitizer);
  matIconRegistry = inject(MatIconRegistry);

  constructor() {
    this.matIconRegistry.addSvgIconSetInNamespace(
      'icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/icons.svg')
    );
  }
}
