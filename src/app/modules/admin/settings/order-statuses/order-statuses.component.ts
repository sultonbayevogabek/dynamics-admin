import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { firstValueFrom } from 'rxjs';
import { SettingsService } from '../settings.service';
import { ToasterService } from '@shared/services/toaster.service';
import { IOrderStatus } from '../interfaces/order-status.interface';

@Component({
  selector: 'order-statuses',
  imports: [
    FormsModule,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './order-statuses.component.html',
  host: {
    class: 'block h-full relative'
  }
})

export class OrderStatusesComponent {
  createForm: FormGroup = new FormGroup({
    nameUz: new FormControl(null, [ Validators.required ]),
    nameRu: new FormControl(null, [ Validators.required ]),
    nameEn: new FormControl(null, [ Validators.required ]),
    color: new FormControl('#000000', [ Validators.required ]),
  });
  statuses = signal<IOrderStatus[]>([]);

  private settingsService = inject(SettingsService);
  private confirmation = inject(FuseConfirmationService);
  private toasterService = inject(ToasterService);

  async ngOnInit() {
    await this.getOrderStatuses();
  }

  async updateOrderStatus(status: IOrderStatus) {
    if (!status.nameUz?.trim() || !status.nameRu?.trim() || !status.nameEn?.trim()) {
      return;
    }
    const response = await firstValueFrom(
      this.settingsService.updateOrderStatus(status)
    );
    if (response.statusCode === 200) {
      this.toasterService.open({
        message: `O'zgarishlar muvaffaqiyatli saqlandi`
      })
    }
  }

  async createOrderStatus(): Promise<void> {
    const form = this.createForm;

    if (form.invalid || form.disabled) {
      return;
    }

    const res = await firstValueFrom(
      this.settingsService.createNewOrderStatus(form.getRawValue())
    );
    if (res.statusCode === 201) {
      this.toasterService.open({
        message: `Yangi status yaratildi`
      })
      this.createForm.reset();
      await this.getOrderStatuses();
    }
  }

  async getOrderStatuses() {
    const statuses = await firstValueFrom(
      this.settingsService.getOrderStatusesList()
    );
    this.statuses.set(statuses);
  }

  async deleteStatus(_id: string) {
    const confirm = await firstValueFrom(this.confirmation.open({
      title: 'Diqqat!',
      message: `Statusni rostan ham o'chirmoqchimsiz?`,
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

    const response = await firstValueFrom(this.settingsService.deleteOrderStatus(_id));
    if (response.statusCode === 200) {
      this.toasterService.open({
        message: `Status muvaffaqiyatli o'chirildi`
      })
      await this.getOrderStatuses();
    } else {
      this.toasterService.open({
        type: 'warning',
        message: `Statusni o'chirishda xatolik sodir bo'ldi`
      })
    }
  }
}
