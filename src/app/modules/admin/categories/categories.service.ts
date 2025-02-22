import { Injectable } from '@angular/core';
import { RequestService } from '../../../shared/services/request.service';
import { map, Observable } from 'rxjs';
import { ICategory } from './category.interface';

export interface IResponse {
  statusCode: number;
  message: string;
  errorCode: number | null;
}

@Injectable({
  providedIn: 'root'
})

export class CategoriesService extends RequestService {
  createCategory(payload: {
    parentId?: string;
    nameUz: string;
    nameRu: string;
    nameEn: string
  }): Observable<IResponse> {
    return this.request('category/add', payload);
  }

  updateCategory(payload: {
    parentId?: string;
    nameUz: string;
    nameRu: string;
    nameEn: string
  }): Observable<IResponse> {
    return this.request('category/update', payload);
  }

  getCategoriesList(parentId?: string): Observable<ICategory[]> {
    return this.request<{ data: ICategory[]; total: number }>('category/get-list', parentId ? { parentId } : {})
      .pipe(
        map(res => {
          return res?.data || [];
        })
      );
  }

  deleteCategory(_id: string): Observable<IResponse> {
    return this.request<IResponse>('category/delete', { _id });
  }
}
