import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, inject, OnInit, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../categories/categories.service';
import { firstValueFrom } from 'rxjs';
import { ICategory } from '../../categories/category.interface';
import {
  SearchableMultiselectComponent
} from '@shared/components/searchable-multiselect/searchable-multiselect.component';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
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
import { ToasterService } from '@shared/services/toaster.service';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';
import { ProductsService } from '../../products/products.service';
import { IProduct } from '../../products/interfaces/product.interface';
import { IBanner } from '../interfaces/banner.interface';

@Component({
  selector: 'banner-edit',
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
  templateUrl: './banner-edit.component.html',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  standalone: true,
  providers: [
    provideNgxMask()
  ]
})


export class BannerEditComponent implements OnInit {
  productSearchInput = viewChild<ElementRef<HTMLInputElement>>('productSearchInput');

  bannerForm = new FormGroup({

    mainCategoryId: new FormControl<string>(null),
    middleCategoryId: new FormControl<string>(null),
    subCategoryId: new FormControl<string>(null),
    categoryId: new FormControl<string>(null),
    brandIds: new FormControl<string[]>([]),
    productId: new FormControl<string>(null),

    _id: new FormControl<string>(null, [ Validators.required ]),
    titleUz: new FormControl<string>(null, [ Validators.required ]),
    titleRu: new FormControl<string>(null, [ Validators.required ]),
    titleEn: new FormControl<string>(null, [ Validators.required ]),
    textUz: new FormControl<string>(null, [ Validators.required ]),
    textRu: new FormControl<string>(null, [ Validators.required ]),
    textEn: new FormControl<string>(null, [ Validators.required ]),
    images: new FormControl<IFile[]>([], [ Validators.required ]),
    type: new FormControl<string>(null)
  });
  categories: { [key: string]: ICategory[] } = {
    main: [],
    middle: [],
    sub: []
  };
  brands: IBrand[] = [];
  products: IProduct[] = [];

  private categoriesService = inject(CategoriesService);
  private bannersService = inject(BannersService);
  private productsService = inject(ProductsService);
  private brandsService = inject(BrandsService);
  private toaster = inject(ToasterService);
  private dialogRef = inject(MatDialogRef);
  @Inject(MAT_DIALOG_DATA) private data: IBanner = inject(MAT_DIALOG_DATA);

  async ngOnInit() {
    this.categories.main = await this.getCategories();
    await this.getBrands();
    await this.setBannerData();
  }

  async setBannerData() {
    console.log('Data ====>', this.data);

    this.bannerForm.patchValue({
      _id: this.data._id,
      titleUz: this.data.titleUz,
      titleRu: this.data.titleRu,
      titleEn: this.data.titleEn,
      textUz: this.data.textUz,
      textRu: this.data.textRu,
      textEn: this.data.textEn,
      images: this.data.images,
      type: this.data.type,
      brandIds: this.data.brandIds || []
    });

    if (this.data.product) {
      this.bannerForm.get('productId').setValue(this.data.product._id);

      const response = await firstValueFrom(
        this.productsService.getProduct({
          _id: this.data.product._id
        })
      );

      this.products = [ response ];
    }

    if (this.data.hierarchy.length) {
      const hierarchy = this.data.hierarchy;
      if (hierarchy[0]) {
        await this.selectCategory('main', hierarchy[0].categoryId);
      }
      if (hierarchy[1]) {
        await this.selectCategory('middle', hierarchy[1].categoryId);
      }
      if (hierarchy[2]) {
        await this.selectCategory('sub', hierarchy[2].categoryId);
      }
    }
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

  onBannerTypeChange() {
    if (this.bannerForm.get('type').value === 'product') {
      this.bannerForm.get('categoryId').setValue(null);
      this.bannerForm.get('mainCategoryId').setValue(null);
      this.bannerForm.get('middleCategoryId').setValue(null);
      this.bannerForm.get('subCategoryId').setValue(null);
      this.bannerForm.get('brandIds').setValue([]);
      this.categories.middle = [];
      this.categories.sub = [];
      return;
    }

    this.products = [];
    this.bannerForm.get('productId').setValue(null);
    this.productSearchInput().nativeElement.value = '';
  }

  async searchProduct() {
    const search = this.productSearchInput().nativeElement.value;
    this.products = [];
    this.bannerForm.get('productId').setValue(null);

    if (search?.trim()) {
      const response = await firstValueFrom(
        this.productsService.getProductsList({
          search
        })
      );

      this.products = response?.data || [];
    }
  }

  onProductSelected($event: MatAutocompleteSelectedEvent) {
    this.bannerForm.get('productId').setValue($event.option.value._id);
  }

  displayFn(product: IProduct): string {
    return product?.nameUz;
  }

  async editBanner() {
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

    const bannerType = this.bannerForm.get('type').value;

    if (bannerType === 'product' && !form.get('productId').value) {
      this.toaster.open({
        type: 'warning',
        title: 'Diqqat!',
        message: `Banner turida tovarni belgilagansiz. Bannerdagi tugmani bosganda qaysi tovar ochilishi kerakligini belgilang!`
      });
      return;
    }

    if (bannerType === 'filter' && !form.get('categoryId').value && !form.get('brandIds')?.value?.length) {
      this.toaster.open({
        type: 'warning',
        title: 'Diqqat!',
        message: `Banner turida filterni belgilagansiz. Bannerdagi tugmani bosganda qaysi kategoriya va brandlar bo'yicha tovarlar ko'rsatilishi kerakligini ko'rsating!`
      });
      return;
    }

    form.disable();

    try {
      const response = await firstValueFrom(
        this.bannersService.editBanner(form.getRawValue())
      );
      if (response && response.statusCode === 200) {
        this.toaster.open({
          message: `Banner muvaffaqiyatli yaratildi`
        });
        this.dialogRef.close('edited');
      } else {
        this.toaster.open({
          message: `Bannerni yaratishda xatolik sodir bo'ldi`,
          type: 'warning'
        });
        form.enable();
      }
    } catch (error) {
      this.toaster.open({
        message: `Bannerni yaratishda xatolik sodir bo'ldi`,
        type: 'warning'
      });
      form.enable();
    }
  }
}
