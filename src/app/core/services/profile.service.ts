import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  private _httpClient = inject(HttpClient);

  updateUserInformation(payload: any): Observable<{ success: boolean; access_token: string }> {
    return this._httpClient.post<{ success: boolean; access_token: string }>(environment.host + 'users/update-user-profile', payload)
  }
}
