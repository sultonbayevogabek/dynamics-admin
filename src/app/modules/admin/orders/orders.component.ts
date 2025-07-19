import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from '@env/environment';
import { Confirmable } from '../../../core/decorators/confirmation-decorator';
import { ToasterService } from '@shared/services/toaster.service';
import { OrdersService } from './orders.service';
import { IOrder } from './interfaces/order.interface';
import { DatePipe, formatDate, NgStyle, TitleCasePipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { SettingsService } from '../settings/settings.service';
import { IOrderStatus } from '../settings/interfaces/order-status.interface';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';

@Component({
  selector: 'orders',
  imports: [
    MatIcon,
    FormsModule,
    MatFormField,
    MatInput,
    MatPaginator,
    MatPrefix,
    DatePipe,
    TitleCasePipe,
    MatIconButton,
    MatOption,
    MatSelect,
    NgStyle,
    MatSuffix,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle
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
    status: null,
    fromDate: null,
    toDate: null
  };
  orders: IOrder[] = [];
  statuses = signal<IOrderStatus[]>([]);

  private ordersService = inject(OrdersService);
  private toasterService = inject(ToasterService);
  private settingsService = inject(SettingsService);

  async ngOnInit() {
    await this.getOrders();
    await this.getOrderStatuses();
  }

  async getOrders() {
    const response = await firstValueFrom(
      this.ordersService.getOrdersList({
        ...this.params,
        page: this.params.page + 1,
        fromDate: this.params.fromDate ? formatDate(this.params.fromDate, 'dd.MM.yyyy', 'en-US') : null,
        toDate: this.params.toDate ? formatDate(this.params.toDate, 'dd.MM.yyyy', 'en-US') : null
      })
    );
    this.params.total = response.total;
    this.orders = response.data || [];
  }

  @Confirmable({
    title: 'Diqqat',
    message: `Buyurtmani o'chirishni tasdiqlaysizmi?`
  })
  async deleteProduct(_id: string) {
    const response = await firstValueFrom(
      this.ordersService.deleteOrder(_id)
    );
    if (response && response.statusCode === 200) {
      this.toasterService.open({
        message: `Buyurtma o'chirildi!`
      });
      this.params.page = 0;
      await this.getOrders();
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
    await this.getOrders();
  }

  async pageChange($event: PageEvent) {
    this.params.page = $event.pageIndex;
    await this.getOrders();
  }

  async orderStatusChange(id: string, $event: MatSelectChange) {
    const response = await firstValueFrom(
      this.ordersService.editOrder({
        _id: id,
        status: $event.value
      })
    );

    if (response && response.statusCode === 200) {
      this.toasterService.open({
        message: `Buyurtmaning statusi o'zgartirildi`,
        duration: 1000
      });
      return;
    }

    this.toasterService.open({
      message: `Buyurtmaning statusi o'zgartirishda xatolik sodir bo'ldi`,
      duration: 1000,
      type: 'warning'
    });
  }

  async getOrderStatuses() {
    const statuses = await firstValueFrom(
      this.settingsService.getOrderStatusesList()
    );
    this.statuses.set(statuses);
  }
}
