import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe, formatDate, NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatRipple, provideNativeDateAdapter } from '@angular/material/core';
import { NgxMaskDirective } from 'ngx-mask';
import { MatDatepicker, MatDatepickerInput } from '@angular/material/datepicker';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToasterService } from '../../core/services/toaster.service';
import { FileService } from '../../core/services/file.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProfileService } from '../../core/services/profile.service';
import { MembersService } from '../../core/services/members.service';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [
    TranslateModule,
    NgOptimizedImage,
    MatIcon,
    MatRipple,
    NgxMaskDirective,
    DatePipe,
    MatDatepicker,
    MatDatepickerInput,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
    MatProgressSpinner
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {
  @ViewChild('attachFile') attachFile: ElementRef<HTMLInputElement>;

  fileHost = environment.fileHost;
  profileForm = new FormGroup({
    first_name: new FormControl<string>('', [ Validators.required, Validators.maxLength(32) ]),
    middle_name: new FormControl<string>('', [ Validators.required, Validators.maxLength(32) ]),
    last_name: new FormControl<string>('', [ Validators.required, Validators.maxLength(32) ]),
    phone: new FormControl<string>(null, [ Validators.required ]),
    gender: new FormControl<'male' | 'female'>(null, [ Validators.required ]),
    birthday: new FormControl<string>(null, [ Validators.required ]),
    file_id: new FormControl<string>(null, [ Validators.required ]),
    passport_number: new FormControl<string>(null, [ Validators.required ]),
    pinpp: new FormControl<string>(null, [ Validators.required ]),
    department_id: new FormControl<string>(null, [ Validators.required ]),
    position_id: new FormControl<string>(null, [ Validators.required ]),
  });

  departmentsList = [];
  positionsList = [];

  private _authService: AuthService = inject(AuthService);
  private _membersService = inject(MembersService);
  private _profileService = inject(ProfileService);
  private _toasterService = inject(ToasterService);
  private _fileService = inject(FileService);
  private _destroyRef = inject(DestroyRef);

  async ngOnInit(): Promise<void> {
    this._authService.currentUser$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(user => {
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
          position_id: user?.position_id,
        });
      });

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
    const payload = {
      ...formValue,
      birthday: formatDate(formValue?.birthday, 'YYYY-MM-dd', 'ru'),
      phone: '998' + formValue?.phone,
      passport_number: formValue?.passport_number?.toUpperCase()
    };

    this._profileService.updateUserInformation(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        if (!res || !res?.access_token) {
          return;
        }

        this._authService.currentUser = null;
        this._authService.token = res?.access_token;
        this._authService.getUserByToken().subscribe();

        this._toasterService.open({
          title: 'attention',
          message: 'changes.saved.successfully'
        });

        form.enable();
      }, err => {
        this._toasterService.open({
          title: 'attention',
          message: 'an.error.occurred',
          type: 'error'
        });
        form.enable();
      });
  }
}
