import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '@shared/services/request.service';

@Injectable({
  providedIn: 'root'
})

export class SettingsService extends RequestService {
  createNewOrderStatus(payload: { nameUz: string; nameRu: string; nameEn: string; color: string }): Observable<
    { statusCode: number }
  > {
    return this.request<{ statusCode: number }>('order-status/add', payload);
  }

  getOrderStatusesList(): Observable<{ data: any[]; total: number }> {
    return this.request<{ data: any[]; total: number }>('order-status/list');
  }

  deletOrderStatus(_id: string): Observable<{ statusCode: number }> {
    return this.request<{ statusCode: number }>('order-status/delete', { _id });
  }
}
