import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MemberModel, PerformerModel } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})

export class MembersService {
  private _httpClient = inject(HttpClient);

  public updateMembersList$ = new Subject<void>();

  getPerformers(): Observable<{ success: boolean; data: PerformerModel[] }> {
    return this._httpClient.post<{ success: boolean; data: PerformerModel[] }>(environment.host + 'objective/performer-list', {})
  }

  getMembersList(params: { page: number; limit: number }): Observable<{ success: boolean; data: MemberModel[]; total: number }> {
    return this._httpClient.post<{ success: boolean; data: MemberModel[]; total: number }>(environment.host + 'member/list', params)
  }

  getDepartmentsList(page = 1, limit = 300): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'departments/list', {
      page, limit
    })
  }

  getPositionsList(page = 1, limit = 1000): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'positions/position-list', {
      page, limit
    })
  }

  getMemberDetails(user_id: string): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'member/member-detail', { user_id })
  }

  getUserTokenById(id: string): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'users/get-user-token-by-id', { id })
  }

  deleteUser(id: string): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'users/delete-user', { id })
  }

  getUserDataById(id: string): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'users/get-user-by-id', { id })
  }

  createUser(payload: any): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'users/create-user', payload)
  }

  updateUser(payload: any): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'users/update-user', payload)
  }

  deleteDepartment(id: string): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'departments/delete-department', { id })
  }

  deletePosition(id: string): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'positions/delete-position', { id })
  }

  updateDepartment(payload: any): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'departments/update-department', payload)
  }

  updatePosition(payload: any): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'positions/update-position', payload)
  }

  createDepartment(payload: any): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'departments/create-department', payload)
  }

  createPosition(payload: any): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'positions/create-position', payload)
  }
}
