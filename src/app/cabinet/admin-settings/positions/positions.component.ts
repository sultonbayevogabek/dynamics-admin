import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterService } from '../../../core/services/toaster.service';
import { MembersService } from '../../../core/services/members.service';
import { HasPermissionsDirective } from '../../../core/directives/has-permissions.directive';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { SearchPipe } from '../../../core/pipes/search.pipe';
import { ConfirmationService } from '../../../core/services/confirmation.service';

@Component({
  selector: 'positions',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    HasPermissionsDirective,
    MatIcon,
    SearchPipe
  ],
  templateUrl: './positions.component.html',
  providers: [
    ConfirmationService
  ]
})

export class PositionsComponent implements OnInit {
  private _membersService = inject(MembersService);
  private _toasterService = inject(ToasterService);
  private _confirmationService = inject(ConfirmationService);

  positionForm = new FormGroup({
    name_uz: new FormControl('', [ Validators.required ]),
    name_ru: new FormControl('', [ Validators.required ]),
    name_uz_latn: new FormControl('', [ Validators.required ])
  });
  positionSearch = '';
  positions = [];

  async ngOnInit(): Promise<void> {
    await this.getPositionsList();
  }

  async getPositionsList(): Promise<void> {
    this.positions = await firstValueFrom(this._membersService.getPositionsList(1, 1000)) || [];
  }

  async deletePosition(id: string): Promise<void> {
    const confirm = await firstValueFrom(this._confirmationService.confirmation({
      message: 'confirm.deletion?'
    }));

    if (!confirm) return;

    await firstValueFrom(this._membersService.deletePosition(id));

    await this.getPositionsList();
  }

  updatePosition(position: any): void {
    const payload = {
      id: position.id,
      ...position.name_json
    }

    if (!payload?.name_uz || !payload?.name_uz_latn || !payload?.name_ru) return;

    this._membersService.updatePosition(payload)
      .subscribe(res => {
        this._toasterService.open({
          message: 'changes.saved.successfully'
        })
      }, error => {
        this._toasterService.open({
          message: 'an.error.occurred',
          type: 'error'
        })
      })
  }

  async createPosition(): Promise<void> {
    if (this.positionForm.invalid) return;
    await firstValueFrom(this._membersService.createPosition(this.positionForm.getRawValue()));
    this.positionForm.reset();
    await this.getPositionsList();
  }
}
