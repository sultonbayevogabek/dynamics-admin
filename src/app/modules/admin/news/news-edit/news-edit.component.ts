import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { provideNgxMask } from 'ngx-mask';
import { NewsService } from '../news.service';
import { ToasterService } from '@shared/services/toaster.service';
import { firstValueFrom } from 'rxjs';
import { IFaq } from '../interfaces/news.interface';

@Component({
  selector: 'news-edit',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatDialogClose,
    MatFormField,
    MatInput,
    MatIconButton,
    MatLabel,
    MatError,
  ],
  templateUrl: './news-edit.component.html',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  standalone: true,
  providers: [
    provideNgxMask()
  ]
})
export class NewsEditComponent implements OnInit {
  faqForm = new FormGroup({
    _id: new FormControl<string>(null, [ Validators.required ]),
    questionUz: new FormControl<string>('', [ Validators.required ]),
    questionRu: new FormControl<string>('', [ Validators.required ]),
    questionEn: new FormControl<string>('', [ Validators.required ]),
    answerUz: new FormControl<string>('', [ Validators.required ]),
    answerRu: new FormControl<string>('', [ Validators.required ]),
    answerEn: new FormControl<string>('', [ Validators.required ]),
  });

  private faqService = inject(NewsService);
  private toaster = inject(ToasterService);
  private dialogRef = inject(MatDialogRef);
  private data: IFaq = inject(MAT_DIALOG_DATA);

  ngOnInit() {
    this.setDataToForm();
  }

  setDataToForm() {
    if (this.data) {
      this.faqForm.patchValue({
        _id: this.data._id,
        questionUz: this.data.questionUz,
        questionRu: this.data.questionRu,
        questionEn: this.data.questionEn,
        answerUz: this.data.answerUz,
        answerRu: this.data.answerRu,
        answerEn: this.data.answerEn,
      });
    }
  }

  async edit() {
    const form = this.faqForm;

    if (form.invalid) {
      this.toaster.open({
        message: `Majburiy maydonlarni to'ldiring`,
        type: 'warning'
      });
      return;
    }

    if (form.disabled) {
      return;
    }

    form.disable();

    try {
      const response = await firstValueFrom(
        this.faqService.editItem(form.getRawValue())
      );
      if (response && response.statusCode === 200) {
        this.toaster.open({
          message: `Savol muvaffaqiyatli tahrirlandi`
        });
        this.dialogRef.close('edited');
      } else {
        this.toaster.open({
          message: `Savolni tahrirlashda xatolik sodir bo'ldi`,
          type: 'warning'
        });
        form.enable();
      }
    } catch (error) {
      this.toaster.open({
        message: `Savolni tahrirlashda xatolik sodir bo'ldi`,
        type: 'warning'
      });
      form.enable();
    }
  }
}
