import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../categories/categories.service';
import { firstValueFrom } from 'rxjs';
import { ICategory } from '../../categories/category.interface';
import {
  SearchableMultiselectComponent
} from '@shared/components/searchable-multiselect/searchable-multiselect.component';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
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
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'product-create',
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
    MatSelect,
    MatOption
  ],
  templateUrl: './product-create.component.html',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  standalone: true,
  providers: [
    provideNgxMask()
  ]
})


export class ProductCreateComponent implements OnInit {
  productForm = new FormGroup({
    details: new FormGroup({
      mainCategoryId: new FormControl<string>(null, Validators.required),
      middleCategoryId: new FormControl<string>(null, Validators.required)
    }),
    categoryId: new FormControl<string>(null, [ Validators.required ]),
    nameUz: new FormControl<string>('Elektr arra, Philips 890/10X', [ Validators.required ]),
    nameRu: new FormControl<string>('Электропила Philips 890/10X', [ Validators.required ]),
    nameEn: new FormControl<string>('Electric saw, Philips 890/10X', [ Validators.required ]),
    descriptionUz: new FormControl<string>(`Elektr arra Philips 890/10X –
    bu yuqori samarali va bardoshli elektr arra bo‘lib, yog‘och,
    plastmassa va metall materiallarni kesish uchun mo‘ljallangan.
    Quvvatli dvigatel, aniq kesish mexanizmi va ergonomik dizayni bilan u uy va
    professional ustaxonalarda foydalanish uchun ideal tanlovdir.
     Xavfsizlik tizimi va qulay qo‘l ushlagichi bilan ishlash yanada oson va xavfsiz.`, [ Validators.required ]),
    descriptionRu: new FormControl<string>(`Электрическая пила Philips 890/10X – это мощная
    и надежная электрическая пила, предназначенная для резки дерева, пластика и металла.
    Оснащена высокопроизводительным двигателем, точным механизмом резки и эргономичным
    дизайном, что делает её идеальным выбором как для домашнего использования, так и для профессиональных
     мастерских. Система безопасности и удобная рукоятка обеспечивают комфорт и безопасность во время работы.`, [ Validators.required ]),
    descriptionEn: new FormControl<string>(`Electric Saw Philips 890/10X is a high-performance
    and durable electric saw designed for cutting wood, plastic, and metal materials. Equipped with a powerful
    motor, precise cutting mechanism, and ergonomic design, it is an ideal choice for both home and professional
    workshops. The safety system and comfortable handle ensure ease of use and enhanced safety during operation.`, [ Validators.required ]),
    oldPrice: new FormControl(),
    currentPrice: new FormControl(),
    availability: new FormControl('on_demand'),
    brandId: new FormControl<string>(null, [ Validators.required ]),
    images: new FormControl<IFile[]>([], [ Validators.required ]),
    attributes: new FormArray<FormGroup>([
        new FormGroup({
          nameUz: new FormControl<string>('Ishlab chiqaruvchi', [ Validators.required ]),
          nameRu: new FormControl<string>('Производитель', [ Validators.required ]),
          nameEn: new FormControl<string>('Manufacturer', [ Validators.required ]),
          valueUz: new FormControl<string>('ABB', [ Validators.required ]),
          valueRu: new FormControl<string>('Samsung', [ Validators.required ]),
          valueEn: new FormControl<string>('LG', [ Validators.required ])
        })
      ], [ Validators.required ]
    ),
    keywords: new FormControl<string>('elektr qurilma, apparat, elektr arra, randa, bichqi')
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
        this.productsService.createProduct({
          ...form.getRawValue(),
          oldPrice: form.getRawValue().oldPrice || null
        })
      );
      if (response && response.statusCode === 201) {
        this.snackbar.open(`Tovar muvaffaqiyatli yaratildi`, 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        form.enable();
      }
    } catch (error) {
      this.snackbar.open(`Tovarni yaratishda xatolik sodir bo'ldi`, 'OK', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      form.enable();
    }
  }
}
