import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriesCrudComponent } from './categories-crud/categories-crud.component';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  imports: [
    FormsModule,
    CategoriesCrudComponent
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class CategoriesComponent {}
