import { Component, DestroyRef, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { DecimalPipe, NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChartComponent } from './chart/chart.component';
import { MatRipple } from '@angular/material/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { StatisticsEditorComponent } from './statistics-editor/statistics-editor.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DashboardStatisticsModel } from '../../core/models/dashboard-statistics.model';
import { HasPermissionsDirective } from '../../core/directives/has-permissions.directive';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [
    NgOptimizedImage,
    TranslateModule,
    NgStyle,
    ChartComponent,
    MatRipple,
    DecimalPipe,
    RouterLink,
    MatIcon,
    NgTemplateOutlet,
    HasPermissionsDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  schemas: [ NO_ERRORS_SCHEMA ]
})

export class DashboardComponent implements OnInit {
  private _dashboardService = inject(DashboardService);
  private _destroyRef = inject(DestroyRef);
  private _matDialog = inject(MatDialog);

  chartData: Partial<DashboardStatisticsModel>[] = [
    {
      id: '6752cb1f7531ec2c8e4f88c2',
      title: 'entering.the.top-30.in.the.e-government.rating',
      colors: [ '#009EDC', '#009EDC66' ],
      fact: [],
      plan: [],
      years_number: [],
      curve: 'straight',
      postfix: '-place',
      reversed: true
    },
    {
      id: '6752cb34886d732c8e214aa7',
      title: 'export.of.it.services.to.5.billion.dollars',
      colors: [ '#F97066', '#F9706666' ],
      fact: [],
      plan: [],
      years_number: [],
      curve: 'straight',
      postfix: 'bn'
    },
    {
      id: '6752cb427c398d2c8e9dbd0b',
      title: 'employment.of.300,000.young.people',
      colors: [ '#479353', '#47935366' ],
      fact: [],
      plan: [],
      years_number: [],
      curve: 'straight',
      postfix: 'thousand'
    },
    {
      id: '6752cb4f0a6a1d2c8ea8903d',
      title: 'increase.the.share.of.digital.economy.in.gdp.to.30%',
      colors: [ '#F79009', '#F7900966' ],
      fact: [],
      plan: [],
      years_number: [],
      curve: 'straight',
      postfix: '%'
    }
  ];
  statistics = [
    {
      id: '66c8914f89e24234b983a4f1',
      chartId: '6752cb1f7531ec2c8e4f88c2',
      icon: 'assets/img/dashboard/emblem.svg',
      title: 'entering.the.top-30.in.the.e-government.rating',
      bgColor: 'bg-[#DDF5FF]',
      bgPercent: 'bg-[#009EDC]',
      donut: '#009EDC',
      borderTopColor: 'border-t-[#009EDC66]',
      borderColor: 'border-[#009EDC66]',
      textColor: 'text-[#546178]',
      count_all: 0,
      count_done: 0,
      percent: 0,
      percentage: 0
    },
    {
      id: '66c8929d8fde7034b99e0b9e',
      chartId: '6752cb34886d732c8e214aa7',
      icon: 'assets/img/dashboard/diagram.svg',
      title: 'export.of.it.services.to.5.billion.dollars',
      bgColor: 'bg-[#F8EEED]',
      bgPercent: 'bg-[#F97066]',
      donut: '#F97066',
      borderTopColor: 'border-t-[#F97066]',
      borderColor: 'border-[#F97066]',
      textColor: 'text-[#F97066]',
      count_all: 0,
      count_done: 0,
      percent: 0,
      percentage: 0
    },
    {
      id: '66c893224347bf34b9828bc1',
      chartId: '6752cb427c398d2c8e9dbd0b',
      icon: 'assets/img/dashboard/people.svg',
      title: 'employment.of.300,000.young.people',
      bgColor: 'bg-[#EDF4EE]',
      bgPercent: 'bg-[#479353]',
      donut: '#479353',
      borderTopColor: 'border-t-[#B5D4BA]',
      borderColor: 'border-[#B5D4BA]',
      textColor: 'text-[#667085]',
      count_all: 0,
      count_done: 0,
      percent: 0,
      percentage: 0
    },
    {
      id: '66c89374afbf4534b9275afb',
      chartId: '6752cb4f0a6a1d2c8ea8903d',
      icon: 'assets/img/dashboard/pie-chart.svg',
      title: 'increase.the.share.of.digital.economy.in.gdp.to.30%',
      bgColor: 'bg-[#FFFAEB]',
      bgPercent: 'bg-[#F79009]',
      donut: '#F79009',
      borderTopColor: 'border-t-[#FEC84B]',
      borderColor: 'border-[#FEC84B]',
      textColor: 'text-[#667085]',
      count_all: 0,
      count_done: 0,
      percent: 0,
      percentage: 0
    }
  ];

  ngOnInit(): void {
    this._dashboardService.getRootObjectivesList()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        this.generateStatisticsData(res || []);
      });

    this._dashboardService.getDashboardStatistics()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        if (!res || !res.length) return;

        res?.forEach(item => {
          const index = this.chartData.findIndex(d => d.id === item.id);

          item?.years?.forEach(year => {
            if (year.fact === null && year.plan === null) return;

            this.chartData[index].fact.push(year.fact);
            this.chartData[index].plan.push(year.plan);
            this.chartData[index].years_number.push(year.year);
          });
        });

        this.calculatePercent();
      });
  }

  generateStatisticsData(data: any[]): void {
    data.forEach(item => {
      const index = this.statistics.findIndex(i => i.id === item.id);

      this.statistics[index].count_all = +item?.count_all || 0;
      this.statistics[index].count_done = +item?.count_done || 0;
      this.statistics[index].percent = +item?.count_all ? +item?.count_done / +item?.count_all * 100 : 0;
    });
  }

  openStatisticsEditor() {
    this._matDialog.open(StatisticsEditorComponent, {
      width: '80vw',
      maxWidth: '80vw'
    });
  }

  calculatePercent(): void {
    this.chartData.forEach(d => {
      const lastPlan = d.plan[d.plan.length - 1];
      const lastFact = this.findLastNonNull(d.fact);
      const index = this.statistics.findIndex(i => i.chartId === d.id);
      if (d.id === '6752cb1f7531ec2c8e4f88c2') {
        this.statistics[index].percentage = (lastPlan / lastFact) * 100;
        return
      }
      this.statistics[index].percentage = (lastFact / lastPlan) * 100;
    })
  }

  findLastNonNull(arr: (number | null)[]) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] !== null) {
        return arr[i];
      }
    }
    return 0;
  }
}
