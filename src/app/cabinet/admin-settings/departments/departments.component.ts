import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterService } from '../../../core/services/toaster.service';
import { MembersService } from '../../../core/services/members.service';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { MatIcon } from '@angular/material/icon';
import { SearchPipe } from '../../../core/pipes/search.pipe';
import { HasPermissionsDirective } from '../../../core/directives/has-permissions.directive';

@Component({
  selector: 'departments',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    MatIcon,
    SearchPipe,
    HasPermissionsDirective
  ],
  templateUrl: './departments.component.html',
  providers: [
    ConfirmationService
  ]
})

export class DepartmentsComponent implements OnInit {
  private _membersService = inject(MembersService);
  private _toasterService = inject(ToasterService);
  private _confirmationService = inject(ConfirmationService);

  departmentForm = new FormGroup({
    name_uz: new FormControl('', [ Validators.required ]),
    name_ru: new FormControl('', [ Validators.required ]),
    name_uz_latn: new FormControl('', [ Validators.required ])
  });
  departmentSearch = '';
  departments = [];

  async ngOnInit(): Promise<void> {
    await this.getDepartmentsList();
  }

  async getDepartmentsList(): Promise<void> {
    this.departments = (await firstValueFrom(this._membersService.getDepartmentsList(1, 1000)))?.data || [];
  }

  async deleteDepartment(id: string): Promise<void> {
    const confirm = await firstValueFrom(this._confirmationService.confirmation({
      message: 'confirm.deletion?'
    }));

    if (!confirm) return;

    await firstValueFrom(this._membersService.deleteDepartment(id));

    await this.getDepartmentsList();
  }

  updateDepartment(department: any): void {
    const payload = {
      id: department.id,
      ...department.name_json
    }

    if (!payload?.name_uz || !payload?.name_uz_latn || !payload?.name_ru) return;

    this._membersService.updateDepartment(payload)
      .subscribe(() => {
        this._toasterService.open({
          message: 'changes.saved.successfully'
        })
      }, () => {
        this._toasterService.open({
          message: 'an.error.occurred',
          type: 'error'
        })
      })
  }

  async createDepartment(): Promise<void> {
    if (this.departmentForm.invalid) return;
    await firstValueFrom(this._membersService.createDepartment(this.departmentForm.getRawValue()));
    this.departmentForm.reset();
    await this.getDepartmentsList();
  }
}
