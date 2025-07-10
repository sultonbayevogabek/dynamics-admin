import { Injectable } from '@angular/core';
import { RequestService } from '@shared/services/request.service';
import { Observable } from 'rxjs';
import { IOrder } from './interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})

export class OrdersService extends RequestService {
  createProduct(payload: any): Observable<any> {
    return this.request('product/add', payload);
  }

  editProduct(payload: any): Observable<any> {
    return this.request('product/update', payload);
  }

  getOrdersList(params: any): Observable<{ total: number; data: IOrder[] }> {
    return this.request<{ total: number; data: IOrder[] }>('product/list', params);
  }

  getProduct(params: { slug?: string; _id?: string }): Observable<IOrder> {
    return this.request('product/get-product', params);
  }

  deleteProduct(_id: string): Observable<any> {
    return this.request('product/delete', { _id });
  }
}
