import { Injectable } from '@angular/core';
import { RequestService } from '@shared/services/request.service';
import { Observable } from 'rxjs';
import { IOrder } from './interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})

export class OrdersService extends RequestService {
  createOrder(payload: any): Observable<any> {
    return this.request('order/add', payload);
  }

  editOrder(payload: any): Observable<any> {
    return this.request('order/update', payload);
  }

  getOrdersList(params: any): Observable<{ total: number; data: IOrder[] }> {
    return this.request<{ total: number; data: IOrder[] }>('order/list', params);
  }

  getOrder(params: { slug?: string; _id?: string }): Observable<IOrder> {
    return this.request('order/get-product', params);
  }

  deleteOrder(_id: string): Observable<any> {
    return this.request('order/delete', { _id });
  }
}
