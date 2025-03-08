import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../../categories/categories.service';
import { firstValueFrom } from 'rxjs';
import { ICategory } from '../../categories/category.interface';
import {
  SearchableMultiselectComponent
} from '../../../../shared/components/searchable-multiselect/searchable-multiselect.component';

@Component({
  selector: 'product-create',
  imports: [
    MatFormField,
    MatAutocomplete,
    MatOption,
    MatInput,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    SearchableMultiselectComponent,
    SearchableMultiselectComponent
  ],
  templateUrl: './product-create.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ProductCreateComponent implements OnInit {
  categories = signal<ICategory[]>([]);

  private categoriesService = inject(CategoriesService);

  async ngOnInit() {
    await this.getCategories();
  }

  async getCategories() {
    const categories = await firstValueFrom(
      this.categoriesService.getCategoriesList()
    );
    this.categories.set(categories);
  }
}
