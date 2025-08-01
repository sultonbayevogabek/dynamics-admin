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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'news',
  imports: [
    MatButton,
    MatIcon,
    FormsModule,
    DatePipe,
    MatPaginator,
    MatFormField,
    MatInput,
    MatPrefix,
    MatProgressSpinner
  ],
  templateUrl: './news.component.html',
  standalone: true,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class NewsComponent implements OnInit {
  items: INews[] = [];
  loading = true;

  params = {
    page: 0,
    limit: 10,
    total: 0,
    search: ''
  };

  private matDialog = inject(MatDialog);
  private service = inject(NewsService);
  private toasterService = inject(ToasterService);

  async ngOnInit() {
    await this.getNews();
    this.loading = false;
  }

  async getNews() {
    const response = await firstValueFrom(
      this.service.getItemsList({
        ...this.params,
        page: this.params.page + 1
      })
    );
    this.items = response.data || [];
    this.params.total = response?.total;
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
      await this.searchNews();
    }
  }

  async openDetails(news: INews) {
    const data = await firstValueFrom(
      this.service.getItem(news?._id)
    )

    const result = await firstValueFrom(
      this.matDialog.open(NewsEditComponent, {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data
      }).afterClosed()
    );

    if (result === 'edited') {
      await this.searchNews();
    }
  }

  @Confirmable({
    message: `O'chirishni tasdiqlaysizmi?`,
    title: 'Diqqat'
  })
  async deleteItem(_id: string) {
    try {
      // Real API call
      const response = await firstValueFrom(
        this.service.deleteItem(_id)
      );
      if (response && response.statusCode === 200) {
        this.toasterService.open({
          message: `Yangilik muvaffaqiyatli o'chirildi!`
        });

        await this.searchNews();
      }

    } catch (error) {
      this.toasterService.open({
        title: 'Diqqat',
        message: `Yangilikni o'chirishda xatolik sodir bo'ldi`,
        type: 'warning'
      });
    }
  }

  async searchNews() {
    this.params.page = 0;
    await this.getNews();
  }

  async pageChange($event: PageEvent) {
    this.params.page = $event.pageIndex;
    await this.getNews();
  }
}

