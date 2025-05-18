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
    shortDescriptionUz: new FormControl<string>('', [Validators.required]),
    shortDescriptionRu: new FormControl<string>('', [Validators.required]),
    shortDescriptionEn: new FormControl<string>('', [Validators.required]),
    contentUz: new FormControl<string>('', [Validators.required]),
    contentRu: new FormControl<string>('', [Validators.required]),
    contentEn: new FormControl<string>('', [Validators.required]),
    imageUrl: new FormControl<string>('', [Validators.required])
  });

  imagePreviewUrl: string | null = null;
  isUploading = false;
  editors = {};

  private newsService = inject(NewsService);
  private fileService = inject(FileService);
  private toaster = inject(ToasterService);
  private dialogRef = inject(MatDialogRef);
  private data: INews = inject(MAT_DIALOG_DATA);

  // Quill editorni sozlash
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  };

  ngOnInit() {
    this.handleEditorCreated = this.handleEditorCreated.bind(this);
    this.setDataToForm();
  }

  ngAfterViewInit() {
    document.addEventListener('paste', this.handlePaste.bind(this));
    document.addEventListener('drop', this.handleDrop.bind(this));

    setTimeout(() => {
      this.setupImageHandlers();
    }, 500);
  }

  setDataToForm() {
    if (this.data) {
      this.newsForm.patchValue({
        _id: this.data._id,
        titleUz: this.data.titleUz,
        titleRu: this.data.titleRu,
        titleEn: this.data.titleEn,
        shortDescriptionUz: this.data.shortDescriptionUz,
        shortDescriptionRu: this.data.shortDescriptionRu,
        shortDescriptionEn: this.data.shortDescriptionEn,
        contentUz: this.data.contentUz,
        contentRu: this.data.contentRu,
        contentEn: this.data.contentEn,
        imageUrl: this.data.imageUrl
      });

      this.imagePreviewUrl = this.data.imageUrl;
    }
  }

  setupImageHandlers() {
    const imageButtons = document.querySelectorAll('.ql-image');

    imageButtons.forEach(button => {
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }

      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.selectImage();
      });
    });
  }

  handleEditorCreated(editor: any) {
    // Base64 img paste bloklash
    editor.clipboard.addMatcher('img', (node, delta) => {
      return delta;
    });

    // Qo'shimcha sozlamalar
    const field = editor.root.dataset.field;
    if (field) {
      this.editors[field] = editor;
    }

    // Rasm handler o'rnatish
    const toolbar = editor.getModule('toolbar');
    if (toolbar) {
      toolbar.addHandler('image', () => {
        this.selectImage();
      });
    }
  }

  handlePaste(event: ClipboardEvent) {
    const activeEditor = this.getActiveEditor();
    if (!activeEditor) return;

    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

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
    const activeEditor = this.getActiveEditor();
    if (!activeEditor) return;

    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) return;

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

  getActiveEditor() {
    // Document.activeElement bo'yicha qidirish
    const activeElement = document.activeElement;
    const editorElements = document.querySelectorAll('.ql-editor');

    for (let i = 0; i < editorElements.length; i++) {
      const editor = editorElements[i];
      if (editor === activeElement || editor.contains(activeElement)) {
        // Ota elementni topib, undan quill instansini olish
        const container = editor.closest('.quill-editor');
        if (container && container['__quill']) {
          return container['__quill'];
        }
      }
    }

    // Agar aktiv editor topilmasa, contentUz ni qaytarish
    if (this.editors['contentUz']) {
      return this.editors['contentUz'];
    }

    // So'nggi usul - birinchi editorni qaytarish
    const editorKeys = Object.keys(this.editors);
    if (editorKeys.length > 0) {
      return this.editors[editorKeys[0]];
    }

    return null;
  }

  selectImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const activeEditor = this.getActiveEditor();
        if (activeEditor) {
          this.uploadFileAndInsertToEditor(file, activeEditor);
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

    try {
      this.isUploading = true;
      this.toaster.open({
        message: 'Rasm yuklanmoqda...',
        type: 'info'
      });

      const imageUrl = await this.uploadImage(file);

      // Editorga rasm qo'shish
      const range = editor.getSelection() || { index: 0 };
      editor.insertEmbed(range.index, 'image', this.host + imageUrl);
      editor.setSelection(range.index + 1);

      this.toaster.open({
        message: 'Rasm muvaffaqiyatli qo\'shildi',
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
        message: 'Majburiy maydonlarni to\'ldiring',
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
          message: 'Yangilik muvaffaqiyatli tahrirlandi'
        });
        this.dialogRef.close('edited');
      } else {
        this.toaster.open({
          message: 'Yangilikni tahrirlashda xatolik sodir bo\'ldi',
          type: 'warning'
        });
        form.enable();
      }
    } catch (error) {
      this.toaster.open({
        message: 'Yangilikni tahrirlashda xatolik sodir bo\'ldi',
        type: 'warning'
      });
      form.enable();
    }
  }
}
