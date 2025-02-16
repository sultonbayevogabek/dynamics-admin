import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuseCardComponent } from '../../../../../@fuse/components/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'first-level',
  imports: [
    FormsModule,
    FuseCardComponent,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './first-level.component.html'
})

export class FirstLevelComponent {
  createForm: FormGroup = new FormGroup({
    nameUz: new FormControl(`Ombor uchun texnika va anjomlar`, [ Validators.required ]),
    nameRu: new FormControl('Складское оборудование и принадлежности', [ Validators.required ]),
    nameEn: new FormControl('Warehouse equipment and supplies', [ Validators.required ])
  });

  async createCategory(): Promise<void> {
    const form = this.createForm;
    if (form.invalid || form.disabled) {
      return;
    }

  }
}
