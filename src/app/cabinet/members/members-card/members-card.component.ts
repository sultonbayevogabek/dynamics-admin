import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { MemberModel } from '../../../core/models/member.model';
import { environment } from '../../../../environments/environment';
import { MemberActionsComponent } from '../member-actions/member-actions.component';
import { HasPermissionsDirective } from '../../../core/directives/has-permissions.directive';

@Component({
  selector: 'members-card',
  standalone: true,
  imports: [
    MatIcon,
    MatRipple,
    TranslateModule,
    NgOptimizedImage,
    MemberActionsComponent,
    HasPermissionsDirective
  ],
  templateUrl: './members-card.component.html'
})

export class MembersCardComponent {
  @Input({ required: true }) member: MemberModel;
  fileHost = environment.fileHost;
}
