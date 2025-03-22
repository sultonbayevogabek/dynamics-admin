import { Injectable } from '@angular/core';
import { RequestService } from '@shared/services/request.service';
import { Observable } from 'rxjs';
import { IBanner } from './interfaces/banner.interface';

@Injectable({
  providedIn: 'root'
})

export class BannersService extends RequestService {
  createProduct(payload: any): Observable<any> {
    return this.request('product/add', payload);
  }

  editProduct(payload: any): Observable<any> {
    return this.request('product/update', payload);
  }

  getProductsList(params: any): Observable<{ total: number; data: IBanner[] }> {
    return this.request<{ total: number; data: IBanner[] }>('product/get-list', params);
  }

  getProduct(slug: string): Observable<IBanner> {
    return this.request('product/get-product', { slug });
  }

  deleteProduct(_id: string): Observable<any> {
    return this.request('product/delete', { _id });
  }
}
