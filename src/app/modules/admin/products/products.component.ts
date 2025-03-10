import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ProductCreateComponent } from './product-create/product-create.component';

@Component({
  selector: 'products',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './products.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ProductsComponent implements OnInit {
  private matDialog = inject(MatDialog);

  ngOnInit() {
    this.openAddProductDialog()
  }

  openAddProductDialog() {
    this.matDialog.open(ProductCreateComponent, {
      width: '80%'
    })
  }
}
