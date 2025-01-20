import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  private _httpClient = inject(HttpClient);

  getRootObjectivesList(): Observable<any> {
    return this._httpClient.post(environment.host + 'objective/root-objective-list', {});
  }

  getDashboardStatistics(): Observable<any> {
    return this._httpClient.post(environment.host + 'dashboard/list', {});
  }

  updateStatistics(payload: any): Observable<any> {
    return this._httpClient.post(environment.host + 'dashboard/update-chart-values', payload)
  }
}
