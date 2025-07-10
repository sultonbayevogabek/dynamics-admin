import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '@shared/services/request.service';
import { IOrderStatus } from './interfaces/order-status.interface';

@Injectable({
  providedIn: 'root'
})

export class SettingsService extends RequestService {
  createNewOrderStatus(payload: { nameUz: string; nameRu: string; nameEn: string; color: string }): Observable<
    { statusCode: number }
  > {
    return this.request<{ statusCode: number }>('order-status/add', payload);
  }

  getOrderStatusesList(): Observable<IOrderStatus[]> {
    return this.request<IOrderStatus[]>('order-status/list');
  }

  deleteOrderStatus(_id: string): Observable<{ statusCode: number }> {
    return this.request<{ statusCode: number }>('order-status/delete', { _id });
  }

  updateOrderStatus(payload: IOrderStatus): Observable<{ statusCode: number }> {
    return this.request<{ statusCode: number }>('order-status/update', payload);
  }
}
