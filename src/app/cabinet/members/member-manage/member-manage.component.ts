import { Component, DestroyRef, ElementRef, Inject, inject, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembersService } from '../../../core/services/members.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { FileService } from '../../../core/services/file.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { DatePipe, formatDate, NgOptimizedImage } from '@angular/common';
import { MatDatepicker, MatDatepickerInput } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/autocomplete';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatRipple, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'member-manage',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatIcon,
    MatOption,
    MatProgressSpinner,
    MatRipple,
    MatSelect,
    NgOptimizedImage,
    NgxMaskDirective,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogContent
  ],
  templateUrl: './member-manage.component.html',
  providers: [
    provideNativeDateAdapter()
  ]
})

export class MemberManageComponent {
  @ViewChild('attachFile') attachFile: ElementRef<HTMLInputElement>;
  @Inject(MAT_DIALOG_DATA) data: { memberId: string } = inject(MAT_DIALOG_DATA);


  fileHost = environment.fileHost;
  profileForm = new FormGroup({
    first_name: new FormControl<string>('', [ Validators.required, Validators.maxLength(32) ]),
    middle_name: new FormControl<string>('', [ Validators.required, Validators.maxLength(32) ]),
    last_name: new FormControl<string>('', [ Validators.required, Validators.maxLength(32) ]),
    phone: new FormControl<string>(null, [ Validators.required ]),
    gender: new FormControl<'male' | 'female'>(null, [ Validators.required ]),
    birthday: new FormControl<string>(null, [ Validators.required ]),
    file_id: new FormControl<string>(null),
    passport_number: new FormControl<string>(null, [ Validators.required ]),
    pinpp: new FormControl<string>(null, [ Validators.required ]),
    department_id: new FormControl<string>(null, [ Validators.required ]),
    position_id: new FormControl<string>(null, [ Validators.required ]),
  });

  departmentsList = [];
  positionsList = [];

  private _membersService = inject(MembersService);
  private _toasterService = inject(ToasterService);
  private _fileService = inject(FileService);
  private _destroyRef = inject(DestroyRef);
  private _dialogRef = inject(MatDialogRef);

  async ngOnInit(): Promise<void> {
    if (this.data && this.data?.memberId) {
      const user = await firstValueFrom(this._membersService.getUserDataById(this.data?.memberId));
      this.profileForm.patchValue({
        first_name: user?.first_name,
        middle_name: user?.middle_name,
        last_name: user?.last_name,
        gender: user?.gender,
        phone: user?.phone ? user?.phone?.slice(3) : null,
        birthday: user?.birthday,
        file_id: user?.file_id,
        pinpp: user?.pinpp,
        passport_number: user?.passport_number,
        department_id: user?.department_id,
        position_id: user?.position_id
      });
    }

    this.departmentsList = (await firstValueFrom(this._membersService.getDepartmentsList()))?.data || [];
    this.positionsList = await firstValueFrom(this._membersService.getPositionsList());
  }

  async chooseFile(event: FileList) {
    let fileList: FileList = event;

    if (!fileList?.length) {
      return;
    }

    let file = fileList[0];

    if (![ 'image/jpeg', 'image/png' ].includes(file.type)) {
      this._toasterService.open({
        type: 'warning',
        message: 'you.can.upload.images.with.jpeg.or.png.extension.for.your.profile.picture'
      });
      return;
    }

    this._fileService.uploadFile(file).then(({ id }: { id: string }) => {
      this.profileForm.get('file_id').setValue(id);
      this.attachFile.nativeElement.value = '';
    });
  }

  saveChanges(): void {
    const form = this.profileForm;

    if (form.invalid || form.disabled) {
      return;
    }

    form.disable();

    const formValue = form.getRawValue();
    const payload: any = {
      ...formValue,
      birthday: formatDate(formValue?.birthday, 'YYYY-MM-dd', 'ru'),
      phone: '998' + formValue?.phone,
      passport_number: formValue?.passport_number?.toUpperCase()
    };

    if (this.data && this.data?.memberId) {
      payload.id = this.data?.memberId;

      this._membersService.updateUser(payload)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(res => {
          this._membersService.updateMembersList$.next();
          this._toasterService.open({
            message: 'changes.saved.successfully'
          })
        }, error => {
          this._toasterService.open({
            type: 'error',
            title: 'attention',
            message: 'an.error.occurred'
          })
        })
    } else {
      this._membersService.createUser(payload)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(res => {
          this._membersService.updateMembersList$.next();
          this._toasterService.open({
            message: 'new.member.successfully.created'
          })
        }, error => {
          this._toasterService.open({
            type: 'error',
            title: 'attention',
            message: 'an.error.occurred'
          })
        })
    }

    this._dialogRef.close();
  }
}
