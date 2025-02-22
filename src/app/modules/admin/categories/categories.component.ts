import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriesCrudComponent } from './categories-crud/categories-crud.component';
import { FuseCardComponent } from '../../../../@fuse/components/card';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  imports: [
    FormsModule,
    CategoriesCrudComponent,
    FuseCardComponent
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class CategoriesComponent {}
