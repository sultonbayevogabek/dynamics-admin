import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CategoriesService } from '../categories.service';
import { firstValueFrom } from 'rxjs';
import { ICategory } from '../category.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { FileListComponent } from '@shared/components/file-list/file-list.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { IFile } from '@shared/interfaces/file.interface';
import { ToasterService } from '@shared/services/toaster.service';

@Component({
  selector: 'categories-crud',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    ReactiveFormsModule,
    MatIconButton,
    FileListComponent,
    FileUploadComponent
  ],
  templateUrl: './categories-crud.component.html',
  standalone: true
})

export class CategoriesCrudComponent implements OnInit {
  createForm: FormGroup = new FormGroup({
    nameUz: new FormControl(null, [ Validators.required ]),
    nameRu: new FormControl(null, [ Validators.required ]),
    nameEn: new FormControl(null, [ Validators.required ]),
    image: new FormControl(null),
  });
  categories = signal<ICategory[]>([]);
  parentId = input<string>(null);

  private categoriesService = inject(CategoriesService);
  private toasterService = inject(ToasterService);
  private confirmation = inject(FuseConfirmationService);

  async ngOnInit() {
    await this.getCategories();
  }

  async updateCategory(category: ICategory) {
    if (!category.nameUz?.trim() || !category.nameRu?.trim() || !category.nameEn?.trim()) {
      return;
    }
    const response = await firstValueFrom(
      this.categoriesService.updateCategory(category)
    );
    if (response.statusCode === 200) {
      this.toasterService.open({
        message: `O'zgarishlar muvaffaqiyatli saqlandi`,
        type: 'success'
      })
    }
  }

  async createCategory(): Promise<void> {
    const form = this.createForm;

    if (form.invalid || form.disabled) {
      return;
    }

    const payload = {
      parentId: this.parentId(),
      ...form.getRawValue()
    };

    const res = await firstValueFrom(
      this.categoriesService.createCategory(payload)
    );
    if (res.statusCode === 201) {
      this.toasterService.open({
        message: `Yangi kategoriya qo'shildi`,
        type: 'success'
      })
      this.createForm.reset();
      await this.getCategories();
    }
  }

  async getCategories() {
    const categories = await firstValueFrom(
      this.categoriesService.getCategoriesList(this.parentId())
    );
    this.categories.set(categories);
  }

  async deleteCategory(_id: string) {
    const confirm = await firstValueFrom(this.confirmation.open({
      title: 'Diqqat!',
      message: `Kategoriyani rostan ham o'chirmoqchimsiz?`,
      actions: {
        cancel: {
          label: `Yo'q`
        },
        confirm: {
          label: `Ha`
        }
      },
      dismissible: true
    }).afterClosed());

    if (confirm === 'cancelled' || !confirm) return;

    const response = await firstValueFrom(this.categoriesService.deleteCategory(_id));
    if (response.statusCode === 200) {
      this.toasterService.open({
        message: `Kategoriya o'chirildi`,
        type: 'success'
      })
      await this.getCategories();
    } else {
      this.toasterService.open({
        message: `O'chirishda xatolik sodir bo'ldi`,
        type: 'error'
      })
    }
  }

  filesUploaded(files: IFile[]) {
    this.createForm.get('image').setValue(files[0]);
  }

  onLogoRemoved() {
    this.createForm.get('image').setValue(null);
  }
}
