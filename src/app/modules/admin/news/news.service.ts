import { Injectable } from '@angular/core';
import { RequestService } from '@shared/services/request.service';
import { Observable } from 'rxjs';
import { INews } from './interfaces/news.interface';

@Injectable({
  providedIn: 'root'
})

export class NewsService extends RequestService {
  create(payload: any): Observable<any> {
    return this.request('news/add', payload);
  }

  editItem(payload: any): Observable<any> {
    return this.request('news/update', payload);
  }

  getItemsList(): Observable<{ total: number; data: INews[] }> {
    return this.request<{ total: number; data: INews[] }>('news/list');
  }

  getItem(slug: string): Observable<INews> {
    return this.request('news/get-news', { slug });
  }

  deleteItem(_id: string): Observable<any> {
    return this.request('news/delete', { _id });
  }
}
