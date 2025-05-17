// news.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NewsCreateComponent } from './news-create/news-create.component';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NewsService } from './news.service';
import { IFaq } from './interfaces/news.interface';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Confirmable } from '../../../core/decorators/confirmation-decorator';
import { ToasterService } from '@shared/services/toaster.service';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

interface IFaqOrder {
  _id: string;
  index: number;
}

@Component({
  selector: 'news',
  imports: [
    MatButton,
    MatIcon,
    FormsModule,
    MatSlideToggle,
    DragDropModule
  ],
  templateUrl: './news.component.html',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class NewsComponent implements OnInit {
  items: IFaq[] = [
    {
      _id: '1',
      questionUz: 'Mahsulotlarni qaytarishning qanday shartlari mavjud?',
      questionRu: 'Каковы условия возврата товаров?',
      questionEn: 'What are the terms for product returns?',
      answerUz: 'Mahsulotlarni 14 kun ichida qaytarishingiz mumkin. Bunda mahsulot o\'z qutisida va ishlatilmagan bo\'lishi kerak. To\'lov kvitansiyasi va passport ma\'lumotlari talab qilinadi.',
      answerRu: 'Вы можете вернуть товары в течение 14 дней. Товар должен быть в оригинальной упаковке и неиспользованным. Требуется квитанция об оплате и паспортные данные.',
      answerEn: 'You can return products within 14 days. The product must be in its original packaging and unused. Payment receipt and passport details are required.',
      status: 1
    },
    {
      _id: '2',
      questionUz: 'Buyurtmani qancha vaqt ichida olaman?',
      questionRu: 'За какое время я получу заказ?',
      questionEn: 'How long will it take to receive my order?',
      answerUz: 'Toshkent shahri bo\'yicha buyurtmalar odatda 1-2 kun ichida yetkazib beriladi. Viloyatlarga yetkazib berish muddati 3-5 kunni tashkil etadi.',
      answerRu: 'Заказы по Ташкенту обычно доставляются в течение 1-2 дней. Доставка в регионы занимает 3-5 дней.',
      answerEn: 'Orders within Tashkent are usually delivered within 1-2 days. Delivery to regions takes 3-5 days.',
      status: 1
    },
    {
      _id: '3',
      questionUz: 'To\'lovni qanday amalga oshirish mumkin?',
      questionRu: 'Как можно произвести оплату?',
      questionEn: 'What payment methods are available?',
      answerUz: 'Biz quyidagi to\'lov usullarini qabul qilamiz: naqd pul, bank kartasi (Uzcard, Humo), Click, Payme, va bank o\'tkazmasi.',
      answerRu: 'Мы принимаем следующие способы оплаты: наличные, банковская карта (Uzcard, Humo), Click, Payme и банковский перевод.',
      answerEn: 'We accept the following payment methods: cash, bank card (Uzcard, Humo), Click, Payme, and bank transfer.',
      status: 0
    },
    {
      _id: '4',
      questionUz: 'Yetkazib berish uchun qancha to\'lashim kerak?',
      questionRu: 'Сколько нужно платить за доставку?',
      questionEn: 'How much do I need to pay for delivery?',
      answerUz: 'Toshkent shahri ichida 100,000 so\'mdan yuqori buyurtmalar uchun yetkazib berish bepul. Kichik buyurtmalar uchun yetkazib berish narxi 30,000 so\'mni tashkil etadi. Viloyatlarga yetkazib berish narxi masofaga qarab belgilanadi.',
      answerRu: 'Доставка по Ташкенту бесплатна для заказов свыше 100 000 сумов. Стоимость доставки для небольших заказов составляет 30 000 сумов. Стоимость доставки в регионы зависит от расстояния.',
      answerEn: 'Delivery within Tashkent is free for orders over 100,000 UZS. Delivery cost for small orders is 30,000 UZS. The cost of delivery to regions depends on the distance.',
      status: 1
    },
    {
      _id: '5',
      questionUz: 'Mahsulotning kafolat muddati qancha?',
      questionRu: 'Какой гарантийный срок на товар?',
      questionEn: 'What is the warranty period for the product?',
      answerUz: 'Barcha elektron jihozlar uchun rasmiy kafolat muddati 1 yilni tashkil etadi. Kafolat ta\'mirlashni o\'z ichiga oladi va nosozlik ishlab chiqarish xatosi bo\'lsa, almashtirib beriladi.',
      answerRu: 'Официальный гарантийный срок на всю электронику составляет 1 год. Гарантия включает ремонт и замену, если неисправность является производственным дефектом.',
      answerEn: 'The official warranty period for all electronics is 1 year. The warranty includes repair and replacement if the malfunction is a manufacturing defect.',
      status: 1
    }
  ];

  // Drag&Drop ishlatilayotganini ko'rsatish uchun
  isDragging = false;

  private matDialog = inject(MatDialog);
  private service = inject(NewsService);
  private toasterService = inject(ToasterService);

  async ngOnInit() {
    // Comment out when using actual API
    // await this.getFaqs();
  }

  async getFaqs() {
    const response = await firstValueFrom(
      this.service.getItemsList()
    );
    this.items = response.data || [];
  }

  async openAddDialog() {
    const result = await firstValueFrom(
      this.matDialog.open(NewsCreateComponent, {
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        maxWidth: '100vw'
      }).afterClosed()
    );
    if (result === 'created') {
      // For real API call: await this.getFaqs()
      // For testing, just reset to dummy data
      this.ngOnInit();
    }
  }

  async openDetails(faq: IFaq) {
    const result = await firstValueFrom(
      this.matDialog.open(NewsEditComponent, {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: faq
      }).afterClosed()
    );
    if (result === 'edited') {
      // For real API call: await this.getFaqs();
      // For testing, just reset to dummy data
      this.ngOnInit();
    }
  }

  @Confirmable({
    message: `O'chirishni tasdiqlaysizmi?`,
    title: 'Diqqat'
  })
  async deleteItem(_id: string) {
    try {
      // For real API
      // const response = await firstValueFrom(
      //   this.service.deleteItem(_id)
      // );
      // if (response && response.statusCode === 200) {

      // For testing
      this.items = this.items.filter(item => item._id !== _id);

      this.toasterService.open({
        message: `O'chirildi!`
      });

      // For real API
      // await this.getFaqs();

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
        message: `Savollar tartibi muvaffaqiyatli saqlandi`,
      });
    } catch (error) {
      this.toasterService.open({
        message: `Savollar tartibini o'zgartirishda xatolik yuz berdi`,
        type: 'warning',
      });

      // Xatolik yuz berganda ma'lumotlar oldingi tartibga qaytarilishi mumkin
      // await this.getFaqs();
    }
  }
}
