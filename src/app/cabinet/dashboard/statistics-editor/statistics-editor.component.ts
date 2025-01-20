import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { DashboardService } from '../../../core/services/dashboard.service';
import { firstValueFrom } from 'rxjs';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { ToasterService } from '../../../core/services/toaster.service';
import { rootObjectivesNamesForCharts } from '../../../core/constants/root-objectives';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'statistics-editor',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    FormsModule,
    MatDialogClose,
    MatIcon,
    MatRipple,
    NgTemplateOutlet
  ],
  templateUrl: './statistics-editor.component.html'
})

export class StatisticsEditorComponent implements OnInit {
  rootObjectivesNames = rootObjectivesNamesForCharts;
  rootObjectives = [];

  years = [
    2024,
    2025,
    2026,
    2027,
    2028,
    2029,
    2030
  ];

  private _dashboardService = inject(DashboardService);
  private _toasterService = inject(ToasterService);

  async ngOnInit(): Promise<void> {
    this.rootObjectives = (await firstValueFrom(this._dashboardService.getDashboardStatistics())).map((item: any) => {
      return {
        title: this.rootObjectivesNames[item.id],
        ...item
      }
    })
  }

  updateStatistics(year: any, id: string): void {
    this._dashboardService.updateStatistics({
      chart_id: id,
      plan: year.plan || null,
      fact: year.fact || null,
      year: year.year
    })
      .subscribe(res => {
        this._toasterService.open({
          message: 'changes.saved.successfully'
        })
      })
  }
}
