import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CurrencyPipe, DatePipe, formatDate, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IProduct } from './interfaces/product.interface';
import { environment } from '@env/environment';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Confirmable } from '../../../core/decorators/confirmation-decorator';
import { ToasterService } from '@shared/services/toaster.service';
import { ICategory } from '../categories/category.interface';
import { CategoriesService } from '../categories/categories.service';
import {
  SearchableMultiselectComponent
} from '@shared/components/searchable-multiselect/searchable-multiselect.component';
import { IBrand } from '../brands/brands.interface';
import { BrandsService } from '../brands/brands.service';
import { ImgUrlPipe } from '@shared/pipes/img-url.pipe';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { OrdersService } from './orders.service';

@Component({
  selector: 'orders',
  imports: [
    MatButton,
    MatIcon,
    CurrencyPipe,
    FormsModule,
    MatFormField,
    MatInput,
    MatPaginator,
    MatPrefix,
    MatSlideToggle,
    SearchableMultiselectComponent,
    ImgUrlPipe,
    NgOptimizedImage,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    DatePipe
  ],
  templateUrl: './orders.component.html',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  styles: [ `
    .inventory-grid {
      grid-template-columns: 48px 96px 25% 25% 100px 100px 100px 40px;
    }
  `
  ]
})

export class OrdersComponent implements OnInit {
  host = environment.host;
  params = {
    page: 0,
    limit: 15,
    total: 0,
    search: '',
    categoryId: null,
    brandId: null,
    mainCategoryId: null,
    middleCategoryId: null,
    subCategoryId: null,
    createdDate: null
  };
  products: IProduct[] = [];
  categories: { [key: string]: ICategory[] } = {
    main: [],
    middle: [],
    sub: []
  };
  brands: IBrand[] = [];

  private matDialog = inject(MatDialog);
  private productsService = inject(OrdersService);
  private categoriesService = inject(CategoriesService);
  private brandsService = inject(BrandsService);
  private toasterService = inject(ToasterService);

  async ngOnInit() {
    await this.getProducts();
    await this.getBrands();

    this.categories.main = await this.getCategories();
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

  async getProducts() {
    const response = await firstValueFrom(
      this.productsService.getProductsList({
        ...this.params,
        page: this.params.page + 1,
        createdDate: this.params.createdDate ? formatDate(this.params.createdDate, 'dd.MM.yyyy', 'en-US') : null
      })
    );
    this.params.total = response.total;
    this.products = response.data || [];
  }

  @Confirmable({
    title: 'Diqqat',
    message: `Buyurtmani o'chirishni tasdiqlaysizmi?`,
  })
  async deleteProduct(_id: string) {
    const response = await firstValueFrom(
      this.productsService.deleteProduct(_id)
    );
    if (response && response.statusCode === 200) {
      this.toasterService.open({
        message: `Buyurtma o'chirildi!`
      });
      this.params.page = 0;
      await this.getProducts();
    } else {
      this.toasterService.open({
        title: 'Diqqat',
        message: `Buyurtmani o'chirishda xatolik sodir bo'ldi`,
        type: 'warning'
      });
    }
  }

  async searchProduct() {
    this.params.page = 0;
    await this.getProducts();
  }

  async selectCategory(type: 'main' | 'middle' | 'sub', $event: string) {
    if (type === 'main') {
      if ($event) {
        this.categories.middle = await this.getCategories($event);
      } else {
        this.categories.middle = [];
      }
      this.categories.sub = [];
      this.params.mainCategoryId = $event;
      this.params.middleCategoryId = null;
      this.params.subCategoryId = null;
    }

    if (type === 'middle') {
      if ($event) {
        this.categories.sub = await this.getCategories($event);
      } else {
        this.categories.sub = [];
      }
      this.params.middleCategoryId = $event;
      this.params.subCategoryId = null;
    }

    if (type === 'sub') {
      this.params.subCategoryId = $event;
    }

    if (this.params.subCategoryId) {
      this.params.categoryId = this.params.subCategoryId;
      await this.searchProduct();
      return;
    }

    if (this.params.middleCategoryId) {
      this.params.categoryId = this.params.middleCategoryId;
      await this.searchProduct();
      return;
    }

    if (this.params.mainCategoryId) {
      this.params.categoryId = this.params.mainCategoryId;
      await this.searchProduct();
      return;
    }

    this.params.categoryId = null;
    await this.searchProduct();
  }

  async selectBrand($event: string) {
    this.params.brandId = $event;
    await this.searchProduct();
  }

  async pageChange($event: PageEvent) {
    this.params.page = $event.pageIndex;
    await this.getProducts();
  }

  async productStatusChange($event: MatSlideToggleChange, product: IProduct) {
    const newStatus = $event.checked ? 1 : 0
    const params = {
      _id: product._id,
      status: newStatus,
    }

    await firstValueFrom(
      this.productsService.editProduct(params)
    )

    product.status = newStatus;
    this.toasterService.open({
      message: `Tovar status o'zgartirildi`,
      duration: 1000
    })
  }
}
