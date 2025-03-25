import { Injectable } from '@angular/core';
import { RequestService } from '@shared/services/request.service';
import { Observable } from 'rxjs';
import { IBanner } from './interfaces/banner.interface';

@Injectable({
  providedIn: 'root'
})

export class BannersService extends RequestService {
  createBanner(payload: any): Observable<any> {
    return this.request('banner/add', payload);
  }

  editBanner(payload: any): Observable<any> {
    return this.request('banner/update', payload);
  }

  getBannersList(params: any): Observable<{ total: number; data: IBanner[] }> {
    return this.request<{ total: number; data: IBanner[] }>('banner/get-list', params);
  }

  getProduct(slug: string): Observable<IBanner> {
    return this.request('product/get-product', { slug });
  }

  deleteBanner(_id: string): Observable<any> {
    return this.request('banner/delete', { _id });
  }
}
