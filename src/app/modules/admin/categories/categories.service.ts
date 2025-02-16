import { Injectable } from '@angular/core';
import { RequestService } from '../../../shared/services/request.service';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
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
  mainCategories$ = new BehaviorSubject<ICategory[]>([]);
  midCategories$ = new BehaviorSubject<ICategory[]>([]);
  subCategories$ = new BehaviorSubject<ICategory[]>([]);

  createCategory(level: 'main' | 'mid' | 'sub', payload: {
    parentId?: string;
    nameUz: string;
    nameRu: string;
    nameEn: string
  }): Observable<IResponse> {
    return this.request(level + '-category/add', payload);
  }

  updateCategory(level: 'main' | 'mid' | 'sub', payload: {
    parentId?: string;
    nameUz: string;
    nameRu: string;
    nameEn: string
  }): Observable<IResponse> {
    return this.request(level + '-category/update', payload);
  }

  getCategoriesList(level: 'main' | 'mid' | 'sub', parentId?: string): Observable<ICategory[]> {
    return this.request<{ data: ICategory[]; total: number }>(level + '-category/get-list', parentId ? { parentId } : {})
      .pipe(
        map(res => {
          return res?.data || [];
        }),
        tap(res => {
          if (level === 'main') {
            this.mainCategories$.next(res);
          }
          if (level === 'mid') {
            this.midCategories$.next(res);
          }
          if (level === 'sub') {
            this.subCategories$.next(res);
          }
        })
      );
  }

  deleteCategory(level: 'main' | 'mid' | 'sub', _id: string): Observable<IResponse> {
    return this.request<IResponse>(level + '-category/delete', { _id });
  }
}
