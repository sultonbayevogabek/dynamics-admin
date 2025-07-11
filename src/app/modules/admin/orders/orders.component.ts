import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from '@env/environment';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Confirmable } from '../../../core/decorators/confirmation-decorator';
import { ToasterService } from '@shared/services/toaster.service';
import { OrdersService } from './orders.service';
import { IOrder } from './interfaces/order.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

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
    MatIconButton
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
    search: ''
  };
  orders: IOrder[] = [];

  private ordersService = inject(OrdersService);
  private toasterService = inject(ToasterService);

  async ngOnInit() {
    await this.getOrders();
  }

  async getOrders() {
    const response = await firstValueFrom(
      this.ordersService.getOrdersList({
        ...this.params,
        page: this.params.page + 1,
      })
    );
    this.params.total = response.total;
    this.orders = response.data || [];
  }

  @Confirmable({
    title: 'Diqqat',
    message: `Buyurtmani o'chirishni tasdiqlaysizmi?`,
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

  async orderStatusChange($event: MatSlideToggleChange, order: IOrder) {
    const newStatus = $event.checked ? 1 : 0
    const params = {
      _id: order._id,
      status: newStatus,
    }

    await firstValueFrom(
      this.ordersService.editOrder(params)
    )

    // order.status = newStatus;
    this.toasterService.open({
      message: `Buyurtmaning statusi o'zgartirildi`,
      duration: 1000
    })
  }
}
