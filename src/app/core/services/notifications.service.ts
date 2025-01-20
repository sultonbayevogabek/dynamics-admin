import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { NotificationModel } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})

export class NotificationsService {
  private _httpClient = inject(HttpClient);

  notificationsCount$ = new BehaviorSubject(0);

  getNotificationsCount(): Observable<{ new_notifications_count: string }> {
    return this._httpClient.post<{ new_notifications_count: string }>(environment.host + 'notification-history/new-notifications-count', {})
      .pipe(
        tap(res => {
          this.notificationsCount$.next(+res?.new_notifications_count);
        })
      )
  }

  getNotificationsList(params: { page: number; limit: number }): Observable<{ total: number; data: NotificationModel[] }> {
    return this._httpClient.post<{ total: number; data: NotificationModel[] }>(environment.host + 'notification-history/list', params)
  }

  notificationMarkAsRead(id: string): Observable<any> {
    return this._httpClient.post<any>(environment.host + 'notification-history/change-notification-status', { id })
  }
}
