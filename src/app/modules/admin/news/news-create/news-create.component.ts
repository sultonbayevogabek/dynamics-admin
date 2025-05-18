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
import { NgClass, NgIf } from '@angular/common';
import { FileService } from '@shared/services/file.service';
import { environment } from '@env/environment';

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
    NgClass
  ],
  templateUrl: './news-create.component.html',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  standalone: true,
  providers: [
    provideNgxMask()
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [ `
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
    titleUz: new FormControl<string>('Toshkentda IT sohasidagi innovatsion loyihalar taqdimoti bo\'lib o\'tdi\n', [ Validators.required ]),
    titleRu: new FormControl<string>(`В Ташкенте прошла презентация инновационных проектов в сфере IT`, [ Validators.required ]),
    titleEn: new FormControl<string>('Innovative IT Projects Presented in Tashkent', [ Validators.required ]),
    shortDescriptionUz: new FormControl<string>(`
      Poytaxtimizda "Digital Future" konferensiyasi doirasida yosh dasturchilar
      tomonidan ishlab chiqilgan 50 dan ortiq innovatsion loyihalar taqdimoti
      bo'lib o'tdi. Tadbir davomida sun'iy intellekt, blokchein texnologiyalari va
      mobil ilovalar sohasidagi eng istiqbolli loyihalar aniqlanib, g'oliblar
      1 milliard so'mlik grant sohibiga aylanishdi.
    `, [ Validators.required ]),
    shortDescriptionRu: new FormControl<string>(`
      В столице в рамках конференции "Digital Future" состоялась презентация более
      50 инновационных проектов, разработанных молодыми программистами.
      В ходе мероприятия были определены самые перспективные проекты
      в области искусственного интеллекта, блокчейн-технологий и мобильных приложений,
      а победители стали обладателями грантов на сумму 1 миллиард сумов.
    `, [ Validators.required ]),
    shortDescriptionEn: new FormControl<string>(`
      The capital hosted presentations of more than
      50 innovative projects developed by young programmers
      as part of the "Digital Future" conference. During the event,
      the most promising projects in artificial intelligence, blockchain
      technologies, and mobile applications were identified, and the winners
      received grants totaling 1 billion soums.
    `, [ Validators.required ]),
    contentUz: new FormControl<string>('', [ Validators.required ]),
    contentRu: new FormControl<string>('', [ Validators.required ]),
    contentEn: new FormControl<string>('', [ Validators.required ]),
    imageUrl: new FormControl<string>('', [ Validators.required ])
  });

  imagePreviewUrl: string | null = null;
  isUploading = false;
  editorList = [];

  private newsService = inject(NewsService);
  private fileService = inject(FileService);
  private toaster = inject(ToasterService);
  private dialogRef = inject(MatDialogRef);

  // Quill editorni sodda konfiguratsiyasi (toolbar handlerlar bilan)
  quillModules = {
    toolbar: [
      [ 'bold', 'italic', 'underline', 'strike' ],
      [ { 'header': 1 }, { 'header': 2 } ],
      [ { 'list': 'ordered' }, { 'list': 'bullet' } ],
      [ { 'script': 'sub' }, { 'script': 'super' } ],
      [ { 'indent': '-1' }, { 'indent': '+1' } ],
      [ { 'align': [] } ],
      [ 'link', 'image' ],
      [ 'clean' ]
    ],
    clipboard: {
      matchVisual: false
    }
  };

  ngOnInit() {
    // this metodi bindini saqlash
    this.handleEditorCreated = this.handleEditorCreated.bind(this);
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
    const activeTabIndex = this.findActiveTabIndex();
    if (activeTabIndex >= 0 && activeTabIndex < this.editorList.length) {
      return this.editorList[activeTabIndex];
    }

    // Hech nima topilmasa, birinchi editorni qaytarish
    if (this.editorList.length > 0) {
      return this.editorList[0];
    }

    return null;
  }

  /**
   * Aktiv til tabini aniqlash
   */
  findActiveTabIndex() {
    // Odatda O'zbekcha tab aktiv
    return 0;
  }

  customImageHandler() {
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
}
