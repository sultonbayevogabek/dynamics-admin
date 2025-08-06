import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, Inject, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../categories/categories.service';
import { firstValueFrom } from 'rxjs';
import { ICategory } from '../../categories/category.interface';
import {
  SearchableMultiselectComponent
} from '@shared/components/searchable-multiselect/searchable-multiselect.component';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { IBrand } from '../../brands/brands.interface';
import { BrandsService } from '../../brands/brands.service';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { IFile } from '@shared/interfaces/file.interface';
import { FileListComponent } from '@shared/components/file-list/file-list.component';
import { ProductsService } from '../products.service';
import { IProduct } from '../interfaces/product.interface';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ToasterService } from '@shared/services/toaster.service';

@Component({
  selector: 'news-edit',
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
    MatSuffix,
    NgxMaskDirective,
    FileUploadComponent,
    FileListComponent,
    MatOption,
    MatSelect
  ],
  templateUrl: './product-edit.component.html',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  standalone: true,
  providers: [
    provideNgxMask()
  ]
})


export class ProductEditComponent implements OnInit {
  productForm = new FormGroup({
    details: new FormGroup({
      mainCategoryId: new FormControl<string>(null, Validators.required),
      middleCategoryId: new FormControl<string>(null, Validators.required)
    }),
    _id: new FormControl(null, [Validators.required]),
    categoryId: new FormControl<string>(null),
    nameUz: new FormControl<string>(null, [ Validators.required ]),
    nameRu: new FormControl<string>(null, [ Validators.required ]),
    nameEn: new FormControl<string>(null, [ Validators.required ]),
    descriptionUz: new FormControl<string>(null, [ Validators.required ]),
    descriptionRu: new FormControl<string>(null, [ Validators.required ]),
    descriptionEn: new FormControl<string>(null, [ Validators.required ]),
    oldPrice: new FormControl<number>(null),
    currentPrice: new FormControl<number>(null),
    availability: new FormControl('on_demand'),
    brandId: new FormControl<string>(null, [ Validators.required ]),
    images: new FormControl<IFile[]>([]),
    link: new FormControl<string>(''),
    attributes: new FormArray<FormGroup>([], [ Validators.required ]
    ),
    keywords: new FormControl<string>('')
  });
  attributes = computed(() => {
    return this.productForm.get('attributes') as FormArray<FormGroup>;
  });

  categories: { [key: string]: ICategory[] } = {
    main: [],
    middle: [],
    sub: []
  };
  brands: IBrand[] = [];

  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);
  private brandsService = inject(BrandsService);
  private toaster = inject(ToasterService);
  private dialogRef = inject(MatDialogRef);
  @Inject(MAT_DIALOG_DATA) data: IProduct = inject(MAT_DIALOG_DATA);

  async ngOnInit() {
    this.categories.main = await this.getCategories();
    await this.getBrands();

    await this.setProductData();
  }

  async setProductData() {
    this.productForm.patchValue({
      _id: this.data._id,
      nameUz: this.data.nameUz,
      nameRu: this.data.nameRu,
      nameEn: this.data.nameEn,
      descriptionUz: this.data.descriptionUz,
      descriptionRu: this.data.descriptionRu,
      descriptionEn: this.data.descriptionEn,
      oldPrice: this.data.oldPrice || null,
      currentPrice: this.data.currentPrice,
      availability: this.data.availability,
      brandId: this.data.brandId,
      images: this.data.images,
      keywords: this.data.keywords,
      link: this.data.link
    });

    this.data.attributes.forEach(attribute => {
      const formGroup = new FormGroup({});
      const controls = (this.productForm.get('attributes') as FormArray<FormGroup>).controls;

      for (const attributeKey in attribute) {
        const formControl = new FormControl(attribute[attributeKey], [ Validators.required ]);
        formGroup.setControl(attributeKey, formControl);
      }

      (this.productForm.get('attributes') as FormArray<FormGroup>).push(formGroup);
    })

    await this.selectCategory('main', this.data.hierarchy[0]?.categoryId);
    await this.selectCategory('middle', this.data.hierarchy[1]?.categoryId);
    await this.selectCategory('sub', this.data.hierarchy[2]?.categoryId);
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
      this.productForm.get('details.mainCategoryId').setValue($event);
      this.productForm.get('details.middleCategoryId').setValue(null);
      this.productForm.get('categoryId').setValue(null);

      this.categories.middle = await this.getCategories($event);
      this.categories.sub = [];
    }

    if (type === 'middle') {
      this.productForm.get('details.middleCategoryId').setValue($event);
      this.productForm.get('categoryId').setValue(null);

      this.categories.sub = await this.getCategories($event);
    }

    if (type === 'sub') {
      this.productForm.get('categoryId').setValue($event);
    }
  }

  onFilesUpload(files: IFile[]) {
    const images = this.productForm.get('images').value;
    images.push(...files);
    this.productForm.get('images').setValue(images);
  }

  addNewAttribute(nameUz = '', nameRu = '', nameEn = '', valueUz = '', valueRu = '', valueEn = '') {
    const formGroup = new FormGroup({
      nameUz: new FormControl(nameUz, [ Validators.required ]),
      nameRu: new FormControl(nameRu, [ Validators.required ]),
      nameEn: new FormControl(nameEn, [ Validators.required ]),
      valueUz: new FormControl(valueUz, [ Validators.required ]),
      valueRu: new FormControl(valueRu, [ Validators.required ]),
      valueEn: new FormControl(valueEn, [ Validators.required ])
    });

    (this.productForm.get('attributes') as FormArray<FormGroup>).push(formGroup);
  }

  deleteAttribute(i: number) {
    const controls = (this.productForm.get('attributes') as FormArray<FormGroup>).controls;
    controls.splice(i, 1);
    this.productForm.get('attributes').updateValueAndValidity();
  }

  async fillAttributesFromBuffer() {
    const clipboardText = await navigator.clipboard.readText();

    if (!this.isValidAttributesJsonRegex(clipboardText)) {
      this.toaster.open({
        type: 'warning',
        message: `Bufferdagi matn tovar xususiyatlarini kiritish uchun mos kelmaydi. Tekshirib ko'ring!`
      })
      return
    }

    const attributes = JSON.parse(clipboardText);

    (this.productForm.get('attributes') as FormArray<FormGroup>).clear();
    attributes.forEach((attribute) => {
      this.addNewAttribute(
        attribute.nameUz,
        attribute.nameRu,
        attribute.nameEn,
        attribute.valueUz,
        attribute.valueRu,
        attribute.valueEn
      )
    })
  }

  private isValidAttributesJsonRegex(text: string): boolean {
    const cleanText = text.replace(/\s+/g, '');

    const attributesPattern = /^\[\s*(\{\s*"nameUz"\s*:\s*"[^"]*"\s*,\s*"nameRu"\s*:\s*"[^"]*"\s*,\s*"nameEn"\s*:\s*"[^"]*"\s*,\s*"valueUz"\s*:\s*"[^"]*"\s*,\s*"valueRu"\s*:\s*"[^"]*"\s*,\s*"valueEn"\s*:\s*"[^"]*"\s*\}\s*,?\s*)*\]\s*$/;

    return attributesPattern.test(cleanText);
  }

  async createProduct() {
    const form = this.productForm;

    if (form.invalid) {
      this.toaster.open({
        type: 'warning',
        message: `Majburiy maydonlarni to'ldiring`
      })
      return;
    }

    if (form.disabled) {
      return;
    }

    form.disable();

    try {
      const response = await firstValueFrom(
        this.productsService.editProduct({
          ...form.getRawValue(),
          oldPrice: form.getRawValue().oldPrice || null,
          categoryId: form.getRawValue().categoryId || form.getRawValue().details.middleCategoryId
        })
      );
      if (response && response.statusCode === 200) {
        this.toaster.open({
          message: `Tovar muvaffaqiyatli o'zgartirildi`
        })

        this.dialogRef.close('edited');
      }
    } catch (error) {
      this.toaster.open({
        type: 'error',
        message: `Tovar ma'lumotlarini tahrirlashda xatolik sodir bo'ldi`
      })

      form.enable();
    }
  }
}
