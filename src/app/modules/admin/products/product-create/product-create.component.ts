import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../categories/categories.service';
import { firstValueFrom } from 'rxjs';
import { ICategory } from '../../categories/category.interface';
import {
  SearchableMultiselectComponent
} from '../../../../shared/components/searchable-multiselect/searchable-multiselect.component';
import { MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'product-create',
  imports: [
    ReactiveFormsModule,
    SearchableMultiselectComponent,
    SearchableMultiselectComponent,
    MatDialogContent,
    MatButton,
    MatIcon,
    MatDialogClose,
    MatFormField,
    MatInput
  ],
  templateUrl: './product-create.component.html',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  standalone: true
})


export class ProductCreateComponent implements OnInit {
  productForm = new FormGroup({
    details: new FormGroup({
      mainCategoryId: new FormControl<string>(null, Validators.required),
      middleCategoryId: new FormControl<string>(null, Validators.required)
    }),
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
    attributes: new FormArray(
      [
        new FormGroup({
          nameUz: new FormControl<string>(null, [ Validators.required ]),
          nameRu: new FormControl<string>(null, [ Validators.required ]),
          nameEn: new FormControl<string>(null, [ Validators.required ]),
          valueUz: new FormControl<string>(null, [ Validators.required ]),
          valueRu: new FormControl<string>(null, [ Validators.required ]),
          valueEn: new FormControl<string>(null, [ Validators.required ])
      })
      ]
    )
  });
  categories: { [key: string]: ICategory[] } = {
    main: [],
    middle: [],
    sub: []
  };

  private categoriesService = inject(CategoriesService);

  async ngOnInit() {
    this.categories.main = await this.getCategories();
  }

  async getCategories(parentCategoryId?: string) {
    return await firstValueFrom(
      this.categoriesService.getCategoriesList(parentCategoryId)
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

    console.log(this.productForm.getRawValue());
  }
}
