// news.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FaqCreateComponent } from './faq-create/faq-create.component';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FaqService } from './faq.service';
import { IFaq } from './interfaces/faq.interface';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Confirmable } from '../../../core/decorators/confirmation-decorator';
import { ToasterService } from '@shared/services/toaster.service';
import { FaqEditComponent } from './faq-edit/faq-edit.component';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

interface IFaqOrder {
  _id: string;
  index: number;
}

@Component({
  selector: 'faq',
  imports: [
    MatButton,
    MatIcon,
    FormsModule,
    MatSlideToggle,
    DragDropModule
  ],
  templateUrl: './faq.component.html',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FaqComponent implements OnInit {
  items: IFaq[] = [];

  // Drag&Drop ishlatilayotganini ko'rsatish uchun
  isDragging = false;

  private matDialog = inject(MatDialog);
  private service = inject(FaqService);
  private toasterService = inject(ToasterService);

  async ngOnInit() {
    // Comment out when using actual API
    await this.getFaqs();
  }

  async getFaqs() {
    const response = await firstValueFrom(
      this.service.getItemsList()
    );
    this.items = response || [];
  }

  async openAddDialog() {
    const result = await firstValueFrom(
      this.matDialog.open(FaqCreateComponent, {
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        maxWidth: '100vw'
      }).afterClosed()
    );
    if (result === 'created') {
      await this.getFaqs();
    }
  }

  async openDetails(faq: IFaq) {
    const result = await firstValueFrom(
      this.matDialog.open(FaqEditComponent, {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: faq
      }).afterClosed()
    );
    if (result === 'edited') {
      await this.getFaqs();
    }
  }

  @Confirmable({
    message: `O'chirishni tasdiqlaysizmi?`,
    title: 'Diqqat'
  })
  async deleteItem(_id: string) {
    try {
      const response = await firstValueFrom(
        this.service.deleteItem(_id)
      );
      if (response && response.statusCode === 200) {
        this.toasterService.open({
          message: `O'chirildi!`
        });

        // For real API
        await this.getFaqs();
      }
    } catch (error) {
      this.toasterService.open({
        title: 'Diqqat',
        message: `O'chirishda xatolik sodir bo'ldi`,
        type: 'warning'
      });
    }
  }

  async itemStatusChange($event: MatSlideToggleChange, item: IFaq) {
    const newStatus = $event.checked ? 1 : 0;
    const params = {
      _id: item._id,
      status: newStatus
    };

    try {
      // For real API
      // await firstValueFrom(
      //   this.service.editItem(params)
      // );

      // For testing
      item.status = newStatus;

      this.toasterService.open({
        message: `Status o'zgartirildi`,
        duration: 1000
      });
    } catch (error) {
      this.toasterService.open({
        message: `Status o'zgartirishda xatolik sodir bo'ldi`,
        type: 'warning',
        duration: 1000
      });
    }
  }

  // Drag and Drop orqali savollar tartibini o'zgartirish
  onDragStarted() {
    this.isDragging = true;
  }

  onDragReleased() {
    this.isDragging = false;
  }

  async onDrop(event: CdkDragDrop<IFaq[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    // Oxirgi array ichidagi ma'lumotlarni yangilash
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);

    // O'zgartirilgan tartibni backendga yuborish uchun ma'lumotlarni tayyorlash
    const orderData: IFaqOrder[] = this.items.map((item, index) => ({
      _id: item._id,
      index: index
    }));

    try {
      // Backend API chaqiruvi
      // Asl APIda:
      // await firstValueFrom(
      //   this.service.updateOrder(orderData)
      // );

      // Testing uchun log
      console.log('Savollar tartibi o\'zgartirildi:', orderData);

      this.toasterService.open({
        message: `Savollar tartibi muvaffaqiyatli saqlandi`
      });
    } catch (error) {
      this.toasterService.open({
        message: `Savollar tartibini o'zgartirishda xatolik yuz berdi`,
        type: 'warning'
      });

      // Xatolik yuz berganda ma'lumotlar oldingi tartibga qaytarilishi mumkin
      // await this.getFaqs();
    }
  }
}
