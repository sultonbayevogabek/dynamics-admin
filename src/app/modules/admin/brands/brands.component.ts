import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseCardComponent } from '@fuse/components/card';
import { BrandsService } from './brands.service';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { IBrand } from './brands.interface';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'brands',
  imports: [
    FormsModule,
    FuseCardComponent,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    ReactiveFormsModule,
    FileUploadComponent
  ],
  templateUrl: './brands.component.html'
})

export class BrandsComponent implements OnInit {
  createForm: FormGroup = new FormGroup({
    nameUz: new FormControl(null, [ Validators.required ]),
    nameRu: new FormControl(null, [ Validators.required ]),
    nameEn: new FormControl(null, [ Validators.required ])
  });
  brands = signal<IBrand[]>([]);

  private brandsService =inject(BrandsService);
  private snackbar =inject(MatSnackBar);
  private confirmation =inject(FuseConfirmationService);

  async ngOnInit() {
    await this.getCategories();
  }

  async updateBrand(brand: IBrand) {

  }

  async createBrand(): Promise<void> {
    const form = this.createForm;

    if (form.invalid || form.disabled) {
      return;
    }

    const payload = form.getRawValue();
  }

  async getCategories() {
  }

  async deleteBrand(_id: string) {
    const confirm = await firstValueFrom(this.confirmation.open({
      title: 'Diqqat!',
      message: `Brandni rostan ham o'chirmoqchimsiz?`,
      actions: {
        cancel: {
          label: `Yo'q`
        },
        confirm: {
          label: `Ha`
        },
      },
      dismissible: true,
    }).afterClosed());

    if (confirm === 'cancelled' || !confirm) return;
  }
}
