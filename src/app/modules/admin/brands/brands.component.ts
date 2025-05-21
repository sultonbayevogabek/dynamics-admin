import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrandsService } from './brands.service';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { IBrand } from './brands.interface';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { IFile } from '@shared/interfaces/file.interface';
import { FileListComponent } from '@shared/components/file-list/file-list.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'brands',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    ReactiveFormsModule,
    FileUploadComponent,
    FileListComponent,
    MatIconButton,
    MatPaginator,
    MatPrefix
  ],
  templateUrl: './brands.component.html',
  standalone: true
})

export class BrandsComponent implements OnInit {
  createForm: FormGroup = new FormGroup({
    nameUz: new FormControl<string>(null, [ Validators.required ]),
    nameRu: new FormControl<string>(null, [ Validators.required ]),
    nameEn: new FormControl<string>(null, [ Validators.required ]),
    logo: new FormControl<IFile>(null, [ Validators.required ]),
    website: new FormControl<string>(null, [ Validators.required ])
  });
  brands = signal<IBrand[]>([]);
  params = {
    page: 0,
    limit: 10,
    total: 0,
    search: ''
  };

  private brandsService = inject(BrandsService);
  private snackbar = inject(MatSnackBar);
  private confirmation = inject(FuseConfirmationService);

  async ngOnInit() {
    await this.getBrands();

    this.createForm.get('nameUz')
      .valueChanges
      .subscribe(value => {
        this.createForm.get('nameRu').setValue(value);
        this.createForm.get('nameEn').setValue(value);
      })
  }

  async updateBrand(brand: IBrand) {
    if (!brand.nameUz || !brand.nameRu || !brand.nameEn || !brand.website || !brand.logo) {
      return;
    }

    const response = await firstValueFrom(
      this.brandsService.updateBrand(brand)
    );
    this.snackbar.open(`O'zgarishlar saqlandi`, 'OK', { duration: 2000 });
    await this.searchBrand();
  }

  async createBrand(): Promise<void> {
    const form = this.createForm;

    if (form.invalid || form.disabled) {
      return;
    }

    const payload = form.getRawValue();

    const response: any = await firstValueFrom(
      this.brandsService.createBrand(payload)
    );

    if (!response?.errorCode) {
      this.createForm.reset();
      await this.searchBrand();
    }
  }

  async getBrands() {
    const response = await firstValueFrom(
      this.brandsService.getBrandsList({
        ...this.params,
        page: this.params.page + 1
      })
    );
    this.params.total = response?.total;
    this.brands.set(response?.data || []);
  }

  async searchBrand() {
    this.params.page = 0;
    await this.getBrands();
  }

  async pageChange($event: PageEvent) {
    this.params.page = $event.pageIndex;
    await this.getBrands();
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
    await this.searchBrand();
  }

  filesUploaded(files: IFile[]) {
    this.createForm.get('logo').setValue(files[0]);
  }

  onLogoRemoved() {
    this.createForm.get('logo').setValue(null);
  }
}
