import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatRipple } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { MembersCardComponent } from './members-card/members-card.component';
import { PaginationComponent } from '../../core/components/pagination/pagination.component';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MembersTableComponent } from './members-table/members-table.component';
import { MembersService } from '../../core/services/members.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MemberModel } from '../../core/models/member.model';
import { rootObjectives } from '../../core/constants/root-objectives';
import { OverlayComponent } from '../../core/components/overlay-panel/overlay-panel.component';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { HasPermissionsDirective } from '../../core/directives/has-permissions.directive';
import { MemberManageComponent } from './member-manage/member-manage.component';

@Component({
  selector: 'members',
  standalone: true,
  imports: [
    MatIcon,
    MatRipple,
    TranslateModule,
    MembersCardComponent,
    PaginationComponent,
    MatSelect,
    MatOption,
    FormsModule,
    MembersTableComponent,
    OverlayComponent,
    NgClass,
    HasPermissionsDirective
  ],
  templateUrl: './members.component.html'
})

export class MembersComponent implements OnInit {
  viewType: 'grid' | 'list' = 'grid';

  params = {
    limit: 15,
    page: 1,
    total: 0,
    department_ids: [],
    root_objective_id: null,
    root_objective_name: 'all',
    search: ''
  };

  members: MemberModel[] = [];
  departments: any[] = [];

  rootObjectives = [
    {
      id: null,
      title: 'all'
    },
    ...rootObjectives
  ];


  private _membersService = inject(MembersService);
  private _destroyRef = inject(DestroyRef);
  private _dialog = inject(MatDialog);

  ngOnInit() {
    this.getMembersList();
    this.getDepartments();

    this._membersService.updateMembersList$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.search();
      });
  }

  getMembersList(): void {
    this._membersService.getMembersList(this.params)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: res => {
          this.members = res?.data || [];
          this.params.total = res?.total || 0;
        }
      });
  }

  changePage(page: number): void {
    this.params.page = page;
    this.getMembersList();
  }

  getDepartments(): void {
    this._membersService.getDepartmentsList()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        this.departments = res?.data || [];
      });
  }

  onLimitChange(): void {
    this.search();
  }

  search(): void {
    this.params.page = 1;
    this.getMembersList();
  }

  selectRootObjectiveId(rootObjectiveId: string, overlayPanel: OverlayRef): void {
    this.params.root_objective_id = rootObjectiveId;
    this.params.root_objective_name = this.rootObjectives.find(i => i.id === rootObjectiveId)?.title;
    overlayPanel.detach();
    this.search();
  }

  openMemberDetailsDialog(member: MemberModel): void {
    this._dialog.open(MemberDetailsComponent, {
      width: '1400px',
      data: member
    });
  }

  openAddNewMemberDialog(): void {
    this._dialog.open(MemberManageComponent, {
      width: '600px',
    })
  }
}
