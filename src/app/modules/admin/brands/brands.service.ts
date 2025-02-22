import { Injectable } from '@angular/core';
import { RequestService } from '../../../shared/services/request.service';
import { IBrand } from './brands.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BrandsService extends RequestService {
  createBrand(brand: IBrand) {
    return this.request('brand/add', brand)
  }
  updateBrand(brand: IBrand) {
    return this.request('brand/update', brand)
  }
  deleteBrand(_id: string) {
    return this.request('brand/delete', { _id })
  }
  getBrandsList(): Observable<IBrand[]> {
    return this.request<{
      total: number;
      data: IBrand[]
    }>('brand/get-list')
      .pipe(map((res) => {
        return res.data;
      }))
  }
}
