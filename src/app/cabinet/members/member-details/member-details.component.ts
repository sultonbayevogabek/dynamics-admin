import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MemberModel } from '../../../core/models/member.model';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MembersService } from '../../../core/services/members.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { rootObjectivesIdName } from '../../../core/constants/root-objectives';
import { MatRipple } from '@angular/material/core';
import { environment } from '../../../../environments/environment';
import { FileComponentComponent } from '../../../core/components/file-component/file-component.component';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    MatDialogContent,
    NgOptimizedImage,
    TranslateModule,
    MatIcon,
    MatDialogClose,
    MatRipple,
    DatePipe,
    FileComponentComponent
  ],
  templateUrl: './member-details.component.html'
})

export class MemberDetailsComponent implements OnInit {
  @Inject(MAT_DIALOG_DATA) data: MemberModel = inject(MAT_DIALOG_DATA);
  fileHost = environment.fileHost;
  private _membersService = inject(MembersService);
  private _destroyRef = inject(DestroyRef);

  rootObjectives = rootObjectivesIdName;

  objectives = [];

  ngOnInit(): void {
    this._membersService.getMemberDetails(this.data?.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        this.objectives = res?.objectives || [];
      });
  }
}
