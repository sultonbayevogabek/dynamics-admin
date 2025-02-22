import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirstLevelComponent } from './first-level/first-level.component';
import { FuseCardComponent } from '../../../../@fuse/components/card';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  imports: [
    FormsModule,
    FirstLevelComponent,
    FuseCardComponent
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class CategoriesComponent {}
