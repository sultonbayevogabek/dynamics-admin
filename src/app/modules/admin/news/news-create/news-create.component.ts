import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { provideNgxMask } from 'ngx-mask';
import { NewsService } from '../news.service';
import { ToasterService } from '@shared/services/toaster.service';
import { firstValueFrom } from 'rxjs';
import { QuillModule } from 'ngx-quill';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FileService } from '@shared/services/file.service';
import { environment } from '@env/environment';
import { MatOption, MatSelect } from '@angular/material/select';

// Pastedan base64 ni bloklash uchun
const BlockBase64Paste = (quill) => {
  quill.clipboard.addMatcher('img', (node, delta) => {
    // Rasmlar uchun delta qaytaramiz, lekin img atributlarini bo'sh qilamiz
    return delta;
  });
};

@Component({
  selector: 'news-create',
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
    QuillModule,
    NgIf,
    NgClass,
    MatSelect,
    MatOption,
    NgForOf
  ],
  templateUrl: './news-create.component.html',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  standalone: true,
  providers: [
    provideNgxMask()
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [ `
    .ql-editor {
      padding: 30px;
    }

    .editor-container {
      @apply w-full;
    }

    .editor-container .ql-container {
      @apply h-[300px] w-full overflow-y-auto;
    }

    .editor-container .ql-toolbar {
      @apply w-full;
    }

    .editor-container .ql-editor {
      @apply min-h-full;
    }

    .editor-container.ng-invalid.ng-touched .ql-container {
      @apply border-red-500;
    }
  ` ]
})
export class NewsCreateComponent implements OnInit, AfterViewInit {
  host = environment.host;
  newsForm = new FormGroup({
    titleUz: new FormControl<string>('', [ Validators.required ]),
    titleRu: new FormControl<string>('', [ Validators.required ]),
    titleEn: new FormControl<string>('Innovative IT Projects Presented in Tashkent', [ Validators.required ]),
    shortDescUz: new FormControl<string>('', [ Validators.required ]),
    shortDescRu: new FormControl<string>('', [ Validators.required ]),
    shortDescEn: new FormControl<string>('', [ Validators.required ]),
    contentUz: new FormControl<string>('', [ Validators.required ]),
    contentRu: new FormControl<string>('', [ Validators.required ]),
    contentEn: new FormControl<string>('', [ Validators.required ]),
    imageUrl: new FormControl<string>('', [ Validators.required ])
  });

  dummyNews = [
    {
      id: 1,
      titleUz: "Toshkentda yangi IT loyihalar taqdimoti o'tkazildi",
      titleRu: "В Ташкенте прошла презентация новых IT проектов",
      titleEn: "New IT projects presented in Tashkent",
      shortDescUz: "Poytaxtimizda innovatsion texnologiyalar sohasidagi eng yangi loyihalar taqdimoti bo'lib o'tdi",
      shortDescRu: "В столице прошла презентация новейших проектов в сфере инновационных технологий",
      shortDescEn: "The capital hosted a presentation of the latest projects in the field of innovative technologies",
      contentUz: "<p>Toshkent shahridagi Raqamli texnologiyalar markazida yosh dasturchilar tomonidan yaratilgan yangi loyihalar taqdimoti bo'lib o'tdi. Tadbir davomida 20 dan ortiq innovatsion g'oyalar namoyish etildi.</p>",
      contentRu: "<p>В Центре цифровых технологий в Ташкенте состоялась презентация новых проектов, созданных молодыми программистами. В ходе мероприятия было продемонстрировано более 20 инновационных идей.</p>",
      contentEn: "<p>The Digital Technology Center in Tashkent hosted a presentation of new projects created by young programmers. More than 20 innovative ideas were demonstrated during the event.</p>"
    },
    {
      id: 2,
      titleUz: "O'zbekiston-Koreya hamkorligida raqamli ta'lim platformasi ishga tushirildi",
      titleRu: "Запущена цифровая образовательная платформа при сотрудничестве Узбекистана и Кореи",
      titleEn: "Digital education platform launched in cooperation between Uzbekistan and Korea",
      shortDescUz: "Yangi platforma masofaviy ta'lim imkoniyatlarini kengaytiradi",
      shortDescRu: "Новая платформа расширит возможности дистанционного образования",
      shortDescEn: "The new platform will expand distance learning opportunities",
      contentUz: "<p>O'zbekiston va Janubiy Koreya hamkorligida yaratilgan yangi ta'lim platformasi bugun rasmiy ravishda ishga tushirildi. Platforma zamonaviy onlayn ta'lim imkoniyatlarini taqdim etadi va 100 mingdan ortiq foydalanuvchini qamrab olishi kutilmoqda.</p>",
      contentRu: "<p>Сегодня официально запущена новая образовательная платформа, созданная в сотрудничестве между Узбекистаном и Южной Кореей. Платформа предоставляет современные возможности онлайн-обучения и ожидается, что она охватит более 100 тысяч пользователей.</p>",
      contentEn: "<p>A new educational platform created in cooperation between Uzbekistan and South Korea was officially launched today. The platform provides modern online learning opportunities and is expected to reach over 100,000 users.</p>"
    },
    {
      id: 3,
      titleUz: "Milliy startaplar uchun yangi grant dasturi e'lon qilindi",
      titleRu: "Объявлена новая грантовая программа для национальных стартапов",
      titleEn: "New grant program announced for national startups",
      shortDescUz: "Innovatsion g'oyalar uchun 1 million dollarlik jamg'arma ajratildi",
      shortDescRu: "Выделен фонд в размере 1 миллиона долларов для инновационных идей",
      shortDescEn: "A $1 million fund has been allocated for innovative ideas",
      contentUz: "<p>Innovatsion rivojlanish vazirligi tomonidan milliy startaplarni qo'llab-quvvatlash uchun yangi grant dasturi e'lon qilindi. Dastur doirasida IT, qishloq xo'jaligi va qayta tiklanadigan energiya sohalaridagi loyihalarga grantlar ajratiladi.</p>",
      contentRu: "<p>Министерство инновационного развития объявило новую грантовую программу для поддержки национальных стартапов. В рамках программы будут выделены гранты на проекты в областях IT, сельского хозяйства и возобновляемой энергетики.</p>",
      contentEn: "<p>The Ministry of Innovative Development has announced a new grant program to support national startups. The program will provide grants for projects in the fields of IT, agriculture, and renewable energy.</p>"
    },
    {
      id: 4,
      titleUz: "Kibersport bo'yicha O'zbekiston milliy terma jamoasi tashkil etildi",
      titleRu: "Сформирована национальная сборная Узбекистана по киберспорту",
      titleEn: "National Cybersport Team of Uzbekistan formed",
      shortDescUz: "Jamoa xalqaro musobaqalarga tayyorgarlik ko'rmoqda",
      shortDescRu: "Команда готовится к международным соревнованиям",
      shortDescEn: "The team is preparing for international competitions",
      contentUz: "<p>O'zbekiston Kibersport assotsiatsiyasi rasmiy ravishda milliy terma jamoani e'lon qildi. Jamoa tarkibiga mamlakatimizning eng kuchli o'yinchilari kiritilgan va ular kelgusi oyda Osiyo o'yinlarida ishtirok etishadi.</p>",
      contentRu: "<p>Ассоциация киберспорта Узбекистана официально объявила о создании национальной сборной. В состав команды вошли сильнейшие игроки страны, которые примут участие в Азиатских играх в следующем месяце.</p>",
      contentEn: "<p>The Cybersport Association of Uzbekistan has officially announced the national team. The team includes the strongest players in the country who will participate in the Asian Games next month.</p>"
    },
    {
      id: 5,
      titleUz: "Toshkentda yosh dasturchilar uchun bepul bootcamp boshlandi",
      titleRu: "В Ташкенте стартовал бесплатный буткемп для молодых программистов",
      titleEn: "Free bootcamp for young programmers launched in Tashkent",
      shortDescUz: "Uch oylik dastur davomida ishtirokchilar real loyihalar ustida ishlashadi",
      shortDescRu: "В течение трехмесячной программы участники будут работать над реальными проектами",
      shortDescEn: "Participants will work on real projects during the three-month program",
      contentUz: "<p>Bugun Toshkentda yosh dasturchilar uchun bepul bootcamp dasturi boshlandi. Uch oylik dastur davomida ishtirokchilar tajribali mentorlar nazorati ostida real loyihalar ustida ishlashadi va amaliy ko'nikmalarni oshirishadi.</p>",
      contentRu: "<p>Сегодня в Ташкенте стартовала программа бесплатного буткемпа для молодых программистов. В течение трехмесячной программы участники будут работать над реальными проектами под руководством опытных наставников и улучшать практические навыки.</p>",
      contentEn: "<p>A free bootcamp program for young programmers started today in Tashkent. During the three-month program, participants will work on real projects under the supervision of experienced mentors and improve their practical skills.</p>"
    },
    {
      id: 6,
      titleUz: "O'zbekistonda sun'iy intellekt strategiyasi tasdiqlandi",
      titleRu: "В Узбекистане утверждена стратегия искусственного интеллекта",
      titleEn: "Artificial Intelligence Strategy approved in Uzbekistan",
      shortDescUz: "Strategiya 2024-2030 yillarga mo'ljallangan va soha rivojlanish yo'llarini belgilaydi",
      shortDescRu: "Стратегия рассчитана на 2024-2030 годы и определяет пути развития отрасли",
      shortDescEn: "The strategy is designed for 2024-2030 and defines the development paths for the industry",
      contentUz: "<p>O'zbekiston Respublikasi Prezidenti tomonidan mamlakat sun'iy intellekt rivojlanishi strategiyasi tasdiqlandi. Hujjatda 2030 yilgacha bo'lgan davrda sohani rivojlantirish yo'nalishlari, ilmiy tadqiqotlar va kadrlar tayyorlash masalalari belgilangan.</p>",
      contentRu: "<p>Президент Республики Узбекистан утвердил стратегию развития искусственного интеллекта в стране. В документе определены направления развития отрасли, научных исследований и подготовки кадров на период до 2030 года.</p>",
      contentEn: "<p>The President of the Republic of Uzbekistan has approved the artificial intelligence development strategy for the country. The document defines the directions for industry development, scientific research, and personnel training for the period until 2030.</p>"
    },
    {
      id: 7,
      titleUz: "Navbatdagi IT Texnopark Samarqandda ochildi",
      titleRu: "В Самарканде открылся очередной IT-технопарк",
      titleEn: "New IT Technopark opened in Samarkand",
      shortDescUz: "Texnopark 1000 dan ortiq dasturchi uchun ish o'rni yaratadi",
      shortDescRu: "Технопарк создаст рабочие места для более чем 1000 программистов",
      shortDescEn: "The technopark will create jobs for more than 1000 programmers",
      contentUz: "<p>Samarqand shahrida zamonaviy IT Texnopark o'z faoliyatini boshladi. Markazda dasturlash, sun'iy intellekt va raqamli marketing yo'nalishlari bo'yicha ta'lim beriladi, shuningdek, startaplarga qo'llab-quvvatlash ko'rsatiladi.</p>",
      contentRu: "<p>В городе Самарканд начал свою деятельность современный IT-технопарк. В центре будет проводиться обучение по направлениям программирования, искусственного интеллекта и цифрового маркетинга, а также оказываться поддержка стартапам.</p>",
      contentEn: "<p>A modern IT Technopark has started its operations in the city of Samarkand. The center will provide education in programming, artificial intelligence, and digital marketing, as well as support for startups.</p>"
    },
    {
      id: 8,
      titleUz: "Raqamli soha mutaxassislari uchun malaka oshirish dasturi ishga tushirildi",
      titleRu: "Запущена программа повышения квалификации для специалистов цифровой сферы",
      titleEn: "Professional development program launched for digital specialists",
      shortDescUz: "Dastur xalqaro sertifikatlar olish imkoniyatini taqdim etadi",
      shortDescRu: "Программа предоставляет возможность получения международных сертификатов",
      shortDescEn: "The program provides an opportunity to obtain international certificates",
      contentUz: "<p>Axborot texnologiyalari vazirligi IT soha mutaxassislari uchun yangi malaka oshirish dasturini ishga tushirdi. Dastur doirasida ishtirokchilar masofaviy ta'lim orqali ko'nikmalarini oshirib, xalqaro sertifikatlar olish imkoniyatiga ega bo'lishadi.</p>",
      contentRu: "<p>Министерство информационных технологий запустило новую программу повышения квалификации для специалистов IT-сферы. В рамках программы участники смогут повысить свои навыки через дистанционное обучение и получить международные сертификаты.</p>",
      contentEn: "<p>The Ministry of Information Technologies has launched a new professional development program for IT specialists. Within the program, participants will be able to improve their skills through distance learning and obtain international certificates.</p>"
    },
    {
      id: 9,
      titleUz: "Xalqaro IT forum Digital Uzbekistan 2023 bo'lib o'tdi",
      titleRu: "Прошел международный IT-форум Digital Uzbekistan 2023",
      titleEn: "International IT forum Digital Uzbekistan 2023 held",
      shortDescUz: "Forumda 20 dan ortiq mamlakatdan mutaxassislar ishtirok etdi",
      shortDescRu: "В форуме приняли участие специалисты из более чем 20 стран",
      shortDescEn: "Specialists from more than 20 countries participated in the forum",
      contentUz: "<p>Toshkentda Digital Uzbekistan 2023 xalqaro IT forumi bo'lib o'tdi. Tadbir davomida raqamlashtirish, sun'iy intellekt, blokcheyn texnologiyalari va kiberxavfsizlik mavzularida muhokamalar o'tkazildi.</p>",
      contentRu: "<p>В Ташкенте прошел международный IT-форум Digital Uzbekistan 2023. В ходе мероприятия были проведены обсуждения по темам цифровизации, искусственного интеллекта, блокчейн-технологий и кибербезопасности.</p>",
      contentEn: "<p>The international IT forum Digital Uzbekistan 2023 was held in Tashkent. Discussions on digitalization, artificial intelligence, blockchain technologies, and cybersecurity were conducted during the event.</p>"
    },
    {
      id: 10,
      titleUz: "Mobil ilovalar bo'yicha milliy tanlov g'oliblari e'lon qilindi",
      titleRu: "Объявлены победители национального конкурса мобильных приложений",
      titleEn: "Winners of the national mobile app competition announced",
      shortDescUz: "Yuzdan ortiq loyiha orasidan 10 ta g'olib tanlandi",
      shortDescRu: "Из более чем ста проектов выбрано 10 победителей",
      shortDescEn: "Ten winners were selected from more than a hundred projects",
      contentUz: "<p>O'zbekiston Raqamli texnologiyalar vazirligi tomonidan o'tkazilgan mobil ilovalar tanlovining g'oliblari e'lon qilindi. Tanlovda 'Ta'lim', 'Sog'liqni saqlash', 'Biznes' va 'Ijtimoiy loyihalar' yo'nalishlari bo'yicha g'oliblar aniqlandi.</p>",
      contentRu: "<p>Объявлены победители конкурса мобильных приложений, проведенного Министерством цифровых технологий Узбекистана. В конкурсе были определены победители по направлениям 'Образование', 'Здравоохранение', 'Бизнес' и 'Социальные проекты'.</p>",
      contentEn: "<p>The winners of the mobile application contest held by the Ministry of Digital Technologies of Uzbekistan have been announced. Winners were determined in the categories of 'Education', 'Healthcare', 'Business', and 'Social Projects'.</p>"
    }
  ];


  imagePreviewUrl: string | null = null;
  isUploading = false;
  editorList = [];
  activeTabIndex = 0;

  private newsService = inject(NewsService);
  private fileService = inject(FileService);
  private toaster = inject(ToasterService);
  private dialogRef = inject(MatDialogRef);

  // Quill editorni sodda konfiguratsiyasi (toolbar handlerlar bilan)
  quillModules = {
    toolbar: [
      [ 'bold', 'italic', 'underline', 'strike' ],
      [ { 'header': 2 }, { 'header': 3 } ],
      [ { 'list': 'ordered' }, { 'list': 'bullet' } ],
      [ { 'script': 'sub' }, { 'script': 'super' } ],
      [ { 'indent': '-1' }, { 'indent': '+1' } ],
      [ { 'align': [] } ],
      [ 'link', 'image' ]
    ],
    clipboard: {
      matchVisual: false
    }
  };

  ngOnInit() {
    // this metodi bindini saqlash
    this.handleEditorCreated = this.handleEditorCreated.bind(this);
    this.watchContentUz();
  }

  ngAfterViewInit() {
    // Paste va drop uchun listener qo'shish
    document.addEventListener('paste', this.handlePaste.bind(this));
    document.addEventListener('drop', this.handleDrop.bind(this));

    // Editor yaratilgandan keyin button handlerlarni qo'shish
    setTimeout(() => {
      this.setupToolbarHandlers();
    }, 500);
  }

  watchContentUz(): void {
    this.newsForm.get('contentUz')?.valueChanges.subscribe(value => {
      const element = document.createElement('div');
      element.innerHTML = value;
      console.log(element);

      this.newsForm.patchValue({
        contentRu: value,
        contentEn: value
      }, { emitEvent: false });
    });
  }

  /**
   * Quill editorlar yaratilgandan keyin toolbar handlerlarni qo'shish
   */
  setupToolbarHandlers() {
    const imageButtons = document.querySelectorAll('.ql-image');

    imageButtons.forEach(button => {
      // Existing listeners ni olib tashlash
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }

      // Yangi event listener qo'shish
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.customImageHandler();
      });
    });
  }

  handleEditorCreated(editor) {
    // Editorni listga qo'shish
    this.editorList.push(editor);

    // Base64 ni bloklash
    BlockBase64Paste(editor);

    // Rasm qo'shish uchun button handlerlarni o'zgartirish
    const toolbar = editor.getModule('toolbar');
    if (toolbar) {
      toolbar.addHandler('image', () => {
        this.customImageHandler();
      });
    }
  }

  handlePaste(event: ClipboardEvent) {
    // Faol editorni aniqlash
    const activeEditor = this.getActiveQuillEditor();
    if (!activeEditor) return;

    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    // Rasmlarni tekshirish
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        event.stopPropagation();

        const file = item.getAsFile();
        if (file) {
          this.uploadFileAndInsertToEditor(file, activeEditor);
        }
        return;
      }
    }
  }

  handleDrop(event: DragEvent) {
    // Faol editorni aniqlash
    const activeEditor = this.getActiveQuillEditor();
    if (!activeEditor) return;

    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) return;

    // Rasmlarni tekshirish
    for (let i = 0; i < dataTransfer.items.length; i++) {
      const item = dataTransfer.items[i];
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        event.stopPropagation();

        const file = item.getAsFile();
        if (file) {
          this.uploadFileAndInsertToEditor(file, activeEditor);
        }
        return;
      }
    }
  }

  getActiveQuillEditor() {
    // Agar biror editor fokusda bo'lsa, uni qaytarish
    const editorElements = document.querySelectorAll('.ql-editor');
    for (let i = 0; i < editorElements.length; i++) {
      const editorEl = editorElements[i];
      if (document.activeElement === editorEl || editorEl.contains(document.activeElement)) {
        const editorContainer = editorEl.closest('.quill-editor');
        if (editorContainer) {
          return (editorContainer as any).__quill;
        }
      }
    }

    // Agar fokusda bo'lmasa, aktiv tilni aniqlash
    const activeTabIndex = this.activeTabIndex;
    if (activeTabIndex >= 0 && activeTabIndex < this.editorList.length) {
      return this.editorList[activeTabIndex];
    }

    // Hech nima topilmasa, birinchi editorni qaytarish
    if (this.editorList.length > 0) {
      return this.editorList[0];
    }

    return null;
  }

  async customImageHandler() {
    console.log('Image handler called');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    // Click eventini qo'lda ishga tushirish
    input.dispatchEvent(new MouseEvent('click'));

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        console.log('File selected:', file.name);
        const activeEditor = this.getActiveQuillEditor();
        if (activeEditor) {
          this.uploadFileAndInsertToEditor(file, activeEditor);
        } else {
          console.error('No active editor found');
        }
      }
    };
  }

  async uploadFileAndInsertToEditor(file: File, editor: any) {
    if (!file.type.startsWith('image/')) {
      this.toaster.open({
        message: 'Faqat rasm fayllarini yuklash mumkin',
        type: 'warning'
      });
      return;
    }

    console.log('Uploading file to editor');

    try {
      this.isUploading = true;
      this.toaster.open({
        message: 'Rasm yuklanmoqda...',
        type: 'info'
      });

      const imageUrl = await this.uploadImage(file);
      console.log('Image uploaded successfully:', imageUrl);

      // Editorga rasm qo'shish
      const range = editor.getSelection() || { index: 0 };
      editor.insertEmbed(range.index, 'image', this.host + imageUrl);
      editor.setSelection(range.index + 1);

      this.newsForm.get('contentUz')?.updateValueAndValidity();
      this.newsForm.get('contentRu')?.updateValueAndValidity();
      this.newsForm.get('contentEn')?.updateValueAndValidity();

      this.toaster.open({
        message: `Rasm muvaffaqiyatli qo'shildi`,
        type: 'success'
      });
    } catch (error) {
      this.toaster.open({
        message: 'Rasmni yuklashda xatolik yuz berdi',
        type: 'error'
      });
      console.error('Rasm yuklash xatoligi:', error);
    } finally {
      this.isUploading = false;
    }
  }

  async uploadMainImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.toaster.open({
        message: 'Faqat rasm fayllarini yuklash mumkin',
        type: 'warning'
      });
      return;
    }

    this.isUploading = true;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await firstValueFrom(this.fileService.uploadFiles(formData));

      if (response && response.length) {
        const fileData = response[0];
        this.imagePreviewUrl = this.host + fileData.path;
        this.newsForm.get('imageUrl')?.setValue(this.host + fileData.path);
        this.toaster.open({
          message: 'Rasm muvaffaqiyatli yuklandi'
        });
      }
    } catch (error) {
      this.toaster.open({
        message: 'Rasmni yuklashda xatolik yuz berdi',
        type: 'error'
      });
    } finally {
      this.isUploading = false;
    }
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await firstValueFrom(this.fileService.uploadFiles(formData));
      if (response && response.length) {
        return response[0].path;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async createNews() {
    const form = this.newsForm;

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
        this.newsService.create(form.getRawValue())
      );
      if (response && response.statusCode === 201) {
        this.toaster.open({
          message: `Yangilik muvaffaqiyatli yaratildi`
        });
        this.dialogRef.close('created');
      } else {
        this.toaster.open({
          message: `Yangilik yaratishda xatolik sodir bo'ldi`,
          type: 'warning'
        });
        form.enable();
      }
    } catch (error) {
      this.toaster.open({
        message: `Yangilik yaratishda xatolik sodir bo'ldi`,
        type: 'warning'
      });
      form.enable();
    }
  }

  onFocus(index: number) {
    this.activeTabIndex = index;
  }

  // Yangilik tanlanganda formni to'ldirish uchun
  onNewsSelect(event: any) {
    const newsId = parseInt(event.value, 10);

    // Tanlangan yangilikni topish
    const selectedNews = this.dummyNews.find(news => news.id === newsId);

    if (selectedNews) {
      // Formni to'ldirish
      this.newsForm.patchValue({
        titleUz: selectedNews.titleUz,
        titleRu: selectedNews.titleRu,
        titleEn: selectedNews.titleEn,
        shortDescUz: selectedNews.shortDescUz,
        shortDescRu: selectedNews.shortDescRu,
        shortDescEn: selectedNews.shortDescEn,
        contentUz: selectedNews.contentUz,
        contentRu: selectedNews.contentRu,
        contentEn: selectedNews.contentEn
      });
    }
  }
}
