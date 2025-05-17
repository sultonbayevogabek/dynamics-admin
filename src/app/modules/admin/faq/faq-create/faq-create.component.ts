import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { provideNgxMask } from 'ngx-mask';
import { FaqService } from '../faq.service';
import { ToasterService } from '@shared/services/toaster.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'faq-create',
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
  templateUrl: './faq-create.component.html',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  standalone: true,
  providers: [
    provideNgxMask()
  ]
})
export class FaqCreateComponent implements OnInit {
  faqForm = new FormGroup({
    questionUz: new FormControl<string>('', [ Validators.required ]),
    questionRu: new FormControl<string>('', [ Validators.required ]),
    questionEn: new FormControl<string>('', [ Validators.required ]),
    answerUz: new FormControl<string>('', [ Validators.required ]),
    answerRu: new FormControl<string>('', [ Validators.required ]),
    answerEn: new FormControl<string>('', [ Validators.required ]),
  });

  private faqService = inject(FaqService);
  private toaster = inject(ToasterService);
  private dialogRef = inject(MatDialogRef);

  ngOnInit() {
    // Agar kerak bo'lsa, boshlang'ich qiymatlarni o'rnatish mumkin
  }

  async createFaq() {
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
        this.faqService.create(form.getRawValue())
      );
      if (response && response.statusCode === 201) {
        this.toaster.open({
          message: `Savol muvaffaqiyatli yaratildi`
        });
        this.dialogRef.close('created');
      } else {
        this.toaster.open({
          message: `Savolni yaratishda xatolik sodir bo'ldi`,
          type: 'warning'
        });
        form.enable();
      }
    } catch (error) {
      this.toaster.open({
        message: `Savolni yaratishda xatolik sodir bo'ldi`,
        type: 'warning'
      });
      form.enable();
    }
  }
}
