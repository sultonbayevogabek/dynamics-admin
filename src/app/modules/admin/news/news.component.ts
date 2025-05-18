import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NewsCreateComponent } from './news-create/news-create.component';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NewsService } from './news.service';
import { INews } from './interfaces/news.interface';
import { Confirmable } from '../../../core/decorators/confirmation-decorator';
import { ToasterService } from '@shared/services/toaster.service';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'news',
  imports: [
    MatButton,
    MatIcon,
    FormsModule,
    DatePipe
  ],
  templateUrl: './news.component.html',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class NewsComponent implements OnInit {
  items: INews[] = [];
  paginatedItems: INews[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  pageNumbers: number[] = [];

  private matDialog = inject(MatDialog);
  private service = inject(NewsService);
  private toasterService = inject(ToasterService);

  async ngOnInit() {
    await this.getNews();
    this.updatePagination();
  }

  async getNews() {
    // Real API call
    // const response = await firstValueFrom(
    //   this.service.getItemsList()
    // );
    // this.items = response.data || [];

    // Using dummy data instead
    this.items = [
      {
        _id: '1',
        titleUz: 'Kompaniyamiz yangi filiali ochildi',
        titleRu: 'Открыт новый филиал нашей компании',
        titleEn: 'The new branch of our company has been opened',
        shortDescriptionUz: 'Biz yangi filialimizni Toshkent shahrining Chilonzor tumanida ochdik. Endi xizmatlarimiz yanada qulayroq.',
        shortDescriptionRu: 'Мы открыли новый филиал в Чиланзарском районе города Ташкента. Теперь наши услуги стали еще удобнее.',
        shortDescriptionEn: 'We have opened a new branch in the Chilanzar district of Tashkent city. Now our services are even more convenient.',
        contentUz: 'Hurmatli mijozlar, biz sizlarga yangi xabar bilan murojaat qilmoqdamiz. Kompaniyamiz Toshkent shahrining Chilonzor tumani, Muqimiy ko\'chasi 35-uyda yangi filialini ochdi. Yangi filialimiz zamonaviy jihozlar bilan jihozlangan va barcha xizmatlarimiz taqdim etiladi. Filialimiz har kuni 9:00 dan 18:00 gacha ishlaydi. Xizmatlarimizdan foydalanish uchun oldindan ro\'yxatdan o\'tishingiz mumkin.',
        contentRu: 'Уважаемые клиенты, мы обращаемся к вам с новостью. Наша компания открыла новый филиал по адресу: город Ташкент, Чиланзарский район, улица Мукими, дом 35. Наш новый филиал оснащен современным оборудованием и предоставляет все наши услуги. Филиал работает ежедневно с 9:00 до 18:00. Вы можете заранее зарегистрироваться для использования наших услуг.',
        contentEn: 'Dear customers, we are reaching out to you with news. Our company has opened a new branch at: Tashkent city, Chilanzar district, Mukimi street, house 35. Our new branch is equipped with modern equipment and provides all our services. The branch is open daily from 9:00 to 18:00. You can register in advance to use our services.',
        imageUrl: 'assets/images/news/branch.jpg',
        createdAt: '2023-09-15T15:30:45.123Z'
      },
      {
        _id: '2',
        titleUz: 'Yangi mahsulotlar katalogi',
        titleRu: 'Новый каталог товаров',
        titleEn: 'New product catalog',
        shortDescriptionUz: 'Biz 2023-yil kuz mavsumi uchun yangi mahsulotlar katalogini e\'lon qildik. Katalogda 500 dan ortiq yangi mahsulotlar mavjud.',
        shortDescriptionRu: 'Мы выпустили новый каталог товаров на осенний сезон 2023 года. В каталоге представлено более 500 новых товаров.',
        shortDescriptionEn: 'We have released a new product catalog for the fall season of 2023. The catalog features more than 500 new products.',
        contentUz: 'Hurmatli mijozlar! Biz 2023-yil kuz mavsumi uchun yangi mahsulotlar katalogini e\'lon qilganimizdan mamnunmiz. Ushbu katalogda siz 500 dan ortiq yangi mahsulotlarimiz bilan tanishishingiz mumkin. Katalogni veb-saytimizdan yuklab olishingiz yoki filiallarimizda bepul olishingiz mumkin. Barcha mahsulotlar yuqori sifatli va zamonaviy standartlarga muvofiq ishlab chiqarilgan. Maxsus taklif: katalogdagi barcha mahsulotlarni 15 oktabrgacha 10% chegirma bilan sotib olishingiz mumkin.',
        contentRu: 'Уважаемые клиенты! Мы рады объявить о выпуске нового каталога товаров на осенний сезон 2023 года. В этом каталоге вы можете ознакомиться с более чем 500 нашими новыми товарами. Вы можете скачать каталог с нашего веб-сайта или получить его бесплатно в наших филиалах. Все товары высокого качества и произведены в соответствии с современными стандартами. Специальное предложение: все товары из каталога можно приобрести со скидкой 10% до 15 октября.',
        contentEn: 'Dear customers! We are pleased to announce the release of a new product catalog for the fall season of 2023. In this catalog, you can get acquainted with more than 500 of our new products. You can download the catalog from our website or get it for free at our branches. All products are of high quality and manufactured in accordance with modern standards. Special offer: you can purchase all products from the catalog with a 10% discount until October 15.',
        imageUrl: 'assets/images/news/catalog.jpg',
        createdAt: '2023-10-01T09:15:30.456Z'
      },
      {
        _id: '3',
        titleUz: 'Mustaqillik kuni bilan tabriklaymiz',
        titleRu: 'Поздравляем с Днем Независимости',
        titleEn: 'Congratulations on Independence Day',
        shortDescriptionUz: 'Kompaniyamiz barcha O\'zbekiston fuqarolarini Mustaqillik kuni bilan samimiy tabrikaydi. 1-sentabr kuni barcha filiallarimiz dam oladi.',
        shortDescriptionRu: 'Наша компания искренне поздравляет всех граждан Узбекистана с Днем Независимости. 1 сентября все наши филиалы будут закрыты.',
        shortDescriptionEn: 'Our company sincerely congratulates all citizens of Uzbekistan on Independence Day. On September 1, all our branches will be closed.',
        contentUz: 'Aziz vatandoshlar! Kompaniyamiz sizlarni O\'zbekiston Respublikasi Mustaqilligining 32 yilligi bilan samimiy muborakbod etadi. Mustaqillik - bu bizning eng katta boyligimiz va yutuqlarimiz asosi. Ushbu qutlug\' ayyom munosabati bilan barchaga tinchlik, xotirjamlik, sihat-salomatlik va farovonlik tilaymiz. Ma\'lumdiki, 1-sentabr kuni mamlakatimizda rasmiy bayram va dam olish kuni hisoblanadi. Shu munosabat bilan kompaniyamizning barcha filiallari 1-sentabr kuni ishlamaydi. 2-sentabrdan boshlab o\'z ishimizni odatdagidek davom ettiramiz. Bayram munosabati bilan 2-sentabrdan 10-sentabrgacha barcha mahsulotlarimizga maxsus chegirmalar taqdim etamiz.',
        contentRu: 'Дорогие соотечественники! Наша компания искренне поздравляет вас с 32-летием Независимости Республики Узбекистан. Независимость - это наше величайшее богатство и основа наших достижений. По случаю этого праздника желаем всем мира, спокойствия, здоровья и процветания. Как известно, 1 сентября в нашей стране официальный праздник и выходной день. В связи с этим все филиалы нашей компании 1 сентября работать не будут. С 2 сентября мы продолжим нашу работу в обычном режиме. В честь праздника с 2 по 10 сентября предоставляем специальные скидки на все наши товары.',
        contentEn: 'Dear compatriots! Our company sincerely congratulates you on the 32nd anniversary of the Independence of the Republic of Uzbekistan. Independence is our greatest wealth and the basis of our achievements. On the occasion of this holiday, we wish everyone peace, tranquility, health and prosperity. As you know, September 1 is an official holiday and day off in our country. In this regard, all our company\'s branches will not work on September 1. From September 2, we will continue our work as usual. In honor of the holiday, from September 2 to September 10, we offer special discounts on all our products.',
        imageUrl: 'assets/images/news/independence.jpg',
        createdAt: '2023-08-25T12:45:20.789Z'
      },
      {
        _id: '4',
        titleUz: 'Xizmatlar narxlari o\'zgarishi',
        titleRu: 'Изменение цен на услуги',
        titleEn: 'Change in service prices',
        shortDescriptionUz: '2023-yil 1-noyabrdan boshlab kompaniyamiz xizmatlari narxlari o\'zgaradi. Yangilangan narxlar bilan tanishing.',
        shortDescriptionRu: 'С 1 ноября 2023 года изменятся цены на услуги нашей компании. Ознакомьтесь с обновленными ценами.',
        shortDescriptionEn: 'From November 1, 2023, the prices of our company\'s services will change. Please familiarize yourself with the updated prices.',
        contentUz: 'Hurmatli mijozlar! Sizlarni xabardor qilishdan maqsad, 2023-yil 1-noyabrdan boshlab kompaniyamiz tomonidan ko\'rsatiladigan xizmatlar narxlarida o\'zgarishlar bo\'ladi. Ushbu qaror bozordagi narxlarning o\'zgarishi, xomashyo narxlarining oshishi va kompaniyamiz xizmatlarini yanada rivojlantirish maqsadida qabul qilindi. Yangi narxlar haqidagi to\'liq ma\'lumotni veb-saytimizning "Xizmatlar" bo\'limida yoki filiallarimizda ko\'rishingiz mumkin. Shu bilan birga, doimiy mijozlarimiz uchun maxsus chegirmalar va imtiyozlar saqlanib qoladi. Bizning xizmatlarimizdan foydalanganingiz uchun tashakkur va kelajakdagi hamkorligimiz uchun minnatdorchilik bildiramiz.',
        contentRu: 'Уважаемые клиенты! Информируем вас о том, что с 1 ноября 2023 года произойдут изменения в ценах на услуги, предоставляемые нашей компанией. Это решение было принято из-за изменения рыночных цен, повышения стоимости сырья и с целью дальнейшего развития услуг нашей компании. Полную информацию о новых ценах вы можете увидеть в разделе "Услуги" нашего веб-сайта или в наших филиалах. В то же время, для постоянных клиентов сохраняются специальные скидки и привилегии. Благодарим вас за использование наших услуг и выражаем признательность за наше будущее сотрудничество.',
        contentEn: 'Dear customers! We inform you that from November 1, 2023, there will be changes in the prices of services provided by our company. This decision was made due to changes in market prices, increases in raw material costs, and with the aim of further developing our company\'s services. You can see full information about the new prices in the "Services" section of our website or at our branches. At the same time, special discounts and privileges are maintained for regular customers. We thank you for using our services and express our gratitude for our future cooperation.',
        imageUrl: 'assets/images/news/prices.jpg',
        createdAt: '2023-10-15T10:20:35.123Z'
      },
      {
        _id: '5',
        titleUz: 'Qish mavsumine tayyorgarlik',
        titleRu: 'Подготовка к зимнему сезону',
        titleEn: 'Preparation for the winter season',
        shortDescriptionUz: 'Qish mavsumi yaqinlashmoqda. Biz mijozlarimizga qish mavsumiga tayyorgarlik ko\'rishda yordam beramiz.',
        shortDescriptionRu: 'Приближается зимний сезон. Мы поможем нашим клиентам подготовиться к зимнему сезону.',
        shortDescriptionEn: 'The winter season is approaching. We will help our customers prepare for the winter season.',
        contentUz: 'Hurmatli mijozlar! Qish mavsumi yaqinlashmoqda va biz sizga uyingizni va biznesingizni qishga tayyorlashda yordam berishga tayyormiz. Kompaniyamiz quyidagi xizmatlarni taklif etadi: isitish tizimlarini tekshirish va ta\'mirlash, derazalarni izolyatsiya qilish, tom qoplamalarini tekshirish va ta\'mirlash, qor tozalash qurilmalarini sotish va ijaraga berish. Bundan tashqari, biz qish mavsumi uchun maxsus komplekt tayyorladik, u issiqlikni saqlash vositalarini, qor kuragini va muzdan himoya qilish vositalarini o\'z ichiga oladi. Ushbu xizmatlar va mahsulotlarni oktyabr oyi davomida buyurtma bersangiz, 15% chegirmaga ega bo\'lasiz.',
        contentRu: 'Уважаемые клиенты! Приближается зимний сезон, и мы готовы помочь вам подготовить ваш дом и бизнес к зиме. Наша компания предлагает следующие услуги: проверка и ремонт систем отопления, изоляция окон, проверка и ремонт кровельных покрытий, продажа и аренда снегоуборочного оборудования. Кроме того, мы подготовили специальный комплект для зимнего сезона, который включает средства для сохранения тепла, снежную лопату и средства противообледенения. Если вы закажете эти услуги и товары в течение октября, вы получите скидку 15%.',
        contentEn: 'Dear customers! The winter season is approaching, and we are ready to help you prepare your home and business for winter. Our company offers the following services: checking and repairing heating systems, window insulation, checking and repairing roof coverings, selling and renting snow removal equipment. In addition, we have prepared a special kit for the winter season, which includes heat-keeping tools, a snow shovel, and de-icing agents. If you order these services and products during October, you will receive a 15% discount.',
        imageUrl: 'assets/images/news/winter.jpg',
        createdAt: '2023-10-10T14:30:15.789Z'
      },
      {
        _id: '6',
        titleUz: 'Yangi mobil ilova',
        titleRu: 'Новое мобильное приложение',
        titleEn: 'New mobile application',
        shortDescriptionUz: 'Kompaniyamiz yangi mobil ilovasini taqdim etadi. Endi barcha xizmatlarimiz telefoningizda.',
        shortDescriptionRu: 'Наша компания представляет новое мобильное приложение. Теперь все наши услуги на вашем телефоне.',
        shortDescriptionEn: 'Our company presents a new mobile application. Now all our services are on your phone.',
        contentUz: 'Hurmatli mijozlar! Kompaniyamiz o\'zining rasmiy mobil ilovasini ishga tushirganini e\'lon qiladi. Endi bizning barcha xizmatlarimiz va mahsulotlarimiz sizning telefoningizda. Ilova orqali siz quyidagi imkoniyatlarga ega bo\'lasiz: mahsulotlarni onlayn buyurtma qilish, xizmatlar uchun ro\'yxatdan o\'tish, to\'lovlarni amalga oshirish, aksiyalar va chegirmalar haqida xabardor bo\'lish, kompaniya yangiliklarini kuzatib borish. Mobil ilova Android va iOS platformalari uchun mavjud. Ilova to\'liq bepul va foydalanish uchun qulay. Ilovani yuklab olish uchun QR-kodni skanerlang yoki App Store / Google Play do\'konidan "Kompaniya Nomi" deb qidiring.',
        contentRu: 'Уважаемые клиенты! Наша компания объявляет о запуске своего официального мобильного приложения. Теперь все наши услуги и товары на вашем телефоне. Через приложение вы получите следующие возможности: заказывать товары онлайн, регистрироваться на услуги, совершать платежи, быть в курсе акций и скидок, следить за новостями компании. Мобильное приложение доступно для платформ Android и iOS. Приложение полностью бесплатное и удобное в использовании. Для загрузки приложения, отсканируйте QR-код или найдите "Название Компании" в App Store / Google Play.',
        contentEn: 'Dear customers! Our company announces the launch of its official mobile application. Now all our services and products are on your phone. Through the application, you will have the following opportunities: order products online, register for services, make payments, be aware of promotions and discounts, follow company news. The mobile application is available for Android and iOS platforms. The application is completely free and convenient to use. To download the application, scan the QR code or search for "Company Name" in the App Store / Google Play.',
        imageUrl: 'assets/images/news/mobile-app.jpg',
        createdAt: '2023-09-20T08:45:30.456Z'
      },
      {
        _id: '7',
        titleUz: 'Yangi hamkorlik',
        titleRu: 'Новое партнерство',
        titleEn: 'New partnership',
        shortDescriptionUz: 'Kompaniyamiz Yevropa ishlab chiqaruvchisi bilan yangi hamkorlik o\'rnatdi. Endi yangi sifatli mahsulotlar bizning do\'konlarimizda.',
        shortDescriptionRu: 'Наша компания установила новое партнерство с европейским производителем. Теперь новые качественные товары в наших магазинах.',
        shortDescriptionEn: 'Our company has established a new partnership with a European manufacturer. Now new quality products in our stores.',
        contentUz: 'Hurmatli mijozlar! Kompaniyamiz Germaniyaning taniqli ishlab chiqaruvchisi "German Quality GmbH" bilan eksklyuziv hamkorlik shartnomasi imzoladi. Bu hamkorlik bizga Yevropa sifatiga ega bo\'lgan mahsulotlarni O\'zbekiston bozoriga olib kirish imkonini beradi. Bu mahsulotlar yuqori sifat standartlariga javob beradi va uzoq muddat foydalanish imkonini beradi. Yangi mahsulotlar katalogini filiallarimizda yoki veb-saytimizda ko\'rishingiz mumkin. Bu hamkorlik tufayli mijozlarimiz jahon brendlarining mahsulotlarini qulay narxlarda sotib olish imkoniyatiga ega bo\'lishadi.',
        contentRu: 'Уважаемые клиенты! Наша компания подписала эксклюзивный партнерский договор с известным немецким производителем "German Quality GmbH". Это партнерство позволит нам привезти на рынок Узбекистана продукцию европейского качества. Эти товары соответствуют высоким стандартам качества и обеспечивают длительный срок службы. Вы можете увидеть каталог новых товаров в наших филиалах или на нашем веб-сайте. Благодаря этому партнерству наши клиенты получат возможность приобрести продукцию мировых брендов по доступным ценам.',
        contentEn: 'Dear customers! Our company has signed an exclusive partnership agreement with the renowned German manufacturer "German Quality GmbH". This partnership will allow us to bring European quality products to the Uzbekistan market. These products meet high quality standards and provide a long service life. You can see the catalog of new products at our branches or on our website. Thanks to this partnership, our customers will have the opportunity to purchase products of world brands at affordable prices.',
        imageUrl: 'assets/images/news/partnership.jpg',
        createdAt: '2023-08-15T11:25:40.123Z'
      },
      {
        _id: '8',
        titleUz: 'Bepul seminar',
        titleRu: 'Бесплатный семинар',
        titleEn: 'Free seminar',
        shortDescriptionUz: 'Kompaniyamiz mijozlarimiz uchun bepul seminar tashkil etmoqda. Seminar mavzusi: "Energiya tejash texnologiyalari".',
        shortDescriptionRu: 'Наша компания организует бесплатный семинар для наших клиентов. Тема семинара: "Энергосберегающие технологии".',
        shortDescriptionEn: 'Our company is organizing a free seminar for our customers. Seminar topic: "Energy saving technologies".',
        // news.component.ts (davomi)
        contentUz: 'Hurmatli mijozlar! Kompaniyamiz 2023-yil 25-noyabr kuni "Energiya tejash texnologiyalari" mavzusida bepul seminar o\'tkazadi. Seminar Toshkent shahrida joylashgan bosh ofisimizda o\'tkaziladi. Seminar davomida quyidagi mavzular muhokama qilinadi: zamonaviy energiya tejash texnologiyalari, uy va ofisda elektr energiyasini tejash usullari, quyosh panellari va boshqa muqobil energiya manbalari, energiya tejash orqali byudjetni tejash yo\'llari. Seminar mutaxassislarimiz tomonidan o\'tkaziladi va barcha qatnashchilar uchun bepul. Seminarda qatnashish uchun oldindan ro\'yxatdan o\'tish zarur. Ro\'yxatdan o\'tish uchun veb-saytimizga tashrif buyuring yoki +998 XX XXX XX XX raqamiga qo\'ng\'iroq qiling.',
        contentRu: 'Уважаемые клиенты! Наша компания проведет бесплатный семинар на тему "Энергосберегающие технологии" 25 ноября 2023 года. Семинар пройдет в нашем головном офисе, расположенном в Ташкенте. В ходе семинара будут обсуждаться следующие темы: современные энергосберегающие технологии, способы экономии электроэнергии дома и в офисе, солнечные панели и другие альтернативные источники энергии, пути экономии бюджета за счет энергосбережения. Семинар будет проводиться нашими специалистами и бесплатен для всех участников. Для участия в семинаре необходима предварительная регистрация. Для регистрации посетите наш веб-сайт или позвоните по номеру +998 XX XXX XX XX.',
        contentEn: 'Dear customers! Our company will conduct a free seminar on "Energy Saving Technologies" on November 25, 2023. The seminar will be held at our head office located in Tashkent. The following topics will be discussed during the seminar: modern energy-saving technologies, ways to save electricity at home and in the office, solar panels and other alternative energy sources, ways to save budget through energy saving. The seminar will be conducted by our specialists and is free for all participants. Pre-registration is required to participate in the seminar. To register, visit our website or call +998 XX XXX XX XX.',
        imageUrl: 'assets/images/news/seminar.jpg',
        createdAt: '2023-10-28T15:40:10.456Z'
      }
    ];

    // Add createdAt field if not present in interface
    this.items.forEach(item => {
      if (!item.createdAt) {
        item.createdAt = new Date().toISOString();
      }
    });

    // Sort news by date, newest first
    this.items.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);

    // Generate page numbers
    this.pageNumbers = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumbers.push(i);
    }

    // Update displayed items
    this.paginatedItems = this.getPaginatedItems();
  }

  getPaginatedItems(): INews[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.items.slice(startIndex, endIndex);
  }

  // Pagination methods
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginatedItems = this.getPaginatedItems();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatedItems = this.getPaginatedItems();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginatedItems = this.getPaginatedItems();
    }
  }

  // Calculate real index for display
  calculateIndex(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
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
      await this.getNews();
      this.updatePagination();
    }
  }

  async openDetails(news: INews) {
    const result = await firstValueFrom(
      this.matDialog.open(NewsEditComponent, {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: news
      }).afterClosed()
    );
    if (result === 'edited') {
      await this.getNews();
      this.updatePagination();
    }
  }

  @Confirmable({
    message: `O'chirishni tasdiqlaysizmi?`,
    title: 'Diqqat'
  })
  async deleteItem(_id: string) {
    try {
      // Real API call
      // const response = await firstValueFrom(
      //   this.service.deleteItem(_id)
      // );
      // if (response && response.statusCode === 200) {

      // For testing
      this.items = this.items.filter(item => item._id !== _id);
      this.updatePagination();

      this.toasterService.open({
        message: `Yangilik muvaffaqiyatli o'chirildi!`
      });

      // For real API
      // await this.getNews();

    } catch (error) {
      this.toasterService.open({
        title: 'Diqqat',
        message: `Yangilikni o'chirishda xatolik sodir bo'ldi`,
        type: 'warning'
      });
    }
  }
}

