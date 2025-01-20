import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/autocomplete';
import { MatRipple } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { PaginationComponent } from '../../core/components/pagination/pagination.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NotificationsService } from '../../core/services/notifications.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationModel } from '../../core/models/notification.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    MatIcon,
    MatOption,
    MatRipple,
    MatSelect,
    PaginationComponent,
    TranslateModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './notifications.component.html',
})

export class NotificationsComponent implements OnInit {
  params = {
    limit: 15,
    page: 1,
    total: 0
  };
  notificationsCount = 0;

  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  private _notificationsService = inject(NotificationsService);

  notifications: Partial<NotificationModel>[] = [];

  ngOnInit() {
    this.getNotificationsList();

    this._notificationsService.notificationsCount$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(count => {
        this.notificationsCount = count;
      });
  }

  changePage(page: number): void {
    this.params.page = page;
    this.getNotificationsList();
  }

  onLimitChange(): void {
    this.params.page = 1;
    this.getNotificationsList();
  }

  getNotificationsList(): void {
    this._notificationsService.getNotificationsList(this.params)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        this.params.total = res?.total || 0;
        this.notifications = res?.data || [];
      });
  }

  openNotification(not: Partial<NotificationModel>): void {
    if (not?.read) {
      this.redirectNotification(not);
      return;
    }

    this._notificationsService.notificationMarkAsRead(not?.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        not.read = true;

        if (this.notificationsCount) {
          this.notificationsCount > 0 ? this.notificationsCount-- : null;
          this._notificationsService.notificationsCount$.next(this.notificationsCount);
        }

        this.redirectNotification(not);
      });
  }

  redirectNotification(not: Partial<NotificationModel>): void {
    if (not?.details?.objective_id) {
      this._router.navigate([ '/', 'my-tasks', 'objectives' ], {
        queryParams: {
          objectiveId: not?.details?.objective_id
        }
      });
    }

    if (not?.details?.key_id) {
      this._router.navigate([ '/', 'my-tasks', 'key-results' ], {
        queryParams: {
          keyId: not?.details?.key_id
        }
      });
    }
  }
}
