import { Injectable } from '@angular/core';
import { RequestService } from '@shared/services/request.service';
import { Observable } from 'rxjs';
import { IFaq, IFaqOrder } from './interfaces/faq.interface';

@Injectable({
  providedIn: 'root'
})

export class FaqService extends RequestService {
  create(payload: any): Observable<any> {
    return this.request('faq/add', payload);
  }

  editItem(payload: any): Observable<any> {
    return this.request('faq/update', payload);
  }

  getItemsList(): Observable<IFaq[]> {
    return this.request<IFaq[]>('faq/list');
  }

  getItem(slug: string): Observable<IFaq> {
    return this.request('faq/get-product', { slug });
  }

  deleteItem(_id: string): Observable<any> {
    return this.request('faq/delete', { _id });
  }

  updateOrder(payload: { orders: IFaqOrder[] }): Observable<any> {
    return this.request('faq/update-order', payload);
  }
}
