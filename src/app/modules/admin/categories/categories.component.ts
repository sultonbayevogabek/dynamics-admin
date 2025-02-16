import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirstLevelComponent } from './first-level/first-level.component';
import { SecondLevelComponent } from './second-level/second-level.component';
import { ThirdLevelComponent } from './third-level/third-level.component';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  imports: [
    FormsModule,
    FirstLevelComponent,
    SecondLevelComponent,
    ThirdLevelComponent
  ]
})

export class CategoriesComponent {}
