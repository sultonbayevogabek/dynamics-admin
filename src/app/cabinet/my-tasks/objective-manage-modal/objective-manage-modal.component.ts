import { Component, DestroyRef, ElementRef, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DatePipe, formatDate, NgOptimizedImage, TitleCasePipe } from '@angular/common';
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
import { FileService } from '../../../core/services/file.service';
import { IFile } from '../../../core/models/file.model';
import { FileComponentComponent } from '../../../core/components/file-component/file-component.component';
import { ToasterService } from '../../../core/services/toaster.service';
import { CommentModel } from '../../../core/models/comment.model';
import { UserModel } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { units } from '../../../core/constants/unit-types';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { rootObjectives } from '../../../core/constants/root-objectives';
import { NgxMaskDirective } from 'ngx-mask';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'objective-manage-modal',
  templateUrl: './objective-manage-modal.component.html',
  imports: [
    MatDialogContent,
    TranslateModule,
    MatIcon,
    MatRipple,
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
    TitleCasePipe,
    SearchPipe,
    FileComponentComponent,
    MatProgressSpinner,
    NgxMaskDirective,
    QuillModule,
    FormsModule,
    MatDialogClose
  ],
  providers: [
    provideNativeDateAdapter(),
    ToasterService,
    ConfirmationService,
  ],
  standalone: true
})

export class ObjectiveManageModalComponent implements OnInit {
  @ViewChild('attachFile') attachFile: ElementRef<HTMLInputElement>;
  @Inject(MAT_DIALOG_DATA) data: any = inject(MAT_DIALOG_DATA);
  objective: any = {
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
    key_ids: [],
    unit_type: null,
    unit_value: 0,
    root_objective_id: []
  };
  units = units;
  rootObjectives = rootObjectives;
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
  keysList = [];
  currentLang = 'uz_latn';
  currentUser: UserModel;
  loading = false;

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

    if (this.data) {
      this.objective = structuredClone({
        ...this.data,
        due_date: this.data?.due_date ? new Date(this.data?.due_date) : null,
        created_at: this.data?.created_at ? new Date(this.data?.created_at) : null,
        recipients: this.data?.recipients ? this.data?.recipients : []
      });
      this.getCommentList();
      this.getKeyResultsListByObjectiveId();
    }

    this._membersService.getPerformers()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        this.members = res.data || [];
      });

    this._authService.currentUser$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  add(member: PerformerModel): void {
    this.memberSearchText = '';
    this.objective.recipients.push(member);
    this.members = this.members.filter(m => m.id !== member.id);
  }

  remove(member: any): void {
    const index = this.objective.recipients.findIndex(m => m.id === member.id);

    if (index >= 0) {
      this.objective.recipients.splice(index, 1);
      this.members.push(member);
    }
  }

  createObjective(): void {
    let errorMessage = '';

    if (!this.objective.unit_value || !this.objective.unit_type) {
      errorMessage = 'specify.the.value.and.unit';
    }

    if (!this.objective?.name?.name_lat?.trim()?.length) {
      errorMessage = 'enter.target.name';
    }

    if (!this.objective?.root_objective_id) {
      errorMessage = 'specify.the.main.purpose';
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
    this._tasksService.createObjective({
      ...this.objective,
      unit_value: +this.objective?.unit_value,
      due_date: this.objective?.due_date ? formatDate(this.objective?.due_date, 'yyyy-MM-dd', 'ru') : null,
      recipients: this.objective?.recipients?.map(rec => {
        return {
          'recipient_user_id': rec?.id,
          'recipient_db_id': rec?.db_id,
          'is_main': false
        };
      })
    })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: event => {
          this._dialogRef.close();
        },
        error: err => {
          this.loading = false;
        }
      });
  }

  updateObjective() {
    if (!this.data) return;

    let errorMessage = '';

    if (!this.objective.unit_value || !this.objective.unit_type) {
      errorMessage = 'specify.the.value.and.unit';
    }

    if (!this.objective?.name?.name_lat?.trim()?.length) {
      errorMessage = 'enter.target.name';
    }

    if (!this.objective?.root_objective_id) {
      errorMessage = 'specify.the.main.purpose';
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
    this._tasksService.updateObjective({
      ...this.objective,
      unit_value: +this.objective?.unit_value,
      due_date: this.objective?.due_date ? formatDate(this.objective?.due_date, 'yyyy-MM-dd', 'ru') : null,
      recipients: this.objective?.recipients?.map(rec => {
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
  }

  getCommentList(): void {
    this._tasksService.getCommentListByObjective({ objective_id: this.data.id })
      .subscribe((response) => {
        if (response?.data && response?.data?.length > 0 && Array.isArray(response?.data)) {
          this.commentList = response?.data;
        } else {
          this.commentList = [];
        }
      });
  }

  getKeyResultsListByObjectiveId(): void {
    this._tasksService.getKeyResultListByObjectiveId(this.objective?.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        this.keysList = res?.data || [];
      });
  }

  addCommentToObjective(): void {
    if (!this.comment?.comment.trim()?.length) {
      return;
    }
    this._tasksService.addCommentToObjective({
      objective_id: this.data.id,
      content: this.comment?.comment,
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

  deleteObjective(overlayPanel: OverlayRef): void {
    if (!this.data.id) {
      return;
    }

    this._confirmationService.confirmation()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        if (!res) return;

        overlayPanel.detach();
        this._tasksService.deleteObjective(this.data.id)
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe(res => {
            this._dialogRef.close();
          }, error => {
            this._toasterService.open({
              type: 'warning',
              title: 'attention',
              message: 'Maqsadga biriktirilgan vazifalar bor'
            });
          });
      })
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
    this._tasksService.deleteObjectiveComment(commentId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        this.getCommentList();
      });
  }

  markAsDone(key: any): void {
    this._confirmationService.confirmation({
      message: 'are.you.sure.you.want.to.mark.the.task.as.complete?',
      confirm: 'yes',
      cancel: 'no'
    })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        if (!res) return;

        const payload:  { key_id: string; objective_id?: string } = {
          key_id: key.id,
        }

        if (this.keysList.filter(key => !key?.is_done)?.length === 1) {
          payload.objective_id = this.objective.id;
        }

        this._tasksService.markKeyAsDone(payload)
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe(_ => {
            key.is_done = true;
          })
      })
  }
}
