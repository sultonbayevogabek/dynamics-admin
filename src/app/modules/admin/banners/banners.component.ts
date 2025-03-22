import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BannerCreateComponent } from './banner-create/banner-create.component';
import { firstValueFrom } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BannersService } from './banners.service';
import { IBanner } from './interfaces/banner.interface';
import { environment } from '@env/environment';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Confirmable } from '../../../core/decorators/confirmation-decorator';
import { ToasterService } from '@shared/services/toaster.service';
import { BannerEditComponent } from './banner-edit/banner-edit.component';
import { ICategory } from '../categories/category.interface';
import { CategoriesService } from '../categories/categories.service';
import { IBrand } from '../brands/brands.interface';
import { BrandsService } from '../brands/brands.service';

@Component({
  selector: 'banners',
  imports: [
    MatButton,
    MatIcon,
    CurrencyPipe,
    FormsModule,
    MatSlideToggle
  ],
  templateUrl: './banners.component.html',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})

export class BannersComponent implements OnInit {
  host = environment.host;
  params = {
    search: '',
    categoryId: null,
    brandId: null,
    mainCategoryId: null,
    middleCategoryId: null,
    subCategoryId: null,
  };
  products: IBanner[] = [];
  categories: { [key: string]: ICategory[] } = {
    main: [],
    middle: [],
    sub: []
  };
  brands: IBrand[] = [];

  private matDialog = inject(MatDialog);
  private productsService = inject(BannersService);
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
        ...this.params
      })
    );
    this.products = response.data || [];
  }

  async openAddBannerDialog() {
    this.matDialog.open(BannerCreateComponent, {
      width: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      maxWidth: '100vw'
    })
  }

  async openProductDetails(slugUz: string) {
    const data = await firstValueFrom(
      this.productsService.getProduct(slugUz)
    );
    const result = await firstValueFrom(
      this.matDialog.open(BannerEditComponent, {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data
      }).afterClosed()
    )
    if (result === 'edited') {
      await this.searchProduct();
    }
  }

  @Confirmable({
    message: `Tovarni o'chirishni tasdiqlaysizmi?`,
    title: 'Diqqat'
  })
  async deleteProduct(_id: string) {
    const response = await firstValueFrom(
      this.productsService.deleteProduct(_id)
    );
    if (response && response.statusCode === 200) {
      this.toasterService.open({
        message: `Tovar o'chirildi!`
      });
      await this.getProducts();
    } else {
      this.toasterService.open({
        title: 'Diqqat',
        message: `Tovarni o'chirishda xatolik sodir bo'ldi`,
        type: 'warning'
      });
    }
  }

  async searchProduct() {
    await this.getProducts();
  }

  async selectCategory(type: 'main' | 'middle' | 'sub', $event: string) {
    console.log(this.params);
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

  async productStatusChange($event: MatSlideToggleChange, product: IBanner) {
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
