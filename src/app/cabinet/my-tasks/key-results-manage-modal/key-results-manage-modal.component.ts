import { Component, DestroyRef, ElementRef, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DatePipe, formatDate, NgOptimizedImage, NgStyle, TitleCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatNativeDateModule, MatOption, MatRipple, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInput, MatDatepickerModule } from '@angular/material/datepicker';
import { TasksService } from '../../../core/services/tasks.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PerformerModel } from '../../../core/models/member.model';
import { MatSelect } from '@angular/material/select';
import { MembersService } from '../../../core/services/members.service';
import { OverlayComponent } from '../../../core/components/overlay-panel/overlay-panel.component';
import { OverlayRef } from '@angular/cdk/overlay';
import { SearchPipe } from '../../../core/pipes/search.pipe';
import { ToasterService } from '../../../core/services/toaster.service';
import { IFile } from '../../../core/models/file.model';
import { CommentModel } from '../../../core/models/comment.model';
import { FileService } from '../../../core/services/file.service';
import { FileComponentComponent } from '../../../core/components/file-component/file-component.component';
import { UserModel } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { units } from '../../../core/constants/unit-types';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { NgxMaskDirective } from 'ngx-mask';
import { QuillEditorComponent } from 'ngx-quill';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'key-result-manage-modal',
  templateUrl: './key-results-manage-modal.component.html',
  imports: [
    MatDialogContent,
    NgStyle,
    TranslateModule,
    MatIcon,
    MatRipple,
    FormsModule,
    MatDatepickerInput,
    DatePipe,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatOption,
    NgOptimizedImage,
    MatSelect,
    NgOptimizedImage,
    OverlayComponent,
    SearchPipe,
    TitleCasePipe,
    FileComponentComponent,
    MatTooltip,
    MatProgressSpinner,
    NgxMaskDirective,
    QuillEditorComponent,
    MatDialogClose
  ],
  providers: [
    provideNativeDateAdapter(),
    ToasterService,
    ConfirmationService
  ],
  standalone: true
})

export class KeyResultsManageModalComponent implements OnInit {
  @Inject(MAT_DIALOG_DATA) data: any = inject(MAT_DIALOG_DATA);
  @ViewChild('memberSearchInput') memberSearchInput: ElementRef<HTMLInputElement>;
  @ViewChild('attachFile') attachFile: ElementRef<HTMLInputElement>;
  keyResult: any = {
    name: {
      name_uz: '',
      name_ru: '',
      name_lat: ''
    },
    icon: '',
    description: '',
    created_at: new Date(),
    due_date: null,
    recipients: [],
    objective_id: null,
    unit_type: null,
    unit_value: 0
  };
  units = units;

  comment: {
    comment: string;
    files: IFile[];
  } = {
    comment: '',
    files: []
  };
  showMembersSelect = false;
  members: PerformerModel[] = [];
  memberSearchText = '';
  commentList: CommentModel[] = [];
  objectivesList = [];
  currentLang = 'uz_latn';
  currentUser: UserModel;
  isObjectiveSelectDisabled = false;
  doneValue = 0;
  loading = false;
  isDoneValueInputReadonly = true;
  fileHost = environment.fileHost;

  private _tasksService = inject(TasksService);
  private _destroyRef = inject(DestroyRef);
  private _dialogRef = inject(MatDialogRef);
  private _membersService = inject(MembersService);
  private _translateService = inject(TranslateService);
  private _fileService = inject(FileService);
  private _toasterService = inject(ToasterService);
  private _authService = inject(AuthService);
  private _confirmationService = inject(ConfirmationService);

  ngOnInit() {
    this.currentLang = this._translateService.defaultLang;

    if (this.data && !this.data?.parentObjectiveId) {
      this.keyResult = structuredClone({
        ...this.data,
        due_date: this.data?.due_date ? new Date(this.data?.due_date) : null,
        created_at: this.data?.created_at ? new Date(this.data?.created_at) : null,
        recipients: this.data?.recipients ? this.data?.recipients : []
      });
      this.getCommentList();
    }

    if (this.data && this.data?.parentObjectiveId) {
      this.keyResult.objective_id = this.data?.parentObjectiveId;
      this.isObjectiveSelectDisabled = true;
    }

    if (this.data && this.data?.unit_done_value) {
      this.doneValue = +this.data?.unit_done_value || 0;
    }

    this.getObjectives();

    this._membersService.getPerformers()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        this.members = (res.data || []).filter(member => {
          const exist = this.keyResult.recipients.find(r => r.id === member.id);

          return !exist;
        });
      });

    this._authService.currentUser$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(user => {
        this.currentUser = user;

        if (this.keyResult?.recipients?.find(r => r?.id === this.currentUser?.id)) {
          this.isDoneValueInputReadonly = false;
        }
      });
  }

  add(member: PerformerModel): void {
    this.memberSearchText = '';
    this.keyResult.recipients.push(member);
    this.members = this.members.filter(m => m.id !== member.id);
  }

  remove(member: any): void {
    const index = this.keyResult.recipients.findIndex(m => m.id === member.id);

    if (index >= 0) {
      this.keyResult.recipients.splice(index, 1);
      this.members.push(member);
    }
  }

  createKeyResult(): void {
    let errorMessage = '';

    if (!this.keyResult.unit_type) {
      errorMessage = 'specify.the.value.and.unit';
    }

    if (!this.keyResult?.objective_id) {
      errorMessage = 'choose.goal';
    }

    if (!this.keyResult?.name?.name_lat?.trim()?.length) {
      errorMessage = 'enter.task.name';
    }

    if (errorMessage) {
      this._toasterService.open({
        type: 'warning',
        title: 'attention',
        message: errorMessage
      });
      return;
    }

    if (this.loading) {
      return;
    }

    this.loading = true;
    this._tasksService.createKeyResult({
      ...this.keyResult,
      unit_value: +this.keyResult?.unit_value,
      due_date: this.keyResult?.due_date ? formatDate(this.keyResult?.due_date, 'yyyy-MM-dd', 'ru') : null,
      recipients: this.keyResult?.recipients?.map(rec => {
        return {
          'recipient_user_id': rec?.id,
          'recipient_db_id': rec?.db_id,
          'is_main': false
        };
      })
    })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: res => {
          if (this.data?.parentObjectiveId) {
            this._dialogRef.close(res?.key);
            return;
          }
          this._dialogRef.close();
        },
        error: err => {
          this.loading = false;
        }
      });
  }

  updateKeyResult() {
    if (!this.data) return;

    let errorMessage = '';

    if (!this.keyResult.unit_type) {
      errorMessage = 'specify.the.value.and.unit';
    }

    if (!this.keyResult?.objective_id) {
      errorMessage = 'choose.goal';
    }

    if (!this.keyResult?.name?.name_lat?.trim()?.length) {
      errorMessage = 'enter.task.name';
    }

    if (errorMessage) {
      this._toasterService.open({
        type: 'warning',
        title: 'attention',
        message: errorMessage
      });
      return;
    }

    if (this.loading) {
      return;
    }

    this._confirmationService.confirmation({
      message: 'confirm.the.changes?'
    })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        if (!res) return;

        this.enterDoneValue();

        this.loading = true;
        this._tasksService.updateKeyResult({
          ...this.keyResult,
          unit_value: +this.keyResult?.unit_value,
          due_date: this.keyResult?.due_date ? formatDate(this.keyResult?.due_date, 'yyyy-MM-dd', 'ru') : null,
          recipients: this.keyResult?.recipients?.map(rec => {
            return {
              'recipient_user_id': rec?.id,
              'recipient_db_id': rec?.db_id,
              'is_main': false
            };
          })
        })
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe(() => {
            this._dialogRef.close();
          }, () => {
            this.loading = false;
          });
      });
  }

  getCommentList(): void {
    this._tasksService.getCommentListByKey({ key_id: this.data.id })
      .subscribe((response) => {
        if (response?.data && response.data.length > 0 && Array.isArray(response.data)) {
          this.commentList = response?.data;
        } else {
          this.commentList = [];
        }
      });
  }

  getObjectives(): void {
    this._tasksService.getObjectiveListByKeyId(this.data?.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        this.objectivesList = res?.data;
      });
  }

  addCommentToKeyResult(): void {
    if (!this.comment?.comment?.trim()?.length) {
      return;
    }
    this._tasksService.addCommentToKeyResult({
      key_id: this.data.id,
      content: this.comment.comment,
      files: this.comment?.files?.map(file => {
        return {
          'id': file?.id,
          'name': file?.name,
          'type': file?.type,
          'size': file?.size
        };
      })
    })
      .subscribe((response) => {
        if (response.success) {
          this.comment = {
            comment: '',
            files: []
          };
          this.getCommentList();
        }
      });
  }

  deleteKeyResult(overlayPanel: OverlayRef): void {
    if (!this.data.id) {
      return;
    }

    this._confirmationService.confirmation()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        if (!res) return;

        overlayPanel.detach();
        this._tasksService.deleteKeyResult(this.data.id)
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe(res => {
            this._dialogRef.close();
          });
      });
  }

  async chooseFile(event: File | FileList) {
    let files: File | FileList = event;
    const acceptedFiles: File[] = [];
    for (let i = 0; i < (files as any)?.length; i++) {
      let file = files[i];
      acceptedFiles.push(file);
    }

    Promise.all(
      acceptedFiles?.map(async (file) => {
        return this._fileService.uploadFile(file);
      })
    ).then((files) => {
      this.comment.files.push(...files);
    });
    this.attachFile.nativeElement.value = '';
  }

  removeFile(id: string): void {
    this.comment.files = this.comment.files.filter(file => file.id !== id);
  }

  deleteComment(commentId: string): void {
    this._tasksService.deleteKeyComment(commentId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        this.getCommentList();
      });
  }

  onObjectiveSelected(): void {
    this.keyResult.unit_type = this.objectivesList.find(obj => obj?.id === this.keyResult?.objective_id)?.unit_type;
  }

  enterDoneValue(): void {
    this._tasksService.enterKeyUnitDoneValue(this.keyResult?.id, this.doneValue || 0)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
