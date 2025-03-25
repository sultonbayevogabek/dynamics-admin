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
import { ICategory } from '../categories/category.interface';
import { CategoriesService } from '../categories/categories.service';
import { IBrand } from '../brands/brands.interface';
import { BrandsService } from '../brands/brands.service';
import { BannerEditComponent } from './banner-edit/banner-edit.component';

@Component({
  selector: 'banners',
  imports: [
    MatButton,
    MatIcon,
    FormsModule,
    MatSlideToggle
  ],
  templateUrl: './banners.component.html',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class BannersComponent implements OnInit {
  host = environment.host;
  params = {
    search: '',
    categoryId: null,
    brandId: null,
    mainCategoryId: null,
    middleCategoryId: null,
    subCategoryId: null
  };
  banners: IBanner[] = [];
  categories: { [key: string]: ICategory[] } = {
    main: [],
    middle: [],
    sub: []
  };
  brands: IBrand[] = [];

  private matDialog = inject(MatDialog);
  private bannersService = inject(BannersService);
  private categoriesService = inject(CategoriesService);
  private brandsService = inject(BrandsService);
  private toasterService = inject(ToasterService);

  async ngOnInit() {
    await this.getBanners();
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

  async getBanners() {
    const response = await firstValueFrom(
      this.bannersService.getBannersList({
        ...this.params
      })
    );
    this.banners = response.data || [];
  }

  async openAddBannerDialog() {
    const result = await firstValueFrom(
      this.matDialog.open(BannerCreateComponent, {
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        maxWidth: '100vw'
      }).afterClosed()
    );
    if (result === 'created') {
      await this.getBanners()
    }
  }

  async openDetails(banner: IBanner) {
    const result = await firstValueFrom(
      this.matDialog.open(BannerEditComponent, {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: banner
      }).afterClosed()
    );
    if (result === 'edited') {
      await this.getBanners();
    }
  }

  @Confirmable({
    message: `Bannerni o'chirishni tasdiqlaysizmi?`,
    title: 'Diqqat'
  })
  async deleteItem(_id: string) {
    const response = await firstValueFrom(
      this.bannersService.deleteBanner(_id)
    );
    if (response && response.statusCode === 200) {
      this.toasterService.open({
        message: `Banner o'chirildi!`
      });
      await this.getBanners();
    } else {
      this.toasterService.open({
        title: 'Diqqat',
        message: `Bannerni o'chirishda xatolik sodir bo'ldi`,
        type: 'warning'
      });
    }
  }

  async itemStatusChange($event: MatSlideToggleChange, item: IBanner) {
    const newStatus = $event.checked ? 1 : 0;
    const params = {
      _id: item._id,
      status: newStatus
    };

    await firstValueFrom(
      this.bannersService.editBanner(params)
    );

    item.status = newStatus;
    this.toasterService.open({
      message: `Bannerning status o'zgartirildi`,
      duration: 1000
    });
  }
}
