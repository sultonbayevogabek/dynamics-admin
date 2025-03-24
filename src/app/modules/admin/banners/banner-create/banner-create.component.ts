import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../categories/categories.service';
import { firstValueFrom } from 'rxjs';
import { ICategory } from '../../categories/category.interface';
import {
  SearchableMultiselectComponent
} from '@shared/components/searchable-multiselect/searchable-multiselect.component';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { provideNgxMask } from 'ngx-mask';
import { IBrand } from '../../brands/brands.interface';
import { BrandsService } from '../../brands/brands.service';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { IFile } from '@shared/interfaces/file.interface';
import { FileListComponent } from '@shared/components/file-list/file-list.component';
import { BannersService } from '../banners.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToasterService } from '@shared/services/toaster.service';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';

@Component({
  selector: 'banner-create',
  imports: [
    ReactiveFormsModule,
    SearchableMultiselectComponent,
    SearchableMultiselectComponent,
    MatButton,
    MatIcon,
    MatDialogClose,
    MatFormField,
    MatInput,
    MatIconButton,
    MatLabel,
    MatError,
    FileUploadComponent,
    FileListComponent,
    MatRadioGroup,
    MatRadioButton,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption
  ],
  templateUrl: './banner-create.component.html',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  standalone: true,
  providers: [
    provideNgxMask()
  ]
})


export class BannerCreateComponent implements OnInit {
  bannerForm = new FormGroup({
    mainCategoryId: new FormControl<string>(null),
    middleCategoryId: new FormControl<string>(null),
    subCategoryId: new FormControl<string>(null),
    categoryId: new FormControl<string>(null),
    brandIds: new FormControl<string[]>([]),
    productId: new FormControl<string>(null),

    titleUz: new FormControl<string>('Santexnika mahsulotlarining katta tanlovi', [ Validators.required ]),
    titleRu: new FormControl<string>('Большой выбор сантехнических товаров', [ Validators.required ]),
    titleEn: new FormControl<string>('Big choice of Plumbing products', [ Validators.required ]),
    textUz: new FormControl<string>(`Elektr arra Philips 890/10X –
    bu yuqori samarali va bardoshli elektr arra bo‘lib`, [ Validators.required ]),
    textRu: new FormControl<string>(`Электрическая пила Philips 890/10X – это мощная
    и надежная электрическая пила, предназначенная для резки дерева`, [ Validators.required ]),
    textEn: new FormControl<string>(`Electric Saw Philips 890/10X is a high-performance
    and durable electric saw designed for cutting wood, plastic, and metal materials`, [ Validators.required ]),
    images: new FormControl<IFile[]>([
      {
        'fieldname': 'file',
        'originalname': 'slide-3.jpg',
        'encoding': '7bit',
        'mimetype': 'image/jpeg',
        'destination': 'uploads',
        'filename': '1742670202921-781193048-slide-3.jpg',
        'path': 'uploads/1742670202921-781193048-slide-3.jpg',
        'size': 0.069,
        'extension': 'jpg'
      },
      {
        'fieldname': 'file',
        'originalname': 'slide-1-mobile.jpg',
        'encoding': '7bit',
        'mimetype': 'image/jpeg',
        'destination': 'uploads',
        'filename': '1742670202923-126466488-slide-1-mobile.jpg',
        'path': 'uploads/1742670202923-126466488-slide-1-mobile.jpg',
        'size': 0.024,
        'extension': 'jpg'
      }
    ], [ Validators.required ]),
    type: new FormControl<'product' | 'filter'>('filter')
  });
  categories: { [key: string]: ICategory[] } = {
    main: [],
    middle: [],
    sub: []
  };
  brands: IBrand[] = [];

  private categoriesService = inject(CategoriesService);
  private productsService = inject(BannersService);
  private brandsService = inject(BrandsService);
  private snackbar = inject(MatSnackBar);
  private toaster = inject(ToasterService);
  private dialogRef = inject(MatDialogRef);

  async ngOnInit() {
    this.categories.main = await this.getCategories();
    await this.getBrands();
  }

  async getCategories(parentCategoryId?: string) {
    return await firstValueFrom(
      this.categoriesService.getCategoriesList(parentCategoryId)
    );
  }

  async getBrands() {
    const response = await firstValueFrom(
      this.brandsService.getBrandsList()
    );
    this.brands = response?.data || [];
  }

  async selectCategory(type: 'main' | 'middle' | 'sub', $event: string) {
    setTimeout(() => {
      console.log(this.bannerForm.getRawValue(), 'banner');
    }, 1000)
    if (type === 'main') {
      if ($event) {
        this.categories.middle = await this.getCategories($event);
      } else {
        this.categories.middle = [];
      }
      this.categories.sub = [];
      this.bannerForm.get('mainCategoryId').setValue($event);
      this.bannerForm.get('middleCategoryId').setValue(null);
      this.bannerForm.get('subCategoryId').setValue(null);
    }

    if (type === 'middle') {
      if ($event) {
        this.categories.sub = await this.getCategories($event);
      } else {
        this.categories.sub = [];
      }
      this.bannerForm.get('middleCategoryId').setValue($event);
      this.bannerForm.get('subCategoryId').setValue(null);
    }

    if (type === 'sub') {
      this.bannerForm.get('subCategoryId').setValue($event);
    }

    if (this.bannerForm.get('subCategoryId').value) {
      this.bannerForm.get('categoryId').setValue(this.bannerForm.get('subCategoryId').value);
      return;
    }

    if (this.bannerForm.get('middleCategoryId').value) {
      this.bannerForm.get('categoryId').setValue(this.bannerForm.get('middleCategoryId').value);
      return;
    }

    if (this.bannerForm.get('mainCategoryId').value) {
      this.bannerForm.get('categoryId').setValue(this.bannerForm.get('mainCategoryId').value);
      return;
    }

    this.bannerForm.get('categoryId').setValue(null);
  }

  onFilesUpload(files: IFile[]) {
    const currentFiles = this.bannerForm.get('images').value;
    currentFiles.push(...files);
    this.bannerForm.get('images').setValue(currentFiles);
  }

  async createProduct() {
    const form = this.bannerForm;

    if (form.invalid) {
      this.toaster.open({
        message: `Majburiy maydonlarni to'ldiring`,
        type: 'warning'
      });
      return;
    }

    if (form.disabled) {
      return;
    }

    form.disable();

    try {
      const response = await firstValueFrom(
        this.productsService.createProduct(form.getRawValue())
      );
      if (response && response.statusCode === 201) {
        this.toaster.open({
          message: `Tovar muvaffaqiyatli yaratildi`,
          type: 'warning'
        });
        form.enable();
      }
    } catch (error) {
      this.toaster.open({
        message: `Tovarni yaratishda xatolik sodir bo'ldi`,
        type: 'warning'
      });
      form.enable();
    }
  }
}
