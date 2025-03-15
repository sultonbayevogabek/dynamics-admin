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
import { MatSnackBar } from '@angular/material/snack-bar';
import { IProduct } from '../interfaces/product.interface';

@Component({
  selector: 'product-edit',
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
    FileListComponent
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
    categoryId: new FormControl<string>(null, [ Validators.required ]),
    nameUz: new FormControl<string>(null, [ Validators.required ]),
    nameRu: new FormControl<string>(null, [ Validators.required ]),
    nameEn: new FormControl<string>(null, [ Validators.required ]),
    descriptionUz: new FormControl<string>(null, [ Validators.required ]),
    descriptionRu: new FormControl<string>(null, [ Validators.required ]),
    descriptionEn: new FormControl<string>(null, [ Validators.required ]),
    oldPrice: new FormControl<number>(null),
    currentPrice: new FormControl<number>(null, [ Validators.required ]),
    quantity: new FormControl<number>(null, [ Validators.required ]),
    brandId: new FormControl<string>(null, [ Validators.required ]),
    images: new FormControl<IFile[]>([], [ Validators.required ]),
    attributes: new FormArray<FormGroup>([], [ Validators.required ]
    ),
    keywords: new FormControl<string>('')
  });
  attributes = computed(() => {
    return this.productForm.get('attributes') as FormArray<FormGroup>;
  });
  dummyAttributes = [
    {
      nameUz: 'Ishlab chiqaruvchi',
      nameRu: 'Производитель',
      nameEn: 'Manufacturer',
      valueUz: 'Fubag',
      valueRu: 'Fubag',
      valueEn: 'Fubag'
    },
    {
      nameUz: 'Quvvat',
      nameRu: 'Мощность',
      nameEn: 'Power',
      valueUz: '1200 Vt',
      valueRu: '1200 Вт',
      valueEn: '1200 W'
    },
    {
      nameUz: 'Pichoq diametri',
      nameRu: 'Диаметр диска',
      nameEn: 'Blade Diameter',
      valueUz: '185 mm',
      valueRu: '185 мм',
      valueEn: '185 mm'
    },
    {
      nameUz: 'Kesish burchagi',
      nameRu: 'Угол резки',
      nameEn: 'Cutting Angle',
      valueUz: '0-45°',
      valueRu: '0-45°',
      valueEn: '0-45°'
    },
    {
      nameUz: 'Aylanish tezligi',
      nameRu: 'Скорость вращения',
      nameEn: 'Rotation Speed',
      valueUz: '5000 ayl/min',
      valueRu: '5000 об/мин',
      valueEn: '5000 RPM'
    },
    {
      nameUz: 'Og‘irligi',
      nameRu: 'Вес',
      nameEn: 'Weight',
      valueUz: '3.5 kg',
      valueRu: '3.5 кг',
      valueEn: '3.5 kg'
    },
    {
      nameUz: 'Korpus materiali',
      nameRu: 'Материал корпуса',
      nameEn: 'Body Material',
      valueUz: 'Metall va plastmassa',
      valueRu: 'Металл и пластик',
      valueEn: 'Metal and Plastic'
    },
    {
      nameUz: 'Chang yutish tizimi',
      nameRu: 'Система удаления пыли',
      nameEn: 'Dust Extraction System',
      valueUz: 'Mavjud',
      valueRu: 'Есть',
      valueEn: 'Available'
    },
    {
      nameUz: 'Kabel uzunligi',
      nameRu: 'Длина кабеля',
      nameEn: 'Cable Length',
      valueUz: '2 m',
      valueRu: '2 м',
      valueEn: '2 m'
    },
    {
      nameUz: 'Quvvat manbai',
      nameRu: 'Источник питания',
      nameEn: 'Power Source',
      valueUz: 'Elektr tarmog‘i',
      valueRu: 'Электросеть',
      valueEn: 'Electric Grid'
    },
    {
      nameUz: 'Xavfsizlik himoyasi',
      nameRu: 'Защита безопасности',
      nameEn: 'Safety Protection',
      valueUz: 'Mavjud',
      valueRu: 'Есть',
      valueEn: 'Available'
    }
  ];
  categories: { [key: string]: ICategory[] } = {
    main: [],
    middle: [],
    sub: []
  };
  brands: IBrand[] = [];

  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);
  private brandsService = inject(BrandsService);
  private snackbar = inject(MatSnackBar);
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
      quantity: this.data.quantity,
      brandId: this.data.brandId,
      images: this.data.images,
      keywords: this.data.keywords
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

    await this.selectCategory('main', this.data.details.mainCategoryId);
    await this.selectCategory('middle', this.data.details.middleCategoryId);
    await this.selectCategory('sub', this.data.categoryId);
  }

  async getCategories(parentCategoryId?: string) {
    return await firstValueFrom(
      this.categoriesService.getCategoriesList(parentCategoryId)
    );
  }

  async getBrands() {
    this.brands = await firstValueFrom(
      this.brandsService.getBrandsList()
    );
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

  addNewAttribute() {
    const formGroup = new FormGroup({});
    const controls = (this.productForm.get('attributes') as FormArray<FormGroup>).controls;
    const dummyAttribute = this.dummyAttributes[controls.length];

    for (const dummyAttributeKey in dummyAttribute) {
      const formControl = new FormControl(dummyAttribute[dummyAttributeKey], [ Validators.required ]);
      formGroup.setControl(dummyAttributeKey, formControl);
    }

    (this.productForm.get('attributes') as FormArray<FormGroup>).push(formGroup);
  }

  deleteAttribute(i: number) {
    const controls = (this.productForm.get('attributes') as FormArray<FormGroup>).controls;
    controls.splice(i, 1);
    this.productForm.get('attributes').updateValueAndValidity();
  }

  async createProduct() {
    const form = this.productForm;

    if (form.invalid) {
      this.snackbar.open(`Majburiy maydonlarni to'ldiring`, 'OK', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
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
          oldPrice: form.getRawValue().oldPrice || null
        })
      );
      if (response && response.statusCode === 200) {
        this.snackbar.open(`Tovar muvaffaqiyatli o'zgartirildi`, 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        this.dialogRef.close('edited');
      }
    } catch (error) {
      this.snackbar.open(`Tovar ma'lumotlarini tahrirlashda xatolik sodir bo'ldi`, 'OK', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      form.enable();
    }
  }
}
