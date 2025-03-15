import { Injectable } from '@angular/core';
import { RequestService } from '@shared/services/request.service';
import { Observable } from 'rxjs';
import { IProduct } from './interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})

export class ProductsService extends RequestService {
  createProduct(payload: any): Observable<any> {
    return this.request('product/add', payload);
  }

  editProduct(payload: any): Observable<any> {
    return this.request('product/update', payload);
  }

  getProductsList(params: any): Observable<{ total: number; data: IProduct[] }> {
    return this.request<{ total: number; data: IProduct[] }>('product/get-list', params);
  }

  getProduct(slug: string): Observable<IProduct> {
    return this.request('product/get-product', { slug });
  }

  deleteProduct(_id: string): Observable<any> {
    return this.request('product/delete', { _id });
  }
}
