import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrandsService } from './brands.service';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { IBrand } from './brands.interface';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { IFile } from '../../../shared/interfaces/file.interface';
import { FuseCardComponent } from '../../../../@fuse/components/card';
import { FileListComponent } from '../../../shared/components/file-list/file-list.component';

@Component({
  selector: 'brands',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    ReactiveFormsModule,
    FileUploadComponent,
    FuseCardComponent,
    FileListComponent,
    MatIconButton
  ],
  templateUrl: './brands.component.html',
  standalone: true
})

export class BrandsComponent implements OnInit {
  createForm: FormGroup = new FormGroup({
    nameUz: new FormControl<string>(null, [ Validators.required ]),
    nameRu: new FormControl<string>(null, [ Validators.required ]),
    nameEn: new FormControl<string>(null, [ Validators.required ]),
    logo: new FormControl<string>(null, [ Validators.required ]),
    website: new FormControl<string>(null, [ Validators.required ])
  });
  brands = signal<IBrand[]>([]);
  files: IFile[] = [];

  private brandsService = inject(BrandsService);
  private snackbar = inject(MatSnackBar);
  private confirmation = inject(FuseConfirmationService);

  async ngOnInit() {
    await this.getCategories();
  }

  async updateBrand(brand: IBrand) {
    if (!brand.nameUz || !brand.nameRu || !brand.nameEn || !brand.website || !brand.logo) {
      return;
    }

    const response = await firstValueFrom(
      this.brandsService.updateBrand(brand)
    );
    this.snackbar.open(`O'zgarishlar saqlandi`, 'OK', { duration: 2000 });
    await this.getCategories();
  }

  async createBrand(): Promise<void> {
    const form = this.createForm;

    if (form.invalid || form.disabled) {
      return;
    }

    const payload = form.getRawValue();

    const response = await firstValueFrom(
      this.brandsService.createBrand(payload)
    );

    this.files = [];
    this.createForm.reset();
    await this.getCategories();
  }

  async getCategories() {
    const brands = await firstValueFrom(this.brandsService.getBrandsList());
    this.brands.set(brands);
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
        }
      },
      dismissible: true
    }).afterClosed());

    if (confirm === 'cancelled' || !confirm) return;

    const response = await firstValueFrom(this.brandsService.deleteBrand(_id));
    await this.getCategories();
  }

  filesUploaded(files: IFile[]) {
    this.files = files;
    this.createForm.get('logo').setValue(files[0].path);
  }

  onLogoRemoved() {
    this.files = [];
    this.createForm.get('logo').setValue(null);
  }
}
