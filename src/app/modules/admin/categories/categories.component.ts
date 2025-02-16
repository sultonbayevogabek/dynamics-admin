import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FuseCardComponent } from '../../../../@fuse/components/card';
import { FirstLevelComponent } from './first-level/first-level.component';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  imports: [
    FormsModule,
    FuseCardComponent,
    FirstLevelComponent
  ]
})

export class CategoriesComponent {}
