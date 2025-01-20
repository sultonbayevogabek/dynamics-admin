import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { MemberModel } from '../../../core/models/member.model';
import { environment } from '../../../../environments/environment';
import { HasPermissionsDirective } from '../../../core/directives/has-permissions.directive';
import { MemberActionsComponent } from '../member-actions/member-actions.component';

@Component({
  selector: 'members-table',
  standalone: true,
  imports: [
    MatIcon,
    TranslateModule,
    NgOptimizedImage,
    TitleCasePipe,
    HasPermissionsDirective,
    MemberActionsComponent
  ],
  templateUrl: './members-table.component.html'
})

export class MembersTableComponent {
  @Input({ required: true }) members: MemberModel[];
  @Output('onMemberSelected') memberSelected = new EventEmitter<MemberModel>();
  fileHost = environment.fileHost;

  selectMember(member: MemberModel): void {
    this.memberSelected.emit(member);
  }
}
