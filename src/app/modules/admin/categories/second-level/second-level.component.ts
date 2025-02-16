import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuseCardComponent } from '../../../../../@fuse/components/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CategoriesService } from '../categories.service';
import { firstValueFrom } from 'rxjs';
import { ICategory } from '../category.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'second-level',
  imports: [
    FormsModule,
    FuseCardComponent,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    ReactiveFormsModule,
    MatOption,
    MatSelect
  ],
  templateUrl: './second-level.component.html'
})

export class SecondLevelComponent implements OnInit {
  createForm: FormGroup = new FormGroup({
    nameUz: new FormControl(null, [ Validators.required ]),
    nameRu: new FormControl(null, [ Validators.required ]),
    nameEn: new FormControl(null, [ Validators.required ])
  });
  parentCategoryId = signal<string>(null);
  parentCategories = signal<ICategory[]>([]);
  categories = signal<ICategory[]>([]);

  private categoriesService =inject(CategoriesService);
  private snackbar =inject(MatSnackBar);
  private confirmation =inject(FuseConfirmationService);

  async ngOnInit() {
    this.categoriesService.mainCategories$.subscribe(async res => {
      if (res && res?.length) {
        this.parentCategories.set(res);
        this.parentCategoryId.set(res[0]?._id)
        await this.getCategories();
      }
    })
  }

  async updateCategory(category: ICategory) {
    if (!category.nameUz?.trim() || !category.nameRu?.trim() || !category.nameEn?.trim()) {
      return;
    }
    const response = await firstValueFrom(this.categoriesService.updateCategory('main', category));
    if (response.statusCode === 200) {
      this.snackbar.open(`O'zgarishlar muvaffaqiyatli saqlandi`, 'OK', {
        duration: 2000
      })
    }
  }

  async createCategory(): Promise<void> {
    const form = this.createForm;

    if (form.invalid || form.disabled) {
      return;
    }

    const payload = form.getRawValue();

    const res = await firstValueFrom(
      this.categoriesService.createCategory('mid', { parentId: this.parentCategoryId(), ...payload })
    );
    if (res.statusCode === 201) {
      this.snackbar.open(`Yangi kategoriya qo'shildi`, 'OK', {
        duration: 2000
      })
      this.createForm.reset();
      await this.getCategories();
    }
  }

  async getCategories() {
    const categories = await firstValueFrom(
      this.categoriesService.getCategoriesList('mid', this.parentCategoryId())
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
        },
      },
      dismissible: true,
    }).afterClosed());

    if (confirm === 'cancelled' || !confirm) return;

    const response = await firstValueFrom(
      this.categoriesService.deleteCategory('mid', _id)
    );
    if (response.statusCode === 200) {
      this.snackbar.open(`Kategoriya o'chirildi`, 'OK', {
        duration: 2000
      })
      await this.getCategories();
    } else {
      this.snackbar.open(`O'chirishda xatolik sodir bo'ldi`, 'OK', {
        duration: 2000
      })
    }
  }
}
