import { Injectable } from '@angular/core';
import { RequestService } from '../../../shared/services/request.service';
import { IBrand } from './brands.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BrandsService extends RequestService {
  createBrand(brand: IBrand) {
    return this.request('brand/add', brand);
  }

  updateBrand(brand: IBrand) {
    return this.request('brand/update', brand);
  }

  deleteBrand(_id: string) {
    return this.request('brand/delete', { _id });
  }

  getBrandsList(params: any = {}): Observable<{
    total: number;
    data: IBrand[]
  }> {
    return this.request('brand/list', params);
  }
}
