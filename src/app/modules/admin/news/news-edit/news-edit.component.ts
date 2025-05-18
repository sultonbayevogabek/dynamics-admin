import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, inject, OnInit, ViewEncapsulation } from '@angular/core';
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
import { QuillModule } from 'ngx-quill';
import { NgClass, NgIf } from '@angular/common';
import { FileService } from '@shared/services/file.service';
import { environment } from '@env/environment';
import { INews } from '../interfaces/news.interface';

// Pastedan base64 ni bloklash uchun
const BlockBase64Paste = (quill) => {
  quill.clipboard.addMatcher('img', (node, delta) => {
    // Rasmlar uchun delta qaytaramiz, lekin img atributlarini bo'sh qilamiz
    return delta;
  });
};

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
    QuillModule,
    NgIf,
    NgClass
  ],
  templateUrl: './news-edit.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  providers: [
    provideNgxMask()
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [`
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
  `]
})
export class NewsEditComponent implements OnInit, AfterViewInit {
  host = environment.host;
  newsForm = new FormGroup({
    _id: new FormControl<string>(null, [Validators.required]),
    titleUz: new FormControl<string>('', [Validators.required]),
    titleRu: new FormControl<string>('', [Validators.required]),
    titleEn: new FormControl<string>('', [Validators.required]),
    shortDescUz: new FormControl<string>('', [Validators.required]),
    shortDescRu: new FormControl<string>('', [Validators.required]),
    shortDescEn: new FormControl<string>('', [Validators.required]),
    contentUz: new FormControl<string>('', [Validators.required]),
    contentRu: new FormControl<string>('', [Validators.required]),
    contentEn: new FormControl<string>('', [Validators.required]),
    imageUrl: new FormControl<string>('', [Validators.required])
  });

  imagePreviewUrl: string | null = null;
  isUploading = false;
  editorList = [];
  activeTabIndex = 0;

  private newsService = inject(NewsService);
  private fileService = inject(FileService);
  private toaster = inject(ToasterService);
  private dialogRef = inject(MatDialogRef);
  private data: INews = inject(MAT_DIALOG_DATA);

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
    this.setDataToForm();
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

  setDataToForm() {
    if (this.data) {
      this.newsForm.patchValue({
        _id: this.data._id,
        titleUz: this.data.titleUz,
        titleRu: this.data.titleRu,
        titleEn: this.data.titleEn,
        shortDescUz: this.data.shortDescUz,
        shortDescRu: this.data.shortDescRu,
        shortDescEn: this.data.shortDescEn,
        contentUz: this.data.contentUz,
        contentRu: this.data.contentRu,
        contentEn: this.data.contentEn,
        imageUrl: this.data.imageUrl
      });

      this.imagePreviewUrl = this.data.imageUrl;
    }
  }

  /**
   * Quill editorlar yaratilgandan keyin toolbar handlerlarni qo'shish
   */
  setupToolbarHandlers() {
    const imageButtons = document.querySelectorAll('.ql-image');

    imageButtons.forEach((button, index) => {
      // Existing listeners ni olib tashlash
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }

      // Yangi event listener qo'shish
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.activeTabIndex = index;
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

  // Editor fokus bo'lganda, aktiv tabni o'rnatish
  onFocus(index: number) {
    this.activeTabIndex = index;
  }

  async handlePaste(event: ClipboardEvent) {
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
          await this.uploadFileAndInsertToEditor(file, activeEditor);
        }
        return;
      }
    }
  }

  async handleDrop(event: DragEvent) {
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
          await this.uploadFileAndInsertToEditor(file, activeEditor);
        }
        return;
      }
    }
  }

  getActiveQuillEditor() {
    // 1. Toolbar orqali tekshirish
    const activeToolbar = document.activeElement?.closest('.ql-toolbar');
    if (activeToolbar) {
      const editorContainer = activeToolbar.closest('.quill-editor');
      if (editorContainer) {
        const quillInstance = (editorContainer as any).__quill;
        if (quillInstance) {
          return quillInstance;
        }
      }
    }

    // 2. Agar biror editor fokusda bo'lsa, uni qaytarish
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

    // 3. Aktiv tab indeksidan foydalanish
    if (this.activeTabIndex >= 0 && this.activeTabIndex < this.editorList.length) {
      return this.editorList[this.activeTabIndex];
    }

    // 4. Hech nima topilmasa, birinchi editorni qaytarish
    if (this.editorList.length > 0) {
      return this.editorList[0];
    }

    return null;
  }

  async customImageHandler() {
    console.log('Image handler called for editor index:', this.activeTabIndex);
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    // Click eventini qo'lda ishga tushirish
    input.dispatchEvent(new MouseEvent('click'));

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        console.log('File selected:', file.name);
        // Aktiv editorni qayta tekshirish
        const activeEditor = this.getActiveQuillEditor();
        if (activeEditor) {
          console.log('Uploading to editor:', this.editorList.indexOf(activeEditor));
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

  async editNews() {
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
        this.newsService.editItem(form.getRawValue())
      );
      if (response && response.statusCode === 200) {
        this.toaster.open({
          message: `Yangilik muvaffaqiyatli yangilandi`
        });
        this.dialogRef.close('updated');
      } else {
        this.toaster.open({
          message: `Yangilikni yangilashda xatolik sodir bo'ldi`,
          type: 'warning'
        });
        form.enable();
      }
    } catch (error) {
      this.toaster.open({
        message: `Yangilikni yangilashda xatolik sodir bo'ldi`,
        type: 'warning'
      });
      form.enable();
    }
  }
}
