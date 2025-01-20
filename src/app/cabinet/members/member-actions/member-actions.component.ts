import { Component, inject, Input, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { OverlayComponent } from '../../../core/components/overlay-panel/overlay-panel.component';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { firstValueFrom } from 'rxjs';
import { MembersService } from '../../../core/services/members.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { MemberManageComponent } from '../member-manage/member-manage.component';

@Component({
  selector: 'member-actions',
  standalone: true,
  imports: [
    MatIcon,
    MatRipple,
    OverlayComponent,
    TranslateModule
  ],
  templateUrl: './member-actions.component.html',
  providers: [ConfirmationService]
})
export class MemberActionsComponent {
  @ViewChild('overlayPanel') overlayPanel: OverlayComponent;
  @Input({ required: true }) memberId: string;

  private _confirmationService = inject(ConfirmationService);
  private _membersService = inject(MembersService);
  private _toasterService = inject(ToasterService);
  private _dialog = inject(MatDialog);

  async deleteMember(_overlayRef: OverlayRef): Promise<void> {
    this.overlayPanel._overlayRef.detach();

    const confirm = await firstValueFrom(this._confirmationService.confirmation({
      message: 'are.you.sure.you.want.to.delete.the.user?'
    }));

    if (!confirm) return;

    const res = await firstValueFrom(this._membersService.deleteUser(this.memberId));

    if (!res && !res?.success) return;

    this._membersService.updateMembersList$.next();

    this._toasterService.open({
      message: 'user.deleted'
    })
  }

  async enterToUserProfile(): Promise<void> {
    this.overlayPanel._overlayRef.detach();

    const response = await firstValueFrom(this._confirmationService.confirmation({
      message: 'are.you.sure.you.want.to.enter.to.the.user\'s.profile?'
    }));

    if (!response) return;

    const { access_token } = await firstValueFrom(this._membersService.getUserTokenById(this.memberId));
    if (!access_token) return;

    localStorage.setItem('access_token', access_token);
    window.location.href = window.location.origin;
  }

  openUserDataEditDialog(): void {
    this.overlayPanel._overlayRef.detach();

    this._dialog.open(MemberManageComponent, {
      width: '600px',
      data: {
        memberId: this.memberId
      }
    })
  }
}
