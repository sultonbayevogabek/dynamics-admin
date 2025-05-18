import { Injectable } from '@angular/core';
import { RequestService } from '@shared/services/request.service';
import { Observable } from 'rxjs';
import { INews } from './interfaces/news.interface';

@Injectable({
  providedIn: 'root'
})

export class NewsService extends RequestService {
  create(payload: any): Observable<any> {
    return this.request('faq/add', payload);
  }

  editItem(payload: any): Observable<any> {
    return this.request('faq/update', payload);
  }

  getItemsList(): Observable<{ total: number; data: INews[] }> {
    return this.request<{ total: number; data: INews[] }>('faq/list');
  }

  getItem(slug: string): Observable<INews> {
    return this.request('faq/get-product', { slug });
  }

  deleteItem(_id: string): Observable<any> {
    return this.request('banner/delete', { _id });
  }
}
